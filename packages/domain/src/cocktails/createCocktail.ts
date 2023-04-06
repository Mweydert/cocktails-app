import { CocktailGateway, CreateCocktailGatewayResult } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { CreateCocktailCommand, CreateCocktailResult } from "./createCocktail.contract";
import { MediaGateway, StoreMediaGatewayResult } from "./../medias/medias.contract";
import ResultObject from "../utils/resultObject";

// TODO: manage conflict in cocktail name

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

        let pictureKey;
        if (picture) {
            const storeMediaRes = await this.#mediaGateway.storeMedia(picture);
            if (storeMediaRes.result !== StoreMediaGatewayResult.SUCCESS) {
                // LOG HERE ?
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
            return new ResultObject(CreateCocktailResult.UNHANDLED_ERROR);
        }

        // TODO when time: delete picture if fail to create Cocktail

        logger.debug(`Successfully created new cocktail ${cocktail.id}`);
        return new ResultObject(CreateCocktailResult.SUCCESS, cocktail);
    }
}