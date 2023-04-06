import { File } from "../medias";

export interface UpdateCocktailCommand {
    id: string;
    note?: number;
    picture?: File;
}
