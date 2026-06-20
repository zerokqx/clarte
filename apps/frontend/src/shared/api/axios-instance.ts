import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: '',
  withCredentials: true, // куки JWT передаются автоматически
});

// Orval мутатор — используется вместо встроенного fetch
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data } = await AXIOS_INSTANCE({ ...config, ...options });
  return data;
};

// Эти два типа ОБЯЗАТЕЛЬНЫ — Orval читает их для принятия решения
// генерировать useQuery или useMutation
export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
