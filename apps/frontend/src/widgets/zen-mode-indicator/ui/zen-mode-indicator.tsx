import { motion, AnimatePresence } from 'motion/react';
import { PauseIcon } from '@phosphor-icons/react/dist/csr/Pause';
import { layoutStore } from '@/shared/model';
import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';

export const ZenModeIndicator = observer(() => {
  return (
    /* 1. Обязательно оборачиваем в AnimatePresence снаружи условия */
    <AnimatePresence>
      {layoutStore.zenModeStatus && (
        <motion.div
          style={{
            zIndex:1000,
            position: 'absolute',
            left: '30px',
            top:"30px"
          }}
          key="zen-mode-indicator"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2, ease: 'anticipate' }}
        >
          <Group bg={'dark.6'} p={'xs'} bdrs={'md'}>
          
            <Box bg="green.6" h={20} w={20} bdrs={'xl'} />
            <Text>Enabled</Text>
            <ActionIcon variant="transparent" onClick={() => layoutStore.toggleZenMode()}>
              <PauseIcon />
            </ActionIcon>
          </Group>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
