import logger from "@/utils/logger";
import Router from "@koa/router";
import {
    CreateCocktail,
    GetCocktail,
    GetCocktailList
} from "app-domain/src/cocktails";
import { CocktailPSQLGateway, S3MediaGateway } from "infrastructure/src";
import { CreateCocktailScheme, fileScheme, GetCocktailListScheme, GetCocktailScheme } from "./contract";
import multer from "@koa/multer";
import dataSource from "@/utils/dbConfig";
import s3Client from "@/utils/s3Config";
import config from "@/config";

const upload = multer();

// TODO: dependency injection

const router = new Router();

const cocktailGateway = new CocktailPSQLGateway(dataSource);
const mediaGateway = new S3MediaGateway(s3Client, config.S3_BUCKET);

const createCocktailUC = new CreateCocktail(
    cocktailGateway,
    mediaGateway
);
const getCocktailUC = new GetCocktail(
    cocktailGateway,
    mediaGateway
);
const getCocktailListUC = new GetCocktailList(
    cocktailGateway,
    mediaGateway
);


router.post("/", upload.single("picture"), async (ctx, next) => {
    const commandBody = CreateCocktailScheme.safeParse(ctx.request.body);
    if (!commandBody.success) {
        logger.warn("CocktailRouter - POST / - Invalid body", commandBody.error);
        ctx.status = 400;
        ctx.body = commandBody.error;
        return;
    }
    const commandPicture = fileScheme.safeParse(ctx.request.file);
    if (!commandPicture.success) {
        logger.warn("CocktailRouter - POST / - Invalid picture", commandPicture.error);
        ctx.status = 400;
        ctx.body = commandPicture.error;
        return;
    }
    const command = {
        ...commandBody.data,
        picture: commandPicture.data && {
            fileName: commandPicture.data.originalname,
            encoding: commandPicture.data.encoding,
            mimetype: commandPicture.data.mimetype,
            buffer: commandPicture.data.buffer,
            size: commandPicture.data.size,
        }
    }

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
    logger.debug("id", ctx.params.id);
    const query = GetCocktailScheme.safeParse(ctx.params);

    if (!query.success) {
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

router.get("/", async (ctx, next) => {
    logger.debug("query", ctx.query);
    const query = GetCocktailListScheme.safeParse(ctx.query);
    if (!query.success) {
        ctx.status = 400;
        ctx.body = query.error;
        return;
    }

    const res = await getCocktailListUC.execute({
        pagination: {
            page: query.data.page || 1,
            itemPerPage: query.data.itemPerPage || 10
        }
    });

    ctx.status = 200;
    ctx.body = res

    next();
})


export default router;
