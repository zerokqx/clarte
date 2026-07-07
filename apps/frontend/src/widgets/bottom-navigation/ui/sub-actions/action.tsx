import { ActionIcon } from '@mantine/core';

export type SubActionProps = Pick<ActionIcon.Props, 'children'>;

export const SubAction = ({ children }: SubActionProps) => {
  return <ActionIcon color="gray">{children}</ActionIcon>;
};
