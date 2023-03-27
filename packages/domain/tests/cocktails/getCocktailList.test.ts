import { GetCocktailList as GetCocktailListUC } from "../../../domain/src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";

describe("getCocktailList UC", () => {
    test("should successfully return list of cocktail", async () => {
        const existingCocktails = [{
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5
        }, {
            id: "1500d25f-27a8-4981-9bfe-18250e0964d3",
            name: "New cocktail",
            note: 3.2
        }, {
            id: "34263753-883c-4c1c-8d3b-50f4ed257127",
            name: "Toto's cocktail",
            note: 2
        }];
        const gateway = new CocktailInMemoryGateway(existingCocktails);
        const uc = new GetCocktailListUC(gateway);
        const res = await uc.execute();

        expect(res).toEqual({
            data: existingCocktails,
            total: existingCocktails.length
        });
    });

    test("should successfully return empty list if no cocktail", async () => {
        const gateway = new CocktailInMemoryGateway();
        const uc = new GetCocktailListUC(gateway);
        const res = await uc.execute();
        expect(res).toEqual({
            data: [],
            total: 0
        });
    });
});