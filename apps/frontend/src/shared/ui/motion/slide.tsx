import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { ReactNode } from 'react';

export interface SlideProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  distance?: number;
  triggerOnce?: boolean;
  inView?: boolean;
}

export function Slide({
  children,
  direction = 'up',
  duration = 0.4,
  delay = 0,
  distance = 30,
  triggerOnce = true,
  inView,
  ...props
}: SlideProps) {
  const directionMap = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
  };

  const offset = directionMap[direction];

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration,
        delay,
      },
    },
  };

  const animateProp = inView !== undefined ? (inView ? 'visible' : 'hidden') : undefined;
  const whileInViewProp = inView === undefined ? 'visible' : undefined;

  return (
    <motion.div
      initial="hidden"
      animate={animateProp}
      whileInView={whileInViewProp}
      viewport={{ once: triggerOnce, margin: '-50px' }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
