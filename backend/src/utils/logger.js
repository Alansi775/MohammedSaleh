/**
 * Simple logging utility
 */

const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${type.toUpperCase()}]`;
  console.log(`${prefix} ${message}`);
};

export const logger = {
  info: (msg) => log(msg, 'info'),
  error: (msg) => log(msg, 'error'),
  warn: (msg) => log(msg, 'warn'),
  debug: (msg) => log(msg, 'debug'),
};
