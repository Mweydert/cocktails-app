import {
    GetIngredientsByName as GetIngredientsByNameUC,
    GetIngredientsByNameResult,
    Ingredient,
} from "./../../src/ingredients";
import InMemoryIngredientGateway from "../gateways/ingredients";

describe("Get Ingredients by name UC", () => {
    test("should successfully return ingredients with name matching", async () => {
        const singleMalt = new Ingredient({
            id: "0c3f78bc-d514-4859-9d31-aa3b9a6e692b",
            name: "whisky single malt"
        })
        const genericWhisky = new Ingredient({
            id: "589a853a-36d8-4af6-94a2-a8649c18be84",
            name: "WHisKy"
        });
        const vodka = new Ingredient({
            id: "04d84a6d-4cd1-42d9-8c57-d390e0862926",
            name: "Vodka"
        });
        const gateway = new InMemoryIngredientGateway([
            singleMalt,
            genericWhisky,
            vodka
        ]);
        const uc = new GetIngredientsByNameUC(gateway);

        const res = await uc.execute("whisky");
        expect(res.result).toBe(GetIngredientsByNameResult.SUCCESS);

        expect(res.data).toEqual([singleMalt, genericWhisky]);
    });

    test("should successfully return empty list if no ingredients matching", async () => {
        const gateway = new InMemoryIngredientGateway();
        const uc = new GetIngredientsByNameUC(gateway);

        const res = await uc.execute("whisky");
        expect(res.result).toBe(GetIngredientsByNameResult.SUCCESS);

        expect(res.data).toEqual([]);
    });
});