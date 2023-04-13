import { CocktailGateway, GetCocktailGatewayResult } from "./cocktails.contract";
import { GetCocktailData, GetCocktailQuery, GetCocktailResult } from "./getCocktail.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { GetMediaSignedUrlGatewayResult, MediaGateway } from "../medias/medias.contract";
import { ResultObject } from "../utils";

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
    ): GetCocktailData {
        return {
            id: cocktail.id,
            name: cocktail.name,
            note: cocktail.note,
            pictureUrl: signedUrl,
            ingredients: cocktail.ingredients
        }
    }

    async execute({
        id
    }: GetCocktailQuery): Promise<ResultObject<GetCocktailResult, GetCocktailData>> {
        const cocktailRes = await this.#cocktailGateway.getCocktail(id, true);
        if (cocktailRes.result === GetCocktailGatewayResult.NOT_FOUND) {
            return new ResultObject(GetCocktailResult.NOT_FOUNT);
        } else if (!cocktailRes.data) {
            return new ResultObject(GetCocktailResult.UNHANDLED_ERROR);
        }
        const cocktail = cocktailRes.data;

        let signedUrl;
        if (cocktail?.pictureKey) {
            const signedUrlRes = await this.#mediaGateway.getMediaSignedUrl(cocktail.pictureKey);
            if (signedUrlRes.result !== GetMediaSignedUrlGatewayResult.SUCCESS) {
                return new ResultObject(GetCocktailResult.UNHANDLED_ERROR);
            }

            signedUrl = signedUrlRes.data;
        }

        return new ResultObject(
            GetCocktailResult.SUCCESS,
            GetCocktail.mapCocktailToGetCocktailResult(cocktail, signedUrl)
        );
    }
}