import logger from "@/utils/logger";
import Router from "@koa/router";
import {
    CreateCocktail,
    GetCocktail,
    GetCocktailList,
    UpdateCocktail,
    CreateCocktailResult,
    GetCocktailResult,
    GetCocktaiListResult,
    UpdateCocktailResult
} from "app-domain";
import { CocktailPSQLGateway, S3MediaGateway } from "infrastructure";
import {
    CreateCocktailFileScheme,
    CreateCocktailScheme,
    GetCocktailListScheme,
    GetCocktailScheme,
    UpdateCocktailBodyScheme,
    UpdateCocktailIdScheme,
    UpdateCocktailPictureScheme
} from "./contract";
import multer from "@koa/multer";
import dataSource from "@/utils/dbConfig";
import s3Client from "@/utils/s3Config";
import config from "@/config";

const upload = multer();

// TODO: dependency injection
// TODO: better logs

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
const updateCocktailUC = new UpdateCocktail(
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
    const commandPicture = CreateCocktailFileScheme.safeParse(ctx.request.file);
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
    if (res.result === CreateCocktailResult.COCKTAIL_ALREADY_EXIST) {
        ctx.status = 409;
        return;
    } else if (!res.data) {
        ctx.status = 500;
    } else if (res.result === CreateCocktailResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = {
            id: res.data.id,
            name: res.data.name,
            note: res.data.note,
        }
        return;
    }

    next();
})

router.get("/:id", async (ctx, next) => {
    logger.debug("Get cocktail", ctx.params.id);
    const query = GetCocktailScheme.safeParse(ctx.params);

    if (!query.success) {
        ctx.status = 400;
        ctx.body = query.error;
        return;
    }

    const res = await getCocktailUC.execute(query.data);

    if (res.result === GetCocktailResult.NOT_FOUNT) {
        ctx.status = 404
        return;
    } else if (!res.data) {
        ctx.status = 500;
    } else if (res.result === GetCocktailResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = res.data;
        return;
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

    if (!res.data) {
        ctx.status = 500;
    } else if (res.result === GetCocktaiListResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = res.data;
        return;
    }

    next();
})

router.put("/:id", upload.single("picture"), async (ctx, next) => {
    logger.debug("update cocktail", ctx.params.id);

    const parsedId = UpdateCocktailIdScheme.safeParse({
        id: ctx.params.id,
    });
    const parsedBody = UpdateCocktailBodyScheme.safeParse(ctx.request.body)
    const parsedPicture = UpdateCocktailPictureScheme.safeParse(ctx.request.file)
    if (!parsedId.success) {
        ctx.status = 400;
        ctx.body = parsedId.error;
        return;
    }
    if (!parsedBody.success) {
        ctx.status = 400;
        ctx.body = parsedBody.error;
        return;
    }
    if (!parsedPicture.success) {
        ctx.status = 400;
        ctx.body = parsedPicture.error;
        return;
    }

    const command = {
        ...parsedId.data,
        ...parsedBody.data,
        picture: parsedPicture.data && {
            fileName: parsedPicture.data.originalname,
            encoding: parsedPicture.data.encoding,
            mimetype: parsedPicture.data.mimetype,
            buffer: parsedPicture.data.buffer,
            size: parsedPicture.data.size,
        }
    }

    const updateRes = await updateCocktailUC.execute(command);
    if (updateRes.result === UpdateCocktailResult.COCKTAIL_NOT_EXIST) {
        ctx.status = 422;
        return;
    } else if (updateRes.result !== UpdateCocktailResult.SUCCESS) {
        ctx.status = 500;
        return next();
    }

    const res = await getCocktailUC.execute({ id: command.id });
    if (res.result === GetCocktailResult.NOT_FOUNT || !res.data) {
        ctx.status = 500;
    } else if (res.result === GetCocktailResult.SUCCESS) {
        ctx.status = 200;
        ctx.body = res.data;
        return;
    }

    next();
})

export default router;
