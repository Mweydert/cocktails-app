import Router from "@koa/router";
import statusRouter from "./status";
import cocktailsRouter from "./cocktails";
import ingredientsRouter from "./ingredients";

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
router.use(
    "/api/ingredients",
    ingredientsRouter.routes(),
    ingredientsRouter.allowedMethods(),
);


export default router;