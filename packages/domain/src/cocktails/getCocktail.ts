import { CocktailGateway } from "./cocktails.contract";
import { GetCocktailQuery, GetCocktailResult } from "./getCocktail.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { MediaGateway } from "../medias/medias.contract";

export default class GetCocktail {
    #cocktailGateway: CocktailGateway;
    #mediaGateway: MediaGateway;

    constructor(
        cocktailGateway: CocktailGateway,
        mediaGateway: MediaGateway
    ) {
        this.#cocktailGateway = cocktailGateway;
        this.#mediaGateway = mediaGateway;
    }

    private static mapCocktailToGetCocktailResult(
        cocktail: Cocktail,
        signedUrl?: string
    ): GetCocktailResult {
        return {
            id: cocktail.id,
            name: cocktail.name,
            note: cocktail.note,
            pictureUrl: signedUrl,
        }
    }

    async execute({ id }: GetCocktailQuery): Promise<GetCocktailResult | null> {
        logger.debug(`Get cocktail ${id}`);

        const cocktail = await this.#cocktailGateway.getCocktail(id);

        if (!cocktail) {
            return null;
        }

        const signedUrl = cocktail?.pictureKey
            ? await this.#mediaGateway.getMediaSignedUrl(cocktail.pictureKey)
            : undefined;

        logger.debug(`Successfully got cocktail ${id}`);

        return GetCocktail.mapCocktailToGetCocktailResult(cocktail, signedUrl);
    }
}