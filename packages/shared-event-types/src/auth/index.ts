export enum AuthEventPatern {
  UserRegistered = 'auth.user.event.registered',
  UserLogined = 'auth.user.event.logined',
}

export interface IAuthRegisteredPayload {
  userId: string;
}
export interface IAuthLoginedPayload {
  userId: string;
}

export interface AuthEventPayloadMap {
  [AuthEventPatern.UserRegistered]: IAuthRegisteredPayload;
  [AuthEventPatern.UserLogined]: IAuthLoginedPayload;
}
