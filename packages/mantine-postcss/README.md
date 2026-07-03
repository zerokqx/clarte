# @clarte/mantine-postcss

Набор легковесных PostCSS-плагинов для автоматической трансформации кастомных CSS-функций в соответствующие CSS-переменные Mantine v7.

## Установка и подключение

Подключите плагины в вашем файле конфигурации `postcss.config.js` (рекомендуется подключать перед `postcss-preset-mantine`):

```javascript
const {
  color,
  spacing,
  primary,
  radius,
  shadow,
  fz,
  fw,
  lh,
  breakpoint,
  z,
} = require('@clarte/mantine-postcss');

module.exports = {
  plugins: [
    color(),
    spacing(),
    primary(),
    radius(),
    shadow(),
    fz(),
    fw(),
    lh(),
    breakpoint(),
    z(),
    require('postcss-preset-mantine')({}),
    // другие плагины...
  ],
};
```

---

## Список плагинов и правила трансформации

Все плагины не выполняют лишних проверок значений и напрямую преобразуют функцию вида `name(value)` в переменную `var(--mantine-name-value)` (или специфичные префиксы согласно дизайн-системе Mantine).

### 1. Цвета (`c`)

Трансформирует цвета и оттенки:

- `c(blue.4)` ➡️ `var(--mantine-color-blue-4)`
- `c(text)` ➡️ `var(--mantine-color-text)`
- `c(primary.3)` ➡️ `var(--mantine-primary-color-3)` _(особый маппинг для оттенков primary)_

### 2. Отступы (`spacing`)

- `spacing(md)` ➡️ `var(--mantine-spacing-md)`
- `spacing(xs)` ➡️ `var(--mantine-spacing-xs)`

### 3. Акцентные цвета (`primary`)

- `primary(filled)` ➡️ `var(--mantine-primary-color-filled)`
- `primary(contrast)` ➡️ `var(--mantine-primary-color-contrast)`

### 4. Радиус скругления (`radius`)

- `radius(md)` ➡️ `var(--mantine-radius-md)`
- `radius(default)` ➡️ `var(--mantine-radius-default)`

### 5. Тени (`shadow`)

- `shadow(md)` ➡️ `var(--mantine-shadow-md)`
- `shadow(xl)` ➡️ `var(--mantine-shadow-xl)`

### 6. Размеры шрифтов (`fz`)

- `font-size: fz(sm)` ➡️ `font-size: var(--mantine-font-size-sm)`
- `font-size: fz(lg)` ➡️ `font-size: var(--mantine-font-size-lg)`

### 7. Вес шрифтов (`fw`)

- `font-weight: fw(bold)` ➡️ `font-weight: var(--mantine-font-weight-bold)`
- `font-weight: fw(medium)` ➡️ `font-weight: var(--mantine-font-weight-medium)`

### 8. Высота строки (`lh`)

- `line-height: lh(md)` ➡️ `line-height: var(--mantine-line-height-md)`

### 9. Контрольные точки адаптивности (`breakpoint`)

- `@media (min-width: breakpoint(md))` ➡️ `@media (min-width: var(--mantine-breakpoint-md))`

### 10. Z-индексы (`z`)

- `z-index: z(modal)` ➡️ `z-index: var(--mantine-z-index-modal)`
- `z-index: z(max)` ➡️ `z-index: var(--mantine-z-index-max)`
