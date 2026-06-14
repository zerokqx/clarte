export interface ITokenPayload {
  sub: string;
  sid: string;
}
export interface ITokenPayloadWithMetadata extends ITokenPayload {
  type: 'access' | 'refresh';
}
