import axios from "axios";
import { Ingredient } from "../models/ingredients";
import { API_URL } from "../utils/config";

export const getIngredientsByName = async (
    value?: string
): Promise<Ingredient[]> => {
    if (!value) {
        return [];
    }

    const res = await axios.get(`${API_URL}/ingredients?name=${value}`);
    return res.data;
}