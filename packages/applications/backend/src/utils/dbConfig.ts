import { getDataSource } from "infrastructure/src";
import config from "@/config";

const dataSource = getDataSource({
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME
})

export default dataSource;