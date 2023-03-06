import moduleAlias from "module-alias";
moduleAlias.addAliases({
    "@": `${__dirname}/`,
});
import cors from "@koa/cors";
import Koa from "koa";
import apiRouter from "@/routes";

const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get("X-Response-Time");
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(3000);