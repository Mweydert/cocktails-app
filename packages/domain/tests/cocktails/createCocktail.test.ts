import { Cocktail, CreateCocktail as CreateCocktailUC } from "../../src/cocktails";
import { CreateCocktailResult } from "../../src/cocktails/createCocktail.contract";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";
import IngredientInMemoryGateway from "../gateways/ingredients";
import { Ingredient } from "../../src/ingredients";

describe("create cocktails UC", () => {
    test("should succeed to create cocktail", async () => {
        const mediaGateway = new MediaInMemoryGateway();
        const cocktailGateway = new CocktailInMemoryGateway();
        const existingIngredients = [
            new Ingredient({
                id: "55ba7868-8073-4b1e-9182-473d7212d790",
                name: "Whisky"
            }),
            new Ingredient({
                id: "7d6d84b9-4c9d-4105-8904-903c3870b702",
                name: "coca"
            }),
            new Ingredient({
                id: "43e6512a-4fea-49a6-a3b4-6ab09dadf527",
                name: "vodka"
            })
        ]
        const ingredientGateway = new IngredientInMemoryGateway(existingIngredients);
        const picture = {
            fileName: "imageName.jpg",
            encoding: "someEncoding",
            mimetype: "image/jpeg",
            buffer: Buffer.from("xyz"),
            size: 1844317
        };
        const payload = {
            name: "awesome cocktail",
            note: 2.5,
            picture,
            ingredientIds: [existingIngredients[0].id, existingIngredients[1].id]
        };
        const res = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway,
            ingredientGateway
        ).execute(payload);

        expect(res.result).toBe(CreateCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);

        expect(cocktail.name).toBe(payload.name);
        expect(cocktail.note).toBe(payload.note);
        expect(cocktail.pictureKey).toBeDefined();
        expect(cocktail.ingredients).toEqual([existingIngredients[0], existingIngredients[1]]);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const storedMedia = mediaGateway.data.get(cocktail.pictureKey!);
        expect(storedMedia).toEqual(picture);

        const cocktailsIngredients = cocktailGateway.cocktailIngredients.get(cocktail.id)
        expect(cocktailsIngredients).toEqual([existingIngredients[0], existingIngredients[1]]);
    });

    test("should succeed to create cocktail without picture", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway();
        const res = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway,
            ingredientGateway
        ).execute({
            name: "awesome cocktail",
            note: 2.5
        });

        expect(res.result).toBe(CreateCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });

    test("should succeed to create cocktail without note", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway();
        const res = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway,
            ingredientGateway
        ).execute({
            name: "awesome cocktail"
        });

        expect(res.result).toBe(CreateCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });

    test("should fail to create cocktail if a cocktail with same name already exist", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
        });
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway();
        const res = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway,
            ingredientGateway
        ).execute({
            name: existingCocktail.name
        });

        expect(res.result).toBe(CreateCocktailResult.COCKTAIL_ALREADY_EXIST);

        const storedCocktail = cocktailGateway.data.get(existingCocktail.id);
        expect(storedCocktail).toEqual(existingCocktail);
    })
});