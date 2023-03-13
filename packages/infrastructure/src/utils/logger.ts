import { createLogger, format, transports } from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

console.info(`Infrastructure logger configured with LOG_LEVEL ${LOG_LEVEL}`);

const logger = createLogger({
    level: LOG_LEVEL,
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
});

const loggerInstance = logger.child({
    service: "infra"
});

export default loggerInstance;