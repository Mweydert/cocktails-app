import { DataSource } from "typeorm";
import * as schemas from "./schemas";

interface DataSourceConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export const getDataSource = (config: DataSourceConfig) => {
    const dataSource = new DataSource({
        type: "postgres",
        host: config.host,
        port: config.port,
        entities: Object.values(schemas),
        username: config.username,
        password: config.password,
        database: config.database,
    })

    // TODO: custom logger infra
    console.info(`Open connection on ${config.host}:${config.port}/${config.database} with user ${config.username}`);

    return dataSource;
}
