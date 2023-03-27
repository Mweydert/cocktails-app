import Cocktail from "./model";

export interface CocktailGateway {
    createCocktail: (cocktail: Cocktail) => Promise<void>;
    getCocktail: (id: string) => Promise<Cocktail | null>;
    getCocktailList: () => Promise<Cocktail[]>;
}