import { CocktailGateway, CreateCocktailGatewayResult, GetCocktailGatewayResult, GetCocktailListGatewayResult, UpdateCocktailGatewayResult, UpdateCocktailPayload } from "../../src/cocktails/cocktails.contract";
import Cocktail from "../../src/cocktails/model";
import { Ingredient } from "../../src/ingredients";
import { PaginatedListResult, PaginationParams } from "../../src/utils/pagination.model";
import ResultObject from "../../src/utils/resultObject";

export default class CocktailInMemoryGateway implements CocktailGateway {
    data: Map<string, Cocktail>
    cocktailIngredients: Map<string, Ingredient[]>

    constructor(initialData?: Cocktail[]) {
        this.data = new Map<string, Cocktail>(
            initialData?.map(
                cocktail => ([cocktail.id, cocktail])
            ) || []
        );
        this.cocktailIngredients = new Map<string, Ingredient[]>();
    }

    async createCocktail(
        cocktail: Cocktail
    ): Promise<ResultObject<CreateCocktailGatewayResult, undefined>> {
        if (this.data.has(cocktail.id)) {
            throw new Error("Cocktail already exist");
        }
        this.data.set(cocktail.id, cocktail);

        if (cocktail.ingredients?.length) {
            this.cocktailIngredients.set(cocktail.id, cocktail.ingredients)
        }

        return new ResultObject(CreateCocktailGatewayResult.SUCCESS);
    }

    async getCocktail(
        id: string,
        includeIngredients = false
    ): Promise<ResultObject<GetCocktailGatewayResult, Cocktail>> {
        const cocktail = this.data.get(id);
        if (!cocktail) {
            return new ResultObject(GetCocktailGatewayResult.NOT_FOUND);
        }

        const data = new Cocktail(cocktail);

        if (includeIngredients) {
            const ingredients = this.cocktailIngredients.get(cocktail.id);
            cocktail.ingredients = ingredients;
        }

        return new ResultObject(GetCocktailGatewayResult.SUCCESS, data);
    }

    async getCocktailByName(
        name: string
    ): Promise<ResultObject<GetCocktailGatewayResult, Cocktail>> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this.data) {
            if (item.name === name) {
                return new ResultObject(GetCocktailGatewayResult.SUCCESS, item);
            }
        }
        return new ResultObject(GetCocktailGatewayResult.NOT_FOUND);
    }

    async getCocktailList(
        pagination?: PaginationParams
    ): Promise<ResultObject<GetCocktailListGatewayResult, PaginatedListResult<Cocktail>>> {
        const {
            page = 1,
            itemPerPage = 10
        } = pagination || {};

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const allItems = Array.from(this.data, ([_, value]) => value);

        const firstItemIndex = (page - 1) * itemPerPage;
        const lastItemIndexExcluded = page * itemPerPage;

        const res = allItems.slice(firstItemIndex, lastItemIndexExcluded)

        const total = allItems.length;
        const pageCount = total ? Math.ceil(total / itemPerPage) : 1;
        return new ResultObject(
            GetCocktailListGatewayResult.SUCCESS,
            {
                data: res.map(item => new Cocktail(item)),
                meta: {
                    total: total,
                    page: page,
                    itemPerPage,
                    pageCount: pageCount
                }
            }
        );
    }

    async updateCocktail(
        id: string,
        payload: UpdateCocktailPayload
    ): Promise<ResultObject<UpdateCocktailGatewayResult, undefined>> {
        const cocktail = this.data.get(id);
        if (!cocktail) {
            throw new Error("cocktail not found");
        }

        for (const [key, value] of Object.entries(payload)) {
            if (key === "ingredients") {
                this.cocktailIngredients.set(id, value);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (cocktail as any)[key] = value;
            }
        }
        this.data.set(id, cocktail);
        return new ResultObject(UpdateCocktailGatewayResult.SUCCESS)
    }
}
