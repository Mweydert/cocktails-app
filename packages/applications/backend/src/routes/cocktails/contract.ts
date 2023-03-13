import z from "zod";

export const CreateCocktailScheme = z.object({
    name: z.string(),
    note: z.number().optional(),
});