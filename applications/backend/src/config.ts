export interface Config {
    LOG_LEVEL: string;
}

const config: Config = {
    LOG_LEVEL: process.env.LOG_LEVEL || "info"
}

export default config;