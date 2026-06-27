export enum CqrsRepoType {
  r = 1,
  w = 2,
}

export type CrqsRepository<R extends object, W extends object> = Readonly<{
  [CqrsRepoType.r]: R;
  [CqrsRepoType.w]: W;
}>;
