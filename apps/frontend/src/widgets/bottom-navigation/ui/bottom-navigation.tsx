import { AnimatePresence, motion } from 'motion/react';
import { Affix, Group } from '@mantine/core';
import { BottomNavigationItem } from './bottom-navigation-item';
import { bottomNavigationConfig } from '../config';
import { BottomNavigationProvider } from '../model';
import { Pill } from './pill';
import { useScrollDirection } from '@mantine/hooks';
import classes from './bottom-navigation.module.scss';

export const BottomNavigation = () => {
  const scrollDirection = useScrollDirection();

  return (
    <Affix position={{ bottom: 0, left: 0, right: 0 }} zIndex={99}>
      <AnimatePresence initial={false} mode="wait">
        {scrollDirection !== 'down' && (
          <motion.div
            key="bottom-navigation"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          >
            <Group id="bottom-navigation-bar" className={classes.bottomNavContainer}>
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
