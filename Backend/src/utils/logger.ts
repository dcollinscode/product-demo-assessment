import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format:
    process.env.NODE_ENV === "production"
      ? winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()          // structured JSON for log aggregators
        )
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "HH:mm:ss" }),
          winston.format.printf(
            ({ timestamp, level, message, ...meta }) =>
              `${timestamp} [${level}] ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta) : ""
              }`
          )
        ),
  transports: [new winston.transports.Console()],
});

export default logger;