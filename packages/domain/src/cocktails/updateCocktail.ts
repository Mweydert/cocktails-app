import { DeleteMediaGatewayResult, MediaGateway, StoreMediaGatewayResult } from "../medias";
import { ResultObject } from "../utils";
import logger from "../utils/logger";
import { CocktailGateway, GetCocktailGatewayResult, UpdateCocktailGatewayResult } from "./cocktails.contract";
import { UpdateCocktailCommand, UpdateCocktailResult } from "./updateCocktail.contract";

export default class UpdateCocktail {
    #cocktailGateway: CocktailGateway;
    #mediaGateway: MediaGateway;

    constructor(
        cocktailGateway: CocktailGateway,
        mediaGateway: MediaGateway
    ) {
        this.#cocktailGateway = cocktailGateway;
        this.#mediaGateway = mediaGateway;
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

        const updateCocktailRes = await this.#cocktailGateway.updateCocktail(command.id, payload);
        if (updateCocktailRes.result !== UpdateCocktailGatewayResult.SUCCESS) {
            return new ResultObject(UpdateCocktailResult.UNHANDLED_ERROR);
        }

        if (oldPictureKey) {
            const deleteMediaRes = await this.#mediaGateway.deleteMedia(oldPictureKey);
            if (deleteMediaRes.result !== DeleteMediaGatewayResult.SUCCESS) {
                logger.error(`Fail to clean picture ${oldPictureKey} of cocktail ${cocktail.id}`);
            }
        }

        return new ResultObject(UpdateCocktailResult.SUCCESS);
    }
}