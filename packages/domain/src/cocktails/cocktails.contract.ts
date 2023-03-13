import Cocktail from "./model";

export interface CreateCocktailCommand {
    name: string;
    note?: number;
}

export interface GetCocktailQuery {
    id: string;
}

export interface CocktailGateway {
    createCocktail: (cocktail: Cocktail) => Promise<void>;
    getCocktail: (id: string) => Promise<Cocktail | null>;
}