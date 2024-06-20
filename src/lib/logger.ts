class Logger {
  info() {}

  error(...args) {
    console.error(...args);
  }
}

export const logger = new Logger();
