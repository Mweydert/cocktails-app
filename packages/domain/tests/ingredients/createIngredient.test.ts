import {
    CreateIngredient as CreateIngredientUC,
    CreateIngredientResult,
    Ingredient
} from "../../src/ingredients";
import InMemoryIngredientGateway from "../gateways/ingredients";

describe("Create ingredient UC", () => {
    test("should successfully create an ingredient", async () => {
        const gateway = new InMemoryIngredientGateway();
        const uc = new CreateIngredientUC(gateway);

        const payload = {
            name: "whisky"
        };
        const res = await uc.execute(payload);
        expect(res.result).toBe(CreateIngredientResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ingredient = res.data!;

        expect(ingredient.name).toBe(payload.name);
        expect(ingredient).toEqual(gateway.data.get(ingredient.id));
    });

    test("should fail to create an ingredient if one with same name already exist (case insensitive)", async () => {
        const ingredient = new Ingredient({
            id: "b3f18fb4-aec5-4a57-a2a2-282dd85e504a",
            name: "WHISKY"
        })
        const gateway = new InMemoryIngredientGateway([ingredient]);
        const uc = new CreateIngredientUC(gateway);

        const res = await uc.execute({
            name: ingredient.name.toLowerCase()
        });
        expect(res.result).toBe(CreateIngredientResult.INGREDIENT_ALREADY_EXIST);
    });
});