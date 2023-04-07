import moduleAlias from "module-alias";
moduleAlias.addAliases({
    "@": `${__dirname}/`,
});
import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import apiRouter from "@/routes";
import dataSource from "@/utils/dbConfig";
import logger from "@/utils/logger";

const API_PORT = 3000;

(async () => {
    logger.debug("Initialize DB");
    await dataSource.initialize();
    logger.info("DB initialized");

    const app = new Koa();

    app.use(cors());
    app.use(bodyParser());

    app.use(async (ctx, next) => {
        await next();
        const rt = ctx.response.get("X-Response-Time");
        const resStatus = ctx.response.status;
        logger.http(`Response to ${ctx.method} ${ctx.url} - ${resStatus} - ${rt}`);
    });

    app.use(async (ctx, next) => {
        logger.debug(`${ctx.method} ${ctx.url}`);
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set("X-Response-Time", `${ms}ms`);
    });

    app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

    app.listen(API_PORT);
    logger.info(`API listenning on port ${API_PORT}`);
})().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
