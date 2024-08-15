import winston from "winston";
import customLevels from "../constants/customLevels";

const nonErrorFilter = winston.format((info) => {
  return info.level === "error" ? false : info;
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "info",
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.combine(nonErrorFilter(), winston.format.json()),
    }),
    new winston.transports.File({ filename: "logs/errorLogger.log", level: "error" }),
  ],
});

// DEV
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
    }),
  );
}

winston.addColors(customLevels.colors);

export default logger;
