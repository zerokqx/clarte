declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_BACKEND_PORT?: string;
      VITE_BACKEND_HOST?: string;
    }
  }
}

export {};
