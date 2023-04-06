import { CreateCocktailPayload, UpdateCocktailPayload } from "./../models/payloads";
import axios from "axios";
import { Cocktail } from "../models/cocktails";
import { API_URL } from "./../utils/config";

interface GetCocktailsResult {
    data: Cocktail[];
    meta: {
        itemPerPage: number;
        page: number;
        pageCount: number;
        total: number;
    }
}

export const getCocktails = async ({
    pageParam = 1
}: {
    pageParam?: number;
}): Promise<GetCocktailsResult> => {
    const res = await axios.get(`${API_URL}/cocktails?itemPerPage=10&page=${pageParam}`);

    return {
        data: res.data.data,
        meta: {
            itemPerPage: res.data.meta.itemPerPage,
            page: res.data.meta.page,
            pageCount: res.data.meta.pageCount,
            total: res.data.meta.total,
        }
    }
}

export const createCocktail = async ({
    name,
    note,
    pictures
}: CreateCocktailPayload) => {
    const form = new FormData();

    form.append("name", name);
    if (note) {
        form.append("note", note.toString());
    }
    if (pictures && pictures.length > 0) {
        form.append("picture", pictures[0]);
    }

    const res = await axios.post(`${API_URL}/cocktails`, form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export const getCocktail = async (
    id: string
): Promise<Cocktail> => {
    const res = await axios.get(`${API_URL}/cocktails/${id}`);
    return res.data;
}

export const updateCocktail = async (
    id: string,
    payload: UpdateCocktailPayload
): Promise<Cocktail> => {
    const form = new FormData();

    if (payload.note) {
        form.append("note", payload.note.toString());
    }
    if (payload.picture) {
        form.append("picture", payload.picture);
    }

    const res = await axios.put(`${API_URL}/cocktails/${id}`, form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return res.data;
}