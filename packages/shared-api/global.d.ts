declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAPI_URL: string;
    }
  }
}

export {};
