import logger from "@/utils/logger";
import Router from "@koa/router";
import CreateCocktail from "app-domain/src/cocktails/createCocktail";
import { CocktailPSQLGateway } from "infrastructure/src";
import { CreateCocktailScheme } from "./contract";

import dataSource from "@/utils/dbConfig";

// TODO: dependency injection

const router = new Router();

const cocktailGateway = new CocktailPSQLGateway(dataSource);
const uc = new CreateCocktail(cocktailGateway);

router.post("/", async (ctx, next) => {
    logger.info("ctx.request.body", ctx.request.body);
    const command = CreateCocktailScheme.parse(ctx.request.body);
    const res = await uc.execute(command);
    ctx.status = 200;
    ctx.body = {
        id: res.id,
        name: res.name,
        note: res.note,
    }
    next();
})


export default router;
