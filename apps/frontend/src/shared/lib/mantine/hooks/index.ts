import { MantineBreakpoint, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { MediaFeature, media } from '../media';

/**
 * Возвращает строковое значение конкретного брейкпоинта из текущей темы Mantine.
 * Полезно, когда нужно получить физическую ширину (например, '48em') для JS-логики.
 *
 * @param breakpoint - Ключ брейкпоинта в теме Mantine ('xs', 'sm', 'md', 'lg', 'xl').
 * @returns Строковое значение брейкпоинта (например, '36em' или '48em').
 *
 * @example
 * const mdWidth = useBreakpoint('md'); // '62em'
 */
export function useBreakpoint(breakpoint: MantineBreakpoint) {
  const theme = useMantineTheme();
  return theme.breakpoints[breakpoint];
}

/**
 * React-хук для отслеживания медиа-запроса на основе брейкпоинта из темы Mantine.
 * Позволяет безопасно реагировать на изменения размеров экрана в JS-коде, используя брейкпоинты темы.
 *
 * @param feature - Физический параметр медиа-запроса (например, 'max-width', 'min-width').
 * @param breakpointKey - Ключ брейкпоинта в теме Mantine ('xs', 'sm', 'md', 'lg', 'xl').
 * @returns Булево значение, указывающее, удовлетворяет ли экран условиям медиа-запроса.
 *
 * @example
 * const isMobile = useBreakpointMediaQuery('max-width', 'xs'); // true/false
 */
export function useBreakpointMediaQuery(feature: MediaFeature, breakpointKey: MantineBreakpoint) {
  const breakpointValue = useBreakpoint(breakpointKey);
  return useMediaQuery(media(feature)(breakpointValue));
}
