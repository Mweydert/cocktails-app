import dataSource from "@/utils/dbConfig";
import Router from "@koa/router";
import { IngredientPSQLGateway } from "infrastructure";
import {
    CreateIngredient as CreateIngredientUC,
    GetIngredientsByName as GetIngredientsByNameUC,
    CreateIngredientResult,
    GetIngredientsByNameResult,
} from "app-domain";
import logger from "@/utils/logger";
import { CreateIngredientBodyScheme, GetIngredientsByNameScheme } from "./contract";

const router = new Router();

const ingredientGateway = new IngredientPSQLGateway(dataSource);

const createIngredientUC = new CreateIngredientUC(ingredientGateway);
const getIngredientsByNameUC = new GetIngredientsByNameUC(ingredientGateway);

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

router.get("/", async (ctx, next) => {
    logger.debug("GET /ingredients/ query", ctx.query);

    const query = GetIngredientsByNameScheme.safeParse(ctx.query);
    if (!query.success) {
        ctx.status = 400;
        ctx.body = query.error;
        return;
    }

    const res = await getIngredientsByNameUC.execute(query.data.name);

    if (!res.data) {
        ctx.status = 500;
    } else if (res.result === GetIngredientsByNameResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = res.data;
        return;
    }

    next();
})

export default router;