import { GET_INGREDIENT_RESULT, Ingredient, IngredientGateway } from "../ingredients";
import { DeleteMediaGatewayResult, MediaGateway, StoreMediaGatewayResult } from "../medias";
import { ResultObject } from "../utils";
import logger from "../utils/logger";
import { CocktailGateway, GetCocktailGatewayResult, UpdateCocktailGatewayResult } from "./cocktails.contract";
import { UpdateCocktailCommand, UpdateCocktailResult } from "./updateCocktail.contract";

export default class UpdateCocktail {
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

    async execute(
        command: UpdateCocktailCommand
    ): Promise<ResultObject<UpdateCocktailResult, undefined>> {
        const cocktailRes = await this.#cocktailGateway.getCocktail(command.id);
        if (cocktailRes.result === GetCocktailGatewayResult.NOT_FOUND) {
            return new ResultObject(UpdateCocktailResult.COCKTAIL_NOT_EXIST);
        } else if (!cocktailRes.data) {
            return new ResultObject(UpdateCocktailResult.UNHANDLED_ERROR);
        }
        const cocktail = cocktailRes.data;

        let oldPictureKey;
        let payload = {};
        if (command.picture) {
            oldPictureKey = cocktail.pictureKey;

            const storeMediaRes = await this.#mediaGateway.storeMedia(command.picture);
            if (storeMediaRes.result !== StoreMediaGatewayResult.SUCCESS || !storeMediaRes.data) {
                return new ResultObject(UpdateCocktailResult.UNHANDLED_ERROR);
            }
            const mediaKey = storeMediaRes.data;

            cocktail.pictureKey = mediaKey;
            payload = {
                ...payload,
                pictureKey: mediaKey
            };
        }
        if (command.note) {
            cocktail.note = command.note;
            payload = {
                ...payload,
                note: command.note
            }
        }

        if (command.ingredients) {
            const getIngredientsRes = await Promise.all(command.ingredients.map(
                ingredientId => this.#ingredientGateway.getIngredient(ingredientId)
            ));
            const ingredients = getIngredientsRes.filter(ingredientRes =>
                ingredientRes.result === GET_INGREDIENT_RESULT.SUCCESS
                && !!ingredientRes.data
            ).map(
                ingredientRes => ingredientRes.data
            );
            if (ingredients.length !== getIngredientsRes.length) {
                return new ResultObject(UpdateCocktailResult.UNHANDLED_ERROR);
            }

            // Author note: we cast as Ingredient here as we has checked ingredientRes.data
            // is not undefined. Don't know why TS doesn't figure it out by itself
            cocktail.ingredients = ingredients as Ingredient[];
            payload = {
                ...payload,
                ingredients: cocktail.ingredients
            }
        }

        const updateCocktailRes = await this.#cocktailGateway.updateCocktail(command.id, payload);
        if (updateCocktailRes.result !== UpdateCocktailGatewayResult.SUCCESS) {
            return new ResultObject(UpdateCocktailResult.UNHANDLED_ERROR);
        }

        if (oldPictureKey) {
            const deleteMediaRes = await this.#mediaGateway.deleteMedia(oldPictureKey);
            if (deleteMediaRes.result !== DeleteMediaGatewayResult.SUCCESS) {
                logger.warn(`Fail to clean picture ${oldPictureKey} of cocktail ${cocktail.id}`);
            }
        }

        return new ResultObject(UpdateCocktailResult.SUCCESS);
    }
}