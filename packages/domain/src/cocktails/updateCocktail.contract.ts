import { File } from "../medias";

export interface UpdateCocktailCommand {
    id: string;
    note?: number;
    picture?: File;
}

export interface UpdateCocktailResult {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
}