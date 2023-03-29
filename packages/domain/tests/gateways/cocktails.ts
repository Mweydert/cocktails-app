import { CocktailGateway } from "../../src/cocktails/cocktails.contract";
import Cocktail from "../../src/cocktails/model";
import { PaginationParams } from "../../src/utils/pagination.model";

export default class CocktailInMemoryGateway implements CocktailGateway {
    data: Map<string, Cocktail>

    constructor(initialData?: Cocktail[]) {
        this.data = new Map<string, Cocktail>(
            initialData?.map(
                cocktail => ([cocktail.id, cocktail])
            ) || []
        );
    }

    async createCocktail(cocktail: Cocktail) {
        if (!this.data.has(cocktail.id)) {
            this.data.set(cocktail.id, cocktail);
        }
    }

    async getCocktail(id: string) {
        const cocktail = this.data.get(id);
        if (!cocktail) {
            return null
        }
        return cocktail;
    }

    async getCocktailList(pagination?: PaginationParams) {
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
        return {
            data: res,
            meta: {
                total: total,
                page: page,
                itemPerPage,
                pageCount: pageCount
            }
        }
    }
}
