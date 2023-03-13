import Cocktail from "app-domain/src/cocktails/model";
import { CocktailGateway } from "app-domain/src/cocktails/cocktails.contract";
import { DataSource } from "typeorm";
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

    private static psqlCocktailToCocktail({id, name, note}: PSQLCocktail): Cocktail {
        return new Cocktail({
            id,
            name,
            note
        })
    }

    async createCocktail(cocktail: Cocktail): Promise<void> {
        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = CocktailGatewayImpl.cocktailToPSQLCocktail(cocktail);
        await repository.save(psqlCocktail);

        console.debug(`Create new cocktail ${cocktail.id}`);
    }
    
    async getCocktail(id: string): Promise<Cocktail | null> {
        const repository = this.#dataSource.getRepository(PSQLCocktail);
        const psqlCocktail = await repository.findOneBy({id});

        if (!psqlCocktail) {
            return null;
        }

        return CocktailGatewayImpl.psqlCocktailToCocktail(psqlCocktail);
    }
}