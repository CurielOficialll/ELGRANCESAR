/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPORTS_API_KEY: string
  readonly VITE_SPORTS_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
