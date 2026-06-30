import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';
import { layoutStore } from '@/shared/model';
import { ActionIcon, Group, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import {
  indicatorCapsule,
  pulseDotWrapper,
  pulseDot,
  pulseDotRing,
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
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Group gap="xs" className={indicatorCapsule}>
            <div className={pulseDotWrapper}>
              <span className={pulseDot} />
              <span className={pulseDotRing} />
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

