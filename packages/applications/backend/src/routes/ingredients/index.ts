import dataSource from "@/utils/dbConfig";
import Router from "@koa/router";
import { IngredientPSQLGateway } from "infrastructure";
import {
    CreateIngredient as CreateIngredientUC, CreateIngredientResult
} from "app-domain";
import logger from "@/utils/logger";
import { CreateIngredientBodyScheme } from "./contract";

const router = new Router();

const ingredientGateway = new IngredientPSQLGateway(dataSource);

const createIngredientUC = new CreateIngredientUC(ingredientGateway);

router.post("/", async (ctx, next) => {
    logger.debug("POST /ingredients/ body", ctx.request.body);

    const command = CreateIngredientBodyScheme.safeParse(ctx.request.body);
    if (!command.success) {
        logger.warn("Ingredient Router - POST / - Invalid body", command.error);
        ctx.status = 400;
        ctx.body = command.error;
        return;
    }

    const res = await createIngredientUC.execute(command.data);
    if (res.result === CreateIngredientResult.INGREDIENT_ALREADY_EXIST) {
        ctx.status = 409;
        ctx.body = res.result;
        return;
    } else if (!res.data) {
        ctx.status = 500;
    } else if (res.result === CreateIngredientResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = res.data
        return;
    }

    next();
});

export default router;