import 'dotenv/config';
import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';

/**
 * Determine environment and log file
 */
const isTest = process.env.NODE_ENV === 'test';
const logsDir = path.resolve('./logs');
const logFileName = isTest ? 'test.log' : 'app.log';
const logFilePath = path.join(logsDir, logFileName);

/**
 * Ensure the logs directory exists
 */
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Optional: Clear test log file before starting
 */
if (isTest && fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

/**
 * Create the logger
 */
const logger = createLogger({
  level: isTest ? 'info' : 'debug', // more verbose in dev
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath })
  ]
});

export default logger;
