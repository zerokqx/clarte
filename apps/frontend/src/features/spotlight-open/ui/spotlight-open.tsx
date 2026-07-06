import { BrowserIcon } from '@phosphor-icons/react/dist/csr/Browser';
import { ActionIcon } from '@mantine/core';
import { spotlight } from '@mantine/spotlight';

export const SpotlightOpen = () => {
  return (
    <ActionIcon onClick={spotlight.open}>
      <BrowserIcon />
    </ActionIcon>
  );
};
