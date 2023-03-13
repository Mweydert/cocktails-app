import { createLogger, format, transports } from "winston";
import config from "@/config";

console.info(`Logger configured with LOG_LEVEL ${config.LOG_LEVEL}`);

const logger = createLogger({
    level: config.LOG_LEVEL,
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.errors({ stack: true }),
    ),
    transports: [
        new transports.File({
            filename: "errors.log",
            level: "error",
            format: format.combine(
                format.json(),
            )
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
            )
        })
    ]
})

export default logger;