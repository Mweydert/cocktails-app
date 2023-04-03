import { CocktailGateway } from "./cocktails.contract";
import { UpdateCocktailCommand } from "./updateCocktail.contract";

// TODO: introduce result type to manage errors

export default class UpdateCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(
        command: UpdateCocktailCommand
    ): Promise<void> {
        const cocktail = await this.#cocktailGateway.getCocktail(command.id);
        if (!cocktail) {
            return;
        }

        if (command.note) {
            cocktail.updateNote(command.note);
        }

        await this.#cocktailGateway.updateCocktail(command.id, command);
    }
}