import "reflect-metadata";

import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as schemas from "./src/schemas";

const baseConfig = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "postgres",
    entities: Object.values(schemas),
};

const config = {
    ...baseConfig,
    migrations: ["./migrations/*.ts"],
};

const dataSource = new DataSource(config as PostgresConnectionOptions);

export default dataSource

