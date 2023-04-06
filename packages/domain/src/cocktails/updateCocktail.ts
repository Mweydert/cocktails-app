import { MediaGateway } from "../medias";
import logger from "../utils/logger";
import { CocktailGateway } from "./cocktails.contract";
import Cocktail from "./model";
import { UpdateCocktailCommand, UpdateCocktailResult } from "./updateCocktail.contract";

// TODO: introduce result type to manage errors

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

    private static mapCocktailToUpdateCocktailResult(
        cocktail: Cocktail,
        signedUrl?: string
    ): UpdateCocktailResult {
        return {
            id: cocktail.id,
            name: cocktail.name,
            note: cocktail.note,
            pictureUrl: signedUrl,
        }
    }

    async execute(
        command: UpdateCocktailCommand
    ): Promise<UpdateCocktailResult> {
        const cocktail = await this.#cocktailGateway.getCocktail(command.id);
        if (!cocktail) {
            throw new Error(`Cocktail ${command.id} not found`);
        }


        let oldPictureKey;
        let payload = {};
        if (command.picture) {
            oldPictureKey = cocktail.pictureKey;
            logger.debug("Update new media for cocktail", cocktail.id);
            const mediaKey = await this.#mediaGateway.storeMedia(command.picture);

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

        await this.#cocktailGateway.updateCocktail(command.id, payload);

        if (oldPictureKey) {
            logger.debug("Delete old media", oldPictureKey, "of cocktail", cocktail.id);
            await this.#mediaGateway.deleteMedia(oldPictureKey);
        }

        const signedUrl = cocktail.pictureKey
            ? await this.#mediaGateway.getMediaSignedUrl(cocktail.pictureKey)
            : undefined;

        return UpdateCocktail.mapCocktailToUpdateCocktailResult(cocktail, signedUrl);
    }
}