import logger from "../utils/logger";
import { CocktailGateway } from "./cocktails.contract";
import { MediaGateway } from "../medias/medias.contract";
import { CocktailListResult, GetCocktailListItem, GetCocktailListQuery } from "./getCocktailList.contract";
import Cocktail from "./model";

export default class GetCocktailList {
    #cocktailGateway: CocktailGateway
    #mediaGateway: MediaGateway

    constructor(
        cocktailGateway: CocktailGateway,
        mediaGateway: MediaGateway
    ) {
        this.#cocktailGateway = cocktailGateway;
        this.#mediaGateway = mediaGateway;
    }

    private static mapCocktailToCocktailListItem(
        cocktail: Cocktail,
        pictureSignedUrl?: string
    ): GetCocktailListItem {
        return {
            id: cocktail.id,
            name: cocktail.name,
            note: cocktail.note,
            pictureUrl: pictureSignedUrl
        }
    }

    async execute({
        pagination
    }: GetCocktailListQuery): Promise<CocktailListResult> {
        logger.info("GetCocktailList", pagination);

        const cocktailList = await this.#cocktailGateway.getCocktailList(pagination);

        const cocktailWithSignedPictureUrl = await Promise.all(cocktailList.data.map(async cocktail => {
            if (cocktail.pictureKey) {
                const pictureSignedUrl = await this.#mediaGateway.getMediaSignedUrl(cocktail.pictureKey);
                return GetCocktailList.mapCocktailToCocktailListItem(
                    cocktail,
                    pictureSignedUrl
                );
            }
            return GetCocktailList.mapCocktailToCocktailListItem(cocktail);
        }));

        return {
            data: cocktailWithSignedPictureUrl,
            meta: cocktailList.meta
        };
    }
}