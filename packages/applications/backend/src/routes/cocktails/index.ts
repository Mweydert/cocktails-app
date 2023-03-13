import logger from "@/utils/logger";
import Router from "@koa/router";
import CreateCocktail from "app-domain/src/cocktails/createCocktail";
import GetCocktail from "app-domain/src/cocktails/getCocktail";
import { CocktailPSQLGateway } from "infrastructure/src";
import { CreateCocktailScheme, GetCocktailScheme } from "./contract";

import dataSource from "@/utils/dbConfig";

// TODO: dependency injection

const router = new Router();

const cocktailGateway = new CocktailPSQLGateway(dataSource);

const createCocktailUC = new CreateCocktail(cocktailGateway);
const getCocktailUC = new GetCocktail(cocktailGateway);

router.post("/", async (ctx, next) => {
    ``
    logger.debug("body", ctx.request.body);
    const command = CreateCocktailScheme.parse(ctx.request.body);
    const res = await createCocktailUC.execute(command);
    ctx.status = 200;
    ctx.body = {
        id: res.id,
        name: res.name,
        note: res.note,
    }
    next();
})

router.get("/:id", async (ctx, next) => {
    logger.info("id", ctx.params.id);
    const query = GetCocktailScheme.safeParse(ctx.params);

    if(!query.success) {
        ctx.status = 400;
        ctx.body = query.error;
        return;
    }

    const res = await getCocktailUC.execute(query.data);

    if (!res) {
        ctx.status = 404
        return;
    }

    ctx.status = 200;
    ctx.body = {
        id: res.id,
        name: res.name,
        note: res.note,
    }

    next();
})


export default router;
