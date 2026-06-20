export enum UserEventPattern {
  UserCreated = 'user.user.event.created',
  UserEntered = 'user.user.event.entered',
}

export interface IUserCreatedPayload {
  userId: string;
  login: string;
}
export interface IUserEnteredPayload {
  userId: string;
  userAgent: string;
}

export type UserEventPayloadMap = {
  [UserEventPattern.UserCreated]: IUserCreatedPayload;
  [UserEventPattern.UserEntered]: IUserEnteredPayload;
};
