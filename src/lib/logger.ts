import * as Sentry from '@sentry/react';
import { Config } from './config';
export type Environment = 'production' | 'development';

interface LoggerFactoryProps {
  environment: Environment;
}

type LogProps = {
  message: string;
  data?: any;
  breadcrumb?: Sentry.Breadcrumb;
  isProduction: boolean;
  level: Sentry.SeverityLevel;
};

type LoggerProps = {
  message: string;
  breadcrumb?: Sentry.Breadcrumb;
  data?: any;
};

type ErrorLoggerProps = Omit<LoggerProps, 'data'> & { error: any };

const isError = (err: any): err is Error => err instanceof Error;

const SENTRY_SEVERITY_MAP: Record<Sentry.SeverityLevel, (...data: any) => void> = {
  fatal: console.error,
  error: console.error,
  warning: console.warn,
  info: console.info,
  log: console.log,
  debug: console.debug,
};

const addBreadcrumb = ({
  data,
  message,
  breadcrumb,
  level,
}: {
  breadcrumb: Sentry.Breadcrumb;
  message?: string;
  data?: any;
  level: Sentry.SeverityLevel;
}) => {
  Sentry.addBreadcrumb({
    type: breadcrumb.type || 'info',
    category: breadcrumb.category || 'info',
    message: message ?? breadcrumb.message ?? '',
    data,
    level,
  });
};

const captureException = (message: string, data: any): void => {
  if (isError(data)) {
    Sentry.captureException(data, { extra: { message } });
  } else {
    Sentry.captureException(new Error(message), { extra: data });
  }
};

const log = ({ message, isProduction, level, data, breadcrumb }: LogProps) => {
  if (!isProduction) {
    let consoleLevel = SENTRY_SEVERITY_MAP[level];
    consoleLevel(message, data ?? '');
  }

  if (!!breadcrumb) {
    addBreadcrumb({
      data,
      breadcrumb,
      level: level,
      message,
    });
  }

  if (level === 'error') {
    if (!isProduction) {
      console.error({
        message,
        data,
      });
    }
    captureException(message, data);
  }
};

const loggerFactory = ({ environment }: LoggerFactoryProps) => {
  const isProduction = environment === 'production';

  return {
    info: (props: LoggerProps): void => {
      log({
        ...props,
        isProduction,
        level: 'info',
      });
    },

    debug: (props: LoggerProps): void => {
      log({
        ...props,
        isProduction,
        level: 'debug',
      });
    },

    warn: (props: LoggerProps): void => {
      log({
        ...props,
        isProduction,
        level: 'warning',
      });
    },

    error: ({ error, ...rest }: ErrorLoggerProps): void => {
      log({
        ...rest,
        isProduction,
        level: 'error',
        data: error,
      });
    },
  };
};

export const logger = loggerFactory({
  environment: Config.environment as Environment,
});
