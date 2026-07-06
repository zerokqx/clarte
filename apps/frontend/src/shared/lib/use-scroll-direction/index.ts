import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);

  useEffect(() => {
    let lastScrollTop = window.scrollY || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;

      const threshold = 5;

      if (Math.abs(currentScroll - lastScrollTop) < threshold) {
        return;
      }

      if (currentScroll > lastScrollTop) {
        setScrollDirection('down');
      } else if (currentScroll < lastScrollTop) {
        setScrollDirection('up');
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollDirection;
};
