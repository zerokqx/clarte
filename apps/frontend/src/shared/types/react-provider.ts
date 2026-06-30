import { ReactNode } from 'react';

export type ReactProvider<T extends object = object> = (
  props: { children: ReactNode } & T,
) => ReactNode;
