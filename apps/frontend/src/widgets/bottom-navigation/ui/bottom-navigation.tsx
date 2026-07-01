import { AnimatePresence, motion } from 'motion/react';
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { ActionIcon, Affix, Group, rem, Stack } from '@mantine/core';
import { BottomNavigationItem } from './bottom-navigation-item';
import { bottomNavigatioonConfig } from '../config';
import { useMatchRoute, useNavigate } from '@tanstack/react-router';
import { useIsAtBottom } from '@/shared/lib/use-is-at-bottom';
import { M } from '@/shared/lib/mantine';

export const BottomNavigation = () => {
  const isAtBottom = useIsAtBottom(200);
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const isCRoute = matchRoute({ to: '/c' });
  console.log(isCRoute);

  return (
    <Affix position={{ bottom: 10, left: 10, right: 10 }}>
      <AnimatePresence initial={false} mode="wait">
        {!isAtBottom && (
          <motion.div
            key={'bottom-navigation'}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <Stack align="start">
              <AnimatePresence>
                {!isCRoute && (
                  <motion.div
                    key={'house-button'}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <ActionIcon onClick={() => navigate({ to: '/' })} size={'input-xl'} bdrs="xl">
                      <HouseIcon weight="bold" size={20} />
                    </ActionIcon>
                  </motion.div>
                )}
                <Group
                  bdrs={'xl'}
                  justify="space-between"
                  bg={M.primary(8)}
                  w={'100%'}
                  pl={'xs'}
                  pr={'xs'}
                  h={rem(60)}
                  style={{
                    boxShadow: M.boxShadow(0)(10)(20)('rgba(0,0,0,0.30)'),
                  }}
                >
                  {bottomNavigatioonConfig.map((action, index) => (
                    <BottomNavigationItem
                      key={index}
                      variant={action.variant}
                      onClick={() => {
                        if (action.to) {
                          navigate({ to: action.to });
                        } else if (action.onClick) {
                          action.onClick();
                        }
                      }}
                    >
                      {action.icon}
                    </BottomNavigationItem>
                  ))}
                </Group>
              </AnimatePresence>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Affix>
  );
};
