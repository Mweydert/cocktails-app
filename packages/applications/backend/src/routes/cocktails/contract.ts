import z from "zod";

export const fileScheme = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number()
})

export const CreateCocktailScheme = z.object({
    name: z.string(),
    note: z.coerce.number().optional()
});

export const GetCocktailScheme = z.object({
    id: z.string().uuid()
})

export const GetCocktailListScheme = z.object({
    page: z.coerce.number().optional(),
    itemPerPage: z.coerce.number().optional(),
})