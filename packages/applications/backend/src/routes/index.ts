import Router from "@koa/router";
import statusRouter from "./status";
import cocktailsRouter from "./cocktails";

const router = new Router();

router.use(
    "/api/status",
    statusRouter.routes(),
    statusRouter.allowedMethods(),
);
router.use(
    "/api/cocktails",
    cocktailsRouter.routes(),
    cocktailsRouter.allowedMethods(),
);


export default router;