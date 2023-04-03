import { Cocktail, UpdateCocktail as UpdateCocktailUC } from "../../../domain/src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";

describe("Update cocktail UC", () => {
    test("should successfully update cocktail", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: undefined
        });
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const uc = new UpdateCocktailUC(cocktailGateway);
        await uc.execute({
            id: existingCocktail.id,
            note: 1.2
        });
        const updateCocktail = {
            ...existingCocktail,
            note: 1.2
        };
        expect(cocktailGateway.data.get(existingCocktail.id)).toEqual(updateCocktail);
    });

    // Manage picture update
    // can't update id / name
    // should manage non existing cocktail
});