import { Cocktail, UpdateCocktail as UpdateCocktailUC } from "../../../domain/src/cocktails";
import { UpdateCocktailResult } from "../../src/cocktails/updateCocktail.contract";
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
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway);
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

    test("should fail to update cocktail if not exist", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const uc = new UpdateCocktailUC(cocktailGateway, mediaGateway);
        const res = await uc.execute({
            id: "6df2224c-4363-470b-a360-facf679c4c54",
            note: 1.2
        });
        expect(res.result).toBe(UpdateCocktailResult.COCKTAIL_NOT_EXIST);
    });
});