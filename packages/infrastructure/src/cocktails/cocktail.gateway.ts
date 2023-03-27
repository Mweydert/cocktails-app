import Cocktail from "app-domain/src/cocktails/model";
import { CocktailGateway } from "app-domain/src/cocktails/cocktails.contract";
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
        )
    }

    private static psqlCocktailToCocktail({ id, name, note }: PSQLCocktail): Cocktail {
        return new Cocktail({
            id,
            name,
            note
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

    async getCocktailList(): Promise<Cocktail[]> {
        logger.debug("Get cocktail list");

        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktails = await repository.find();
        logger.debug(`Successfully found ${psqlCocktails.length} cocktails`);

        return psqlCocktails.map(CocktailGatewayImpl.psqlCocktailToCocktail);
    }
}