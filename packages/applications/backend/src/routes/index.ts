import Router from "@koa/router";
import statusRouter from "./status";

const router = new Router();

router.use("/api", statusRouter.routes(), statusRouter.allowedMethods());

export default router;