import { Cocktail, GetCocktail as GetCocktailUC } from "../../src/cocktails";
import { GetCocktailResult } from "../../src/cocktails/getCocktail.contract";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";

describe("get cocktail UC", () => {
    test("should succeed to get cocktail", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5
        })
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const res = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: existingCocktail.id
        });

        expect(res.result).toBe(GetCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

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
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureKey: MediaInMemoryGateway.computeMediaKey(existingMedia)
        });
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway([existingMedia]);
        const res = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: existingCocktail.id
        });
        expect(res.result).toBe(GetCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

        expect(cocktail).toEqual({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
            pictureUrl: `http://fakeUrl/${existingCocktail.pictureKey}?abcsd`
        });
    });

    test("should succeed to get cocktail with ingredients", async () => {
        const existingCocktail = new Cocktail({
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5,
        }, [{
            id: "21de1bf8-1a76-45ab-8deb-207213d60376",
            name: "whisky"
        }])
        const cocktailGateway = new CocktailInMemoryGateway([existingCocktail]);
        const mediaGateway = new MediaInMemoryGateway();
        const res = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: existingCocktail.id
        });

        expect(res.result).toBe(GetCocktailResult.SUCCESS);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const cocktail = res.data!;

        expect(cocktail).toEqual(existingCocktail);
    });

    test("should return null if cocktail does not exist", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const res = await new GetCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            id: "5ecda2f2-6adc-48c9-9998-e720b2da35ec"
        });
        expect(res.result).toBe(GetCocktailResult.NOT_FOUNT);
    });
});