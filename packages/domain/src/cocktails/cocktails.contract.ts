import Cocktail from "./model";

export interface CreateCocktailCommand {
    name: string;
    note?: number;
}

export interface CocktailGateway {
    createCocktail: (cocktail: Cocktail) => Promise<void>;
}