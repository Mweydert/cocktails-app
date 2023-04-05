import { Cocktail, UpdateCocktail as UpdateCocktailUC } from "../../../domain/src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";

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
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway);
        await uc.execute({
            id: existingCocktail.id,
            note: 1.2
        });
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
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway);
        const newPicture = {
            fileName: "new test.jpeg",
            encoding: "utf-8",
            mimetype: "image/jpg",
            buffer: Buffer.from("ytreza"),
            size: 43243
        };
        const updatedCocktail = await uc.execute({
            id: existingCocktail.id,
            picture: newPicture
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newMedia = mediaGateway.data.get(updatedCocktail.pictureKey!);
        expect(newMedia).toEqual(newPicture);


        expect(
            mediaGateway.data.has(MediaInMemoryGateway.computeMediaKey(existingMedia))
        ).toBeFalsy();

        expect(cocktailGateway.data.get(existingCocktail.id)).toEqual(updatedCocktail);

    });

    // should manage non existing cocktail
});