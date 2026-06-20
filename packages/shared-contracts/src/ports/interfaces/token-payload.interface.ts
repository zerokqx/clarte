export interface IAuthClaims {
  sub: string;
  sid: string;
}

export interface IJwtPayload extends IAuthClaims {
  type: 'access' | 'refresh';
}

export interface ITokenMetadata {
  processedBy: 'jwt-access' | 'jwt-refresh';
  original: string;
}

export interface IAuthenticatedUser extends IJwtPayload {
  __metadata: ITokenMetadata;
}
