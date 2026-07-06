# @clarte/mantine-helpers

Вспомогательные утилиты, хелперы и React-хуки для интеграции с дизайн-системой [Mantine](https://mantine.dev/) в проектах фронтенда.

Библиотека разработана для упрощения генерации CSS-переменных, адаптивных стилей, медиа-запросов и поддержки тем (светлая/тёмная) в коде CSS-in-JS/Style Props.

---

## Установка и использование

Установите зависимость в ваш проект фронтенда:

```json
{
  "dependencies": {
    "@clarte/mantine-helpers": "workspace:*"
  }
}
```

Все хелперы экспортируются под общим пространством имён `M`:

```tsx
import { M } from '@clarte/mantine-helpers';

// Пример использования в стилях Mantine:
const styles = {
  container: {
    backgroundColor: M.lightDark(M.gray(0))(M.dark(8)),
    border: M.border(1)('solid')(M.gray(3)),
    padding: M.spacing('md'),
    boxShadow: M.boxShadow(0)(4)(12)(M.alpha(M.dark(9))(0.1)),
  },
};
```

---

## API Reference

### 1. Цвета (`M.colors`)

Позволяют удобно обращаться к CSS-переменным цветов Mantine с автодополнением оттенков.

- **`M.primary(shade?)`** / **`M.dark(shade?)`** / **`M.gray(shade?)`** — Возвращают CSS-переменную оттенка цвета.
  - `M.primary() ➡️ var(--mantine-primary-color-filled)`
  - `M.primary(6) ➡️ var(--mantine-primary-color-6)`
  - `M.dark(3) ➡️ var(--mantine-color-dark-3)`
- **Константные цвета темы:**
  - `M.white() ➡️ var(--mantine-color-white)`
  - `M.body() ➡️ var(--mantine-color-body)`
  - `M.text() ➡️ var(--mantine-color-text)`
  - `M.dimmed() ➡️ var(--mantine-color-dimmed)`
  - `M.error() ➡️ var(--mantine-color-error)`
  - `M.placeholder() ➡️ var(--mantine-color-placeholder)`
  - `M.defaultBg() ➡️ var(--mantine-color-default)`
- **`M.lightDark(lightColor)(darkColor)`** — Каррированная функция для генерации нативного CSS `light-dark()`.
  - `M.lightDark('white')('black') ➡️ light-dark(white, black)`
- **`M.alpha(colorValue)(opacity)`** — Каррированный хелпер для создания полупрозрачных цветов через `color-mix`.
  - `M.alpha(M.primary(6))(0.15) ➡️ color-mix(in srgb, var(--mantine-primary-color-6) 15%, transparent)`
- **`M.gradient(fromColor)(direction)(toColor)`** — Линейные градиенты.
  - `M.gradient('red')('to right')('blue') ➡️ linear-gradient(to right, red, blue)`
- **Адаптивные градиенты под тему:**
  - **`M.themeGradient({ dir, light, dark })`** — Генерирует градиент, автоматически переключающий цвета для светлой/тёмной темы.
    - `M.themeGradient({ dir: 'to right', light: ['red', 'yellow'], dark: ['blue', 'black'] })`
  - **`M.curriedThemeGradient(dir)(light)(dark)`** — Каррированный аналог `themeGradient`.

---

### 2. Размеры и Графика (`M.sizes`)

Служат для генерации CSS-переменных отступов, радиусов, размеров шрифтов и теней.

- `M.spacing(size) ➡️ var(--mantine-spacing-size)`
- `M.radius(size) ➡️ var(--mantine-radius-size)`
- `M.fontSize(size) ➡️ var(--mantine-font-size-size)`
- `M.shadow(size) ➡️ var(--mantine-shadow-size)`
- `M.breakpoint(size) ➡️ var(--mantine-breakpoint-size)`
- **`M.boxShadow(x)(y)(blur)(color)`** — Каррированный хелпер для сборки тени.
  - `M.boxShadow(0)(10)(20)('rgba(0,0,0,0.1)') ➡️ 0 10px 20px rgba(0,0,0,0.1)`
- **`M.border(width)(style)(color)`** — Каррированный хелпер для сборки обводки.
  - `M.border(1)('solid')(M.gray(3)) ➡️ 1px solid var(--mantine-gray-3)`

---

### 3. Медиа-запросы (`M.media`)

Утилиты для построения условий `@media` в CSS/JS.

- **`M.media(feature)(value)`**
  - `M.media('max-width')('48em') ➡️ (max-width: 48em)`

---

### 4. React-хуки (`M.hooks`)

React-хуки, интегрированные с темой и брейкпоинтами Mantine.

- **`M.useBreakpoint(breakpointKey)`** — Возвращает строковое физическое значение брейкпоинта из текущей темы Mantine (например, `'48em'` для `'sm'`).
- **`M.useBreakpointMediaQuery(feature, breakpointKey)`** — React-хук для динамического отслеживания медиа-запроса на основе брейкпоинтов темы.
  - `const isMobile = M.useBreakpointMediaQuery('max-width', 'sm'); // true/false`

---

## Разработка и тестирование

### Сборка библиотеки

Собрать дистрибутив с помощью SWC:

```bash
pnpm nx build mantine-helpers
```

### Запуск тестов

Запустить unit-тесты через Vitest:

```bash
pnpm nx test mantine-helpers
```

### Проверка стиля

Запустить линтер:

```bash
pnpm nx lint mantine-helpers
```
