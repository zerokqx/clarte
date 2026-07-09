import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { ReactNode } from 'react';

export interface FadeProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  triggerOnce?: boolean;
  inView?: boolean;
}

export function Fade({
  children,
  duration = 0.3,
  delay = 0,
  triggerOnce = true,
  inView,
  ...props
}: FadeProps) {
  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        ease: 'easeOut',
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
