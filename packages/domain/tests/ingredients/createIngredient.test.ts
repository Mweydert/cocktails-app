import { CreateIngredient as CreateIngredientUC, CreateIngredientResult } from "../../src/ingredients";
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
});