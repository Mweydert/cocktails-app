import {
    Ingredient,
    ResultObject,
    IngredientGateway,
    CREATE_INGREDIENT_RESULT,
    GET_INGREDIENT_RESULT,
    GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT,
} from "app-domain";
import { DataSource, Raw } from "typeorm";

import { Ingredient as PSQLIngredient } from "./ingredient.contract";
import logger from "../utils/logger";

export default class IngredientGatewayImpl implements IngredientGateway {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    static ingredientToPSQLIngredient(
        ingredient: Ingredient
    ): PSQLIngredient {
        return new PSQLIngredient(
            ingredient.id,
            ingredient.name
        )
    }

    static psqlIngredientToIngredient(
        psqlIngredient: PSQLIngredient
    ): Ingredient {
        return new Ingredient({
            id: psqlIngredient.id,
            name: psqlIngredient.name
        })
    }

    async createIngredient(
        ingredient: Ingredient
    ): Promise<ResultObject<CREATE_INGREDIENT_RESULT, void>> {
        logger.verbose("Create new ingredient")

        const repository = this.#dataSource.getRepository(PSQLIngredient);
        const psqlIngredient = IngredientGatewayImpl.ingredientToPSQLIngredient(ingredient);
        await repository.save(psqlIngredient);

        logger.debug(`Successfuly created new ingredient ${ingredient.id}`);
        return new ResultObject(CREATE_INGREDIENT_RESULT.SUCCESS);
    }

    async getIngredientByName(
        value: string
    ): Promise<ResultObject<GET_INGREDIENT_RESULT, Ingredient>> {
        logger.verbose(`Get ingredient by name ${value}`);

        const repository = this.#dataSource.getRepository(PSQLIngredient);
        const psqlIngredient = await repository.findOne({
            where: {
                name: Raw(
                    (alias) => `LOWER(${alias}) LIKE LOWER(:value)`,
                    { value }
                )
            }
        });

        if (!psqlIngredient) {
            return new ResultObject(GET_INGREDIENT_RESULT.NOT_FOUND);
        }

        logger.debug(`Successfully got ingredient named ${value}`);

        return new ResultObject(
            GET_INGREDIENT_RESULT.SUCCESS,
            IngredientGatewayImpl.psqlIngredientToIngredient(psqlIngredient)
        )
    }

    async getIngredienstWithNameMatching(
        value: string
    ): Promise<ResultObject<GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT, Ingredient[]>> {
        logger.verbose(`Get ingredients with name matching ${value}`);

        const repository = this.#dataSource.getRepository(PSQLIngredient);
        const psqlIngredients = await repository.find({
            where: {
                name: Raw(
                    (alias) => `LOWER(${alias}) LIKE LOWER(:value)`,
                    { value: `%${value}%` }
                )
            }
        });

        logger.debug(`Successfully got ${psqlIngredients.length} ingredients named ${value}`);

        return new ResultObject(
            GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT.SUCCESS,
            psqlIngredients.map(
                psqlIngredient => IngredientGatewayImpl.psqlIngredientToIngredient(psqlIngredient)
            )
        )
    }

    async getIngredient(
        id: string
    ): Promise<ResultObject<GET_INGREDIENT_RESULT, Ingredient>> {
        logger.verbose(`Get ingredient ${id}`);

        const repository = this.#dataSource.getRepository(PSQLIngredient);
        const psqlIngredient = await repository.findOneBy({
            id
        });

        if (!psqlIngredient) {
            return new ResultObject(GET_INGREDIENT_RESULT.NOT_FOUND);
        }

        logger.debug(`Successfully got ingredient ${id}`);

        return new ResultObject(
            GET_INGREDIENT_RESULT.SUCCESS,
            IngredientGatewayImpl.psqlIngredientToIngredient(psqlIngredient)
        )
    }
}