export enum UserEventPattern {
  UserCreated = 'user.user.event.created',
}

export interface IUserCreatedPayload {
  userId: string;
  email: string;
  name: string;
}

export type UserEventPayloadMap = {
  [UserEventPattern.UserCreated]: IUserCreatedPayload;
};
