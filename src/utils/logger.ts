// import winston from 'winston';
// import DailyRotateFile from 'winston-daily-rotate-file';

// const { combine, timestamp, json, errors, printf } = winston.format;

// const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
//   let msg = `${timestamp} [${level}]: ${message}`;
//   if (stack) msg += `\n${stack}`;
//   if (Object.keys(metadata).length > 0) msg += ` ${JSON.stringify(metadata)}`;
//   return msg;
// });

// const transports = [
//   new winston.transports.Console({
//     format: combine(timestamp(), json()),
//   }),
//   new DailyRotateFile({
//     filename: 'logs/application-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     maxSize: '20m',
//     maxFiles: '14d',
//     format: combine(errors({ stack: true }), timestamp(), logFormat),
//   }),
// ];

// export const logger = winston.createLogger({
//   level: 'info',
//   format: combine(errors({ stack: true }), timestamp(), json()),
//   transports,
// });

