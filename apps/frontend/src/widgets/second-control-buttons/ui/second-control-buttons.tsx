import { SpotlightOpen } from '@/features/spotlight-open';
import { Affix, Group } from '@mantine/core';

export const SeccondControlButton = () => {
  return (
    <Affix position={{ bottom: 66, left: 10, right: 0 }}>
      <Group justify="center">
        <SpotlightOpen />
      </Group>
    </Affix>
  );
};
