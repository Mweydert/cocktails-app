import logger from "../utils/logger";
import { CocktailGateway, GetCocktailListGatewayResult } from "./cocktails.contract";
import { GetMediaSignedUrlGatewayResult, MediaGateway } from "../medias/medias.contract";
import { CocktailListData, GetCocktaiListResult, GetCocktailListItem, GetCocktailListQuery } from "./getCocktailList.contract";
import Cocktail from "./model";
import { ResultObject } from "../utils";

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
    }: GetCocktailListQuery): Promise<ResultObject<GetCocktaiListResult, CocktailListData>> {
        const cocktailListRes = await this.#cocktailGateway.getCocktailList(pagination);

        if (cocktailListRes.result !== GetCocktailListGatewayResult.SUCCESS || !cocktailListRes.data) {
            return new ResultObject(GetCocktaiListResult.UNHANDLED_ERROR);
        }

        const cocktailWithSignedPictureUrl = await Promise.all(cocktailListRes.data.data.map(async cocktail => {
            let signedUrl;
            if (cocktail.pictureKey) {
                const pictureSignedUrlRes = await this.#mediaGateway.getMediaSignedUrl(cocktail.pictureKey);
                if (pictureSignedUrlRes.result !== GetMediaSignedUrlGatewayResult.SUCCESS) {
                    logger.error(`Fail to get signed URL for picture ${cocktail.pictureKey} of cocktail ${cocktail.id}`);
                }

                signedUrl = pictureSignedUrlRes.data;
            }

            return GetCocktailList.mapCocktailToCocktailListItem(
                cocktail,
                signedUrl
            );
        }));

        return new ResultObject(
            GetCocktaiListResult.SUCCESS,
            {
                data: cocktailWithSignedPictureUrl,
                meta: cocktailListRes.data.meta
            }
        );
    }
}