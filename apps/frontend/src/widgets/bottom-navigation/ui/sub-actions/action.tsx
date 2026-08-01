import { ActionIcon } from '@mantine/core';
import { ComponentProps } from 'react';

export type SubActionProps = Pick<ActionIcon.Props, 'children'> &
  Pick<ComponentProps<'button'>, 'onClick'>;

export const SubAction = ({ ...props }: SubActionProps) => {
  return <ActionIcon {...props} />;
};
