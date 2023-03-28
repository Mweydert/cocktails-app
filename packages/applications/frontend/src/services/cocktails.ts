import axios from 'axios';
import { Cocktail } from '../models/cocktails';
import { API_URL } from './../utils/config';

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
    const res = await axios.get(`${API_URL}/cocktails?itemPerPage=5&page=${pageParam}`);

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