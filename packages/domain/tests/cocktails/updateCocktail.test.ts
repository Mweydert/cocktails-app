import { Cocktail, UpdateCocktail as UpdateCocktailUC } from "../../../domain/src/cocktails";
import { UpdateCocktailResult } from "../../src/cocktails/updateCocktail.contract";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";
import IngredientInMemoryGateway from "../gateways/ingredients";
import { Ingredient } from "../../src/ingredients";

describe("Update cocktail UC", () => {
    test("should successfully update cocktail's note", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: undefined
        });
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway();
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway, ingredientGateway);
        const res = await uc.execute({
            id: existingCocktail.id,
            note: 1.2
        });
        expect(res.result).toBe(UpdateCocktailResult.SUCCESS);
        const updatedCocktail = {
            ...existingCocktail,
            note: 1.2
        };
        expect(cocktailGateway.data.get(existingCocktail.id)).toEqual(updatedCocktail);
    });

    test("should successfully update cocktail's picture", async () => {
        const existingMedia = {
            fileName: "test.png",
            encoding: "utf-7",
            mimetype: "image/png",
            buffer: Buffer.from("azerty"),
            size: 122332
        }
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: MediaInMemoryGateway.computeMediaKey(existingMedia)
        });
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway([existingMedia]);
        const ingredientGateway = new IngredientInMemoryGateway();
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway, ingredientGateway);
        const newPicture = {
            fileName: "new test.jpeg",
            encoding: "utf-8",
            mimetype: "image/jpg",
            buffer: Buffer.from("ytreza"),
            size: 43243
        };
        const res = await uc.execute({
            id: existingCocktail.id,
            picture: newPicture
        });
        expect(res.result).toBe(UpdateCocktailResult.SUCCESS);

        const updatedCocktail = cocktailGateway.data.get(existingCocktail.id);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newMedia = mediaGateway.data.get(updatedCocktail!.pictureKey!);
        expect(newMedia).toEqual(newPicture);

        expect(
            mediaGateway.data.has(MediaInMemoryGateway.computeMediaKey(existingMedia))
        ).toBeFalsy();
    });

    test("should successfully update cocktail's ingredients", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: undefined
        });
        const existingIngredients = [
            new Ingredient({
                id: "2954bf6c-ba98-427e-b3fa-769d9a5849d3",
                name: "whisky"
            }),
            new Ingredient({
                id: "91b5a361-b4ad-48b0-b778-4e8eb700ff7d",
                name: "coca"
            })
        ];
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway(existingIngredients);
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway, ingredientGateway);
        const res = await uc.execute({
            id: existingCocktail.id,
            ingredients: existingIngredients.map(item => item.id)
        });
        expect(res.result).toBe(UpdateCocktailResult.SUCCESS);
        expect(cocktailGateway.cocktailIngredients.get(existingCocktail.id)).toEqual(existingIngredients);
    });

    test("should fail to update cocktail if not exist", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const ingredientGateway = new IngredientInMemoryGateway();
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway, ingredientGateway);
        const res = await uc.execute({
            id: "6df2224c-4363-470b-a360-facf679c4c54",
            note: 1.2
        });
        expect(res.result).toBe(UpdateCocktailResult.COCKTAIL_NOT_EXIST);
    });
});