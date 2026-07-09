import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { ReactNode } from 'react';

export interface ScaleProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  triggerOnce?: boolean;
  inView?: boolean;
}

export function Scale({
  children,
  duration = 0.4,
  delay = 0,
  initialScale = 0.95,
  triggerOnce = true,
  inView,
  ...props
}: ScaleProps) {
  const variants: Variants = {
    hidden: { opacity: 0, scale: initialScale },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
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
