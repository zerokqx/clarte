import { motion, type HTMLMotionProps, type Variants } from 'motion/react';
import { ReactNode } from 'react';

export interface BlurProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  duration?: number;
  delay?: number;
  initialBlur?: string;
  triggerOnce?: boolean;
  inView?: boolean;
}

export function Blur({
  children,
  duration = 0.5,
  delay = 0,
  initialBlur = '8px',
  triggerOnce = true,
  inView,
  ...props
}: BlurProps) {
  const variants: Variants = {
    hidden: { opacity: 0, filter: `blur(${initialBlur})` },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
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
