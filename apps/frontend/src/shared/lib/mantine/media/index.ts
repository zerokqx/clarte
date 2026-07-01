export type MediaFeature =
  | 'width'
  | 'height'
  | 'min-width'
  | 'max-width'
  | 'min-height'
  | 'max-height';

/**
 * Каррированный хелпер для создания строк медиа-запросов (например, для useMediaQuery).
 * Принимает: фича (например, 'max-width') -> строковое значение.
 * Пример: media('max-width')('48em') ➡️ "(max-width: 48em)"
 */
export function media<F extends MediaFeature>(feature: F) {
  return function <V extends string>(value: V): `(${F}: ${V})` {
    return `(${feature}: ${value})` as unknown as `(${F}: ${V})`;
  };
}
