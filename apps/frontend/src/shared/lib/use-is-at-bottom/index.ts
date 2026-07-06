import { useState, useEffect } from 'react';

export const useIsAtBottom = (offset = 20) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight } = document.documentElement;
      const { innerHeight, scrollY } = window;

      const hasScroll = scrollHeight > innerHeight;

      const isReached = innerHeight + scrollY >= scrollHeight - offset;

      setIsBottom(hasScroll && isReached);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [offset]);

  return isBottom;
};
