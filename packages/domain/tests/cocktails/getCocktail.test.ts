import { GetCocktail as GetCocktailUC } from "../../src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";

describe("create cocktails UC", () => {
    test("should succeed to get cocktail", async () => {
        const existingCocktail = {
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5
        }
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const cocktail = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: existingCocktail.id
        });
        expect(cocktail).toEqual(existingCocktail);
    });

    test("should succeed to get cocktail with pictureUrl", async () => {
        const existingMedia = {
            fileName: "test.png",
            encoding: "utf-7",
            mimetype: "image/png",
            buffer: Buffer.from("azerty"),
            size: 122332
        }
        const existingCocktail = {
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: existingMedia.fileName
        }
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway([existingMedia]);
        const cocktail = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: existingCocktail.id
        });
        expect(cocktail).toEqual({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureUrl: `http://fakeUrl/${existingMedia.fileName}?abcsd`
        });
    });

    test("should return null if cocktail does not exist", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const cocktail = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: "5ecda2f2-6adc-48c9-9998-e720b2da35ec"
        });
        expect(cocktail).toBeNull();
    });
});