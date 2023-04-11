import {
    Cocktail,
    CocktailGateway,
    PaginationParams,
    PaginatedListResult,
    UpdateCocktailPayload,
    CreateCocktailGatewayResult,
    ResultObject,
    GetCocktailGatewayResult,
    GetCocktailListGatewayResult,
    UpdateCocktailGatewayResult
} from "app-domain";
import { DataSource } from "typeorm";
import { IngredientPSQLGateway } from "../ingredients";
import logger from "../utils/logger";
import { Cocktail as PSQLCocktail } from "./cocktail.contract";

export default class CocktailGatewayImpl implements CocktailGateway {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    private static cocktailToPSQLCocktail(cocktail: Cocktail): PSQLCocktail {
        return new PSQLCocktail(
            cocktail.id,
            cocktail.name,
            cocktail.note,
            cocktail.pictureKey,
        )
    }

    private static psqlCocktailToCocktail({ id, name, note, pictureKey }: PSQLCocktail): Cocktail {
        return new Cocktail({
            id,
            name,
            note,
            pictureKey,
        })
    }

    async createCocktail(
        cocktail: Cocktail
    ): Promise<ResultObject<CreateCocktailGatewayResult, undefined>> {
        logger.verbose("Create new cocktail")

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = CocktailGatewayImpl.cocktailToPSQLCocktail(cocktail);
        await repository.save(psqlCocktail);

        logger.debug(`Successfuly created new cocktail ${cocktail.id}`);
        return new ResultObject(CreateCocktailGatewayResult.SUCCESS);
    }

    async getCocktail(
        id: string
    ): Promise<ResultObject<GetCocktailGatewayResult, Cocktail>> {
        logger.verbose(`Get cocktail ${id}`);

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = await repository.findOneBy({ id });

        if (!psqlCocktail) {
            return new ResultObject(GetCocktailGatewayResult.NOT_FOUND);
        }

        logger.debug(`Successfully got cocktail ${id}`);

        return new ResultObject(
            GetCocktailGatewayResult.SUCCESS,
            CocktailGatewayImpl.psqlCocktailToCocktail(psqlCocktail)
        )
    }

    async getCocktailByName(
        name: string
    ): Promise<ResultObject<GetCocktailGatewayResult, Cocktail>> {
        logger.verbose(`Get cocktail by name ${name}`);

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = await repository.findOneBy({ name });

        if (!psqlCocktail) {
            return new ResultObject(GetCocktailGatewayResult.NOT_FOUND);
        }

        logger.debug(`Successfully got cocktail named ${name}`);

        return new ResultObject(
            GetCocktailGatewayResult.SUCCESS,
            CocktailGatewayImpl.psqlCocktailToCocktail(psqlCocktail)
        )
    }

    async getCocktailList(
        pagination?: PaginationParams
    ): Promise<ResultObject<GetCocktailListGatewayResult, PaginatedListResult<Cocktail>>> {
        logger.verbose("Get cocktail list");

        const {
            page = 1,
            itemPerPage = 10
        } = pagination || {};
        const itemsToSkip = (page - 1) * itemPerPage;

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktails = await repository.findAndCount({
            skip: itemsToSkip,
            take: itemPerPage
        });

        logger.debug(`Successfully found ${psqlCocktails[0].length} cocktails over ${psqlCocktails[1]} items `);

        const pageCount = psqlCocktails[1] ? Math.ceil(psqlCocktails[1] / itemPerPage) : 1;

        return new ResultObject(
            GetCocktailListGatewayResult.SUCCESS,
            {
                data: psqlCocktails[0].map(CocktailGatewayImpl.psqlCocktailToCocktail),
                meta: {
                    total: psqlCocktails[1],
                    page,
                    itemPerPage,
                    pageCount
                }
            }
        );
    }

    async updateCocktail(
        id: string,
        payload: UpdateCocktailPayload
    ): Promise<ResultObject<UpdateCocktailGatewayResult, undefined>> {
        logger.verbose(`Update cocktail ${id}`);

        const repository = this.#dataSource.getRepository(PSQLCocktail);

        const psqlCocktailToUpdate = await repository.findOneBy({ id });
        if (!psqlCocktailToUpdate) {
            return new ResultObject(UpdateCocktailGatewayResult.UNHANDLED_ERROR);
        }
        for (const [key, value] of Object.entries(payload)) {
            if (key === "ingredients") {
                logger.debug(`${value.length} ingredients to add to cocktail ${id}`)
                psqlCocktailToUpdate.ingredients = value.map(
                    IngredientPSQLGateway.ingredientToPSQLIngredient
                )
            } else if (key in psqlCocktailToUpdate) {
                // Author note: we check key exist in psqlCocktailToUpdate so key is controlled
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (psqlCocktailToUpdate as any)[key] = value;
            }
        }
        await repository.save(psqlCocktailToUpdate);

        logger.debug(`Successfully updated cocktail ${id}`);
        return new ResultObject(UpdateCocktailGatewayResult.SUCCESS);
    }
}