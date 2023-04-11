import z from "zod";

export const CreateIngredientBodyScheme = z.object({
    name: z.string()
});