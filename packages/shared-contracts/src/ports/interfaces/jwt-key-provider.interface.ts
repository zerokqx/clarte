export interface IJwtKeyProvider {
  get(): Promise<string> | string;
}
