// export interface IJwtPayload {
//   sub: string;
//   sid: string;
// }
//
// export interface ITokenMarks extends IJwtPayload {
//   __marks: {
//     type: 'access' | 'refresh';
//   };
// }
//
// export interface ITokenPayloadWithMetadata extends IJwtPayload {
//   __strategy: {
//     processedBy: 'jwt-access' | 'jwt-refresh';
//     original: string;
//   };
// }
//
// export interface ITokenFullPayload
//   extends IJwtPayload,
//     ITokenMarks,
//     ITokenPayloadWithMetadata {}

// 1. Базовые данные пользователя, которые мы зашиваем изначально
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

// 4. Финальный объект, который живет в req.user во всем приложении
export interface IAuthenticatedUser extends IJwtPayload {
  __metadata: ITokenMetadata;
}
