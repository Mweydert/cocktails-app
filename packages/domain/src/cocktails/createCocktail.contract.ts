import { File } from "../medias/medias.model";

export interface CreateCocktailCommand {
    name: string;
    note?: number;
    picture?: File;
}