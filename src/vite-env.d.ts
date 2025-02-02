/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_VERSION: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
