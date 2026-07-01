import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import { layoutStore } from '@/shared/model';
import { ActionIcon, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import {
  indicatorCapsule,
  pulseDotWrapper,
  pulseDot,
  statusText,
  exitButton,
} from './zen-mode-indicator.module.css';

export const ZenModeIndicator = observer(() => {
  return (
    <AnimatePresence>
      {layoutStore.zenModeStatus && (
        <motion.div
          style={{
            zIndex: 1000,
            position: 'absolute',
            left: '30px',
            top: '30px',
          }}
          key="zen-mode-indicator"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Group gap="xs" className={indicatorCapsule}>
            <div className={pulseDotWrapper}>
              <span className={pulseDot} />
            </div>

            <Text className={statusText}>Zen Mode</Text>

            <ActionIcon
              className={exitButton}
              variant="transparent"
              color="gray"
              size="sm"
              onClick={() => layoutStore.toggleZenMode()}
              title="Выйти из Zen Mode"
            >
              <XIcon size={14} weight="bold" />
            </ActionIcon>
          </Group>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
