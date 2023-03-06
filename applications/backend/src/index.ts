import Koa from 'koa';
import Router from '@koa/router';

// middlewares to add: , koa-response-time, winston, bodyparser, 

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

router.get("/", (ctx, next) => {
    ctx.status = 200;
    ctx.body = "Hello cocktail World";
    next();
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);