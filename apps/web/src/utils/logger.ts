type LogArgs = [message: string, ...details: unknown[]];

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (...args: LogArgs) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  warn: (...args: LogArgs) => {
    console.warn(...args);
  },
  error: (...args: LogArgs) => {
    console.error(...args);
  },
};