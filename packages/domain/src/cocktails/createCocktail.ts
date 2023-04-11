import { CocktailGateway, CreateCocktailGatewayResult, GetCocktailGatewayResult } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { CreateCocktailCommand, CreateCocktailResult } from "./createCocktail.contract";
import { DeleteMediaGatewayResult, MediaGateway, StoreMediaGatewayResult } from "./../medias/medias.contract";
import ResultObject from "../utils/resultObject";
import { GET_INGREDIENT_RESULT, Ingredient, IngredientGateway } from "../ingredients";

export default class CreateCocktail {
    #cocktailGateway: CocktailGateway;
    #mediaGateway: MediaGateway;
    #ingredientGateway: IngredientGateway;

    constructor(
        cocktailGateway: CocktailGateway,
        mediaGateway: MediaGateway,
        ingredientGateway: IngredientGateway
    ) {
        this.#cocktailGateway = cocktailGateway;
        this.#mediaGateway = mediaGateway;
        this.#ingredientGateway = ingredientGateway;
    }

    async execute({
        name,
        note,
        picture,
        ingredientIds
    }: CreateCocktailCommand): Promise<ResultObject<CreateCocktailResult, Cocktail>> {
        const cocktailWithSameNameRes = await this.#cocktailGateway.getCocktailByName(name);
        if (cocktailWithSameNameRes.result !== GetCocktailGatewayResult.NOT_FOUND) {
            return new ResultObject(CreateCocktailResult.COCKTAIL_ALREADY_EXIST);
        }

        let pictureKey;
        if (picture) {
            const storeMediaRes = await this.#mediaGateway.storeMedia(picture);
            if (storeMediaRes.result !== StoreMediaGatewayResult.SUCCESS) {
                return new ResultObject(CreateCocktailResult.UNHANDLED_ERROR);
            }
            pictureKey = storeMediaRes.data;
        }

        let ingredients;
        if (ingredientIds) {
            const getIngredientsRes = await Promise.all(ingredientIds.map(
                ingredientId => this.#ingredientGateway.getIngredient(ingredientId)
            ));
            ingredients = getIngredientsRes.filter(ingredientRes =>
                ingredientRes.result === GET_INGREDIENT_RESULT.SUCCESS
                && !!ingredientRes.data
            ).map(
                ingredientRes => ingredientRes.data
            ) as Ingredient[]; // Cast as if ingredient is undefined an error will be thrown
            if (ingredients.length !== getIngredientsRes.length) {
                return new ResultObject(CreateCocktailResult.UNHANDLED_ERROR);
            }
        }

        const cocktail = new Cocktail({
            name,
            note,
            pictureKey,
        }, ingredients);

        const createCocktailRes = await this.#cocktailGateway.createCocktail(cocktail);
        if (createCocktailRes.result !== CreateCocktailGatewayResult.SUCCESS) {
            if (pictureKey) {
                const deleteMediaRes = await this.#mediaGateway.deleteMedia(pictureKey);
                if (deleteMediaRes.result !== DeleteMediaGatewayResult.SUCCESS) {
                    logger.warn(`Fail to clean picture ${pictureKey}`);
                }
            }

            return new ResultObject(CreateCocktailResult.UNHANDLED_ERROR);
        }

        return new ResultObject(CreateCocktailResult.SUCCESS, cocktail);
    }
}