import { CocktailGateway } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { CreateCocktailCommand } from "./createCocktail.contract";
import { MediaGateway } from "./../medias/medias.contract";

// TODO: manage conflict in cocktail name
// TODO: see if pictureUrl or pictureId or else

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
    }: CreateCocktailCommand): Promise<Cocktail> {
        logger.debug("Create new cocktail");

        const pictureUrl = picture
            ? await this.#mediaGateway.storeMedia(picture)
            : undefined;

        const cocktail = new Cocktail({
            name,
            note,
            pictureUrl
        })
        await this.#cocktailGateway.createCocktail(cocktail);

        // Step: delete picture if failed to create Cocktail


        logger.debug(`Successfully created new cocktail ${cocktail.id}`);
        return cocktail;
    }
}