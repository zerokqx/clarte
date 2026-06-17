export enum UserEventPattern {
  UserCreated = 'user.user.event.created',
}

export interface IUserCreatedPayload {
  userId: string;
  login: string;
}

export type UserEventPayloadMap = {
  [UserEventPattern.UserCreated]: IUserCreatedPayload;
};
