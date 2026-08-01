export enum UserEventPattern {
  UserCreated = 'user.user.event.created',
  UserEntered = 'user.user.event.entered',
  UserChangeLogin = 'user.login.event.changed',
}

export interface IUserCreatedPayload {
  userId: string;
  login: string;
}
export interface IUserEnteredPayload {
  userId: string;
  userAgent: string;
}

export interface IUserLoginChangedPayload {
  userId: string;
  newLogin: string;
}

export type UserEventPayloadMap = {
  [UserEventPattern.UserCreated]: IUserCreatedPayload;
  [UserEventPattern.UserEntered]: IUserEnteredPayload;
  [UserEventPattern.UserChangeLogin]: IUserLoginChangedPayload;
};
