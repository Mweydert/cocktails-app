import { MediaGateway } from "../medias";
import logger from "../utils/logger";
import { CocktailGateway } from "./cocktails.contract";
import { UpdateCocktailCommand } from "./updateCocktail.contract";

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

    async execute(
        command: UpdateCocktailCommand
    ): Promise<void> {
        const cocktail = await this.#cocktailGateway.getCocktail(command.id);
        if (!cocktail) {
            return;
        }

        let payload = {};
        if (command.picture) {
            logger.debug("Update new media for cocktail", cocktail.id);
            const mediaKey = await this.#mediaGateway.storeMedia(command.picture);
            payload = {
                ...payload,
                pictureKey: mediaKey
            };
        }
        if (command.note) {
            payload = {
                ...payload,
                note: command.note
            }
        }

        await this.#cocktailGateway.updateCocktail(command.id, payload);

        if (cocktail.pictureKey) {
            logger.debug("Delete old media", cocktail.pictureKey, "of cocktail", cocktail.id);
            await this.#mediaGateway.deleteMedia(cocktail.pictureKey);
        }
    }
}