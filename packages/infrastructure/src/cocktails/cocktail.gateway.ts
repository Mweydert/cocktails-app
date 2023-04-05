import {
    Cocktail,
    CocktailGateway,
    PaginationParams,
    PaginatedListResult,
    UpdateCocktailPayload
} from "app-domain";
import { DataSource } from "typeorm";
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

    async createCocktail(cocktail: Cocktail): Promise<void> {
        logger.debug("Create new cocktail")

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = CocktailGatewayImpl.cocktailToPSQLCocktail(cocktail);
        await repository.save(psqlCocktail);

        logger.debug(`Successfuly created new cocktail ${cocktail.id}`);
    }

    async getCocktail(id: string): Promise<Cocktail | null> {
        logger.debug(`Get cocktail ${id}`);

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = await repository.findOneBy({ id });

        if (!psqlCocktail) {
            logger.warn(`Cocktail ${id} not found`);
            return null;
        }

        logger.debug(`Successfully got cocktail ${id}`);
        return CocktailGatewayImpl.psqlCocktailToCocktail(psqlCocktail);
    }

    async getCocktailList(pagination?: PaginationParams): Promise<PaginatedListResult<Cocktail>> {
        logger.debug("Get cocktail list");

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

        return {
            data: psqlCocktails[0].map(CocktailGatewayImpl.psqlCocktailToCocktail),
            meta: {
                total: psqlCocktails[1],
                page,
                itemPerPage,
                pageCount
            }
        }
    }

    async updateCocktail(
        id: string,
        payload: UpdateCocktailPayload
    ): Promise<void> {
        logger.debug(`Update cocktail ${id}`);

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        await repository.update(id, payload);

        logger.debug(`Successfully updated cocktail ${id}`);
    }
}