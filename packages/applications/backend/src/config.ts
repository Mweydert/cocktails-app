export interface Config {
    LOG_LEVEL: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    S3_URL: string;
    S3_BUCKET: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_REGION: string;
}

const config: Config = {
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: parseInt(process.env.DB_PORT || "5432"),
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "password",
    DB_NAME: process.env.DB_NAME || "postgres",
    S3_URL: process.env.S3_URL || "http://localhost:9000",
    S3_BUCKET: process.env.S3_BUCKET || "cocktail-pictures",
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || "",
    S3_SECRET_KEY: process.env.S3_SECRET_KEY || "",
    S3_REGION: process.env.S3_REGION || "us-east-1",
}

export default config;