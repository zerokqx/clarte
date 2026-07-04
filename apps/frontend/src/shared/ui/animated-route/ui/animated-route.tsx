import { motion, type MotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { routeVariants } from '../config';

interface AnimatedRouteProps extends MotionProps {
  children: ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'slideUp';
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

export function AnimatedRoute({ children, variant = 'fade', ...motionProps }: AnimatedRouteProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={routeVariants[variant]}
      transition={pageTransition}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
