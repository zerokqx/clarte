import { AnimatePresence, motion } from 'motion/react';
import { Affix, Group, rem } from '@mantine/core';
import { BottomNavigationItem } from './bottom-navigation-item';
import { bottomNavigationConfig } from '../config';
import { useIsAtBottom } from '@/shared/lib/use-is-at-bottom';
import { M } from '@clarte/mantine-helpers';
import { BottomNavigationProvider } from '../model';
import { Pill } from './pill';

export const BottomNavigation = () => {
  const isAtBottom = useIsAtBottom(200);

  return (
    <Affix position={{ bottom: 0, left: 0, right: 0 }} zIndex={99}>
      <AnimatePresence initial={false} mode="wait">
        {!isAtBottom && (
          <motion.div
            key="bottom-navigation"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <Group
              id="bottom-navigation-bar"
              justify="space-around"
              style={{
                borderTop: `1px solid ${M.lightDark(M.color('gray')(3))(M.color('gray')(8))}`,
              }}
              bg={M.body()}
              w="100%"
              px="xs"
              h={rem(56)}
            >
              <BottomNavigationProvider>
                <Pill />
                {bottomNavigationConfig.map((item, index) => (
                  <BottomNavigationItem key={index} to={item.to} activeOptions={item.activeOptions}>
                    {item.icon}
                  </BottomNavigationItem>
                ))}
              </BottomNavigationProvider>
            </Group>
          </motion.div>
        )}
      </AnimatePresence>
    </Affix>
  );
};
