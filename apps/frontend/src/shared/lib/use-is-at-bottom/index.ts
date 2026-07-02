import { useState, useEffect } from 'react';

export const useIsAtBottom = (offset = 20) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight } = document.documentElement;
      const { innerHeight, scrollY } = window;

      // 1. Проверяем, есть ли вообще вертикальный скролл на странице
      // Если вся высота контента меньше или равна высоте экрана, скролла нет
      const hasScroll = scrollHeight > innerHeight;

      // 2. Вычисляем, дошли ли мы до низа
      const isReached = innerHeight + scrollY >= scrollHeight - offset;

      // Панель должна скрываться ТОЛЬКО если скролл существует И мы дошли до низа
      setIsBottom(hasScroll && isReached);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Также полезно слушать изменение размера окна (например, при перевороте экрана)
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [offset]);

  return isBottom;
};
