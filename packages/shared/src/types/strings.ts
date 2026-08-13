// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type NotNullString<T> = T extends `${infer Head}${infer Tail}` ? T : never;
export type AndOtherString<T> = T | ({} & string);
