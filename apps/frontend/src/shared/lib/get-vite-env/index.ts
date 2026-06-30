export const getEnvVar = (key: keyof ImportMetaEnv, fallback = ''): string => {
  return import.meta.env[key] || fallback;
};
