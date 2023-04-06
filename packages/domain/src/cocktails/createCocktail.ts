import { CocktailGateway, CreateCocktailGatewayResult, GetCocktailGatewayResult } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { CreateCocktailCommand, CreateCocktailResult } from "./createCocktail.contract";
import { DeleteMediaGatewayResult, MediaGateway, StoreMediaGatewayResult } from "./../medias/medias.contract";
import ResultObject from "../utils/resultObject";

export default class CreateCocktail {
    #cocktailGateway: CocktailGateway;
    #mediaGateway: MediaGateway;

    constructor(
        cocktailGateway: CocktailGateway,
        mediaGateway: MediaGateway,
    ) {
        this.#cocktailGateway = cocktailGateway;
        this.#mediaGateway = mediaGateway;
    }

    async execute({
        name,
        note,
        picture
    }: CreateCocktailCommand): Promise<ResultObject<CreateCocktailResult, Cocktail>> {
        logger.debug("Create new cocktail");

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

        const cocktail = new Cocktail({
            name,
            note,
            pictureKey
        })

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

        logger.debug(`Successfully created new cocktail ${cocktail.id}`);
        return new ResultObject(CreateCocktailResult.SUCCESS, cocktail);
    }
}