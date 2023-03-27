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
        const res = await uc.execute({});

        expect(res).toEqual({
            data: existingCocktails,
            meta: {
                total: existingCocktails.length,
                page: 1,
                itemPerPage: 10,
                pageCount: 1
            }
        });
    });

    test("should successfully return empty list if no cocktail", async () => {
        const gateway = new CocktailInMemoryGateway();
        const uc = new GetCocktailListUC(gateway);
        const res = await uc.execute({});
        expect(res).toEqual({
            data: [],
            meta: {
                total: 0,
                page: 1,
                itemPerPage: 10,
                pageCount: 1
            }
        });
    });

    test("should successfully return 5 item of page 2 of cocktails list", async () => {
        const allCocktails = Array.from(Array(20)).map(((_, index) => ({
            id: index.toString(),
            name: "Some super cocktail name"
        })))
        const gateway = new CocktailInMemoryGateway(allCocktails);
        const uc = new GetCocktailListUC(gateway);
        const res = await uc.execute({
            pagination: {
                page: 2,
                itemPerPage: 5
            }
        });
        expect(res).toEqual({
            data: allCocktails.slice(5, 10),
            meta: {
                total: 20,
                page: 2,
                itemPerPage: 5,
                pageCount: 4
            }
        });
    });
});