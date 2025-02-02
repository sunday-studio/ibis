import packageJson from '../../package.json';

export enum ConfigKeys {
  SentryDSN = 'sentry_dsn',
  SentryAuthToken = 'sentry_auth_token',
  Version = 'version',
  Environment = 'environment',
}

export const Config: Record<ConfigKeys, string> = {
  [ConfigKeys.SentryDSN]: import.meta.env.VITE_SENTRY_DSN ?? '',
  [ConfigKeys.SentryAuthToken]: import.meta.env.VITE_SENTRY_AUTH_TOKEN ?? '',
  [ConfigKeys.Version]: packageJson.version,
  [ConfigKeys.Environment]: import.meta.env.MODE,
};
