import { GetCocktailList as GetCocktailListUC } from "../../../domain/src/cocktails";
import CocktailInMemoryGateway from "../gateways/cocktails";
import MediaInMemoryGateway from "../gateways/medias";

describe("getCocktailList UC", () => {
    test("should successfully return list of cocktail", async () => {
        const existingMedias = [{
            fileName: "test.png",
            encoding: "utf-7",
            mimetype: "image/png",
            buffer: Buffer.from("azerty"),
            size: 122332
        }, {
            fileName: "new-test.jpg",
            encoding: "utf-7",
            mimetype: "image/jpg",
            buffer: Buffer.from("ytreza"),
            size: 23244223
        }]
        const existingCocktails = [{
            id: "ad04696c-db5c-41b6-9547-dc51d6dbff87",
            name: "Awesome cocktail",
            note: 4.5
        }, {
            id: "1500d25f-27a8-4981-9bfe-18250e0964d3",
            name: "New cocktail",
            note: 3.2,
            pictureUrl: existingMedias[0].fileName
        }, {
            id: "34263753-883c-4c1c-8d3b-50f4ed257127",
            name: "Toto's cocktail",
            note: 2,
            pictureUrl: existingMedias[1].fileName
        }];
        const cocktailGateway = new CocktailInMemoryGateway(existingCocktails);
        const mediaGateway = new MediaInMemoryGateway(existingMedias);
        const uc = new GetCocktailListUC(
            cocktailGateway,
            mediaGateway
        );
        const res = await uc.execute({});

        expect(res).toEqual({
            data: existingCocktails.map(item => ({
                ...item,
                pictureUrl: item.pictureUrl
                    ? `http://fakeUrl/${item.pictureUrl}?abcsd`
                    : undefined
            })),
            meta: {
                total: existingCocktails.length,
                page: 1,
                itemPerPage: 10,
                pageCount: 1
            }
        });
    });

    test("should successfully return empty list if no cocktail", async () => {
        const cocktailGateway = new CocktailInMemoryGateway();
        const mediaGateway = new MediaInMemoryGateway();
        const uc = new GetCocktailListUC(
            cocktailGateway,
            mediaGateway
        );
        const res = await uc.execute({});
        expect(res).toEqual({
            data: [],
            meta: {
                total: 0,
                page: 1,
                itemPerPage: 10,
                pageCount: 1
            }
        });
    });

    test("should successfully return 5 item of page 2 of cocktails list", async () => {
        const allCocktails = Array.from(Array(20)).map(((_, index) => ({
            id: index.toString(),
            name: "Some super cocktail name"
        })))
        const cocktailGateway = new CocktailInMemoryGateway(allCocktails);
        const mediaGateway = new MediaInMemoryGateway();
        const uc = new GetCocktailListUC(
            cocktailGateway,
            mediaGateway
        );
        const res = await uc.execute({
            pagination: {
                page: 2,
                itemPerPage: 5
            }
        });
        expect(res).toEqual({
            data: allCocktails.slice(5, 10),
            meta: {
                total: 20,
                page: 2,
                itemPerPage: 5,
                pageCount: 4
            }
        });
    });
});