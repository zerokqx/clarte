import { useLocation } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { bottomNavigationConfig } from '../../config';
import { useBottomNavigation } from '../../model';
import classes from './pill.module.css';

export const Pill = () => {
  const [dimensions, setDimensions] = useState({ x: 0, width: 0, top: 0 });

  const location = useLocation();
  const bottomNavigation = useBottomNavigation();

  const activeConfig = useMemo(
    () =>
      bottomNavigationConfig.find((item) => {
        if (item.activeOptions?.exact) {
          return location.pathname === item.to;
        }
        return location.pathname.startsWith(item.to);
      }),
    [location.pathname],
  );

  const activeRef = bottomNavigation.getRef(activeConfig?.to ?? '/');

  useEffect(() => {
    if (activeRef) {
      const navContainer = document.getElementById('bottom-navigation-bar');

      if (navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();

        setDimensions({
          x: activeRect.left - navRect.left,
          width: activeRect.width,
          top: activeRect.top - navRect.top,
        });
      }
    }
  }, [activeRef, location.pathname]);

  if (!activeRef) return null;

  return (
    <motion.div
      className={classes.pill}
      animate={{
        x: dimensions.x,
        width: dimensions.width,
        top: dimensions.top,
      }}
    />
  );
};
