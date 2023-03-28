import axios from "axios";
import { API_URL } from "../utils/config"

export const checkApiIsHealthy = async () => {
    const res = await axios.get(`${API_URL}/status`);

    if (res.status === 200 && res.data.status === 200) {
        return true;
    }

    return false;
}