import { CreateCocktail as CreateCocktailUC } from "../../src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";

describe("create cocktails UC", () => {
    test("should succeed to create cocktail", async () => {
        const mediaGateway = new MediaInMemoryGateway();
        const cocktailGateway = new CocktailInMemoryGateway();
        const picture = {
            fileName: "imageName.jpg",
            encoding: "someEncoding",
            mimetype: "image/jpeg",
            buffer: Buffer.from("xyz"),
            size: 1844317
        };
        const cocktail = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            name: "awesome cocktail",
            note: 2.5,
            picture
        });
        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);

        expect(cocktail.pictureKey).toBeDefined();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const storedMedia = mediaGateway.data.get(cocktail.pictureKey!);
        expect(storedMedia).toEqual(picture);
    });

    test("should succeed to create cocktail without picture", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const cocktail = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            name: "awesome cocktail",
            note: 2.5
        });
        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });

    test("should succeed to create cocktail without note", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const cocktail = await new CreateCocktailUC(
            cocktailGateway,
            mediaGateway
        ).execute({
            name: "awesome cocktail"
        });
        const storedCocktail = cocktailGateway.data.get(cocktail.id);
        expect(storedCocktail).toEqual(cocktail);
    });
});