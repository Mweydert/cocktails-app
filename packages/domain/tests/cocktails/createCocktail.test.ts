import CreateCocktailUC from "../../src/cocktails/createCocktail";
import CocktailInMemoryGateway from "../gateways/cocktails";

describe("create cocktails UC", () => {
    test("should succeed to create cocktail", async () => {
        const gateway = new CocktailInMemoryGateway(); 
        const cocktail = await new CreateCocktailUC(gateway).execute({
            name: "awesome cocktail",
            note: 2.5
        });
        const storedCocktail = gateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });

    test("should succeed to create cocktail without note", async () => {
        const gateway = new CocktailInMemoryGateway(); 
        const cocktail = await new CreateCocktailUC(gateway).execute({
            name: "awesome cocktail"
        });
        const storedCocktail = gateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });
});