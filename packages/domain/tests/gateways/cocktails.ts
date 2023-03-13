import { CocktailGateway } from "../../src/cocktails/cocktails.contract";
import Cocktail from "../../src/cocktails/model";

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
}
