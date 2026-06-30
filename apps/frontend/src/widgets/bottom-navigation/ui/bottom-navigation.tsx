import { AnimatePresence, motion } from 'motion/react';
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House';
import { ActionIcon, Affix, Group, rem, Stack } from '@mantine/core';
import { BottomNavigationItem } from './bottom-navigation-item';
import { bottomNavigatioonConfig } from '../config';
import { useLocation, useMatch, useMatchRoute, useNavigate } from '@tanstack/react-router';

export const BottomNavigation = () => {
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const isCRoute = matchRoute({ to: '/c' });
  console.log(isCRoute);

  return (
    <Affix position={{ bottom: 10, left: 10, right: 10 }}>
      <Stack align='start'>
      <AnimatePresence>
      {!isCRoute && (
        <motion.div key={'house-button'} initial={{scale:.7}} animate={{scale:1}} exit={{scale:0}}>
        <ActionIcon onClick={() => navigate({ to: '/' })} size={'input-xl'} bdrs="xl">
        <HouseIcon weight="bold" size={20} />
        </ActionIcon>
        </motion.div>
      )}
      </AnimatePresence>
        <Group
          bdrs={'xl'}
          justify="space-between"
          bg={'var(--mantine-primary-color-8)'}
          w={'100%'}
          pl={'md'}
          pr={'md'}
          h={rem(60)}
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
      </Stack>
    </Affix>
  );
};
