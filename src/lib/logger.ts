class Logger {
  info(...args) {
    console.log(...args);
  }

  error(...args) {
    console.error(...args);
  }
}

export const logger = new Logger();
