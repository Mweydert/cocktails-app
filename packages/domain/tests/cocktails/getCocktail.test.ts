import GetCocktailUC from "../../src/cocktails/getCocktail";
import CocktailInMemoryGateway from "../gateways/cocktails";

describe("create cocktails UC", () => {
    test("should succeed to get cocktail", async () => {
        const existingCocktail = {
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5
        }
        const gateway = new CocktailInMemoryGateway([existingCocktail]); 
        const cocktail = await new GetCocktailUC(gateway).execute({
            id: existingCocktail.id
        });
        expect(cocktail).toEqual(existingCocktail);
    });

    test("should return null if cocktail does not exist", async () => {
        const gateway = new CocktailInMemoryGateway(); 
        const cocktail = await new GetCocktailUC(gateway).execute({
            id: "5ecda2f2-6adc-48c9-9998-e720b2da35ec"
        });
        expect(cocktail).toBeNull();
    });
});