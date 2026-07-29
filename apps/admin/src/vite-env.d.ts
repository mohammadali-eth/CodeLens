/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_APP_ENV: 'development' | 'testing' | 'production';
  readonly VITE_ENABLE_AUDIT_LOGS: string;
  readonly VITE_ENABLE_WEBSOCKETS: string;
  readonly VITE_ENABLE_DARK_THEME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
