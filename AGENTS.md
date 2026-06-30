<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

## Domain Concepts

**Solo Microservice:**
A "solo microservice" is a microservice that encapsulates exactly one distinct entity or aggregate root (e.g., `user-service`). It is responsible solely for the lifecycle, state, and business rules of that specific domain concept without bleeding into other domains. It owns its own database and exposes its capabilities via well-defined contracts (gRPC, HTTP).

**DDD + CQRS in Solo Microservices:**

- **DDD (Domain-Driven Design):** Focuses on isolating the core business logic (Domain) from infrastructure and framework concerns. Even in a single-entity microservice, it helps maintain a clean boundary around the entity's behavior.
- **CQRS (Command Query Responsibility Segregation):** Segregates operations that modify state (Commands) from operations that read state (Queries). In a solo microservice, this means having distinct execution paths and models for reading the entity vs. updating/creating it, which improves maintainability and scalability.

## Стиль написания кода и архитектурные правила

1. **Чистая архитектура и DDD структуры**:
   - Разделение слоев во всех сервисах должно быть строгим:
     - `domain`: содержит сущности-агрегаты (Aggregate Roots), объекты-значения (Value Objects) для валидации полей (например, `IdVo`, `TitleVo`) и доменные исключения. Логика сущностей не должна зависеть от внешних библиотек.
     - `application`: прикладной слой, содержит CQRS-команды/запросы (`commands`/`queries`), порты (`ports`/интерфейсы) и декораторы.
     - `infrastructure`: техническая реализация (адаптеры БД TypeORM, клиенты gRPC/RMQ).
     - `presentation`: контроллеры gRPC/RMQ и HTTP-эндпоинты шлюза (api-gateway).

2. **Внедрение зависимостей (Dependency Injection) и декораторы**:
   - Никогда не внедряйте классы инфраструктуры напрямую в прикладной слой или контроллеры.
   - Всегда объявляйте интерфейсы (порты) в `application/ports/`.
   - Объявляйте символьные токены (DI Tokens) в `application/ports/di-tokens.ts`:
     ```typescript
     export const MY_SERVICE = Symbol('My service');
     ```
   - Создавайте кастомные декораторы инъекции в `application/decorators/` с помощью утилиты `mkInject` из `@clarte/shared-nest/functions`:
     ```typescript
     export const InjectMyService = mkInject(MY_SERVICE);
     ```
   - Внедряйте зависимости только через эти декораторы: `@InjectMyService() private readonly service: IMyService`.

3. **Событийно-ориентированная архитектура (RabbitMQ)**:
   - Описание событий находится в библиотеке `packages/shared-event-types`. Паттерны событий объявляются в `UserEventPattern`, а типы полезной нагрузки — в `UserEventPayloadMap`.
   - При публикации событий используйте `ClientProxy.emit()` совместно с RxJS `firstValueFrom` и конструкцией `satisfies` для строгой проверки типов:
     ```typescript
     firstValueFrom(
       this.rmqClient.emit(UserEventPattern.UserCreated, {
         userId: user.id,
         login: user.login,
       } satisfies UserEventPayloadMap[UserEventPattern.UserCreated]),
     ).catch((err) => console.error(err));
     ```
   - Обработчики событий в микросервисах декорируются `@EventPattern(...)` и принимают строго типизированные аргументы `@Payload() data: IEventPayload`.

4. **Функциональный подход и Effect TS**:
   - Сложные асинхронные цепочки, таймауты, ретраи и обработку ошибок в прикладных обработчиках (Handlers) следует реализовывать в функциональном стиле с использованием библиотеки `effect`:
     ```typescript
     const exit = await pipe(
       Effect.tryPromise({
         try: () => this.client.getData(),
         catch: (err) => new CustomException(err),
       }),
       Effect.timeout('3 seconds'),
       Effect.runPromiseExit,
     );
     ```

5. **Правила TypeScript и Линтера**:
   - Строго соблюдайте правила `@typescript-eslint/no-inferrable-types`. Не пишите тип свойства класса или переменной, если он тривиально выводится из дефолтного значения (пишите `public readonly userAgent = ''` вместо `public readonly userAgent: string = ''`).

6. **Правила стилизации компонентов (Mantine)**:
   - При стилизации UI-компонентов всегда отдавайте приоритет встроенным возможностям Mantine (Props, Style Props, Styles API). Создавать файлы CSS-модулей допускается только в том случае, если стандартных возможностей Mantine недостаточно для реализации интерфейса.

Before a big task from the user, it is always necessary to commit the current changes and only after that start working.

# Rich text editor

Package: @mantine/tiptap
Import: import { Rich text editor } from '@mantine/tiptap';
Description: Tiptap based rich text editor

## Installation

Install with yarn:

```bash
yarn add @mantine/tiptap @mantine/core @mantine/hooks @tiptap/react @tiptap/pm @tiptap/extension-link @tiptap/starter-kit
```

```bash
npm install @mantine/tiptap @mantine/core @mantine/hooks @tiptap/react @tiptap/pm @tiptap/extension-link @tiptap/starter-kit
```

After installation import package styles at the root of your application:

```tsx
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
```

## TipTap editor

The `@mantine/tiptap` package provides a UI for [Tiptap](https://tiptap.dev/). The `RichTextEditor` component
works with the [Editor](https://tiptap.dev/api/editor) instance of tiptap.
This means that you have full control over the editor [state and configuration](https://tiptap.dev/guide/configuration)
with the [useEditor hook](https://tiptap.dev/installation/react).

In other words, the `RichTextEditor` component does not manage state for you;
controls just execute operations on the `Editor` instance. If you want to
implement something that is related to state or component value (for example, controlled mode, value transforms to HTML/Markdown),
you should look for documentation on the [tiptap.dev](https://tiptap.dev/) website.

## Usage

```tsx
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Subtle variant

`variant="subtle"` removes borders from the control groups, makes controls
larger, and reduces spacing of the toolbar:

```tsx
import Highlight from '@tiptap/extension-highlight';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';

const content = '<p>Subtle rich text editor variant</p>';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit, Highlight],
    content,
  });

  return (
    <RichTextEditor editor={editor} variant="subtle">
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Controlled

To control the editor state, create a wrapper component and pass the `onChange` handler
to the `useEditor` hook:

```tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor as MantineRichTextEditor } from '@mantine/tiptap';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <MantineRichTextEditor editor={editor}>
      <MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.ControlsGroup>
          <MantineRichTextEditor.Bold />
          <MantineRichTextEditor.Italic />
        </MantineRichTextEditor.ControlsGroup>
      </MantineRichTextEditor.Toolbar>

      <MantineRichTextEditor.Content />
    </MantineRichTextEditor>
  );
}
```

## Controls and extensions

Some controls require installation of additional [Tiptap extensions](https://tiptap.dev/extensions).
For example, if you want to use `RichTextEditor.Superscript` control, you will need to install `@tiptap/extension-superscript` package:

```bash
yarn add @tiptap/extension-superscript
```

```bash
npm install @tiptap/extension-superscript
```

Included with `@tiptap/starter-kit` (should be installed by default):

- `RichTextEditor.H1`
- `RichTextEditor.H2`
- `RichTextEditor.H3`
- `RichTextEditor.H4`
- `RichTextEditor.H5`
- `RichTextEditor.H6`
- `RichTextEditor.BulletList`
- `RichTextEditor.OrderedList`
- `RichTextEditor.Bold`
- `RichTextEditor.Italic`
- `RichTextEditor.Strikethrough`
- `RichTextEditor.ClearFormatting`
- `RichTextEditor.Blockquote`
- `RichTextEditor.Code`
- `RichTextEditor.CodeBlock`
- `RichTextEditor.Hr`
- `RichTextEditor.Undo`
- `RichTextEditor.Redo`
- `RichTextEditor.Underline`
- `RichTextEditor.Unlink`

Controls that require [@tiptap/extension-text-align](https://www.npmjs.com/package/@tiptap/extension-text-align) extension:

- `RichTextEditor.AlignLeft`
- `RichTextEditor.AlignRight`
- `RichTextEditor.AlignCenter`
- `RichTextEditor.AlignJustify`

Controls that require [@tiptap/extension-color](https://www.npmjs.com/package/@tiptap/extension-color) and [@tiptap/extension-text-style](https://www.npmjs.com/package/@tiptap/extension-text-style) extensions:

- `RichTextEditor.ColorPicker`
- `RichTextEditor.Color`
- `RichTextEditor.UnsetColor`

Other controls with required extensions:

- `RichTextEditor.Superscript` requires [@tiptap/extension-superscript](https://www.npmjs.com/package/@tiptap/extension-superscript)
- `RichTextEditor.Subscript` requires [@tiptap/extension-subscript](https://www.npmjs.com/package/@tiptap/extension-subscript)
- `RichTextEditor.Highlight` requires [@tiptap/extension-highlight](https://www.npmjs.com/package/@tiptap/extension-highlight)

## Placeholder

To use a placeholder, you will need to install the [@tiptap/extension-placeholder](https://www.npmjs.com/package/@tiptap/extension-placeholder) package:

```bash
yarn add @tiptap/extension-placeholder
```

```bash
npm install @tiptap/extension-placeholder
```

```tsx
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit, Placeholder.configure({ placeholder: 'This is placeholder' })],
    content: '',
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Link extension

The `@mantine/tiptap` package provides a custom `Link` extension that is required to be used instead of
`@tiptap/extension-link` in order for the `Ctrl + K` keyboard shortcut to work:

```tsx
// Use Link extension exported from the @mantine/tiptap package
import { useEditor } from '@tiptap/react';
import { Link, RichTextEditor } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    extensions: [
      Link,
      // ... other extensions
    ],
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Text color

To use text color, you will need to install additional packages:

```bash
yarn add @tiptap/extension-color @tiptap/extension-text-style
```

```bash
npm install @tiptap/extension-color @tiptap/extension-text-style
```

You can use the following controls to change text color:

- `RichTextEditor.ColorPicker` – allows you to pick colors from given predefined color swatches and with the [ColorPicker](https://mantine.dev/llms/core-color-picker.md) component
- `RichTextEditor.Color` – allows you to apply a given color with one click
- `RichTextEditor.UnsetColor` – clears color styles

```tsx
import { useEditor } from '@tiptap/react';
import { EyedropperIcon } from '@phosphor-icons/react';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: '<p>Apply some colors to this text</p>',
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ColorPicker
          colors={[
            '#25262b',
            '#868e96',
            '#fa5252',
            '#e64980',
            '#be4bdb',
            '#7950f2',
            '#4c6ef5',
            '#228be6',
            '#15aabf',
            '#12b886',
            '#40c057',
            '#82c91e',
            '#fab005',
            '#fd7e14',
          ]}
        />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control interactive={false}>
            <EyedropperIcon size={16} />
          </RichTextEditor.Control>
          <RichTextEditor.Color color="#F03E3E" />
          <RichTextEditor.Color color="#7048E8" />
          <RichTextEditor.Color color="#1098AD" />
          <RichTextEditor.Color color="#37B24D" />
          <RichTextEditor.Color color="#F59F00" />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.UnsetColor />
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Code highlight

To use code highlighting, you will need to install additional packages:

```bash
yarn add lowlight @tiptap/extension-code-block-lowlight
```

```bash
npm install lowlight @tiptap/extension-code-block-lowlight
```

```tsx
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import ts from 'highlight.js/lib/languages/typescript';

const lowlight = createLowlight();

// register languages that you are planning to use
lowlight.register({ ts });

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const codeExample =
  escapeHtml(`// Valid braces Kata – https://www.codewars.com/kata/5277c8a221e209d3f6000b56

const pairs: Record<string, string> = {
  '[': ']',
  '{': '}',
  '(': ')',
};

const openBraces = Object.keys(pairs);

export function validBraces(braces: string) {
  const opened: string[] = [];

  for (let i = 0; i < braces.length; i += 1) {
    const brace = braces[i];

    if (openBraces.includes(brace)) {
      opened.push(brace);
      continue;
    }

    if (pairs[opened[opened.length - 1]] !== brace) {
      return false
    }

    opened.pop();
  }

  return opened.length === 0;
}`);

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: `<p>Regular paragraph</p><pre><code>${codeExample}</code></pre>`,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.CodeBlock />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Source code mode

You can use the following control to see and edit the source code of editor content:

- `RichTextEditor.SourceCode` – allows switching on/off source code mode

```tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { useState } from 'react';

function Demo() {
  const [isSourceCodeModeActive, onSourceCodeTextSwitch] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    shouldRerenderOnTransaction: true,
    content:
      '<p>Source code control example</p><p>New line with <strong>bold text</strong></p><p>New line with <em>italic</em> <em>text</em></p>',
  });

  return (
    <RichTextEditor editor={editor} onSourceCodeTextSwitch={onSourceCodeTextSwitch}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.SourceCode icon={BoldIcon} />
        </RichTextEditor.ControlsGroup>
        {!isSourceCodeModeActive && (
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
          </RichTextEditor.ControlsGroup>
        )}
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Tasks

To use tasks, you will need to install additional packages:

```bash
yarn add @tiptap/extension-task-item @tiptap/extension-task-list
```

```bash
npm install @tiptap/extension-task-item @tiptap/extension-task-list
```

```tsx
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor, getTaskListExtension } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'test-item',
        },
      }),
    ],
    content: `
        <ul data-type="taskList">
          <li data-type="taskItem" data-checked="true">A list item</li>
          <li data-type="taskItem" data-checked="false">And another one</li>
        </ul>
        <p></p>
      `,
  });

  return (
    <div style={{ padding: 40 }}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.TaskList />
            <RichTextEditor.TaskListLift />
            <RichTextEditor.TaskListSink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
}
```

## Typography styles

By default, `RichTextEditor` renders content with [Typography](https://mantine.dev/llms/core-typography.md) and some additional styles.
You can disable these styles by setting `withTypographyStyles={false}`:

```tsx
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    extensions: [
      // ... your extensions
    ],
  });

  return (
    <RichTextEditor editor={editor} withTypographyStyles={false}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

Then you will be able to add your own styles either with [global styles](https://mantine.dev/llms/styles-global-styles.md)
or with [Styles API](https://mantine.dev/llms/styles-styles-api.md):

```tsx
// Demo.module.css
.root {
  h2 {
    color: light-dark(var(--mantine-color-gray-6), var(--mantine-color-dark-2));
    font-size: var(--mantine-font-size-xl);
  }

  p {
    font-size: var(--mantine-font-size-lg);
  }

  a {
    color: var(--mantine-color-red-6);
  }
}

// Demo.tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor, Link } from '@mantine/tiptap';
import classes from './Demo.module.css';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ link: false }), Link],
    content: `
    <h2>Heading 2</h2>
    <p>Paragraph with <a href="https://mantine.dev">link</a></p>
    `,
  });

  return (
    <RichTextEditor editor={editor} classNames={classes}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}

export const typographyStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
};
```

## Bubble menu

You can use the [BubbleMenu](https://tiptap.dev/api/extensions/bubble-menu) component
with any `RichTextEditor` controls. The bubble menu will appear near a selection of text:

```tsx
import { useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { Link, RichTextEditor } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ link: false }), Link],
    content: '<p>Select some text to see bubble menu</p>',
  });

  return (
    <RichTextEditor editor={editor}>
      {editor && (
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
      )}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Floating menu

You can use the [FloatingMenu](https://tiptap.dev/api/extensions/floating-menu) component
with any `RichTextEditor` controls. The floating menu will appear in an empty line:

```tsx
import { useEditor } from '@tiptap/react';
import { FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor, Link } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit.configure({ link: false }), Link],
    content: '<p>Enter a new line to see floating menu</p>',
  });

  return (
    <RichTextEditor editor={editor}>
      {editor && (
        <FloatingMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.BulletList />
          </RichTextEditor.ControlsGroup>
        </FloatingMenu>
      )}
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Sticky toolbar

Set the `sticky` prop on the `RichTextEditor.Toolbar` component to make the toolbar sticky;
control the `top` property with `stickyOffset`. For example, on the mantine.dev documentation
website there is a header with `var(--docs-header-height)` height. In this case, we will need to
set `stickyOffset="var(--docs-header-height)"` to make the sticky position work correctly with the fixed positioned element.

```tsx
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: false }),
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Editor context

Use the `useRichTextEditorContext` hook to get the [Editor](https://tiptap.dev/api/editor) from
the context. This hook can be used to create a custom control or run any operations supported
by the Tiptap [editor API](https://tiptap.dev/api/editor).

```tsx
import { Button } from '@mantine/core';
import { useRichTextEditorContext } from '@mantine/tiptap';

function Demo() {
  const { editor } = useRichTextEditorContext();
  return <Button onClick={() => editor?.chain().focus().toggleBold().run()}>Make bold</Button>;
}
```

## Custom controls

Use the `RichTextEditor.Control` component to create custom controls. It supports all
props supported by the `button` element and has an `active` prop to indicate active state.
Note that you will need to set the `aria-label` attribute to make the control visible for screen readers.

```tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { StarIcon } from '@phosphor-icons/react';

function InsertStarControl() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.commands.insertContent('⭐')}
      aria-label="Insert star emoji"
      title="Insert star emoji"
    >
      <StarIcon size={16} />
    </RichTextEditor.Control>
  );
}

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit],
    content: '<p>Click control to insert star emoji</p>',
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <InsertStarControl />
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Change icons

You can change the icon of a control by setting the `icon` prop. It accepts a component
that must handle the `size` prop:

```tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { TextBIcon, TextItalicIcon } from '@phosphor-icons/react';

const BoldIcon = () => <TextBIcon size={16} />;
const ItalicIcon = () => <TextItalicIcon size={16} />;

function Demo() {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [StarterKit],
    content: '<p>Customize icons with icon prop</p>',
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold icon={BoldIcon} />
          <RichTextEditor.Italic icon={ItalicIcon} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

## Labels and localization

`RichTextEditor` supports changing labels for all controls with the `labels` prop:

```tsx
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';

function Demo() {
  const editor = useEditor({
    extensions: [
      // ... your extensions
    ],
  });

  return (
    <RichTextEditor
      editor={editor}
      labels={{
        boldControlLabel: 'Make text bold',
        italicControlLabel: 'Make text bold',
        // ...other labels
      }}
    >
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
```

Most labels are used to add `aria-label` and `title` attributes to controls; some of the labels
can be a function that returns a string. If you do not provide all labels, they will be merged with
the default labels.

All available labels:

```tsx
// RichTextEditorLabels type can be imported from @mantine/tiptap package
export interface RichTextEditorLabels {
  /** RichTextEditor.Bold control aria-label */
  boldControlLabel: string;

  /** RichTextEditor.Hr control aria-label */
  hrControlLabel: string;

  /** RichTextEditor.Italic control aria-label */
  italicControlLabel: string;

  /** RichTextEditor.Underline control aria-label */
  underlineControlLabel: string;

  /** RichTextEditor.Strike control aria-label */
  strikeControlLabel: string;

  /** RichTextEditor.ClearFormatting control aria-label */
  clearFormattingControlLabel: string;

  /** RichTextEditor.Link control aria-label */
  linkControlLabel: string;

  /** RichTextEditor.Unlink control aria-label */
  unlinkControlLabel: string;

  /** RichTextEditor.BulletList control aria-label */
  bulletListControlLabel: string;

  /** RichTextEditor.OrderedList control aria-label */
  orderedListControlLabel: string;

  /** RichTextEditor.H1 control aria-label */
  h1ControlLabel: string;

  /** RichTextEditor.H2 control aria-label */
  h2ControlLabel: string;

  /** RichTextEditor.H3 control aria-label */
  h3ControlLabel: string;

  /** RichTextEditor.H4 control aria-label */
  h4ControlLabel: string;

  /** RichTextEditor.H5 control aria-label */
  h5ControlLabel: string;

  /** RichTextEditor.H6 control aria-label */
  h6ControlLabel: string;

  /** RichTextEditor.Blockquote control aria-label */
  blockquoteControlLabel: string;

  /** RichTextEditor.AlignLeft control aria-label */
  alignLeftControlLabel: string;

  /** RichTextEditor.AlignCenter control aria-label */
  alignCenterControlLabel: string;

  /** RichTextEditor.AlignRight control aria-label */
  alignRightControlLabel: string;

  /** RichTextEditor.AlignJustify control aria-label */
  alignJustifyControlLabel: string;

  /** RichTextEditor.Code control aria-label */
  codeControlLabel: string;

  /** RichTextEditor.CodeBlock control aria-label */
  codeBlockControlLabel: string;

  /** RichTextEditor.Subscript control aria-label */
  subscriptControlLabel: string;

  /** RichTextEditor.Superscript control aria-label */
  superscriptControlLabel: string;

  /** RichTextEditor.ColorPicker control aria-label */
  colorPickerControlLabel: string;

  /** RichTextEditor.UnsetColor control aria-label */
  unsetColorControlLabel: string;

  /** RichTextEditor.Highlight control aria-label */
  highlightControlLabel: string;

  /** RichTextEditor.Undo control aria-label */
  undoControlLabel: string;

  /** RichTextEditor.Redo control aria-label */
  redoControlLabel: string;

  /** A function go get RichTextEditor.Color control aria-label based on color that control applies */
  colorControlLabel: (color: string) => string;

  /** aria-label for link editor url input */
  linkEditorInputLabel: string;

  /** placeholder for link editor url input */
  linkEditorInputPlaceholder: string;

  /** Content of external button tooltip in link editor when the link was chosen to open in a new tab */
  linkEditorExternalLink: string;

  /** Content of external button tooltip in link editor when the link was chosen to open in the same tab */
  linkEditorInternalLink: string;

  /** Save button content in link editor */
  linkEditorSave: string;

  /** Cancel button title text in color picker control */
  colorPickerCancel: string;

  /** Clear button title text in color picker control */
  colorPickerClear: string;

  /** Color picker button title text in color picker control */
  colorPickerColorPicker: string;

  /** Palette button title text in color picker control */
  colorPickerPalette: string;

  /** Save button title text in color picker control */
  colorPickerSave: string;

  /** aria-label for color palette colors */
  colorPickerColorLabel: (color: string) => string;
}
```

Default labels (can be imported from `@mantine/tiptap` package):

```tsx
import { RichTextEditorLabels } from '@mantine/tiptap';

export const DEFAULT_LABELS: RichTextEditorLabels = {
  // Controls labels
  linkControlLabel: 'Link',
  colorPickerControlLabel: 'Text color',
  highlightControlLabel: 'Highlight text',
  colorControlLabel: (color) => `Set text color ${color}`,
  boldControlLabel: 'Bold',
  italicControlLabel: 'Italic',
  underlineControlLabel: 'Underline',
  strikeControlLabel: 'Strikethrough',
  clearFormattingControlLabel: 'Clear formatting',
  unlinkControlLabel: 'Remove link',
  bulletListControlLabel: 'Bullet list',
  orderedListControlLabel: 'Ordered list',
  h1ControlLabel: 'Heading 1',
  h2ControlLabel: 'Heading 2',
  h3ControlLabel: 'Heading 3',
  h4ControlLabel: 'Heading 4',
  h5ControlLabel: 'Heading 5',
  h6ControlLabel: 'Heading 6',
  blockquoteControlLabel: 'Blockquote',
  alignLeftControlLabel: 'Align text: left',
  alignCenterControlLabel: 'Align text: center',
  alignRightControlLabel: 'Align text: right',
  alignJustifyControlLabel: 'Align text: justify',
  codeControlLabel: 'Code',
  codeBlockControlLabel: 'Code block',
  subscriptControlLabel: 'Subscript',
  superscriptControlLabel: 'Superscript',
  unsetColorControlLabel: 'Unset color',
  hrControlLabel: 'Horizontal line',
  undoControlLabel: 'Undo',
  redoControlLabel: 'Redo',

  // Task list
  tasksControlLabel: 'Task list',
  tasksSinkLabel: 'Decrease task level',
  tasksLiftLabel: 'Increase task level',

  // Link editor
  linkEditorInputLabel: 'Enter URL',
  linkEditorInputPlaceholder: 'https://example.com/',
  linkEditorExternalLink: 'Open link in a new tab',
  linkEditorInternalLink: 'Open link in the same tab',
  linkEditorSave: 'Save',

  // Color picker control
  colorPickerCancel: 'Cancel',
  colorPickerClear: 'Clear color',
  colorPickerColorPicker: 'Color picker',
  colorPickerPalette: 'Color palette',
  colorPickerSave: 'Save',
  colorPickerColorLabel: (color) => `Set text color ${color}`,
};
```

# HooksPackage

Package: @mantine/hooks
Import: import { HooksPackage } from '@mantine/hooks';

# Mantine hooks

[![npm](https://img.shields.io/npm/dm/@mantine/hooks)](https://www.npmjs.com/package/@mantine/hooks)

The [@mantine/hooks](https://www.npmjs.com/package/@mantine/hooks) package
provides more than 70 hooks to build custom components. The `@mantine/hooks`
package is used internally in most other `@mantine/*` packages –
it is required to be installed in your project to use Mantine components.

## Installation

```bash
yarn add @mantine/hooks
```

```bash
npm install @mantine/hooks
```

## Usage

The `@mantine/hooks` package can be used in any web React application, and state
management hooks (like [use-pagination](https://mantine.dev/llms/hooks-use-pagination.md) or [use-queue](https://mantine.dev/llms/hooks-use-queue.md))
are also compatible with React Native. The package can be used even if you
do not use Mantine components or other Mantine libraries – it is standalone
and has no dependencies except React.

Example of using [use-move](https://mantine.dev/llms/hooks-use-move.md) hook to create a custom slider:

```tsx
// Demo.tsx
import { useState } from 'react';
import { DotsSixVerticalIcon } from '@phosphor-icons/react';
import { clamp, useMove } from '@mantine/hooks';
import classes from './Demo.module.css';

function Demo() {
  const [value, setValue] = useState(0.3);
  const { ref } = useMove(({ x }) => setValue(clamp(x, 0.1, 0.9)));
  const labelFloating = value < 0.2 || value > 0.8;

  return (
    <div className={classes.root}>
      <div className={classes.track} ref={ref}>
        <div
          className={classes.filled}
          style={{
            width: `calc(${value * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
          }}
        >
          <span className={classes.label} data-floating={labelFloating || undefined} data-filled>
            {(value * 100).toFixed(0)}
          </span>
        </div>

        <div
          className={classes.empty}
          style={{
            width: `calc(${(1 - value) * 100}% - var(--thumb-width) / 2 - var(--thumb-offset) / 2)`,
          }}
        >
          <span className={classes.label} data-floating={labelFloating || undefined}>
            {((1 - value) * 100).toFixed(0)}
          </span>
        </div>

        <div
          className={classes.thumb}
          style={{ left: `calc(${value * 100}% - var(--thumb-width) / 2)` }}
        >
          <DotsSixVerticalIcon />
        </div>
      </div>
    </div>
  );
}

// Demo.module.css
.root {
  padding-top: 20px;
}

.track {
  --thumb-width: 20px;
  --thumb-offset: 10px;

  position: relative;
  height: 60px;
  display: flex;
}

.filled {
  height: 100%;
  margin-right: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
  border-radius: var(--mantine-radius-md);
  background-color: var(--mantine-color-blue-filled);
  display: flex;
  align-items: center;
  padding-inline: 10px;
}

.empty {
  height: 100%;
  margin-left: calc(var(--thumb-offset) / 2 + var(--thumb-width) / 2);
  border-radius: var(--mantine-radius-md);
  background-color: var(--mantine-color-gray-1);
  display: flex;
  align-items: center;
  padding-inline: 10px;
  justify-content: flex-end;

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
  }
}

.thumb {
  position: absolute;
  background-color: var(--mantine-color-white);
  border: 1px solid var(--mantine-color-gray-2);
  border-radius: var(--mantine-radius-md);
  height: 100%;
  width: var(--thumb-width);
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mantine-color-gray-5);

  @mixin dark {
    background-color: var(--mantine-color-dark-6);
    border-color: var(--mantine-color-dark-4);
    color: var(--mantine-color-dark-0);
  }
}

.label {
  font-size: var(--mantine-font-size-xl);
  font-weight: 700;
  transition:
    transform 100ms ease,
    color 100ms ease;

  &[data-filled] {
    color: var(--mantine-color-white);
  }

  &[data-floating] {
    transform: translateY(-44px) translateX(-10px);
    color: var(--mantine-color-black);

    &:not([data-filled]) {
      transform: translateY(-44px) translateX(10px);
    }

    @mixin dark {
      color: var(--mantine-color-white);
    }
  }
}
```

## License

MIT

# CorePackage

Package: @mantine/core
Import: import { CorePackage } from '@mantine/core';

# Mantine Core components

[![npm](https://img.shields.io/npm/dm/@mantine/core)](https://www.npmjs.com/package/@mantine/core)

[@mantine/core](https://www.npmjs.com/package/@mantine/core) package
provides essential components: buttons, inputs, modals, typography, and many others.
The `@mantine/core` package is used internally in most of the other `@mantine/*` packages –
it is required to be installed in your project to use Mantine components.

## Installation

```bash
yarn add @mantine/hooks @mantine/core
```

```bash
npm install @mantine/hooks @mantine/core
```

After installation import package styles at the root of your application:

```tsx
import '@mantine/core/styles.css';
```

## Usage

Follow the [getting started guide](https://mantine.dev/llms/getting-started.md) to learn how to
complete the Mantine setup in your project. Example of using the [Stepper](https://mantine.dev/llms/core-stepper.md) component:

```tsx
import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

function Demo() {
  const [active, setActive] = useState(1);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Create an account">
          Step 1 content: Create an account
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next step</Button>
      </Group>
    </>
  );
}
```

## License

MIT

# GettingStartedDates

Package: @mantine/dates
Import: import { GettingStartedDates } from '@mantine/dates';

## Installation

```bash
yarn add @mantine/dates dayjs
```

```bash
npm install @mantine/dates dayjs
```

After installation import package styles at the root of your application:

```tsx
import '@mantine/core/styles.css';
// ‼️ import dates styles after core package styles
import '@mantine/dates/styles.css';
```

## Do not forget to import styles

Followed the installation instructions above but something is not working
(calendars and date pickers have no styles and look broken)?
You've fallen into the trap of not importing dates styles!
To fix this issue, import dates styles at the root of your application:

```tsx
import '@mantine/dates/styles.css';
```

## Usage

After installing the `@mantine/dates` package and importing styles, you can use all components from it:

## Date values as strings

`@mantine/dates` components work with date strings: `YYYY-MM-DD` or `YYYY-MM-DD HH:mm:ss` depending on the component. Those strings do not include any timezone-specific information.

## dayjs

`@mantine/dates` components use [dayjs](https://day.js.org/) under the hood for date manipulations and formatting.
dayjs is a required dependency – you cannot change it to another date library. If you want to use a different
date library in your application, you will need to install it separately.

## DatesProvider

The `DatesProvider` component lets you set various settings that are shared across all
components exported from the `@mantine/dates` package. `DatesProvider` supports the following settings:

- `locale` – dayjs locale. Note that you also need to import the corresponding locale module from dayjs. The default value is `en`.
- `firstDayOfWeek` – a number from 0 to 6, where 0 is Sunday and 6 is Saturday. The default value is 1 – Monday.
- `weekendDays` – an array of numbers from 0 to 6, where 0 is Sunday and 6 is Saturday. The default value is `[0, 6]` – Saturday and Sunday.
- `consistentWeeks` – boolean. If `true`, every month will have 6 weeks. The default value is `false`.

```tsx
import 'dayjs/locale/ru';
import { DatesProvider, MonthPickerInput, DatePickerInput } from '@mantine/dates';

function Demo() {
  return (
    <DatesProvider settings={{ locale: 'ru', firstDayOfWeek: 0, weekendDays: [0] }}>
      <MonthPickerInput label="Pick month" placeholder="Pick month" />
      <DatePickerInput mt="md" label="Pick date" placeholder="Pick date" />
    </DatesProvider>
  );
}
```

## Consistent weeks

If you want to avoid layout shifts, set `consistentWeeks: true` in the `DatesProvider` settings.
This will ensure that every month has 6 weeks, even if outside days are not in the same month.

```tsx
import { DatePicker, DatesProvider } from '@mantine/dates';

function Demo() {
  return (
    <DatesProvider settings={{ consistentWeeks: true }}>
      <DatePicker />
    </DatesProvider>
  );
}
```

## Custom parse format

Some components like [DateInput](https://mantine.dev/llms/dates-date-input.md) require the [custom parse format](https://day.js.org/docs/en/plugin/custom-parse-format)
dayjs plugin. You need to extend dayjs with this plugin before using components that require it. Note that
this is usually done once in your application root file, so you don't need to do it every time you use the component.

```tsx
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
```

## Localization and server components

To add localization, you must import `import 'dayjs/locale/x';` in your application (`x` is the locale name)
and set `locale` either on `DatesProvider` or on each component individually.

Example of setting the locale on DatesProvider:

```tsx
import 'dayjs/locale/ru';

import { DatesProvider } from '@mantine/dates';

function Demo() {
  return <DatesProvider settings={{ locale: 'ru' }}>{/* Your app  */}</DatesProvider>;
}
```

The code above works in all environments, except Next.js app router.
If you are using Next.js app router, you must add `'use client';` to the
top of the file where you are importing `dayjs/locale/x` – locale data
is required both on client and server.

```tsx
'use client';

import 'dayjs/locale/ru';

import { DatesProvider } from '@mantine/dates';

function Demo() {
  return <DatesProvider settings={{ locale: 'ru' }}>{/* Your app  */}</DatesProvider>;
}
```

## 1.0 Port declaration

Declarations of all services of running applications (microservices, databases, queues) are located in the file README.md

## 1.1 Exception Declaration

Effector.dev Documentation
---

# FAQ

## Часто задаваемые вопросы про Effector

### Зачем нужны плагины для babel/swc для SSR?

Плагины эффектора вставляют в код специальные метки - SID, это позволяет автоматизировать сериализацию и десериализацию сторов, так что юзерам не требуется думать о ручной сериализации. Более глубокое объяснение в статье про sid.

### Зачем нам нужно давать имена событиям, эффектам и т.д.?

Это поможет в будущем, при разработке инструментов Effector Devtools, и сейчас используется в [плейграунде](https://share.effector.dev) на боковой панели слева.\
Если вы не хотите этого делать, вы можете использовать [Babel плагин](https://www.npmjs.com/package/@effector/babel-plugin). Он автоматически сгенерирует имя для событий и эффектов из имени переменной.


# Изолированный контекст

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import SideBySide from "@components/SideBySide/SideBySide.astro";

## Изолированный контекст

С помощью скоупов вы можете создать изолированный экземпляр всего приложения, который содержит независимую копию всех юнитов (включая их связи), а также базовые методы для работы с ними:

```ts "fork" "allSettled"
import { fork, allSettled, createStore, createEvent } from "effector";

// Создаем новый скоуп
const scope = fork();

const $counter = createStore(0);
const increment = createEvent();

$counter.on(increment, (state) => state + 1);

// Запускаем событие и дожидаемся всей цепочки выполнения
await allSettled(increment, { scope });

console.log(scope.getState($counter)); // 1
console.log($counter.getState()); // 0 - оригинальный стор остается без изменений
```

С помощью fork мы создаем новый скоуп, а с помощью allSettled — запускаем цепочку событий внутри указанного скоупа и дожидаемся ее завершения.

> INFO Независимость скоупов: 
>
> Не существует механизма для обмена данными между скоупами; каждый экземпляр полностью изолирован и работает самостоятельно.

### Зачем нужен cкоуп?

В effector все состояние хранится глобально. В клиентском приложении (SPA) это не проблема: каждый пользователь получает собственный экземпляр кода и работает со своим состоянием. Но при серверном рендеринге (SSR) или параллельном тестировании глобальное состояние становится проблемой: данные одного запроса или теста могут “протечь” в другой. Поэтому нам необходим скоуп.

* **SSR** — сервер работает как единый процесс и обслуживает запросы множества пользователей. Для каждого запроса можно создать скоуп, который изолирует данные от глобального контекста Effector и предотвращает утечку состояния одного пользователя в запрос другого.
* **Тестирование** — при параллельном запуске тестов возможны гонки данных и коллизии состояний. Скоуп позволяет каждому тесту выполняться со своим собственным изолированным состоянием.

У нас есть подробные гайды по работе с серверным рендерингом (SSR) и тестировании, а здесь мы сосредоточимся на основных принципах работы со скоупом, его правилах и способах избежать распространенных ошибок.

### Правила работы со скоупом

Для корректной работы со скоупом имеется ряд правил, чтобы избежать потери скоупа:

#### Вызов эффектов и промисов

Для обработчиков эффектов, которые вызывают другие эффекты, убедитесь, что вы вызываете только эффекты, а не обычные асинхронные функции. Кроме того, вызовы эффектов должны быть ожидаемыми (`awaited`).

Императивные вызовы эффектов в этом плане безопасны, потому что effector запоминает скоуп в котором начинался императивный вызов эффекта и при завершении вызова восстанавливает его обратно, что позволяет сделать ещё один вызов подряд.

Можно вызывать методы `Promise.all([fx1(), fx2()])` и прочие из стандартного api javascript, потому что в этих случаях вызовы эффектов по прежнему происходят синхронно и скоуп безопасно сохраняется.

<SideBySide>

<Fragment slot="left">

```ts wrap data-border="good" data-height="full"
// ✅ правильное использование эффекта без вложенных эффектов
const delayFx = createEffect(async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
});

// ✅ правильное использование эффекта с вложенными эффектами
const authFx = createEffect(async () => {
  await loginFx();

  await Promise.all([loadProfileFx(), loadSettingsFx()]);
});
```

</Fragment>

  <Fragment slot="right">

```ts wrap data-border="bad" data-height="full"
// ❌ неправильное использование эффекта с вложенными эффектами

const sendWithAuthFx = createEffect(async () => {
  await authUserFx();

  //неправильно! Это должно быть обернуто в эффект.
  await new Promise((resolve) => setTimeout(resolve, 80));

  // здесь скоуп теряется.
  await sendMessageFx();
});
```

</Fragment>

</SideBySide>

> INFO attach в деле: 
>
> Для сценариев, когда эффект может вызывать другой эффект или выполнять асинхронные вычисления, но не то и другое одновременно, рассмотрите использование метода attach для более лаконичных императивных вызовов.

#### Использование юнитов с фреймворками

Всегда используйте хук `useUnit` в связке с фреймворками, чтобы effector сам вызвал юнит в нужном ему скоупе:

```tsx wrap "useUnit"
import { useUnit } from "effector-react";
import { $counter, increased, sendToServerFx } from "./model";

const Component = () => {
  const [counter, increase, sendToServer] = useUnit([$counter, increased, sendToServerFx]);

  return (
    <div>
      <button onClick={increase}>{counter}</button>
      <button onClick={sendToServer}>send data to server</button>
    </div>
  );
};
```

Ну все, хватит слов, давайте посмотри на то как это работает.

### Использование в SSR

Представим ситуацию: у нас есть сайт с SSR, где на странице профиля показывается список личных уведомлений пользователя. Если мы не будем использовать скоуп, то получится следующее:

* Пользователь А делает запрос → на сервере в `$notifications` загружаются его уведомления.
* Почти одновременно Пользователь B делает запрос → стор перезаписывается его данными.
* В результате оба получат список уведомлений Пользователя B.

Получилось явно не то, что мы хотели, да ? Это и есть [состояние гонки](https://ru.wikipedia.org/wiki/%D0%A1%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B5_%D0%B3%D0%BE%D0%BD%D0%BA%D0%B8), ведущее к утечке приватных данных.
В этой ситуации скоуп обеспечит нам изолированный контекст, который будет работать только для текущего пользователя: Пользователь сделал запрос -> создался скоуп и теперь мы меняем состояние только в нашем скоупе, так будет работать для каждого запроса.

<Tabs>
  <TabItem label="Сервер">

```tsx "fork" "allSettled" "serialize"
// server.tsx
import { renderToString } from "react-dom/server";
import { fork, serialize, allSettled } from "effector";
import { Provider } from "effector-react";
import { fetchNotificationsFx } from "./model";

async function serverRender() {
  const scope = fork();

  // Загружаем данные на сервере
  await allSettled(fetchNotificationsFx, { scope });

  // Рендерим приложение
  const html = renderToString(
    <Provider value={scope}>
      <App />
    </Provider>,
  );

  // Сериализуем состояние для передачи на клиент
  const data = serialize(scope);

  return `
	<html>
	  <body>
		<div id="root">${html}</div>
		<script>window.INITIAL_DATA = ${data}</script>
	  </body>
	</html>
`;
}
```

</TabItem>
<TabItem label="Клиент">

```tsx
// client.tsx
import { hydrateRoot } from "react-dom/client";
import { fork } from "effector";

// гидрируем скоуп начальными значениями
const scope = fork({
  values: window.INITIAL_DATA,
});

hydrateRoot(
  document.getElementById("root"),
  <Provider value={scope}>
    <App />
  </Provider>,
);
```

</TabItem>
</Tabs>

Что стоит отметить в этом примере:

1. Мы сериализовали данные с помощью метода serialize, чтобы корректно передать их на клиент.
2. На клиенте мы гидрировали сторы с помощью аргумента конфигурации .

### Связанные API и статьи

* **API**
  * Scope - Описание скоупа и его методов
  * scopeBind - Метод для привязки юнита к скоупу
  * fork - Оператор для создания скоупа
  * allSettled - Метод для вызова юнита в предоставленном скоупе и ожидания завершения всей цепочки эффектов
  * serialize - Метод для получения сериализованного значения сторов
  * hydrate - Метод для гидрации сериализованных данных
* **Статьи**
  * Что такое потеря скоупа и как исправить эту проблему
  * Гайд по работе с SSR
  * Гайд по тестированию
  * Важность SID для гидрации сторов


# Effector React Gate

*Gate* is a hook for conditional rendering, based on the current value (or values) in props. It can solve problems such as compiling all required data when a component mounts, or showing an alternative component if there is insufficient data in props. Gate is also useful for routing or animations, similar to ReactTransitionGroup.

This enables the creation of a feedback loop by sending props back to a *Store*.

Gate can be integrated via the useGate hook or as a component with props. Gate stores and events function as standard units within an application.

Gate has two potential states:

* **Opened**, indicating the component is mounted.
* **Closed**, indicating the component is unmounted.

<br />

**Example of using Gate as a component:**

```tsx
<Gate history={history} />
```

## Properties

### `.state` Store

> WARNING Important: 
>
> Do not modify the `state` value! It is a derived store and should remain in a predictable state.

`Store<Props>`: DerivedStore containing the current state of the gate. This state derives from the second argument of useGate and from props when rendering the gate as a component.

#### Example

```tsx
import { createGate, useGate } from "effector-react";

const Gate = createGate();

Gate.state.watch((state) => console.info("gate state updated", state));

function App() {
  useGate(Gate, { props: "yep" });
  return <div>Example</div>;
}

ReactDOM.render(<App />, root);
// => gate state updated { props: "yep" }
```

### `.open` Event

> INFO Important: 
>
> Do not manually invoke this event. It is an event that is triggered based on the gate's state.

Event\<Props>: Event fired upon gate mounting.

### `.close` Event

> INFO Important: 
>
> Do not manually invoke this event. It is an event that is triggered based on the gate's state.

Event\<Props>: Event fired upon gate unmounting.

### `.status` Store

> WARNING Important: 
>
> Do not modify the `status` value! It is a derived store and should remain in a predictable state.

Store\<boolean>: Boolean DerivedStore indicating whether the gate is mounted.

#### Example

```tsx
import { createGate, useGate } from "effector-react";

const Gate = createGate();

Gate.status.watch((opened) => console.info("is Gate opened?", opened));
// => is Gate opened? false

function App() {
  useGate(Gate);
  return <div>Example</div>;
}

ReactDOM.render(<App />, root);
// => is Gate opened? true
```


# Provider

React `Context.Provider` component, which takes any Scope in its `value` prop and makes all hooks in the subtree work with this scope:

* `useUnit($store)` (and etc.) will read the state and subscribe to updates of the `$store` in this scope
* `useUnit(event)` (and etc.) will bind provided event or effect to this scope

## Usage

### Example Usage

Here is an example of `<Provider />` usage.

```tsx
import { createEvent, createStore, fork } from "effector";
import { useUnit, Provider } from "effector-react";
import { render } from "react-dom";

const buttonClicked = createEvent();
const $count = createStore(0);

$count.on(buttonClicked, (counter) => counter + 1);

const App = () => {
  const [count, handleClick] = useUnit([$count, buttonClicked]);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => handleClick()}>increment</button>
    </>
  );
};

const myScope = fork({
  values: [[$count, 42]],
});

render(
  <Provider value={myScope}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

The `<App />` component is placed in the subtree of `<Provider value={myScope} />`, so its `useUnit([$count, inc])` call will return

* State of the `$count` store in the `myScope`
* Version of `buttonClicked` event, which is bound to the `myScope`, which, if called, updates the `$count` state in the `myScope`

### Multiple Providers Usage

There can be as many `<Provider />` instances in the tree, as you may need.

```tsx
import { fork } from "effector";
import { Provider } from "effector-react";
import { App } from "@/app";

const scopeA = fork();
const scopeB = fork();

const ParallelWidgets = () => (
  <>
    <Provider value={scopeA}>
      <App />
    </Provider>
    <Provider value={scopeB}>
      <App />
    </Provider>
  </>
);
```

## Provider Properties

### `value`

`Scope`: any Scope. All hooks in the subtree will work with this scope.


# connect

```ts
import { connect } from "effector-react";
```

> WARNING Deprecated: 
>
> since [effector-react 23.0.0](https://changelog.effector.dev/#effector-react-23-0-0).
>
> Consider using hooks api in modern projects.

Wrapper for useUnit to use during migration from redux and class-based projects. Will merge store value fields to component props.

## Methods

### `connect($store)(Component)`

#### Formulae

```ts
connect($store: Store<T>)(Component): Component
```

#### Arguments

1. `$store` (Store): store or object with stores

#### Returns

`(Component) => Component`: Function, which accepts react component and return component with store fields merged into props

### `connect(Component)($store)`

#### Formulae

```ts
connect(Component)($store: Store<T>): Component
```

#### Arguments

1. `Component` (React.ComponentType): react component

#### Returns

`($store: Store<T>) => Component`: Function, which accepts a store and returns component with store fields merged into props


# createComponent

```ts
import { createComponent } from "effector-react";
```

> WARNING Deprecated: 
>
> since [effector-react 23.0.0](https://changelog.effector.dev/#effector-react-23-0-0).
>
> You can use hooks api in `createComponent` since [effector-react@20.3.0](https://changelog.effector.dev/#effector-20-3-0).

## Methods

### `createComponent($store, render)`

Creates a store-based React component. The `createComponent` method is useful for transferring logic and data of state to your View component.

#### Arguments

1. `$store` (*Store | Object*): `Store` or object of `Store`
2. `render` (*Function*): Render function which will be called with props and state

#### Returns

(*`React.Component`*): Returns a React component.

#### Example

```jsx
import { createStore, createEvent } from "effector";
import { createComponent } from "effector-react";

const increment = createEvent();

const $counter = createStore(0).on(increment, (n) => n + 1);

const MyCounter = createComponent($counter, (props, state) => (
  <div>
    Counter: {state}
    <button onClick={increment}>increment</button>
  </div>
));

const MyOwnComponent = () => {
  // any stuff here
  return <MyCounter />;
};
```

Try it


# createGate

```ts
import { createGate, type Gate } from "effector-react";
```

## Methods

### `createGate(name?)`

Creates a 

#### Formulae

```ts
createGate(name?: string): Gate<T>
```

#### Arguments

1. `name?` (*string*): Optional name which will be used as the name of a created React component

#### Returns

Gate\<T>

#### Examples

##### Basic Usage

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createGate } from "effector-react";

const Gate = createGate("gate with props");

const App = () => (
  <section>
    <Gate foo="bar" />
  </section>
);

Gate.state.watch((state) => {
  console.log("current state", state);
});
// => current state {}

ReactDOM.render(<App />, document.getElementById("root"));
// => current state {foo: 'bar'}

ReactDOM.unmountComponentAtNode(document.getElementById("root"));
// => current state {}
```

Try it

### `createGate(config?)`

Creates a , if `defaultState` is defined, Gate.state will be created with passed value.

#### Formulae

```ts
createGate({ defaultState?: T, domain?: Domain, name?: string }): Gate<T>
```

#### Arguments

`config` (*Object*): Optional configuration object

* `defaultState?`: Optional default state for Gate.state
* `domain?` (): Optional domain which will be used to create gate units (Gate.open event, Gate.state store, and so on)
* `name?` (*string*): Optional name which will be used as the name of a created React component

#### Returns

Gate\<T>


# createStoreConsumer

```ts
import { createStoreConsumer } from "effector-react";
```

> WARNING Deprecated: 
>
> since [effector-react 23.0.0](https://changelog.effector.dev/#effector-react-23-0-0).
>
> Consider using hooks api in modern projects.

## Methods

### `createStoreConsumer($store)`

Creates a store-based React component which is watching for changes in the store. Based on *Render Props* technique.

#### Arguments

1. `$store` (Store)

#### Returns

(`React.Component`)

#### Examples

```jsx
import { createStore } from "effector";
import { createStoreConsumer } from "effector-react";

const $firstName = createStore("Alan");

const FirstName = createStoreConsumer($firstName);

const App = () => <FirstName>{(name) => <h1>{name}</h1>}</FirstName>;
```

Try it


# Справочник по API

## Хуки

Перечень основных методов API, по группам

* useUnit(units)
* useStoreMap({ store, keys, fn })
* useList(store, renderItem)
* Устаревшие хуки:
  * useStore(store)
  * useEvent(unit)

### Gate API

* Gate
* createGate()
* useGate(GateComponent, props)

### Higher Order Components API

* createComponent(store, render)
* createStoreConsumer(store)
* connect(store)(Component)


# effector-react/compat

```ts
import {} from "effector-react/compat";
```

The library provides a separate module with compatibility up to IE11 and Chrome 47 (browser for Smart TV devices).

> WARNING Bundler, Not Transpiler: 
>
> Since third-party libraries can import `effector-react` directly, you **should not** use transpilers like Babel to replace `effector-react` with `effector-react/compat` in your code because by default, Babel will not transform third-party code.
>
> **Use a bundler instead**, as it will replace `effector-react` with `effector-react/compat` in all modules, including those from third parties.

Since `effector-react` uses `effector` under the hood, you need to use the compat-version of `effector` as well. Please, read effector/compat for details.

### Required Polyfills

You need to install polyfills for these objects:

* `Promise`
* `Object.assign`
* `Array.prototype.flat`
* `Map`
* `Set`

In most cases, a bundler can automatically add polyfills.

#### Vite

<details>
<summary>Vite Configuration Example</summary>

```js
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      polyfills: ["es.promise", "es.object.assign", "es.array.flat", "es.map", "es.set"],
    }),
  ],
});
```

</details>

## Usage

### Manual Usage

You can use it instead of the `effector-react` package if you need to support old browsers.

```diff
- import {useUnit} from 'effector-react'
+ import {useUnit} from 'effector-react/compat'
```

### Automatic Replacement

However, you can set up your bundler to automatically replace `effector` with `effector/compat` in your code.

#### Webpack

```js
module.exports = {
  resolve: {
    alias: {
      effector: "effector/compat",
      "effector-react": "effector-react/compat",
    },
  },
};
```

#### Vite

```js
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      effector: "effector/compat",
      "effector-react": "effector-react/compat",
    },
  },
});
```


# effector-react/scope

## effector-react/scope

```ts
import {} from "effector-react/scope";
```

> WARNING Deprecated: 
>
> Since [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) the core team recommends using main module of `effector-react` instead.

Provides all exports from effector-react, but enforces application to use Scope for all components.

### Usage

You can use this module in the same way as effector-react, but it will require passing Scope to Provider component.

```jsx
// main.js
import { fork } from "effector";
import { Provider } from "effector-react/scope";

import React from "react";
import ReactDOM from "react-dom/client";

const scope = fork();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider value={scope}>
    <Application />
  </Provider>,
);
```

### Migration

Since `effector-react/scope` is deprecated, it is better to migrate to effector-react by removing `scope` from import path.

```diff
+ import { Provider } from "effector-react";
- import { Provider } from "effector-react/scope";
```

> WARNING Continues migration: 
>
> `effector-react` and `effector-react/scope` do not share any code, so you have to migrate all your code to `effector-react` in the same time, because otherwise you will get runtime errors. These errors will be thrown because `effector-react` and `effector-react/scope` will use different instances `Provider` and do not have access to each other's `Provider`.

If you use [Babel](https://babeljs.io/), you need to remove parameter reactSsr from `babel-plugin` configuration.

```diff
{
  "plugins": [
    [
      "effector/babel-plugin",
      {
-        "reactSsr": true
      }
    ]
  ]
}
```

If you use SWC, you need to remove [`bindings.react.scopeReplace`](https://github.com/effector/swc-plugin#bindings) parameter from `@effector/swc-plugin` configuration.

```diff
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [
        "@effector/swc-plugin",
        {
          "bindings": {
            "react": {
-             "scopeReplace": true
            }
          }
        }
      ]
    }
  }
}
```

### Scope Enforcement

All modern hooks of `effector-react` are designed to work with Scope. If you want to imitate the behavior of `effector-react/scope` module, you can use the second parameter of hooks with an option `forceScope: true`. In this case, the hook will throw an error if the Scope is not passed to Provider.

```diff
- import { useUnit } from 'effector-react/scope'
+ import { useUnit } from 'effector-react'


function Example() {
-  const { text } = useUnit({ text: $text })
+  const { text } = useUnit({ text: $text }, { forceScope: true })

  return <p>{text}</p>
}
```


# useEvent

> ERROR Устаревшее API : 
>
> Рекомендуется использовать хук useUnit.

Реакт-хук, который привязывает событие к текущему scope для использования в обработчиках событий

Используется с серверным рендерингом и в тестировании, импортируется из `effector-react/scope`

### *useEvent(unit)*

Привязывает юнит к скоупу компонента

#### Формула

```ts
declare const event: Event<T>
declare const fx: Effect<T, S>

const eventFn = useEvent(/*unit*/ event)
-> (data: T) => T

const fxFn = useEvent(/*unit*/ fx)
-> (data: T) => Promise<S>
```

#### Аргументы

1. **`unit`**: Событие или эффект для привязки к скоупу компонента

#### Возвращает

Функцию для запуска юнита в скоупе компонента

#### Пример

```jsx
import ReactDOM from "react-dom";
import { createEvent, createStore, fork } from "effector";
import { useStore, useEvent, Provider } from "effector-react";

const inc = createEvent();
const $count = createStore(0).on(inc, (x) => x + 1);

const App = () => {
  const count = useStore($count);
  const incFn = useEvent(inc);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => incFn()}>increment</button>
    </>
  );
};

const scope = fork();

ReactDOM.render(
  <Provider value={scope}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

Запустить пример

### *useEvent(\[a, b])*

Привязывает массив событий или эффектов к скоупу компонента

#### Формула

```ts
declare const a: Event<T>
declare const bFx: Effect<T, S>

const [aFn, bFn] = useEvent(/*list*/ [a, bFx])
-> [(data: T) => T, (data: T) => Promise<S>]
```

#### Аргументы

1. **`list`**: Массив событий или эффектов

#### Возвращает

Массив функций для запуска юнитов в скоупе компонента

#### Пример

```jsx
import ReactDOM from "react-dom";
import { createEvent, createStore, fork } from "effector";
import { useStore, useEvent, Provider } from "effector-react";

const inc = createEvent();
const dec = createEvent();
const $count = createStore(0)
  .on(inc, (x) => x + 1)
  .on(dec, (x) => x - 1);

const App = () => {
  const count = useStore($count);
  const [incFn, decFn] = useEvent([inc, dec]);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => incFn()}>increment</button>
      <button onClick={() => decFn()}>decrement</button>
    </>
  );
};

const scope = fork();

ReactDOM.render(
  <Provider value={scope}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

Запустить пример

### `useEvent({a, b})`

Привязывает объект событий или эффектов к скоупу компонента

#### Формула

```ts
declare const a: Event<T>
declare const bFx: Effect<T, S>

const {a: aFn, b: bFn} = useEvent(/*shape*/ {a, b: bFx})
-> {a: (data: T) => T, b: (data: T) => Promise<S>}
```

#### Аргументы

1. **`shape`**: Объект событий или эффектов

#### Возвращает

Объект функций для запуска юнитов в скоупе компонента

#### Пример

```jsx
import ReactDOM from "react-dom";
import { createEvent, createStore, fork } from "effector";
import { useStore, useEvent, Provider } from "effector-react";

const inc = createEvent();
const dec = createEvent();
const $count = createStore(0)
  .on(inc, (x) => x + 1)
  .on(dec, (x) => x - 1);

const App = () => {
  const count = useStore($count);
  const handlers = useEvent({ inc, dec });
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => handlers.inc()}>increment</button>
      <button onClick={() => handlers.dec()}>decrement</button>
    </>
  );
};

const scope = fork();

ReactDOM.render(
  <Provider value={scope}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

Запустить пример


# useGate

```ts
import { useGate } from "effector-react";
```

## Methods

### `useGate(Gate, props?)`

Hook for passing data to .

#### Formulae

```ts
const CustomGate: Gate<T>;

useGate(CustomGate, props?: T): void;
```

#### Arguments

1. `Gate` (Gate\<T>)
2. `props` (`T`)

#### Returns

(`void`)

#### Examples

##### Basic

```js
import { createGate, useGate } from "effector-react";
import { Route } from "react-router";

const PageGate = createGate("page");

PageGate.state.watch(({ match }) => {
  console.log(match);
});

const Home = (props) => {
  useGate(PageGate, props);

  return <section>Home</section>;
};

const App = () => <Route component={Home} />;
```


# useList

> INFO since: 
>
> `useList` появился в [effector-react 20.1.1](https://changelog.effector.dev/#effector-react-20-1-1)

React-хук для эффективного рендеринга сторов хранящих массивы данных.
Каждый элемент будет мемоизирован и обновлен только при изменении его данных

## Когда нужно использовать `useList`?

`useList` решает конкретную задачу эффективного рендера списков, с `useList` можно не проставлять key у списков компонентов и там реализован более оптимальный ререндер. Если есть ощущение что требуется что-то еще, то значит фича переросла `useList` и стоит использовать useStoreMap. С `useStoreMap` можно взять конкретные данные из стора оптимальным образом, если нужен не весь стор, а только его часть

## API

### Сокращённая запись

#### Формула

```ts
function useList(store: Store<T[]>, fn: (item: T, key: number) => React.ReactNode): React.ReactNode;
```

#### Аргументы

1. **`store`**: Стор с массивом данных
2. **`fn`**: `(item: T, key: number) => React.ReactNode`

   Рендер-функция для отображения в ui отдельного элемента массива. Явная простановка `key` реакт-элементам внутри рендер-функции не требуется, ключ элемента проставляется автоматически

   **Аргументы**

   * **`item`**: Элемент массива
   * **`key`**: Индекс элемента, выступает как ключ для React

   **Возвращает**: `React.ReactNode`

#### Возвращает

`React.ReactNode`

### Полная запись

Используется, когда необходимо вычислять ключ элемента или обновлять элементы при изменении какого-либо внешнего значения, доступного только через React (например, поля props из замыкания компонента или состояния другого стора)

По умолчанию `useList` обновляется только тогда, когда некоторые из его элементов были изменены.
Однако иногда необходимо обновлять элементы при изменении какого-либо внешнего значения (например, поля props или состояния другого стора).
В таком случае нужно сообщить React о дополнительных зависимостях, в таком случае элемент будет перерендерен и в случае их изменения

#### Формула

```ts
function useList(
  store: Store<T[]>,
  config: {
    keys: any[];
    fn: (item: T, key: React.Key) => React.ReactNode;
    getKey?: (item: T) => React.Key;
  },
): React.ReactNode;
```

#### Аргументы

1. **`store`**: Стор с массивом данных
2. **`config`**: Объект конфигурации

   * **`keys`**: Массив зависимостей, которые будут переданы в React

   * **`fn`**: `(item: T, key: React.Key) => React.ReactNode`

     Рендер-функция для отображения в ui отдельного элемента массива. Явная простановка `key` реакт-элементам внутри рендер-функции не требуется, ключ элемента проставляется автоматически

     **Аргументы**

     * **`item`**: Элемент массива
     * **`key`**: Ключ элемента, вычисляется с помощью `getKey`, если есть, в противном случае используется индекс элемента

     **Возвращает**: `React.ReactNode`

   * **`getKey?`**: `(item: T) => React.Key`

     Функция для вычисления ключа элемента на основе данных. Полученный ключ будет передан в React

     **Аргументы**

     * **`item`**: Элемент массива

     **Возвращает**: `React.Key`

   * **`placeholder?`**: `React.ReactNode` Опциональный реакт-элемент который будет использован в случае пустого массива

#### Возвращает

`React.ReactNode`

> INFO: 
>
> Опция `getKey` добавлена в effector-react 21.3.0

> INFO: 
>
> Опция `placeholder` добавлена в effector-react 22.1.0

### Примеры

#### Пример 1

```jsx
import { createStore } from "effector";
import { useList } from "effector-react";

const $users = createStore([
  { id: 1, name: "Yung" },
  { id: 2, name: "Lean" },
  { id: 3, name: "Kyoto" },
  { id: 4, name: "Sesh" },
]);

const App = () => {
  const list = useList($users, ({ name }, index) => (
    <li>
      [{index}] {name}
    </li>
  ));

  return <ul>{list}</ul>;
};
```

Запустить пример

#### Пример 2

```jsx
import { createStore, createEvent } from "effector";
import { useList } from "effector-react";

const addTodo = createEvent();
const toggleTodo = createEvent();

const $todoList = createStore([
  { text: "write useList example", done: true },
  { text: "update readme", done: false },
])
  .on(toggleTodo, (list, id) =>
    list.map((todo, i) => {
      if (i === id)
        return {
          ...todo,
          done: !todo.done,
        };
      return todo;
    }),
  )
  .on(addTodo, (list, e) => [
    ...list,
    {
      text: e.currentTarget.elements.content.value,
      done: false,
    },
  ]);

addTodo.watch((e) => {
  e.preventDefault();
});

const TodoList = () =>
  useList($todoList, ({ text, done }, i) => {
    const todo = done ? (
      <del>
        <span>{text}</span>
      </del>
    ) : (
      <span>{text}</span>
    );
    return <li onClick={() => toggleTodo(i)}>{todo}</li>;
  });
const App = () => (
  <div>
    <h1>todo list</h1>
    <form onSubmit={addTodo}>
      <label htmlFor="content">New todo</label>
      <input type="text" name="content" required />
      <input type="submit" value="Add" />
    </form>
    <ul>
      <TodoList />
    </ul>
  </div>
);
```

Запустить пример

#### Пример с конфигурацией

```jsx
import ReactDOM from "react-dom";
import { createEvent, createStore, restore } from "effector";
import { useUnit, useList } from "effector-react";

const renameUser = createEvent();
const $user = restore(renameUser, "alice");
const $friends = createStore(["bob"]);

const App = () => {
  const user = useUnit($user);
  return useList($friends, {
    keys: [user],
    fn: (friend) => (
      <div>
        {friend} is a friend of {user}
      </div>
    ),
  });
};

ReactDOM.render(<App />, document.getElementById("root"));
// => <div> bob is a friend of alice </div>

setTimeout(() => {
  renameUser("carol");
  // => <div> bob is a friend of carol </div>
}, 500);
```

Запустить пример


# useProvidedScope

Низкоуровневый Реакт хук, который возвращает текущий Scope из Provider.

> WARNING Это низкоуровневый API: 
>
> Хук `useProvidedScope` это низкоуровневый API для разработчиков библиотек и не предназначен для использования в продакшен коде напрямую.
>
> Для использования `effector-react` в продакшен коде используейте хук useUnit.

## Методы

### `useProvidedScope()`

#### Возвращает

* Scope или `null`, если `Scope` не передан.

#### Пример

Этот хук может быть использован внутри библиотеки для обработки различных крайних случаев, где также необходимы `createWatch` и `scopeBind`.

Для продакшен кода используйте useUnit хук.

```tsx
const useCustomLibraryInternals = () => {
  const scope = useProvidedScope();

  // ...
};
```


# useStore

> ERROR Устаревшее API : 
>
> Рекомендуется использовать хук useUnit.

Реакт-хук, который подписывается на стор и возвращает его текущее значение, поэтому при обновлении стора, компонент также будет автоматически обновлён

```ts
useStore(store: Store<T>): T
```

**Аргументы**

1. `store`: Store

**Возвращает**

(*`State`*): Значение из стора

#### Пример

```jsx
import { createStore, createApi } from "effector";
import { useStore } from "effector-react";

const $counter = createStore(0);

const { increment, decrement } = createApi($counter, {
  increment: (state) => state + 1,
  decrement: (state) => state - 1,
});

const App = () => {
  const counter = useStore($counter);
  return (
    <div>
      {counter}
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
```

Запустить пример


# useStoreMap

Реакт-хук, который подписывается на стор и трансформирует его значение с переданной функцией. Компонент будет обновляться только когда результат функции будет отличаться от предыдущего

Типичный вариант использования: подписаться на изменения отдельного поля в сторе

## Методы

```ts
useStoreMap<State, Result>(
  store: Store<State>,
  fn: (state: State) => Result
): Result
```

> INFO: 
>
> Краткая форма `useStoreMap` добавлена в `effector-react@21.3.0`

**Аргументы**

1. `store`: Используемый стор
2. `fn` (*(state) => result*): Функция-селектор

**Возвращает**

(*Result*)

```ts
useStoreMap<Source, Result>({
  store: Store<Source>;
  keys: any[];
  fn: (state: Source, keys: any[]) => Result;
  updateFilter?: (newResult: Result, oldResult: Result) => boolean;
  defaultValue?: Result;
}): Result
```

Перегрузка для случаев, когда требуется передать зависимости в React (для обновления элементов при изменении этих зависимостей)

**Аргументы**

1. `params` (*Object*): Объект конфигурации
   * `store`: Используемый стор
   * `keys` (*Array*): Массив, который будет передан в React.useMemo
   * `fn` (*(state, keys) => result*): Функция-селектор
   * `updateFilter` (*(newResult, oldResult) => boolean*): *Опционально* функция, используемая для сравнения старого и нового результата работы хука, предназначено для избежания лишних ререндеров. Реализация опции для работы использует createStore updateFilter
   * `defaultValue`: Опциональное значение по умолчанию, используется когда `fn` возвращает undefined

**Возвращает**

(*Result*)

> INFO: 
>
> Опция `updateFilter` добавлена в `effector-react@21.3.0`

> INFO: 
>
> Опция `defaultValue` добавлена в `effector-react@22.1.0`

##### Пример

Этот хук полезен для работы со списками, особенно с большими

```jsx
import { createStore } from "effector";
import { useUnit, useStoreMap } from "effector-react";

const data = [
  {
    id: 1,
    name: "Yung",
  },
  {
    id: 2,
    name: "Lean",
  },
  {
    id: 3,
    name: "Kyoto",
  },
  {
    id: 4,
    name: "Sesh",
  },
];

const $users = createStore(data);
const $ids = createStore(data.map(({ id }) => id));

const User = ({ id }) => {
  const user = useStoreMap({
    store: $users,
    keys: [id],
    fn: (users, [userId]) => users.find(({ id }) => id === userId),
  });

  return (
    <div>
      <strong>[{user.id}]</strong> {user.name}
    </div>
  );
};

const UserList = () => {
  const ids = useUnit($ids);
  return ids.map((id) => <User key={id} id={id} />);
};
```

Запустить пример


# useUnit

React hook, который принимает любой юнит (стор, событие или эффект) или любой объект с юнитами в качестве значений.

В случае сторов этот хук подписывает компонент на предоставленный стор и возвращает его текущее значение, поэтому при обновлении стора компонент будет обновлен автоматически.

В случае событий или эффектов – привязка к текущему  для использования в обработчиках браузерных событий.
Только версия `effector-react/scope` работает таким образом, `useUnit` из `effector-react` является no-op для событий и не требует `Provider` с scope.

> INFO: 
>
> Метод `useUnit` добавлен в effector-react 22.1.0

## Методы

### `useUnit(unit)`

#### Arguments

1. `unit` Событие или эффект для привязки к скоупу.

**Returns**

(Function): Функция для запуска юнита в скоупе компонента

#### Example

```jsx
import { createEvent, createStore, fork } from "effector";
import { useUnit, Provider } from "effector-react";

const inc = createEvent();
const $count = createStore(0).on(inc, (x) => x + 1);

const App = () => {
  const [count, incFn] = useUnit([$count, inc]);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => incFn()}>increment</button>
    </>
  );
};

const scope = fork();

render(
  () => (
    <Provider value={scope}>
      <App />
    </Provider>
  ),
  document.getElementById("root"),
);
```

### `useUnit(store)`

#### Arguments

1. `store` ()

**Returns**

Текущее значение стора.

##### Example

```js
import { createStore, createApi } from "effector";
import { useUnit } from "effector-react";

const $counter = createStore(0);

const { increment, decrement } = createApi($counter, {
  increment: (state) => state + 1,
  decrement: (state) => state - 1,
});

const App = () => {
  const counter = useUnit($counter);

  return (
    <div>
      {counter}
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
```

### `useUnit(shape)`

#### Arguments

1. `shape` Объект или массив содержащий любые (,  или )

**Returns**

(Объект или Массив):

* В случае событий и эффектов: функции с теми же именами или ключами в качестве аргумента для передачи обработчикам событий. Эти функции запустят события и эффекты в текущем скоупе. *Примечание: события или эффекты будут привязаны к скоупу **только**, если `useUnit` импортирован из `effector-react/scope`*.
* В случае сторов: текущее значение стора.

#### Example

```jsx
import { createStore, createEvent, fork } from "effector";
import { useUnit, Provider } from "effector-react";

const inc = createEvent();
const dec = createEvent();

const $count = createStore(0)
  .on(inc, (x) => x + 1)
  .on(dec, (x) => x - 1);

const App = () => {
  const count = useUnit($count);
  const handler = useUnit({ inc, dec });
  // or
  const [a, b] = useUnit([inc, dec]);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => handler.inc()}>increment</button>
      <button onClick={() => handler.dec()}>decrement</button>
    </>
  );
};

const scope = fork();

render(
  () => (
    <Provider value={scope}>
      <App />
    </Provider>
  ),
  document.getElementById("root"),
);
```


# Effector Solid Gate

*Gate* is a hook for conditional rendering, based on current value (or values) in props.
An example of a problem that Gate can solve – you can put together all required data when component was mounted, or show another component if there is not enough data in props.
Gate also looks good for Routing or animation.

This allows you to send props back to *Store* to create a feedback loop.

Gate can be used via the useGate hook or as a component with props (`<Gate history={history} />`).
Gate stores and events can be used in the application as regular units.

Gate can have two states:

* **Open**, which means mounted
* **Closed**, which means unmounted

## Properties

### `.state` Store

> WARNING Important: 
>
> Do not modify the `state` value! It is a derived store and should be kept in a predictable state.

`Store<Props>`: Derived Store with the current state of the given gate. The state comes from the second argument of useGate and from props when rendering the gate as a component.

### `.open` Event

> INFO Important: 
>
> Do not manually call this event. It is an event that depends on a Gate's state.

Event\<Props>: Event which will be called during the gate's mounting.

### `.close` Event

> INFO Important: 
>
> Do not manually call this event. It is an event that depends on a Gate's state.

Event\<Props>: Event which will be called during the gate's unmounting.

### `.status` Store

> WARNING Important: 
>
> Do not modify the `status` value! It is a derived store and should be in a predictable state.

`Store<boolean>`: Boolean Derived Store, which shows if the given gate is mounted.


# createGate

## Methods

### `createGate(config)`

#### Formulae

```ts
createGate(config): Gate
```

#### Arguments

`config` (*Object*): Optional configuration object

* `defaultState?`: Optional default state for Gate.state
* `domain?` (\[*Domain*]/apieffector/Domain)): Optional domain which will be used to create gate units (Gate.open event, Gate.state store and so on)
* `name?` (*string*): Optional name which will be used as name of a created Solid component

#### Returns



#### Examples

TBD

### `createGate(name?)`

#### Formulae

```ts
createGate(name): Gate
```

#### Arguments

1. `name?` (*string*): Optional name which will be used as name of a created Solid component

#### Returns



#### Examples

##### Basic usage

```js
import { createGate } from "effector-solid";
import { render } from "solid-js/web";

const Gate = createGate("gate with props");

const App = () => (
  <section>
    <Gate foo="bar" />
  </section>
);

Gate.state.watch((state) => {
  console.log("current state", state);
});
// => current state {}

const unmount = render(() => <App />, document.getElementById("root"));
// => current state {foo: 'bar'}

unmount();
// => current state {}
```


# effector-solid

Effector bindings for SolidJS.

## Reactive Helpers

* useUnit(unit)
* useStoreMap({ store, keys, fn })

## Gate API

* Gate
* createGate()
* useGate(GateComponent, props)

## Import Map

Package `effector-solid` provides couple different entry points for different purposes:

* effector-solid/scope


# effector-solid/scope

## effector-solid/scope

```ts
import {} from "effector-solid/scope";
```

> WARNING Deprecated: 
>
> Since [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) the core team recommends using the main module of `effector-solid` instead.

Provides all exports from effector-solid, but enforces the application to use Scope for all components.

### Usage

You can use this module in the same way as effector-solid, but it will require passing Scope to Provider component.

```jsx
// main.js
import { fork } from "effector";
import { Provider } from "effector-solid/scope";
import { render } from "solid-js/web";

const scope = fork();

render(
  <Provider value={scope}>
    <Application />
  </Provider>,
  document.getElementById("root"),
);
```

### Migration

Since `effector-solid/scope` is deprecated, it is recommended to migrate to effector-solid by removing `scope` from the import path.

```diff
+ import { Provider } from "effector-solid";
- import { Provider } from "effector-solid/scope";
```

> WARNING Continued migration: 
>
> `effector-solid` and `effector-solid/scope` do not share any code, so you have to migrate all your code to `effector-solid` at the same time, because otherwise, you will get runtime errors. These errors will occur because `effector-solid` and `effector-solid/scope` will use different instances of `Provider` and do not have access to each other's `Provider`.

### Scope enforcement

All modern hooks of `effector-solid` are designed to work with Scope. If you want to imitate the behavior of the `effector-solid/scope` module, you can pass a second parameter to hooks with an option `forceScope: true`. In this case, the hook will throw an error if the Scope is not passed to Provider.

```diff
- import { useUnit } from 'effector-solid/scope'
+ import { useUnit } from 'effector-solid'


function MyComponent() {
-  const { test } = useUnit({ text: $text })
+  const { test } = useUnit({ text: $text }, { forceScope: true })

  return <p>{text}</p>
}
```


# useGate

```ts
import { useGate } from "effector-solid";
```

Function for passing data to .

## Methods

### `useGate(Gate, props)`

#### Formulae

```ts
useGate(Gate: Gate<Props>, props: Props): void;
```

#### Arguments

1. `Gate` (Gate\<Props>)
2. `props` (*Props*)

#### Returns

(`void`)

#### Examples

##### Basic Usage

```jsx
import { createGate, useGate } from "effector-solid";
import { Route, Routes } from "solid-app-router";

const PageGate = createGate("page");

const Home = (props) => {
  useGate(PageGate, props);
  return <section>Home</section>;
};

PageGate.state.watch(({ match }) => {
  console.log(match);
});

const App = () => (
  <Routes>
    <Route element={<Home />} />
  </Routes>
);
```


# useStoreMap

```ts
import { useStoreMap } from "effector-solid";
```

## Methods

### `useStoreMap($store, fn)`

Function, which subscribes to a store and transforms its value with a given function. Signal will update only when the selector function result will change.

Common use case: subscribe to changes in selected part of store only.

#### Formulae

```ts
useStoreMap(
  $store: Store<State>,
  fn: (state: State) => Result,
): Accessor<Result>;
```

#### Arguments

1. `$store`: Source Store\<T>
2. `fn` (`(state: T) => Result`): Selector function to receive part of source store

#### Returns

(`Result`)

#### Examples

TBD

### `useStoreMap(config)`

#### Formulae

```ts
useStoreMap({
  store: Store<State>,
  keys: any[],
  fn: (state: State, keys: any[]) => Result,
  updateFilter? (newResult, oldResult) => boolean,
}): Result;
```

#### Arguments

1. `params` (*Object*): Configuration object
   * `store`: Source store
   * `keys` (*Array*): Will be passed to `fn` selector
   * `fn` (*(state, keys) => result*): Selector function to receive part of the source store
   * `updateFilter` (*(newResult, oldResult) => boolean*): *Optional* function used to compare old and new updates to prevent unnecessary rerenders. Uses createStore updateFilter option under the hood

#### Returns

(`Accessor<Result>`)

#### Examples

This hook is very useful for working with lists, especially large ones.

```jsx
import { createStore } from "effector";
import { useUnit, useStoreMap } from "effector-solid";
import { For } from "solid-js/web";

const usersRaw = [
  {
    id: 1,
    name: "Yung",
  },
  {
    id: 2,
    name: "Lean",
  },
  {
    id: 3,
    name: "Kyoto",
  },
  {
    id: 4,
    name: "Sesh",
  },
];

const $users = createStore(usersRaw);
const $ids = createStore(usersRaw.map(({ id }) => id));

const User = ({ id }) => {
  const user = useStoreMap({
    store: $users,
    keys: [id],
    fn: (users, [userId]) => users.find(({ id }) => id === userId) ?? null,
  });

  return (
    <div>
      <strong>[{user()?.id}]</strong> {user()?.name}
    </div>
  );
};

const UserList = () => {
  const ids = useUnit($ids);

  return <For each={ids()}>{(id) => <User key={id} id={id} />}</For>;
};
```


# useUnit

```ts
import { useUnit } from "effector-solid";
```

Binds effector stores to the Solid reactivity system or, in the case of events/effects – binds to current  to use in dom event handlers.
Only `effector-solid/scope` version works this way, `useUnit` of `effector-solid` is no-op for events and does not require `Provider` with scope.

## Methods

### `useUnit(unit)`

#### Arguments

```ts
useUnit(event: EventCallable<T>): (payload: T) => T;
useUnit(effect: Effect<Params, Done, any>): (payload: Params) => Promise<Done>;
```

#### Arguments

1. `unit` (EventCallable\<T> or Effect\<Params, Done, Fail>): Event or effect which will be bound to current `scope`.

#### Returns

(`Function`): Function to pass to event handlers. Will trigger the given unit in the current scope.

#### Example

A basic Solid component using `useUnit` with events and stores.

```jsx
import { render } from "solid-js/web";
import { createEvent, createStore, fork } from "effector";
import { useUnit, Provider } from "effector-solid";

const incremented = createEvent();
const $count = createStore(0);

$count.on(incremented, (count) => count + 1);

const App = () => {
  const [count, handleIncrement] = useUnit([$count, incremented]);

  return (
    <>
      <p>Count: {count()}</p>
      <button onClick={() => handleIncrement()}>Increment</button>
    </>
  );
};

const scope = fork();

render(
  () => (
    <Provider value={scope}>
      <App />
    </Provider>
  ),
  document.getElementById("root"),
);
```

### `useUnit(store)`

#### Formulae

```ts
useUnit($store: Store<State>): Accessor<State>;
```

#### Arguments

1. `$store` effector ().

#### Returns

(`Accessor<State>`) which will subscribe to store state.

#### Example

```jsx
import { createStore, createApi } from "effector";
import { useUnit } from "effector-solid";

const $counter = createStore(0);

const { incremented, decremented } = createApi($counter, {
  incremented: (count) => count + 1,
  decremented: (count) => count - 1,
});

const App = () => {
  const counter = useUnit($counter);
  const [handleIncrement, handleDecrement] = useUnit([incremented, decremented]);

  return (
    <div>
      {counter()}
      <button onClick={incremented}>Increment</button>
      <button onClick={decremented}>Decrement</button>
    </div>
  );
};
```

### `useUnit(shape)`

#### Formulae

```ts
useUnit({ a: Store<A>, b: Event<B>, ... }): { a: Accessor<A>, b: (payload: B) => B; ... }

useUnit([Store<A>, Event<B>, ... ]): [Accessor<A>, (payload: B) => B, ... ]
```

#### Arguments

1. `shape` Object or array of (EventCallable, Effect, or Store): Events, or effects, or stores as accessors which will be bound to the current `scope`.

#### Returns

(`Object` or `Array`):

* If `EventCallable` or `Effect`: functions with the same names or keys as argument to pass to event handlers. Will trigger given unit in current scope *Note: events or effects will be bound **only** if `useUnit` is imported from `effector-solid/scope`*.
* If `Store`: accessor signals which will subscribe to the store state.

#### Examples

```jsx
import { render } from "solid-js/web";
import { createStore, createEvent, fork } from "effector";
import { useUnit, Provider } from "effector-solid/scope";

const incremented = createEvent();
const decremented = createEvent();

const $count = createStore(0)
  .on(incremented, (count) => count + 1)
  .on(decremented, (count) => count - 1);

const App = () => {
  const count = useUnit($count);
  const on = useUnit({ incremented, decremented });
  // or
  const [a, b] = useUnit([incremented, decremented]);

  return (
    <>
      <p>Count: {count()}</p>
      <button onClick={() => on.incremented()}>Increment</button>
      <button onClick={() => on.decremented()}>Decrement</button>
    </>
  );
};

const scope = fork();

render(
  () => (
    <Provider value={scope}>
      <App />
    </Provider>
  ),
  document.getElementById("root"),
);
```


# ComponentOptions

## ComponentOptions (Vue2)

### `effector`

#### Returns

(*`Function | Object | Store`*): `Store` or object of `Store`'s, or function which will be called with the Component instance as `this`.

#### Examples

##### Basic Usage

```js
import Vue from "vue";
import { createStore, combine } from "effector";

const counter = createStore(0);

new Vue({
  data() {
    return {
      foo: "bar",
    };
  },
  effector() {
    // would create `state` in template
    return combine(
      this.$store(() => this.foo),
      counter,
      (foo, counter) => `${foo} + ${counter}`,
    );
  },
});
```

##### Using Object Syntax

```js
import { counter } from "./stores";

new Vue({
  effector: {
    counter, // would create `counter` in template
  },
});
```

##### Using Store Directly

```js
import { counter } from "./stores";

new Vue({
  effector: counter, // would create `state` in template
});
```


# EffectorScopePlugin

The Plugin provides a general scope which needs for read and update effector's stores, call effector's events. Required for SSR.

## Plugins

### `EffectorScopePlugin({ scope, scopeName })`

#### Arguments

1. `scope` Scope
2. `scopeName?` custom scopeName (default: `root`)

#### Examples

##### Basic Usage

```js
import { createSSRApp } from "vue";
import { EffectorScopePlugin } from "effector-vue";
import { fork } from "effector";

const app = createSSRApp(AppComponent);
const scope = fork();

app.use(
  EffectorScopePlugin({
    scope,
    scopeName: "app-scope-name",
  }),
);
```


# Effector Vue Gate

*Gate* is a hook for conditional rendering, based on current value (or values) in props. An example of a problem that Gate can solve – you can put together all required data, when component was mounted.

This allows you to send props back to *Store* to create feedback loop.

Gate can be used via useGate hook. Gate stores and events can be used in the application as regular units

Gate can have two states:

* **Open**, which means mounted
* **Closed**, which means unmounted

## Gate Properties

### `.state`

> WARNING Important: 
>
> Do not modify `state` value! It is derived store and should be in predictable state.

`Store<Props>`: DerivedStore with current state of the given gate. The state comes from the second argument of useGate and from props when rendering gate as a component.

### `.open`

> INFO Important: 
>
> Do not manually call this event. It is an event that depends on a Gate state.

Event\<Props>: Event which will be called during gate mounting

### `.close`

> INFO Important: 
>
> Do not manually call this event. It is an event that depends on a Gate state.

Event\<Props>: Event which will be called during a gate unmounting.

### `.status`

> WARNING Important: 
>
> Do not modify `status` value! It is derived store and should be in predictable state.

`Store<boolean>`: Boolean DerivedStore, which show if given gate is mounted.


# VueEffector

```ts
import { VueEffector } from "effector-vue/options-vue3";
```

`effector-vue` plugin for vue 3 creates a mixin that takes a binding function from the effector option.

## Methods

### `VueEffector(app)`

#### Arguments

1. `app` (*instance Vue*): Vue instance

#### Returns

(*`void`*)

#### Examples

##### Installation plugin

```js
import { createApp } from "vue";
import { VueEffector } from "effector-vue/options-vue3";

import App from "./App.vue";

const app = createApp(App);

app.use(VueEffector);
```

##### Effector options

```html
<template>
  <div>
    <span v-if="createPending">loading...</span>
    <p>{{ user.name }}</p>
    ...
    <button @click="create">Create<button>
  </div>
</template>
```

```js
import { $user, create, createFx } from 'model'

export default {
  name: 'VueComponent',
  effector: () => ({
    user: $user,
    createDone: createFx.done,
    createPending: createFx.pending,
  }),
  watch: {
    createDone() {
      // do something after the effect is done
    }
  },
  methods: {
    create, // template binding
    createFx,
  },
  ...
}
```


# VueEffector

```ts
import { VueEffector } from "effector-vue";
```

`effector-vue` plugin for vue 2

## Methods

### `VueEffector(Vue, options?)`

#### Arguments

1. `Vue` (*class Vue*): Vue class
2. `options` (*Object*): Plugin options

* TBD

#### Returns

(*`void`*)

#### Examples

```js
import Vue from "vue";
import { VueEffector } from "effector-vue";

Vue.use(VueEffector);
```


# VueSSRPlugin

The Plugin provides a general scope which needs for read and update effector's stores, call effector's events. Required for SSR.

## Plugins

### `VueSSRPlugin({ scope, scopeName })`

> WARNING Deprecated: 
>
> Since [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) `VueSSRPlugin` is deprecated. Use EffectorScopePlugin instead.

### Arguments

1. `scope` Scope
2. `scopeName?` custom scopeName (default: `root`)

### Examples

#### Basic usage

```js
import { createSSRApp } from "vue";
import { VueSSRPlugin } from "effector-vue/ssr";
import { fork } from "effector";

const app = createSSRApp(AppComponent);
const scope = fork();

app.use(
  VueSSRPlugin({
    scope,
    scopeName: "app-scope-name",
  }),
);
```


# createComponent

## Methods

### `createComponent(options, store?)`

#### Arguments

1. `options` (*Object*): component options (hooks, methods, computed properties)
2. `store` (*Object*): Store object from effector

#### Returns

(*`vue component`*)

#### Example

```html
<template> {{ $counter }} </template>
```

```js
// component.vue
import { createComponent } from "effector-vue";

const $counter = createStore(0);
const { update } = createApi($counter, {
  update: (_, value: number) => value,
});

export default createComponent(
  {
    name: "Counter",

    methods: {
      update,
      handleClick() {
        const value = this.$counter + 1; // this.$counter <- number ( typescript tips )
        this.update(value);
      },
    },
  },
  { $counter },
);
```


# createGate

Creates a  to consume data from view, designed for vue 3. If `defaultState` is defined, Gate.state will be created with passed value.

## Methods

### `createGate(config?: {defaultState?, domain?, name?})`

#### Arguments

`config` (*Object*): Optional configuration object

* `defaultState?`: Optional default state for Gate.state
* `domain?` (): Optional domain which will be used to create gate units (Gate.open event, Gate.state store, and so on)
* `name?` (*string*): Optional name which will be used as the name of a created Vue component

#### Returns



#### Examples

##### Basic Usage

```js
import { createGate, useGate } from "effector-vue/composition";

const ListGate = createGate({
  name: "Gate with required props",
});

const ListItem = {
  template: `
    <div>
      {{id}}
    </div>
  `,
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    useGate(ListGate, () => props.id);
  },
};

const app = {
  template: `
    <div>
      <ListItem :id="id" />
    </div>
  `,
  components: {
    ListItem,
  },
  setup() {
    const id = ref("1");
    return { id };
  },
};

Gate.state.watch((state) => {
  console.log("current state", state);
});
// => current state null

app.mount("#app");
// => current state 1

app.unmount();
// => current state null
```


# effector-vue

Effector binginds for Vue.

## Top-Level Exports

* VueEffector(Vue, options?)
* createComponent(ComponentOptions, store?)
* EffectorScopePlugin({scope, scopeName?})

## ComponentOptions API

* ComponentOptions\<V>

## Hooks

* useUnit(shape)
* useStore(store)
* useStoreMap({store, keys, fn})
* useVModel(store)

## Gate API

* Gate
* createGate()
* useGate(GateComponent, props)

## Import map

Package `effector-vue` provides couple different entry points for different purposes:

* effector-vue/composition
* effector-vue/ssr


# effector-vue/composition

## effector-vue/composition

```ts
import {} from "effector-vue/composition";
```

Provides additional API for effector-vue that allows to use [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)

### APIs

* useUnit(shape)
* useStore($store)
* useStoreMap({ store, keys, fn })
* useVModel($store)


# effector-vue/ssr

## effector-vue/ssr

```ts
import {} from "effector-vue/ssr";
```

> WARNING Deprecated: 
>
> Since [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) the core team recommends using main module of `effector-vue` of `effector-vue/composition` instead.

Provides additional API for effector-vue that enforces library to use Scope

### APIs

* useEvent(event)
* VueSSRPlugin


# useEvent

```ts
import { useEvent } from "effector-vue/ssr";
```

> WARNING Deprecated: 
>
> Since [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) `useEvent` is deprecated. Use useUnit instead.

Bind event to current fork instance to use in dom event handlers. Used **only** with ssr, in application without forks `useEvent` will do nothing

## Methods

### `useEvent(unit)`

#### Arguments

1. `unit` ( or ): Event or effect which will be bound to current `scope`

#### Returns

(`Function`): Function to pass to event handlers. Will trigger a given unit in current scope

#### Examples

##### Basic

```js
import { createStore, createEvent } from "effector";
import { useEvent } from "effector-vue/ssr";

const incremented = createEvent();
const $count = createStore(0);

$count.on(incremented, (x) => x + 1);

export default {
  setup() {
    const counter = useStore($count);
    const onIncrement = useEvent(incremented);

    return {
      onIncrement,
      counter,
    };
  },
};
```


# useGate

```ts
import { useGate } from "effector-vue/composition";
```

## Methods

### `useGate(Gate, props)`

Using a Gate to consume data from view. Designed for Vue 3

#### Arguments

1. `Gate<Props>` ()
2. `props` (*Props*)

#### Returns

(*`void`*)

#### Examples

See example


# useStore

## useStore

```ts
import { useStore } from "effector-vue/composition";
```

A hook function, which subscribes to watcher, that observes changes in the current **readonly** store, so when recording results, the component will update automatically. You can mutate the store value **only via createEvent**. Designed for vue 3

### `useStore($store)`

#### Arguments

1. `$store` (Store\<State>)

#### Returns

(`readonly(State)`)

#### Example

```js
import { createStore, createApi } from "effector";
import { useStore } from "effector-vue/composition";

const $counter = createStore(0);

const { incremented, decremented } = createApi($counter, {
  incremented: (count) => count + 1,
  decremented: (count) => count - 1,
});

export default {
  setup() {
    const counter = useStore($counter);

    return {
      counter,
      incremented,
      decremented,
    };
  },
};
```


# useStoreMap

```ts
import { useStoreMap } from "effector-vue/composition";
```

Function, which subscribes to store and transforms its value with a given function. Signal will update only when the selector function result will change

## Methods

### `useStoreMap($store, fn)`

#### Formulae

```ts
useStoreMap(
  $store: Store<State>,
  fn: (state: State) => Result,
): ComputedRef<Result>;
```

#### Arguments

1. `$store`: Source Store\<State>
2. `fn` (*(state) => result*): Selector function to receive part of source store

#### Returns

(`ComputedRef<Result>`)

### `useStoreMap(config)`

#### Formulae

```ts
useStoreMap({
  store: Store<State>,
  keys?: () => Keys,
  fn: (state: State, keys: Keys) => Result,
  defaultValue?: Result,
}): ComputedRef<Result>;
```

#### Arguments

1. `params` (*Object*): Configuration object
   * `store`: Source store
   * `keys` (`() => Keys`): Will be passed to `fn` selector
   * `fn` (`(state: State, keys: Keys) => Result`): Selector function to receive part of source store
   * `defaultValue` (`Result`): Optional default value if `fn` returned `undefined`

#### Returns

(`ComputedRef<Result>`)

#### Examples

This hook is very useful for working with lists, especially with large ones

###### User.vue

```js
import { createStore } from "effector";
import { useUnit, useStoreMap } from "effector-vue/composition";

const $users = createStore([
  {
    id: 1,
    name: "Yung",
  },
  {
    id: 2,
    name: "Lean",
  },
  {
    id: 3,
    name: "Kyoto",
  },
  {
    id: 4,
    name: "Sesh",
  },
]);

export default {
  props: {
    id: Number,
  },
  setup(props) {
    const user = useStoreMap({
      store: $users,
      keys: () => props.id,
      fn: (users, userId) => users.find(({ id }) => id === userId),
    });

    return { user };
  },
};
```

```jsx
<div>
  <strong>[{user.id}]</strong> {user.name}
</div>
```

###### App.vue

```js
const $ids = createStore(data.map(({ id }) => id));

export default {
  setup() {
    const ids = useStore($ids);

    return { ids };
  },
};
```

```jsx
<div>
  <User v-for="id in ids" :key="id" :id="id" />
</div>
```


# useUnit

```ts
import { useUnit } from "effector-vue/composition";
```

Bind  to Vue reactivity system or, in the case of / - bind to current  to use in DOM event handlers.

**Designed for Vue 3 and Composition API exclusively.**

> INFO Future: 
>
> This API can completely replace the following APIs:
>
> * useStore($store)
> * useEvent(event)
>
> In the future, these APIs can be deprecated and removed.

## Methods

### `useUnit(unit)`

#### Arguments

1. `unit` ( or ): Event or effect which will be bound to current 

#### Returns

(`Function`): Function to pass to event handlers. Will trigger given unit in current scope

#### Examples

##### Basic Usage

```js
// model.js
import { createEvent, createStore, fork } from "effector";

const incremented = createEvent();
const $count = createStore(0);

$count.on(incremented, (count) => count + 1);
```

```html
// App.vue

<script setup>
  import { useUnit } from "effector-vue/composition";

  import { incremented, $count } from "./model.js";

  const onClick = useUnit(incremented);
</script>

<template>
  <button @click="onClick">increment</button>
</template>
```

#### `useUnit($store)`

##### Arguments

1. `$store` (): Store which will be bound to Vue reactivity system

##### Returns

Reactive value of given 

##### Examples

###### Basic Usage

```js
// model.js
import { createEvent, createStore, fork } from "effector";

const incremented = createEvent();
const $count = createStore(0);

$count.on(incremented, (count) => count + 1);
```

```html
// App.vue

<script setup>
  import { useUnit } from "effector-vue/composition";

  import { $count } from "./model.js";

  const count = useUnit($count);
</script>

<template>
  <p>Count: {{ count }}</p>
</template>
```

#### `useUnit(shape)`

##### Arguments

1. `shape` Object or array of ( or  or ): Every unit will be processed by `useUnit` and returned as a reactive value in case of  or as a function to pass to event handlers in case of  or .

##### Returns

(Object or Array):

* if  or : functions with the same names or keys as argument to pass to event handlers. Will trigger given unit in current .
* if : reactive value of given  with the same names or keys as argument.

##### Examples

###### Basic Usage

```js
// model.js
import { createEvent, createStore, fork } from "effector";

const incremented = createEvent();
const $count = createStore(0);

$count.on(incremented, (count) => count + 1);
```

```html
// App.vue

<script setup>
  import { useUnit } from "effector-vue/composition";

  import { $count, incremented } from "./model.js";

  const { count, handleClick } = useUnit({ count: $count, handleClick: incremented });
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="handleClick">increment</button>
</template>
```


# useVModel

```ts
import { useVModel } from "effector-vue/composition";
```

A hook function, which subscribes to a watcher that observes changes in the current store, so when recording results, the component will automatically update. It is primarily used when working with forms (`v-model`) in Vue 3.

## Methods

### `useVModel($store)`

#### Formulae

```ts
useVModel($store: Store<State>): Ref<UnwrapRef<State>>;
```

Designed for Vue 3.

#### Arguments

1. `$store` ()
2. `shape of Stores` ()

#### Returns

(`State`)

#### Examples

##### Single Store

```js
import { createStore, createApi } from "effector";
import { useVModel } from "effector-vue/composition";

const $user = createStore({
  name: "",
  surname: "",
  skills: ["CSS", "HTML"],
});

export default {
  setup() {
    const user = useVModel($user);

    return { user };
  },
};
```

```html
<div id="app">
  <input type="text" v-model="user.name" />
  <input type="text" v-model="user.surname" />

  <div>
    <input type="checkbox" v-model="user.skills" value="HTML" />
    <input type="checkbox" v-model="user.skills" value="CSS" />
    <input type="checkbox" v-model="user.skills" value="JS" />
  </div>
</div>
```

##### Store Shape

```js
import { createStore, createApi } from "effector";
import { useVModel } from "effector-vue/composition";

const $name = createStore("");
const $surname = createStore("");
const $skills = createStore([]);

const model = {
  name: $name,
  surname: $surname,
  skills: $skills,
};

export default {
  setup() {
    const user = useVModel(model);

    return { user };
  },
};
```

```html
<div id="app">
  <input type="text" v-model="user.name" />
  <input type="text" v-model="user.surname" />

  <div>
    <input type="checkbox" v-model="user.skills" value="HTML" />
    <input type="checkbox" v-model="user.skills" value="CSS" />
    <input type="checkbox" v-model="user.skills" value="JS" />
  </div>
</div>
```


# Domain

*Domain (домен)* - это способ группировки и массовой обработки юнитов.

Домен может подписываться на создание события, эффекта, стор или вложенного домена с помощью методов `onCreateEvent`, `onCreateStore`, `onCreateEffect`, `onCreateDomain`.

Может использоваться для логирования или других сайд эффектов.

## Методы для создания юнитов

> INFO since: 
>
> [effector 20.7.0](https://changelog.effector.dev/#effector-20-7-0)

### `createEvent(name?)`

#### Аргументы

1. `name`? (*string*): имя события

**Возвращает**

: Новое событие

### `createEffect(handler?)`

Создает эффект с переданным обработчиком

#### Аргументы

1. `handler`? (*Function*): функция для обработки вызова эффектов, также может быть установленна с помощью use(handler)

**Возвращает**

: Контейнер для асинхронных функций.

> INFO since: 
>
> [effector 21.3.0](https://changelog.effector.dev/#effector-21-3-0)

### `createEffect(name?)`

#### Аргументы

1. `name`? (*string*): имя эффекта

**Возвращает**

: Контейнер для асинхронных функций.

### `createStore(defaultState)`

#### Аргументы

1. `defaultState` (*State*): дефолтное состояние стора

**Возвращает**

: Новый стор

### `createDomain(name?)`

#### Аргументы

1. `name`? (*string*): имя домена

**Возвращает**

: Новый домен

### `history`

Содержит изменяемый набор юнитов только для чтения внутри домена.

#### Формула

```ts
const { stores, events, domains, effects } = domain.history;
```

* Когда любой из юнитов создается внутри домена, он появляется в наборе с именем типа в порядке создания.

> INFO since: 
>
> [effector 20.3.0](https://changelog.effector.dev/#effector-20-3-0)

```js
import { createDomain } from "effector";
const domain = createDomain();
const eventA = domain.event();
const $storeB = domain.store(0);
console.log(domain.history);
// => {stores: Set{storeB}, events: Set{eventA}, domains: Set, effects: Set}
```

Запустить пример

### Псевдонимы

#### `event(name?)`

Псевдоним для domain.createEvent

#### `effect(name?)`

Псевдоним для domain.createEffect

#### `store(defaultState)`

Псевдоним для domain.createStore

#### `domain(name?)`

Псевдоним для domain.createDomain

## Хуки доменов

### `onCreateEvent(hook)`

#### Формула

```ts
domain.onCreateEvent((event) => {});
```

* Функция переданная в `onCreateEvent` вызывается каждый раз, когда создается новое событие в `domain`
* Первый аргумент вызываемой функции `event`
* Результат вызова функции игнорируется

#### Аргументы

1. `hook` ([*Watcher*][_Watcher_]): Функция, которая принимает Event и будет вызвана во время каждого вызова domain.createEvent

**Возвращает**

[*Subscription*][_Subscription_]: Функция для отписки.

#### Пример

```js
import { createDomain } from "effector";

const domain = createDomain();

domain.onCreateEvent((event) => {
  console.log("новое событие создано");
});

const a = domain.createEvent();
// => новое событие создано

const b = domain.createEvent();
// => новое событие создано
```

Запустить пример

### `onCreateEffect(hook)`

#### Формула

```ts
domain.onCreateEffect((effect) => {});
```

* Функция переданная в `onCreateEffect` вызывается каждый раз, когда создается новый эффект в `domain`
* Первый аргумент вызываемой функции `effect`
* Результат вызова функции игнорируется

#### Аргументы

1. `hook` ([*Watcher*][_Watcher_]): Функция, которая принимает Effect и будет вызвана во время каждого вызова domain.createEffect

**Возвращает**

[*Subscription*][_Subscription_]: Функция для отписки.

#### Пример

```js
import { createDomain } from "effector";

const domain = createDomain();

domain.onCreateEffect((effect) => {
  console.log("новый эффект создан");
});

const fooFx = domain.createEffect();
// => новый эффект создан

const barFx = domain.createEffect();
// => новый эффект создан
```

Запустить пример

### `onCreateStore(hook)`

#### Формула

```ts
domain.onCreateStore(($store) => {});
```

* Функция переданная в `onCreateStore` вызывается каждый раз, когда создается новый стор в `domain`
* Первый аргумент вызываемой функции `$store`
* Результат вызова функции игнорируется

#### Аргументы

1. `hook` ([*Watcher*][_Watcher_]): Функция, которая принимает Store и будет вызвана во время каждого вызова domain.createStore

**Возвращает**

[*Subscription*][_Subscription_]: Функция для отписки.

#### Пример

```js
import { createDomain } from "effector";

const domain = createDomain();

domain.onCreateStore((store) => {
  console.log("новый стор создан");
});

const $a = domain.createStore(null);
// => новый стор создан
```

Запустить пример

### `onCreateDomain(hook)`

#### Формула

```ts
domain.onCreateDomain((domain) => {});
```

* Функция переданная в `onCreateDomain` вызывается каждый раз, когда создается новый поддомен в `domain`
* Первый аргумент вызываемой функции `domain`
* Результат вызова функции игнорируется

#### Аргументы

1. `hook` ([*Watcher*][_Watcher_]): Функция, которая принимает Domain и будет вызвана во время каждого вызова domain.createDomain

**Возвращает**

[*Subscription*][_Subscription_]: Функция для отписки.

#### Пример

```js
import { createDomain } from "effector";

const domain = createDomain();

domain.onCreateDomain((domain) => {
  console.log("новый домен создан");
});

const a = domain.createDomain();
// => новый домен создан

const b = domain.createDomain();
// => новый домен создан
```

Запустить пример

[_watcher_]: /ru/explanation/glossary#watcher

[_subscription_]: /ru/explanation/glossary#subscription


# Effect API

[eventTypes]: /ru/api/effector/Event#event-types

[storeTypes]: /ru/essentials/typescript#store-types

## Effect API

```ts
import { type Effect, createEffect } from "effector";

const effectFx = createEffect();
```

Эффект – это контейнер для сайд-эффектов, как синхронных, так и асинхронных. В комплекте имеет ряд заранее созданных событий и сторов, облегчающих стандартные действия. Является юнитом.

Эффекты можно вызывать как обычные функции (*императивный вызов*) а также подключать их и их свойства в различные методы api включая sample, и split (*декларативное подключение*).

> TIP эффективный эффект: 
>
> Если вы не знакомы с эффектами и способами работы с ними, то вам сюда Асинхронность в effector с помощью эффектов.

### Интерфейс Effect

Доступные методы и свойства событий:
| <div style="width:170px">Метод/Свойство</div> | Описание |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| use(handler) | Заменяет обработчик эффекта на новую функцию `handler`. |
| use.getCurrent() | Возвращает текущий обработчик эффекта. |
| watch(watcher) | Добавляет слушатель, вызывающий `watcher` при каждом вызове эффекта. |
| map(fn) | Создаёт новое [производное событие][eventTypes], срабатывает при вызове эффекта с результатом вызова `fn` для параметров эффекта. |
| prepend(fn) | Создаёт новое [событие][eventTypes] , трансформирующее входные данные через `fn` перед вызовом эффекта. |
| filterMap(fn) | Создаёт новое [производное событие][eventTypes], срабатывает при вызове эффекта с результатом `fn`, если тот не вернул `undefined`. |
| done | [Производное событие][eventTypes] `Event<{Params, Done}>`, срабатывающее при успешном завершении эффекта. |
| doneData | [Производное событие][eventTypes] `Event<Done>` с результатом успешного выполнения эффекта. |
| fail | [Производное событие][eventTypes] `Event<{Params, Fail}>`, срабатывающее при ошибке выполнения эффекта. |
| failData | [Производное событие][eventTypes] `Event<Fail>` с данными ошибки эффекта. |
| finally | [Производное событие][eventTypes] `Event<{Params, status, Done?, Fail?}>`, срабатывающее при любом завершении эффекта. |
| pending | [Производный стор][storeTypes] `Store<boolean>` со статусом выполнения эффекта (`true` во время выполнения). |
| inFlight | [Производный стор][storeTypes] `Store<number>` с количеством активных вызовов эффекта. |
| sid | Уникальный идентификатор юнита. |
| shortName | Свойство типа `string`, содержащее имя переменной, в которой объявлен эффект. |
| compositeName | Комплексное имя эффекта (включая домен и короткое имя) — удобно для логирования и трассировки. |

### Особенности эффекта

1. При императивном вызове всегда возвращают промис, отражающий ход выполнения сайд-эффекта.
2. Эффекты принимают только один аргумент, как и события.
3. Имеют встроенные сторы (pending, inFlight) и события (done, fail, finally и др.) для удобства работы.

### Методы эффектов

#### `.use(handler)`

> WARNING use - это антипаттерн: 
>
> Если значение имплементации известно сразу, то оптимальнее использовать `createEffect(handler)`.
>
> Метод `use(handler)` – это антипаттерн, который ухудшает вывод типов.

Определяет имплементацию эффекта: функцию, которая будет вызвана при срабатывании. Используется для случаев когда имплементация не установлена при создании или когда требуется изменение поведения эффекта при тестировании.<br/>
Принимает аргумент `params`, который является данные, с которыми был вызван эффект.

> INFO use в приоритете: 
>
> Если на момент вызова эффект уже имел имплементацию, то она будет заменена на новую.

* **Формула**

```ts
const fx: Effect<Params, Done>;
fx.use(handler);
```

* **Тип**

```ts
effect.use(handler: (params: Params) => Promise<Done> | Done): Effect<
  Params,
  Done,
  Fail
>
```

* **Примеры**

```js
import { createEffect } from "effector";

const fetchUserReposFx = createEffect();

fetchUserReposFx.use(async ({ name }) => {
  console.log("fetchUserReposFx вызван для github пользователя", name);

  const url = `https://api.github.com/users/${name}/repos`;
  const req = await fetch(url);
  return req.json();
});

await fetchUserReposFx({ name: "zerobias" });
// => fetchUserReposFx вызван для github пользователя zerobias
```

Запустить пример

* **Возвращаемое значение**

Возвращает текущий эффект.

***

#### `.use.getCurrent()`

Метод для получения текущей имплементации эффекта. Используется для тестирования.

Если у эффекта ещё не была установлена имплементация, то будет возвращена функция по умолчанию, при срабатывании она выбрасывает ошибку.

* **Формула**

```ts
const fx: Effect<Params, Done>;
const handler = fx.use.getCurrent();
```

* **Тип**

```ts
effect.use.getCurrent(): (params: Params) => Promise<Done>
```

* **Примеры**

```js
const handlerA = () => "A";
const handlerB = () => "B";

const fx = createEffect(handlerA);

console.log(fx.use.getCurrent() === handlerA);
// => true

fx.use(handlerB);
console.log(fx.use.getCurrent() === handlerB);
// => true
```

Запустить пример

* **Возвращаемое значение**

Возвращает функцию-имплементацию эффекта, которая была установлена через createEffect или с помощью метода use.

***

#### `.watch(watcher)`

Вызывает дополнительную функцию с сайд-эффектами при каждом срабатывании эффекта. Не стоит использовать для логики, лучше заменить на sample.

* **Формула**

```ts
const fx: Effect<Params, Done>;
const unwatch = fx.watch(watcher);
```

* **Тип**

```ts
effect.watch(watcher: (payload: Params) => any): Subscription
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect((params) => params);

fx.watch((params) => {
  console.log("эффект вызван с аргументом", params);
});

await fx(10);
// => эффект вызван с аргументом 10
```

Запустить пример

* **Возвращаемое значение**

Функция отмены подписки, после её вызова `watcher` перестаёт получать обновления и удаляется из памяти.

***

#### `.map(fn)`

Метод `map` создает [производное событие][eventTypes]. Событие вызывается в момент выполнения эффекта, с теми же аргументами, что и у эффекта, и результатом, возвращаемым функцией `fn`. Работает по аналогии с Event.map(fn).

* **Формула**

```ts
const fx: Effect<Params, Done>;
const eventB = fx.map(fn);
```

* **Тип**

```ts
effect.map<T>(fn: (params: Params) => T): Event<T>
```

* **Примеры**

```ts
import { createEffect } from "effector";

interface User {
  // ...
}

const saveUserFx = createEffect(async ({ id, name, email }: User) => {
  // ...
  return response.json();
});

const userNameSaving = saveUserFx.map(({ name }) => {
  console.log("Начинаем сохранение пользователя: ", name);
  return name;
});

const savingNotification = saveUserFx.map(({ name, email }) => {
  console.log("Оповещение о сохранении");
  return `Сохранение пользователя: ${name} (${email})`;
});

// При вызове эффекта сработают оба производных события
await saveUserFx({ id: 1, name: "Иван", email: "ivan@example.com" });
// => Начинаем сохранение пользователя: Иван
// => Сохранение пользователя: Иван (ivan@example.com)
```

Запустить пример

* **Возвращаемое значение**

Возвращает новое [производное событие][eventTypes].

***

#### `.prepend(fn)`

Создаёт новое событие для преобразования данных *перед* запуском эффекта. По сравнению с map, работает в обратном направлении. Работает по аналогии с Event.prepend(fn).

* **Формула**

```ts
const fx: Effect<Params, Done>;
const trigger = fx.prepend(fn);
```

* **Тип**

```ts
effect.prepend<Before>(fn: (_: Before) => Params): EventCallable<Before>
```

* **Примеры**

```js
import { createEffect } from "effector";

const saveFx = createEffect(async (data) => {
  console.log('saveFx вызван с: 'data)
  await api.save(data);
});

// создаем событие-триггер для эффекта
const saveForm = saveFx.prepend((form) => ({
  ...form,
  modified: true
}));

saveForm({ name: "John", email: "john@example.com" });
// => saveFx вызван с : { name: "John", email: "john@example.com", modified: true }
```

* **Возвращаемое значение**

Возвращает новое [событие][eventTypes].

***

#### `.filterMap(fn)`

Метод `filterMap` создаёт [производное событие][eventTypes]. Вычисление функции `fn` запускается одновременно с эффектом, однако если функция возвращает `undefined`, событие не срабатывает. Работает аналогично методу .map(fn), но с фильтрацией по возвращаемому значению.

* **Формула**

```ts
const fx: Effect<Params, Done>;
const filtered = fx.filterMap(fn);
```

* **Тип**

```ts
effect.filterMap<T>(fn: (payload: Params) => T | undefined): Event<T>
```

* **Примеры**

```js
import { createEffect } from "effector";

const validateAndSaveFx = createEffect(async (userData) => {
  if (!userData.isValid) {
    throw new Error("Invalid data");
  }

  return await saveToDatabase(userData);
});

// Создаем событие только для валидных данных
const validDataProcessing = validateAndSaveFx.filterMap((userData) => {
  if (userData.isValid && userData.priority === "high") {
    return {
      id: userData.id,
      timestamp: Date.now(),
    };
  }
  // Если данные не валидны или приоритет не высокий, событие не сработает
});

validDataProcessing.watch(({ id, timestamp }) => {
  console.log(`Обработка высокоприоритетных данных ID: ${id} в ${timestamp}`);
});

// Примеры вызовов
await validateAndSaveFx({
  id: 1,
  isValid: true,
  priority: "high",
  role: "user",
});
// => Обработка высокоприоритетных данных ID: 1 в 1703123456789
```

* **Возвращаемое значение**

Возвращает новое [производное событие][eventTypes].

### Свойства эффектов

#### `.done`

[Производное событие][eventTypes], которое срабатывает с результатом выполнения эффекта и аргументом, переданным при вызове.

* **Тип**

```ts
interface Effect<Params, Done> {
  done: Event<{ params: Params; result: Done }>;
}
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect((value) => value + 1);

fx.done.watch(({ params, result }) => {
  console.log("Вызов с аргументом", params, "завершён со значением", result);
});

await fx(2);
// => Вызов с аргументом 2 завершён со значением 3
```

Запустить пример.

***

#### `.doneData`

[Производное событие][eventTypes], которое срабатывает с результатом успешного выполнения эффекта.

* **Тип**

```ts
interface Effect<any, Done> {
  doneData: Event<Done>;
}
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect((value) => value + 1);

fx.doneData.watch((result) => {
  console.log(`Эффект успешно выполнился, вернув ${result}`);
});

await fx(2);
// => Эффект успешно выполнился, вернув 3
```

Запустить пример.

***

#### `.fail`

[Производное событие][eventTypes], которое срабатывает с ошибкой, возникшей при выполнении эффекта и аргументом, переданным при вызове.

* **Тип**

```ts
interface Effect<Params, any, Fail> {
  fail: Event<{ params: Params; error: Fail }>;
}
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect(async (value) => {
  throw new Error(value - 1);
});

fx.fail.watch(({ params, error }) => {
  console.log("Вызов с аргументом", params, "завершился с ошибкой", error.message);
});

fx(2);
// => Вызов с аргументом 2 завершился с ошибкой 1
```

Запустить пример.

***

#### `.failData`

[Производное событие][eventTypes], которое срабатывает с ошибкой, возникшей при выполнении эффекта.

* **Тип**

```ts
interface Effect<any, any, Fail> {
  failData: Event<Fail>;
}
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect(async (value) => {
  throw new Error(value - 1);
});

fx.failData.watch((error) => {
  console.log(`Вызов завершился с ошибкой ${error.message}`);
});

fx(2);
// => Вызов завершился с ошибкой 1
```

Запустить пример.

***

#### `.finally`

[Производное событие][eventTypes], которое срабатывает как при успехе, так и в случае ошибки завершении эффекта с подробной информацией об аргументах, результатах и статусе выполнения.

* **Тип**

```ts
interface Effect<Params, Done, Fail> {
  finally: Event<
    | {
        status: "done";
        params: Params;
        result: Done;
      }
    | {
        status: "fail";
        params: Params;
        error: Fail;
      }
  >;
}
```

* **Примеры**

```js
import { createEffect } from "effector";

const fetchApiFx = createEffect(async ({ time, ok }) => {
  await new Promise((resolve) => setTimeout(resolve, time));

  if (ok) {
    return `${time} ms`;
  }

  throw Error(`${time} ms`);
});

fetchApiFx.finally.watch((value) => {
  switch (value.status) {
    case "done":
      console.log("Вызов с аргументом", value.params, "завершён со значением", value.result);
      break;
    case "fail":
      console.log("Вызов с аргументом", value.params, "завершён с ошибкой", value.error.message);
      break;
  }
});

await fetchApiFx({ time: 100, ok: true });
// => Вызов с аргументом {time: 100, ok: true} завершён со значением 100 ms

fetchApiFx({ time: 100, ok: false });
// => Вызов с аргументом {time: 100, ok: false} завершён с ошибкой 100 ms
```

Запустить пример.

***

#### `.pending`

[Производный стор][storeTypes], который показывает, что эффект находится в процессе выполнения.

* **Тип**

```ts
interface Effect<any, any> {
  pending: Store<boolean>;
}
```

* **Детальное описание**

Это свойство избавляет от необходимости писать подобный код:

```js
const $isRequestPending = createStore(false)
  .on(requestFx, () => true)
  .on(requestFx.done, () => false)
  .on(requestFx.fail, () => false);
```

* **Примеры**

```jsx
import React from "react";
import { createEffect } from "effector";
import { useUnit } from "effector-react";

const fetchApiFx = createEffect(async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
});

fetchApiFx.pending.watch(console.log);
// => false

const App = () => {
  const loading = useUnit(fetchApiFx.pending);
  return <div>{loading ? "Загрузка..." : "Загрузка завершена"}</div>;
};

fetchApiFx(1000);
// => true
// => false
```

Запустить пример.

***

#### `.inFlight`

[Производный стор][storeTypes], который показывает число запущенных эффектов, которые находятся в процессе выполнения. Может использоваться для ограничения числа одновременных запросов.

* **Тип**

```ts
interface Effect<any, any> {
  inFlight: Store<number>;
}
```

* **Детальное описание**

Это свойство избавляет от необходимости писать подобный код:

```js
const $requestsInFlight = createStore(0)
  .on(requestFx, (n) => n + 1)
  .on(requestFx.done, (n) => n - 1)
  .on(requestFx.fail, (n) => n - 1);
```

* **Примеры**

```js
import { createEffect } from "effector";

const fx = createEffect(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});

fx.inFlight.watch((amount) => {
  console.log("выполняется запросов:", amount);
});
// => выполняется запросов: 0

const req1 = fx();
// => выполняется запросов: 1

const req2 = fx();
// => выполняется запросов: 2

await Promise.all([req1, req2]);

// => выполняется запросов: 1
// => выполняется запросов: 0
```

Запустить пример.

***

#### `.sid`

Уникальный идентификатор юнита. Важно отметить, что SID не изменяется при каждом запуске приложения, он статически записывается в пакет вашего приложения для абсолютной идентификации юнитов. Задаётся автоматически через Babel plugin.

* **Тип**

```ts
interface Effect<any, any> {
  sid: string | null;
}
```

***

#### `.shortName`

Свойство типа `string`, содержащее имя переменной, в которой объявлен эффект. Имя эффекта. Задаётся либо явно, через поле `name` в createEffect, либо автоматически через babel plugin.

* **Тип**

```ts
interface Effect<any, any> {
  shortName: string;
}
```

***

#### `.compositeName`

Комплексное имя эффекта (включая домен и короткое имя) — удобно для логирования и трассировки.

* **Тип**

```ts
interface Effect<any, any> {
  compositeName: {
    shortName: string;
    fullName: string;
    path: Array<string>;
  };
}
```

* **Примеры**

```ts
import { createEffect, createDomain } from "effector";

const first = createEffect();
const domain = createDomain();
const second = domain.createEffect();

console.log(first.compositeName);
// {
//     "shortName": "first",
//     "fullName": "first",
//     "path": [
//         "first"
//      ]
// }

console.log(second.compositeName);
// {
//     "shortName": "second",
//     "fullName": "domain/second",
//     "path": [
//         "domain",
//         "second"
//      ]
// }
```

### Связанные API и статьи

* **API**
  * createEffect - Создание нового эффекта
  * Event API - Описание событий, его методов и свойств
  * Store API - Описание сторов, его методов и свойств
  * sample - Ключевой оператор для построения связей между юнитами
  * attach - Создает новые эффекты на основе других эффектов
* **Статьи**
  * Работа с эффектами
  * Как типизировать эффекты и не только
  * Гайд по тестированию эффектов и других юнитов


# Event

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## Event API

```ts
import { type Event, type EventCallable, createEvent } from "effector";

const event = createEvent();
```

Событие в effector представляет действие пользователя, шаг в процессе приложения, команду к выполнению или намерение внести изменения и многое другое. <br/>
Событие служит как точка входа в реактивный поток данных — простой способ сказать приложению "что-то произошло".

> TIP это ваше каноничное событие: 
>
> Если вы не знакомы с событиями и способами работы с ними, то вам сюда Что такое события и как работать с ними.

### Типы событий

Важно понять, что существуют два типа событий:

1. **Обычное событие**, которое создается с помощью createEvent, .prepend; эти события имеют тип EventCallable и могут быть вызваны, либо использованы в target метода sample.
2. **Производное событие**, который создается с помощью .map, .filter, .filterMap. Такие события имеют тип Event и их **нельзя вызывать или передавать в target**, effector сам вызовет их в нужном порядке, однако вы можете подписываться на эти события с помощью sample или watch.

### Интерфейс Event

Доступные методы и свойства событий:

| <div style="width:170px">Метод/Свойство</div>                            | Описание                                                                                                       |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| prepend(fn) | Создаёт новое событие `EventCallable`, трансформируют входные данные через `fn` и передает в исходное событие. |
| map(fn)                                       | Создаёт новое событие типа `Event` с результатом вызова `fn` после срабатывания исходного события.             |
| filter({fn})                              | Создаёт новое событие типа `Event`, срабатывающий только если `fn` возвращает `true`.                          |
| filterMap(fn)                           | Создаёт событие типа `Event`, срабатывающий с результатом `fn`, если тот не вернул `undefined`.                |
| watch(watcher)                         | Добавляет слушатель, вызывающий `watcher` при каждом срабатывании события.                                     |
| subscribe(observer)               | Низкоуровневый метод для интеграции события со стандартным шаблоном `Observable`.                              |
| sid                                           | Уникальный идентификатор юнита (`unit`).                                                                       |
| shortName                               | Свойство типа `string`, содержащее имя переменной, в которой объявлено событие.                                |
| compositeName                       | Комплексное имя Event (включая домен и короткое имя) — удобно для логирования и трассировки.                   |

### Методы событий

#### `.prepend(fn)`

> INFO информация: 
>
> Этот метод существует **только** для обычных событий (`EventCallable`)! Это значит что этот метод может использоваться только на событиях созданных с помощью createEvent.

Создает новое событие `EventCallable`, который можно вызвать. При его срабатывании вызвает `fn` и передает преобразованные данные в исходное событие.

* **Формула**

```ts
const second = first.prepend(fn);
```

* **Тип**

```ts
event.prepend<Before = void>(
  fn: (_: Before) => Payload
): EventCallable<Before>
```

* **Примеры**

```ts
import { createEvent } from "effector";

// исходное событие
const userPropertyChanged = createEvent();

const changeName = userPropertyChanged.prepend((name) => ({
  field: "name",
  value: name,
}));
const changeRole = userPropertyChanged.prepend((role) => ({
  field: "role",
  value: role.toUpperCase(),
}));

userPropertyChanged.watch(({ field, value }) => {
  console.log(`Свойство пользователя "${field}" изменилось на ${value}`);
});

changeName("john");
// => Свойство пользователя "name" изменилось на john

changeRole("admin");
// => Свойство пользователя "role" изменилось на ADMIN

changeName("alice");
// => Свойство пользователя "name" изменилось на alice
```

Открыть пример

Вы можете считать этот метод функцией-обёрткой. Допустим, у нас есть функция с неидеальным API, но нам нужно часто её вызывать:

```ts
import { sendAnalytics } from "./analytics";

export function reportClick(item: string) {
  const argument = { type: "click", container: { items: [arg] } };
  return sendAnalytics(argument);
}
```

Это именно то, как работает `.prepend()`:

```ts
import { sendAnalytics } from "./analytics";

export const reportClick = sendAnalytics.prepend((item: string) => {
  return { type: "click", container: { items: [arg] } };
});

reportClick("example");
// reportClick сработал "example"
// sendAnalytics сработал с { type: "click", container: { items: ["example"] } }
```

* **Детальное описание**

Работает как обратный .map. В случае `.prepend` данные преобразуются **до срабатывания** исходного события, а в случае .map данные преобразуются **после срабатывания**.

Если исходное событие принадлежит какому-либо домену, то новое событие также будет ему принадлежать.

* **Возвращаемое значение**

Возвращает новое событие `EventCallable`.

Ознакомьтесь со всеми другими методами в Event.

***

#### `.map(fn)`

Создает новое производное событие, которое будет вызвано после того, как будет вызвано исходное событие, используя результат функции `fn` в качестве его аргумента.

> INFO Чистота наше все!: 
>
> Функция `fn` **должна быть чистой**.

* **Формула**

```ts
// Событие любого типа, как производное так и обычное
const first: Event<T> | EventCallable<T>;
const second: Event<F> = first.map(fn);
```

* **Тип**

```ts
event.map<T>(fn: (payload: Payload) => T): Event<T>
```

* **Примеры**

```ts
import { createEvent } from "effector";

const userUpdated = createEvent<{ name: string; role: string }>();

// вы можете разбить поток данных с помощью метода .map()
const userNameUpdated = userUpdated.map(({ user }) => name);

// либо преобразовать данные
const userRoleUpdated = userUpdated.map((user) => user.role.toUpperCase());

userNameUpdated.watch((name) => console.log(`Имя пользователя теперь [${name}]`));
userRoleUpdated.watch((role) => console.log(`Роль пользователя теперь [${role}]`));

userUpdated({ name: "john", role: "admin" });
// => Имя пользователя теперь [john]
// => Роль пользователя теперь [ADMIN]
```

Открыть пример

* **Детальное описание**

Метод `.map` позволяет вам разбивать и управлять потоком данных, а также извлекать или преобразовывать данные в рамках вашей модели бизнес-логики.

* **Возвращаемое значение**

Возвращает новое производное событие.

***

#### `.filter({ fn })`

> TIP совет: 
>
> sample с аргументом `filter` является предпочтительным методом фильтрации:
>
> ```ts
> const event = createEvent();
>
> const filteredEvent = sample({
>   clock: event,
>   filter: () => true,
> });
> ```

Метод `.filter` генерирует новое производное событие, которое будет вызвано после исходного события,в случае если функция `fn` вернет `true`. Эта специальная функция позволяет вам разбить поток данных на ветви и подписаться на них в рамках модели бизнес-логики.<br />
Это очень удобно, если мы хотим на события которые срабатывают по условию.

* **Формула**

```ts
// Событие любого типа, как производное так и обычное
const first: Event<T> | EventCallable<T>;
const second: Event<T> = first.filter({ fn });
```

* **Тип**

```ts
event.filter(config: {
  fn(payload: Payload): boolean
}): Event<Payload>
```

* **Примеры**

<Tabs>
<TabItem label="😕 filter">

```js
import { createEvent, createStore } from "effector";

const numbers = createEvent();
const positiveNumbers = numbers.filter({
  fn: ({ x }) => x > 0,
});

const $lastPositive = createStore(0);

$lastPositive.on(positiveNumbers, (n, { x }) => x);

$lastPositive.watch((x) => {
  console.log("последнее положительное:", x);
});

// => последнее положительное: 0

numbers({ x: 0 });
// нет реакции

numbers({ x: -10 });
// нет реакции

numbers({ x: 10 });
// => последнее положительное: 10
```

<br />
[Открыть пример](https://share.effector.dev/H2Iu4iJH)

</TabItem>
<TabItem label="🤩 sample + filter">

```js
import { createEvent, createStore, sample } from "effector";

const numbers = createEvent();
const positiveNumbers = sample({
  clock: numbers,
  filter: ({ x }) => x > 0,
});

const $lastPositive = createStore(0);

$lastPositive.on(positiveNumbers, (n, { x }) => x);

$lastPositive.watch((x) => {
  console.log("последнее положительное:", x);
});

// => последнее положительное: 0

numbers({ x: 0 });
// нет реакции

numbers({ x: -10 });
// нет реакции

numbers({ x: 10 });
// => последнее положительное: 10
```

</TabItem>
</Tabs>

* **Возвращаемое значение**

Возвращает новое производное событие.

***

#### `.filterMap(fn)`

> TIP наш любимый sample: 
>
> Этот метод также можно заменить на операцию sample с аргументами `filter` + `fn`:
>
> ```ts
> const event = createEvent();
>
> const filteredAndMappedEvent = sample({
>   clock: event,
>   filter: () => true,
>   fn: () => "value",
> });
> ```

Этот метод генерирует новое производное событие, которое **может быть вызвано** после исходного события, но с преобразованным аргументом. Этот специальный метод позволяет одновременно преобразовывать данные и фильтровать срабатывание события.

Этот метод наиболее полезен с API JavaScript, которые иногда возвращают `undefined`.

* **Формула**

```ts
// Событие любого типа, как производное так и обычное
const first: Event<T> | EventCallable<T>;
const second: Event<F> = first.filterMap(fn);
```

* **Тип**

```ts
event.filterMap<T>(fn: (payload: Payload) => T | undefined): Event<T>
```

* **Примеры**

```tsx
import { createEvent } from "effector";

const listReceived = createEvent<string[]>();

// Array.prototype.find() возвращает `undefined`, когда элемент не найден
const effectorFound = listReceived.filterMap((list) => {
  return list.find((name) => name === "effector");
});

effectorFound.watch((name) => console.info("найден", name));

listReceived(["redux", "effector", "mobx"]); // => найден effector
listReceived(["redux", "mobx"]);
```

> INFO Внимание: 
>
> Функция `fn` должна возвращать некоторые данные. Если возвращается `undefined`, вызов производного события будет пропущено.

Открыть пример

* **Возвращаемое значение**

Возвращает новое производное событие.

***

#### `.watch(watcher)`

Метод `.watch` вызывается колбэк `watcher` каждый раз при срабатывании события.

> TIP Помните: 
>
> Метод `watch` не обрабатывает и не сообщает о исключениях, не управляет завершением асинхронных операций и не решает проблемы гонки данных.
>
> Его основное предназначение — для краткосрочного отладки и логирования.

Подробнее в разделе изучения.

* **Формула**

```ts
// Событие любого типа, как производное так и обычное
const event: Event<T> | EventCallable<T>;
const unwatch: () => void = event.watch(fn);
```

* **Тип**

```ts
  event.watch(watcher: (payload: Payload) => any): Subscription
```

* **Примеры**

```js
import { createEvent } from "effector";

const sayHi = createEvent();
const unwatch = sayHi.watch((name) => console.log(`${name}, привет!`));

sayHi("Питер"); // => Питер, привет!
unwatch();

sayHi("Дрю"); // => ничего не произошло
```

Открыть пример

* **Возвращаемое значение**

Возвращает функцию для отмены подписки.

***

#### `.subscribe(observer)`

Это низкоуровневый метод для интеграции события со стандартным шаблоном `Observable`.

Подробнее:

* https://rxjs.dev/guide/observable
* https://github.com/tc39/proposal-observable

> INFO Помните: 
>
> Вам не нужно использовать этот метод самостоятельно. Он используется под капотом движками рендеринга и так далее.

* **Формула**

```ts
const event = createEvent();

event.subscribe(observer);
```

* **Тип**

```ts
event.subscribe(observer: Observer<Payload>): Subscription
```

* **Примеры**

```ts
import { createEvent } from "effector";

const userLoggedIn = createEvent<string>();

const subscription = userLoggedIn.subscribe({
  next: (login) => {
    console.log("User login:", login);
  },
});

userLoggedIn("alice"); // => User login: alice

subscription.unsubscribe();
userLoggedIn("bob"); // ничего не произойдет
```

### Свойства

Этот набор свойств в основном задается с помощью effector/babel-plugin или @effector/swc-plugin. Таким образом, они существуют только при использовании Babel или SWC.

#### `.sid`

Это уникальный идентификатор для каждого события.

Важно отметить, что SID не изменяется при каждом запуске приложения, он статически записывается в пакет вашего приложения для абсолютной идентификации юнитов.

Это может быть полезно для отправки событий между рабочими или
сервером/браузером: [examples/worker-rpc](https://github.com/effector/effector/tree/master/examples/worker-rpc).

* **Тип**

```ts
interface Event {
  sid: string | null;
}
```

***

#### `.shortName`

Это свойство содержащее имя переменной, в которой объявлено событие.

```ts
import { createEvent } from "effector";

const demo = createEvent();
// demo.shortName === 'demo'
```

Но переопределение события в другую переменную ничего не изменит:

```ts
const another = demo;
// another.shortName === 'demo'
```

* **Тип**

```ts
interface Event {
  shortName: string;
}
```

***

#### `.compositeName`

Это свойство содержит полную внутреннюю цепочку юнитов. Например, событие может быть создано доменом, поэтому составное имя будет содержать имя домена внутри него.

> TIP Помните: 
>
> Обычно, если требуется длинное имя, лучше передать его явно в поле `name`.

```ts
import { createEvent, createDomain } from "effector";

const first = createEvent();
const domain = createDomain();
const second = domain.createEvent();

console.log(first.compositeName);
// {
//     "shortName": "first",
//     "fullName": "first",
//     "path": [
//         "first"
//      ]
// }

console.log(second.compositeName);
// {
//     "shortName": "second",
//     "fullName": "domain/second",
//     "path": [
//         "domain",
//         "second"
//      ]
// }
```

* **Тип**

```ts
interface Event {
  compositeName: {
    shortName: string;
    fullName: string;
    path: Array<string>;
  };
}
```

### Особенности Event

1. В Effector любое событие поддерживает только **один аргумент**.
   Вызов события с двумя или более аргументами, как в случае `someEvent(first, second)`, будет игнорировать все аргументы кроме первого.
2. В методах событий нельзя вызывать другие события или эффекты - **функции должны быть чистыми**

### Связанные API и статьи

* **API**
  * createEvent - Создание нового события
  * createApi - Создание набора событий для стора
  * merge - Слияние событий в одно
  * sample - Ключевой оператор для построения связей между юнитами
* **Статьи**
  * Как работать с событиями
  * Как мыслить в effector и почему события важны
  * Гайд по типизации событий и юнитов


# Scope API

## Scope API

```ts
import { type Scope, fork } from "effector";

const scope = fork();
```

`Scope` — это полностью изолированный экземпляр приложения.
Основное назначение скоупа связано с SSR (Server-Side Rendering), но не ограничивается только этим случаем использования.
Скоуп содержит независимую копию всех юнитов (включая связи между ними), а также базовые методы для работы с ними.

> TIP скоуп важен: 
>
> Если вы хотите глубже разобраться в скоупах, ознакомьтесь с отличной статьёй про изолированыне контексты.<br/>
> У нас также есть несколько гайдов связанных со скоупом:
>
> * Как исправить потерянный скоуп
> * Использование скоупов с SSR
> * Написание тестов

### Особенности скоупов

1. Существует несколько правил, которые нужно соблюдать, чтобы успешно работать со скоупом.
2. Скоуп можно потерять — чтобы этого избежать, используйте .

### Методы скоупа

#### `.getState($store)`

Возвращает значение стора в данном скоупе:

* **Формула**

```ts
const scope: Scope;
const $value: Store<T> | StoreWritable<T>;

const value: T = scope.getState($value);
```

* **Тип**

```ts
scope.getState<T>(store: Store<T>): T;
```

* **Возвращает**

Значение стора.

* **Пример**

Создадим два экземпляра приложения, вызовем события в каждом из них и проверим значение стора `$counter` в обоих случаях:

```js
import { createStore, createEvent, fork, allSettled } from "effector";

const inc = createEvent();
const dec = createEvent();
const $counter = createStore(0);

$counter.on(inc, (value) => value + 1);
$counter.on(dec, (value) => value - 1);

const scopeA = fork();
const scopeB = fork();

await allSettled(inc, { scope: scopeA });
await allSettled(dec, { scope: scopeB });

console.log($counter.getState()); // => 0
console.log(scopeA.getState($counter)); // => 1
console.log(scopeB.getState($counter)); // => -1
```

Попробовать.

### Связанные API и статьи

* **API**

  * scopeBind – Метод для привязки юнита к скоупу
  * fork – Оператор для создания скоупа
  * allSettled – Метод для вызова юнита в указанном скоупе и ожидания завершения всей цепочки эффектов
  * serialize – Метод для получения сериализованных значений сторов
  * hydrate – Метод для гидрации сериализованных данных

* **Статьи**

  * Что такое потеря скоупа и как её исправить
  * Использование скоупов с SSR
  * Как тестировать юниты


# Store API

## Store API

```ts
import { type Store, type StoreWritable, createStore } from "effector";

const $store = createStore();
```

*Store* — это объект, который хранит значение состояния. Обновление стора происходит когда новое значение не равно (`!==`) текущему, а также когда не равно `undefined` (если в конфигурации стора не указан `skipVoid:false`). Стор является Unit. Некоторые сторы могут быть производными.

> TIP Кто такой этот ваш стор?: 
>
> Если вы еще не знакомы как работать со стором, то добро пожаловать сюда.

### Интерфейс стора

Доступные методы и свойства стора:

| Метод/Свойство                                         | Описание                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| map(fn)                           | Создает новый производный стор                                |
| on(trigger, reducer) | Обновление стейта c помощью `reducer`, когда вызван `trigger` |
| watch(watcher)             | Вызывает функцию `watcher` каждый раз, когда стор обновляется |
| reset(...triggers)        | Метод для сброса к начальному состоянию                       |
| off(trigger)                 | Удаляет подписку на указанный триггер                         |
| updates()                     | Событие срабатывающие при обновление стора                    |
| reinit()                       | Событие для реинициализации стора                             |
| shortName                   | ID или короткое имя store                                     |
| defaultState             | Начальное состояние стора                                     |
| getState()              | Возвращает текущий стейт                                      |

### Иммутабельность

Store в effector иммутабелен. Это значит, что обновления в нём будут происходить только если в функции-обработчике (например `combine`, `sample` или `on`) вернуть новый объект

Например, прежде чем использовать методы массива, нужно создать новую ссылку на него. Как правильно:

```ts
$items.on(addItem, (items, newItem) => {
  const updatedItems = [...items];
  // ✅ метод .push вызывается на новом массиве
  updatedItems.push(newItem);
  return updatedItems;
});
```

Так делать нельзя, обновления стора **не произойдёт**

```ts
$items.on(addItem, (items, newItem) => {
  // ❌ ошибка! Ссылка на массив осталась та же, обновления стора не произойдёт
  items.push(newItem);
  return items;
});
```

Обновление объектов происходит аналогичным образом

Сторы в effector должен быть размером как можно меньше, чтобы отвечать за конкретную часть в бизнес логике, в отличии от например redux стора, который имеет тенденцию к тому чтобы держать рядом всё и сразу. Когда состояние атомарное, то необходимости в спредах объектов становится меньше. Однако, если возникает потребность часто обновлять сильно вложенные данные, для обновления состояния допустимо применять [immer](https://immerjs.github.io/immer/produce) чтобы упростить повторяющийся код

### Методы стора

#### `.map(fn)`

Принимает функцию `fn` и возвращает производный стор, который автоматически обновляется, когда исходный стор изменяется.

* **Формула**

```ts
$source.map(fn, config?);
```

* **Тип**

```ts
const $derived = $source.map<T>(
  fn: (value: SourceValue) => T,
  config?: {
    skipVoid?: boolean
  }
): Store<T>
```

* **Примеры**

Базовое использование:

```ts
import { createEvent, createStore } from "effector";

const changed = createEvent<string>();

const $title = createStore("");
const $titleLength = $title.map((title) => title.length);

$title.on(changed, (_, newTitle) => newTitle);

$titleLength.watch((length) => {
  console.log("new length", length);
});

changed("hello");
changed("world");
changed("hello world");
```

Попробовать

Вторым аргументом можно передать объект конфига со значением `skipVoid:false`, тогда стор сможет принимать `undefined` значения:

```js
const $titleLength = $title.map((title) => title.length, { skipVoid: false });
```

* **Детальное описание**

Метод `map` вызывает переданную функцию `fn` с состоянием исходного стора в аргументе, каждый раз когда оригинальный стор обновляется.<br/>
Результат выполнения функции используется как значение стора.

* **Возвращаемое значение**

Возвращает новый производный стор.

#### `.on(trigger, reducer)`

Обновляет состояние используя reducer, при срабатывании `trigger`.

* **Формула**

```ts
$store.on(trigger, reducer);
```

* **Тип**

```ts
$store.on<T>(
  trigger: Unit<T> | Unit<T>[]
  reducer: (state: State, payload: T) => State | void
): this
```

* **Примеры**

```ts
import { createEvent, createStore } from "effector";

const $counter = createStore(0);
const incrementedBy = createEvent<number>();

$counter.on(incrementedBy, (value, incrementor) => value + incrementor);

$counter.watch((value) => {
  console.log("updated", value);
});

incrementedBy(2);
incrementedBy(2);
```

Попробовать

* **Возвращаемое значение**

Возвращает текущий стор.

#### `.watch(watcher)`

Вызывает функцию `watcher` каждый раз, когда стор обновляется.

* **Формула**

```ts
const unwatch = $store.watch(watcher);
```

* **Тип**

```ts
$store.watch(watcher: (state: State) => any): Subscription
```

* **Примеры**

```ts
import { createEvent, createStore } from "effector";

const add = createEvent<number>();
const $store = createStore(0);

$store.on(add, (state, payload) => state + payload);

$store.watch((value) => console.log(`current value: ${value}`));

add(4);
add(3);
```

Попробовать

* **Возвращаемое значение**

Возвращает функцию для отмены подписки.

#### `.reset(...triggers)`

Сбрасывает состояние стора до значения по умолчанию при срабатывании любого `trigger`.

* **Формула**

```ts
$store.reset(...triggers);
```

* **Тип**

```ts
$store.reset(...triggers: Array<Unit<any>>): this
```

* **Примеры**

```ts
import { createEvent, createStore } from "effector";

const increment = createEvent();
const reset = createEvent();

const $store = createStore(0)
  .on(increment, (state) => state + 1)
  .reset(reset);

$store.watch((state) => console.log("changed", state));

increment();
increment();
reset();
```

Попробовать

* **Возвращаемое значение**

Возвращает текущий стор.

#### `.off(trigger)`

Удаляет reducer для указанного `trigger`.

* **Формула**

```ts
$store.off(trigger);
```

* **Тип**

```ts
$store.off(trigger: Unit<any>): this
```

* **Примеры**

```ts
import { createEvent, createStore, merge } from "effector";

const changedA = createEvent();
const changedB = createEvent();

const $store = createStore(0);
const changed = merge([changedA, changedB]);

$store.on(changed, (state, params) => state + params);
$store.off(changed);
```

Попробовать

* **Возвращаемое значение**

Возвращает текущий стор.

### Свойства стора

#### `.updates`

Событие срабатывающие при обновление стора.

* **Примеры**

```ts
import { createStore, is } from "effector";

const $clicksAmount = createStore(0);
is.event($clicksAmount.updates); // true

$clicksAmount.updates.watch((amount) => {
  console.log(amount);
});
```

Попробовать

* **Возвращаемое значение**

Производное событие, представляющее обновления данного стора.

#### `.reinit`

Событие для реинициализации стора.

* **Примеры**

```ts
import { createStore, createEvent, sample, is } from "effector";

const $counter = createStore(0);
is.event($counter.reinit);

const increment = createEvent();

$counter.reinit();
console.log($counter.getState());
```

Попробовать

* **Возвращаемое значение**

Событие, которое может реинициализировать стор до значения по умолчанию.

#### `.shortName`

Cтроковое свойство, которое содержит ID или короткое имя стора.

* **Примеры**

```ts
const $store = createStore(0, {
  name: "someName",
});

console.log($store.shortName); // someName
```

Попробовать

* **Возвращаемое значение**

ID или короткое имя store.

#### `.defaultState`

Свойство, которое содержит значение состояния по умолчанию стора.

* **Пример**

```ts
const $store = createStore("DEFAULT");

console.log($store.defaultState === "DEFAULT"); // true
```

* **Возвращаемое значение**

Значение состояния по умолчанию.

### Вспомогательные методы

#### `.getState()`

Метод, который возвращает текущее состояние стора.

> WARNING Осторожно!: 
>
> `getState()` не рекомендуется использовать в бизнес-логике - лучше передавать данные через `sample`.

* **Примеры**

```ts
import { createEvent, createStore } from "effector";

const add = createEvent<number>();

const $number = createStore(0).on(add, (state, data) => state + data);

add(2);
add(3);

console.log($number.getState());
```

Попробовать

* **Возвращаемое значение**

Текущее состояние стора.

### Связанные API

* createStore - Создает новый стор
* combine - Комбинирует несколько сторов и возращает новый производный стор
* sample - Ключевой оператор для построения связей между юнитами
* createEvent - Создает события
* createEffect - Создает эффекты


# allSettled

## Методы

### `allSettled(unit, {scope, params?})`

Вызывает предоставленный юнит в переданном скоупе и ожидает завершения всех запущенных юнитов.

#### Формула

```ts
allSettled<T>(unit: Event<T>, {scope: Scope, params?: T}): Promise<void>
allSettled<T>(unit: Effect<T, Done, Fail>, {scope: Scope, params?: T}): Promise<
  | {status: 'done'; value: Done}
  | {status: 'fail'; value: Fail}
>
allSettled<T>(unit: Store<T>, {scope: Scope, params?: T}): Promise<void>
```

#### Аргументы

1. `unit`:  или , который нужно вызвать.
2. `scope`:  — скоуп.
3. `params`: параметры, передаваемые в `unit`.

> INFO Обратите внимание: 
>
> Возвращаемое значение для эффекта поддерживается с версии [effector 21.4.0](https://changelog.effector.dev/#effector-21-4-0).

#### Примеры

```ts
const scope = fork();
const event = createEvent<number>();

event.watch(console.log);

await allSettled(event, { scope, params: 123 }); // в консоль выведется 123
```

```ts
const scopeA = fork();
const scopeB = fork();

const $store = createStore(0);
const inc = createEvent<number>();

await allSettled($store, { scope: scopeA, params: 5 });
await allSettled($store, { scope: scopeB, params: -5 });

$store.watch(console.log);

await allSettled(inc, { scope: scopeA, params: 2 }); // в консоль выведется 7
await allSettled(inc, { scope: scopeB, params: 2 }); // в консоль выведется -3
```

### `allSettled(scope)`

Проверяет предоставленный скоуп на наличие текущих вычислений и ожидает их завершения.

#### Формула

```ts
allSettled<T>(scope): Promise<void>
```

#### Аргументы

1. `scope`:  — скоуп.

> INFO Начиная с: 
>
> effector 22.5.0.

#### Примеры

##### Использование в тестах

Тесты, которые проверяют интеграцию с внешним реактивным API.

```ts
import {createEvent, sample, fork, scopeBind, allSettled} from 'effector'

test('интеграция с externalSource', async () => {
  const scope = fork()

  const updated = createEvent()

  sample({
    clock: updated,
    target: someOtherLogicStart,
  })

  // 1. Подписываем событие на внешний источник
  const externalUpdated = scopeBind(updated, {scope})
  externalSource.listen(() => externalUpdates())

  // 2. Запускаем обновление внешнего источника
  externalSource.trigger()

  // 3. Ожидаем завершения всех запущенных вычислений в области видимости effector, даже если они были запущены не самим effector
  await allSettled(scope)

  // 4. Проверяем что-либо как обычно
  expect(...).toBe(...)
})
```


# attach API

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

[effectApi]: /ru/api/effector/Effect

[storeApi]: /ru/api/effector/Store

## `attach` API

```ts
import { attach } from "effector";
```

Метод `attach` позволяет создавать новые [эффекты][effectApi] на основе существующих c возможностью доступа к данным из [стора][storeApi]. Этот метод позволяет переиспользовать логику эффектов с разными параметрами и автоматически передавать данные из сторов.

> INFO Свойства прикрепленных эффектов: 
>
> Прикрепленный эффект является таким же полноценным эффектом, который имеет собственные свойства `.done`, `.fail`, и др. Они срабатывают только при вызовах прикрепленного эффекта, а не оригинального.
>
> ```ts
> const originalFx = createEffect(async (x: number) => x * 2);
> const attachedFx = attach({ effect: originalFx });
>
> originalFx.done.watch(() => console.log("original done"));
> attachedFx.done.watch(() => console.log("attached done"));
>
> await attachedFx(5);
> // original done
> // attached done
>
> await originalFx(5);
> // original done
> // (attached done не сработает)
> ```

### Алгоритм работы

1. Вы вызываете эффект, который вернул `attach`, передав свои параметры.
2. Если указан `source`, тогда Effector берёт текущее значение из этого стора.
3. Если указан `mapParams`, вызывается эта функция с вашими параметрами и (если есть) данными из `source`.
4. Результат функции `mapParams` передаётся в оригинальный эффект `effect`.
5. Возвращается результат выполнения оригинального эффекта.

### Виды конфигураций `attach`

| <div style="width:220px">Форма</div>                                               | Описание                                                                                                                                    |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| attach({ effect })                                     | Создает локальную копию эффекта с тем же поведением.                                                                                        |
| attach({ source, effect })                      | Создает эффект, который автоматически передает данные из `source` в оригинальный эффект при вызове.                                         |
| attach({ mapParams, effect })                | Создает эффект с преобразованием входных параметров через функцию `mapParams` перед передачей в оригинальный эффект.                        |
| attach({ source, mapParams, effect }) | Создает эффект, который комбинирует данные из `source` с входными параметрами через `mapParams` и передает результат в оригинальный эффект. |

### Конфигурации

#### `attach({ effect })`

Создает новый прикрепленный [эффект][effectApi], который будет вызывать `effect` с переданными параметрами как есть. Это позволяет создавать отдельные эффекты с общим поведением.

* **Формула**

```ts
const attachedFx = attach({
  effect, // оригинальный эффект чье поведение копируем
  name? // имя нового эффекта
});
```

* **Тип**

```ts
export function attach<FX extends Effect<any, any, any>>(config: {
  effect: FX;
  name?: string;
}): Effect<EffectParams<FX>, EffectResult<FX>, EffectError<FX>>;
```

* **Примеры**

Это позволяет создать *локальную* копию эффекта, чтобы реагировать только на вызовы из текущего *локального* кода.

```ts
// Общий эффект для всего приложения
const sendAnalyticsFx = createEffect(async (event: { name: string; data: any }) => {
  console.log("Analytics:", event.name);
});

// В модуле авторизации - локальная копия
const trackAuthFx = attach({
  effect: sendAnalyticsFx,
  name: "trackAuthFx",
});

// Обрабатываем только события из модуля авторизации
trackAuthFx.done.watch(() => {
  console.log("Auth event tracked");
});

// В модуле корзины - другая локальная копия
const trackCartFx = attach({
  effect: sendAnalyticsFx,
  name: "trackCartFx",
});

// Обрабатываем только события из модуля корзины
trackCartFx.done.watch(() => {
  console.log("Cart event tracked");
});

trackAuthFx({ name: "login", data: {} });
// Analytics: login
// Auth event tracked

trackCartFx({ name: "add_to_cart", data: {} });
// Analytics: add_to_cart
// Cart event tracked
```

Запустить пример.

#### `attach({ source, effect })`

Создает новый прикрепленный [эффект][effectApi], который при вызове будет запускать оригинальный эффект `effect` или обработчик с данными из `source`.

* **Формула**

```ts
const attachedFx = attach({
  source, // источник данных передаваемый в эффект
  effect, // оригинальный эффект чье поведение копируем
  name? // имя нового эффекта
  domain? //домен, в случае если effect это обработчик
});
```

* **Тип**

```ts
export function attach<
  States extends StoreShape,
  FX extends
    | Effect<GetShapeValue<States>, any, any>
    | ((state: GetShapeValue<States>, ...params: any[]) => any),
>(config: {
  source: States;
  effect: FX;
  name?: string;
  domain?: Domain;
}): Effect<void, EffectResult<FX>, EffectError<FX>>;
```

* **Особенности**

  * Аргумент `effect` может быть как [эффектом][effectApi], так и обычным обработчиком.
  * Аргумент `source` не является реактивным - изменения сторов не вызывают автоматический запуск эффекта.
  * `source` может быть стором, объектом сторов или массивом сторов.
  * Параметр `domain` может быть передан только в случае, если `effect` является обработчиком.<br /><br />

* **Примеры**

<Tabs>
<TabItem label="Один стор" >
Простое использование с одним стором и обработчиком:<br/><br/>

```ts
// Эффект для загрузки данных
const loadDataFx = createEffect(async (id: number) => {
  return fetch(`/api/data/${id}`).then((res) => res.json());
});

// Стор с текущим id
const $currentId = createStore(1);

// Эффект с привязкой стора
const loadCurrentDataFx = attach({
  source: $currentId,
  effect: async (id: number) => {
    const res = await fetch(`/api/data/${id}`);
    return await res.json();
  },
});
```

</TabItem>
<TabItem label="source как объект" >
Аргумент `source` как объект:<br/><br/>

```ts
import { createEffect, createStore, attach } from "effector";

const requestPageFx = createEffect<{ page: number; size: number }, number>(
  async ({ page, size }) => {
    console.log("Запрошено", page);
    return page * size;
  },
);

const $page = createStore(1);
const $size = createStore(20);

const requestNextPageFx = attach({
  source: { page: $page, size: $size },
  effect: requestPageFx,
});

$page.on(requestNextPageFx.done, (page) => page + 1);

requestPageFx.doneData.watch((position) => console.log("requestPageFx.doneData", position));

await requestNextPageFx();
// => Запрошено 1
// => requestPageFx.doneData 20
```

</TabItem>
<TabItem label="source как массив" >
Использование с массивом сторов:<br/><br/>

```ts
const $lat = createStore(55.7558);
const $lon = createStore(37.6173);

// Эффект получения погоды
const fetchWeatherFx = createEffect(([lat, lon]: [number, number]) =>
  fetch(`/api/weather?lat=${lat}&lon=${lon}`).then((res) => res.json()),
);

// Объединение массива сторов
const loadWeatherFx = attach({
  source: combine([$lat, $lon]),
  effect: fetchWeatherFx,
});
```

</TabItem>

</Tabs>

* **Возвращаемое значение**

Возвращает новый [эффект][effectApi].

#### `attach({ mapParams, effect })`

Создает новый прикрепленный [эффект][effectApi], который при вызове будет запускать оригинальный эффект `effect`, преобразуя параметры с помощью функции `mapParams`.

* **Формула**

```ts
const attachedFx = attach({
  effect, // оригинальный эффект чье поведение копируем
  mapParams, // функция для преобразования данных
  name? // имя нового эффекта
});
```

* **Тип**

```ts
export function attach<Params, FX extends Effect<any, any, any>>(config: {
  effect: FX;
  mapParams: (params: Params) => EffectParams<FX>;
  name?: string;
}): Effect<Params, EffectResult<FX>, EffectError<FX>>;
```

* **Особенности**

  * Если `mapParams` завершится с ошибкой, тогда прикрепленный эффект сразу завершит свое выполнение, а оригинальный эффект не вызовется.
  * `mapParams` должна возвращать тот же тип, который принимает `originalFx` в качестве параметров. В случае ошибки вам нужно самому проконтролировать совместимость типов ошибок с эффектом, TypeScript здесь не поможет.

  ```ts
  const attachedFx: Effect<void, Done, Fail> = attach({
  effect: originalFx,
  mapParams: (): A {
    throw new AnyNonFailType(); // Это может быть несовместимо с типом `Fail`.
  },
  });
  ```

* **Примеры**

С помощью `mapParams` можно преобразовать аргументы:

```ts
import { createEffect, attach } from "effector";

const originalFx = createEffect((a: { input: number }) => a);

const attachedFx = attach({
  effect: originalFx,
  mapParams(a: number) {
    return { input: a * 100 };
  },
});

originalFx.watch((params) => console.log("originalFx started", params));

attachedFx(1);
// => originalFx { input: 100 }
```

Запустить пример

А также обрабатывать исключения:

```ts
import { createEffect, attach } from "effector";

const originalFx = createEffect((a: { a: number }) => a);

const attachedFx = attach({
  effect: originalFx,
  mapParams(a: number) {
    throw new Error("custom error");
    return { a };
  },
});

attachedFx.failData.watch((error) => console.log("attachedFx.failData", error));

attachedFx(1);
// => attachedFx.failData
// =>   Error: custom error
```

Запустить пример

* **Возвращаемое значение**

Возвращает новый [эффект][effectApi].

#### `attach({ source, mapParams, effect })`

Создает новый прикрепленный [эффект][effectApi], который будет читать значения из `source` стора, передавать их с параметрами в функцию `mapParams`, а затем вызывать `effect` с результатом.

* **Формула**

```ts
const attachedFx = attach({
  source, // источник данных передаваемый в эффект
  mapParams, // функция для преобразования данных
  effect, // оригинальный эффект чье поведение копируем
  name? // имя нового эффекта
});
```

* **Тип**

```ts
export function attach<
  States extends StoreShape,
  FX extends Effect<any, any, any>,
  FN extends (params: any, source: GetShapeValue<States>) => EffectParams<FX>,
>(config: {
  source: States;
  effect: FX;
  mapParams: FN;
  name?: string;
}): Effect<Parameters<FN>[0], EffectResult<FX>, EffectError<FX>>;
```

* **Особенности**

  * Если `mapParams` завершится с ошибкой, тогда прикрепленный эффект сразу завершит свое выполнение, а оригинальный эффект не вызовется.
  * Функция `mapParams` должна возвращать тот же тип, который принимает эффект в аргументе `effect` в качестве параметров. В случае ошибки вам нужно самому проконтролировать совместимость типов ошибок с эффектом, TypeScript здесь не поможет.
  * Аргумент `source` не является реактивным - изменения сторов не вызывают автоматический запуск эффекта.
  * `source` может быть стором, объектом сторов или массивом сторов.

* **Примеры**

```ts
import { createStore, createEvent, createEffect, attach, sample } from "effector";

const $credentials = createStore({ username: "", password: "" });
const $authToken = createStore("");

const apiFx = createEffect(async ({ url, data, token }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(data),
  });
  return response.json();
});

const loginFx = attach({
  source: { creds: $credentials, token: $authToken },
  mapParams: (_, { creds, token }) => ({
    url: "/api/login",
    data: creds,
    token,
  }),
  effect: apiFx,
});
```

* **Возвращаемое значение**

Возвращает новый [эффект][effectApi].

### Связанные API и статьи

* **API**
  * Effect API - Описание эффектов, его методов и свойств
  * createEffect - Создание нового эффекта
  * sample - Ключевой оператор для построения связей между юнитами
  * Store API - Описание сторов, его методов и свойств
* **Статьи**
  * Работа с эффектами
  * Типизация&#x20;


# Babel плагин

Встроенный плагин для Babel может использоваться для SSR и отладки. Он добавляет имя юнита,
выведенное из имени переменной, и `sid` (Стабильный Идентификатор), вычисленный из местоположения в исходном коде.

Например, в случае эффектов без обработчиков, это улучшает сообщения об ошибках,
показывая, в каком именно эффекте произошла ошибка.

```js
import { createEffect } from "effector";

const fetchFx = createEffect();

fetchFx();

// => no handler used in fetchFx
```

Запустить пример

## Использование

В простейшем случае его можно использовать без какой-либо конфигурации:

```json
// .babelrc
{
  "plugins": ["effector/babel-plugin"]
}
```

## SID

> INFO Начиная с: 
>
> [effector 20.2.0](https://changelog.effector.dev/#effector-20-2-0)

Стабильный хэш-идентификатор для событий, эффектов, сторов и доменов, сохраняемый между окружениями, для обработки взаимодействия клиент-сервер
в рамках одной кодовой базы.

Ключевое значение sid заключается в том, что он может быть автоматически сгенерирован `effector/babel-plugin` с конфигурацией по умолчанию, и он будет стабильным между сборками.

> TIP Подробное объяснение: 
>
> Если вам нужно подробное объяснение о том, зачем нужны SID и как они используются внутри, вы можете найти его, перейдя по этой ссылке

Смотрите [пример проекта](https://github.com/effector/effector/tree/master/examples/worker-rpc)

```js
// common.js
import { createEffect } from "effector";

export const getUser = createEffect({ sid: "GET /user" });
console.log(getUsers.sid);
// => GET /user
```

```js
// worker.js
import { getUsers } from "./common.js";

getUsers.use((userID) => fetch(userID));

getUsers.done.watch(({ result }) => {
  postMessage({ sid: getUsers.sid, result });
});

onmessage = async ({ data }) => {
  if (data.sid !== getUsers.sid) return;
  getUsers(data.userID);
};
```

```js
// client.js
import { createEvent } from "effector";
import { getUsers } from "./common.js";

const onMessage = createEvent();

const worker = new Worker("worker.js");
worker.onmessage = onMessage;

getUsers.use(
  (userID) =>
    new Promise((rs) => {
      worker.postMessage({ sid: getUsers.sid, userID });
      const unwatch = onMessage.watch(({ data }) => {
        if (data.sid !== getUsers.sid) return;
        unwatch();
        rs(data.result);
      });
    }),
);
```

## Конфигурация

### `hmr`

> INFO Начиная с: 
>
> [effector 23.4.0](https://changelog.effector.dev/#effector-23.4.0)

Включите поддержку Hot Module Replacement (HMR) для очистки связей, подписок и побочных эффектов, управляемых Effector. Это предотвращает двойное срабатывание эффектов и подписок

> WARNING Взаимодействие с фабриками: 
>
> Поддержка HMR показывает наилучшие результаты когда все фабрики в проекте правильно описаны, это помогает плагину и рантайму понимать, какой код нужно удалять при обновлении

#### Формула

```json
"effector/babel-plugin",
  {
    "hmr": "es"
  }
]
```

* Тип: `boolean` | `"es"` | `"cjs"`
  * `true`: Использует API HMR с автоопределением необходимого варианта работы. Работает на базе функциональности бабеля [supportsStaticESM](https://babeljs.io/docs/options#caller), которая широко поддерживается в сборщиках
  * `"es"`: Использует API HMR `import.meta.hot` в сборщиках, соответствующих ESM, таких как Vite и Rollup
  * `"cjs"`: Использует API HMR `module.hot` в сборщиках, использующих CommonJS модули, таких как Webpack, Next.js и React Native
  * `false`: Отключает Hot Module Replacement.
* По умолчанию: `false`

> INFO Сборка для продакшна: 
>
> При сборке для продакшена убедитесь, что задали опции `hmr` значение `false` или удалили опцию полностью, чтобы уменьшить размер бандла и улучшить производительность в runtime.

### `importName`

Указание имени или имен импорта для обработки плагином. Импорт должен использоваться в коде как указано.

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "importName": ["effector"]
  }
]
```

* Тип: `string | string[]`
* По умолчанию: `['effector', 'effector/compat']`

### `factories`

Принимает массив имен модулей, экспорты которых рассматриваются как пользовательские фабрики, поэтому каждый вызов функции предоставляет уникальный префикс для sids юнитов внутри них. Используется для
SSR (серверный рендеринг) и не требуется для клиентских приложений.

> INFO с: 
>
> [effector 21.6.0](https://changelog.effector.dev/#effector-21-6-0)

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "factories": ["path/here"]
  }
]
```

* Тип: `string[]`
* Фабрики могут иметь любое количество аргументов.
* Фабрики могут создавать любое количество юнитов.
* Фабрики могут вызывать любые методы effector.
* Фабрики могут вызывать другие фабрики из других модулей.
* Модули с фабриками могут экспортировать любое количество функций.
* Фабрики должны быть скомпилированы с `effector/babel-plugin`, как и код, который их использует.

#### Примеры

```json
// .babelrc
{
  "plugins": [
    [
      "effector/babel-plugin",
      {
        "factories": ["src/createEffectStatus", "~/createCommonPending"]
      }
    ]
  ]
}
```

```js
// ./src/createEffectStatus.js
import { rootDomain } from "./rootDomain";

export function createEffectStatus(fx) {
  const $status = rootDomain.createStore("init").on(fx.finally, (_, { status }) => status);

  return $status;
}
```

```js
// ./src/statuses.js
import { createEffectStatus } from "./createEffectStatus";
import { fetchUserFx, fetchFriendsFx } from "./api";

export const $fetchUserStatus = createEffectStatus(fetchUserFx);
export const $fetchFriendsStatus = createEffectStatus(fetchFriendsFx);
```

Импорт `createEffectStatus` из `'./createEffectStatus'` рассматривался как фабричная функция, поэтому каждый стор, созданный ею,
имеет свой собственный sid и будет обрабатываться serialize
независимо, хотя без `factories` они будут использовать один и тот же `sid`.

### `reactSsr`

Заменяет импорты из `effector-react` на `effector-react/scope`. Полезно для сборки как серверных, так и клиентских
сборок из одной кодовой базы.

> WARNING Устарело: 
>
> С [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0) команда разработчиков рекомендует удалить эту опцию из конфигурации `babel-plugin`, потому что effector-react поддерживает SSR по умолчанию.

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "reactSsr": false
  }
]
```

* Тип: `boolean`
* По умолчанию: `false`

### `addNames`

Добавляет имя к вызовам фабрик юнитов. Полезно для минификации и обфускации production сборок.

> INFO Начиная с: 
>
> [effector 21.8.0](https://changelog.effector.dev/#effector-21-8-0)

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "addNames": true
  }
]
```

* Тип: `boolean`
* По умолчанию: `true`

### `addLoc`

Добавляет местоположение к вызовам методов. Используется devtools, например [effector-logger](https://github.com/effector/logger).

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "addLoc": false
  }
]
```

* Тип: `boolean`
* По умолчанию: `false`

### `debugSids`

Добавляет путь к файлу и имя переменной определения юнита к sid. Полезно для отладки SSR.

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "debugSids": false
  }
]
```

* Тип: `boolean`
* По умолчанию: `false`

### `noDefaults`

Опция для `effector/babel-plugin` для создания пользовательских фабрик юнитов с чистой конфигурацией.

> INFO с: 
>
> [effector 20.2.0](https://changelog.effector.dev/#effector-20-2-0)

#### Формула

```json
[
  "effector/babel-plugin",
  {
    "noDefaults": false
  }
]
```

* Тип: `boolean`
* По умолчанию: `false`

#### Примеры

```json
// .babelrc
{
  "plugins": [
    ["effector/babel-plugin", { "addLoc": true }],
    [
      "effector/babel-plugin",
      {
        "importName": "@lib/createInputField",
        "storeCreators": ["createInputField"],
        "noDefaults": true
      },
      "createInputField"
    ]
  ]
}
```

```js
// @lib/createInputField.js
import { createStore } from "effector";
import { resetForm } from "./form";

export function createInputField(defaultState, { sid, name }) {
  return createStore(defaultState, { sid, name }).reset(resetForm);
}
```

```js
// src/state.js
import { createInputField } from "@lib/createInputField";

const foo = createInputField("-");
/*

будет обработано как создатель стор и скомпилировано в

const foo = createInputField('-', {
  name: 'foo',
  sid: 'z&si65'
})

*/
```

## Использование со сборщиками

### Vite + React (SSR)

Для использования с `effector/babel-plugin`, необходимо выполнить следующие шаги:

1. Установите пакет `@vitejs/plugin-react`.
2. `vite.config.js` должен выглядеть следующим образом:

> Примечание: `effector/babel-plugin` не является отдельным пакетом, он входит в состав `effector`

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["effector/babel-plugin"],
        // Использовать .babelrc файлы
        babelrc: true,
        // Использовать babel.config.js файлы
        configFile: true,
      },
    }),
  ],
});
```


# clearNode

Низкоуровневый метод для уничтожения юнитов и их связей

## `clearNode` API

### Формула

```ts
clearNode(unit: Unit): void
clearNode(unit: Unit, config: {deep?: boolean}): void
```

#### Аргументы

1. **`unit`**: Любой юнит включая домены и scope. Переданный юнит будет уничтожен и удалён из памяти
2. **`config?`**: Объект конфигурации

   * **`deep?`**: *boolean*

     Глубокое удаление. Уничтожает юнит и *все* его производные

#### Возвращает

*void*

### Примеры

#### Пример удаления стора

```js
import { createStore, createEvent, clearNode } from "effector";

const inc = createEvent();
const store = createStore(0).on(inc, (x) => x + 1);
inc.watch(() => console.log("inc called"));
store.watch((x) => console.log("store state: ", x));
// => store state: 0
inc();
// => inc called
// => store state: 1
clearNode(store);
inc();
// => inc called
```

Запустить пример

#### Пример с deep

```js
import { createStore, createEvent, clearNode } from "effector";

const inc = createEvent();
const trigger = inc.prepend(() => {});
const store = createStore(0).on(inc, (x) => x + 1);
trigger.watch(() => console.log("trigger called"));
inc.watch(() => console.log("inc called"));
store.watch((x) => console.log("store state: ", x));
// => store state: 0
trigger();
// => trigger called
// => inc called
// => store state: 1
clearNode(trigger, { deep: true });
trigger();
// no reaction
inc();
// no reaction!
// all units, which depend on trigger, are erased
// including inc and store, because it depends on inc
```

Запустить пример


# combine API

[storeApi]: /ru/api/effector/Store

## `combine` API

```ts
import { combine } from "effector";
```

Метод `combine` позволяет получить состояние из каждого переданного [стора][storeApi] и комбинировать их в одно значение, сохраняя его в новом производном сторе. Полученный стор будет обновляться каждый раз, когда обновляется любой из переданных сторов.

### Алгоритм

1. `combine` читает текущее состояние из всех переданных сторов.
2. Если предоставлена функция трансформации `fn`, она вызывается со значениями из сторов.
3. Результат сохраняется в новом производном сторе.
4. Производный стор обновляется при каждом изменении любого из исходных сторов.

### Особенности

* **Батчинг обновлений**: Когда несколько сторов обновляются одновременно (за один тик), `combine` обрабатывает их все сразу, что приводит к единственному обновлению производного стора.
* **Смешивание сторов с примитивами**: В `combine` можно передавать не только сторы, но и примитивы и объекты. Effector не будет отслеживать мутации этих примитивов и объектов - они рассматриваются как статические значения.
* **Чистые функции трансформации**: Все функции трансформации, передаваемые в `combine`, должны быть чистыми.
* **Проверка строгого равенства**: Если функция трансформации возвращает то же значение, что и предыдущее (сравнение через `!==`), производный стор не обновится.
* **Обработка ошибок**: Если функция трансформации выбрасывает ошибку во время выполнения, приложение завершится сбоем. Это будет исправлено в [effector v24](https://github.com/effector/effector/issues/1163).

### Формы конфигурации

| <div style="width:280px">Форма</div>                        | Описание                                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| combine($a, fn)              | Трансформирует значение одного стора через `fn`.                             |
| combine(...$stores, fn?)    | Комбинирует несколько сторов/значений, опционально трансформируя через `fn`. |
| combine({ a: $a, b: $b }, fn?) | Комбинирует сторы в объект-стор, опционально трансформируя через `fn`.       |
| combine(\[$a, $b], fn?)          | Комбинирует сторы в массив-стор, опционально трансформируя через `fn`.       |

### Конфигурации

#### `combine($store, fn)`

Создает новый производный стор путем трансформации значения одного стора. Это **предпочтительный метод** для создания производных сторов с одним источником. Является альтернативным способом для Store.map().

* **Формула**

```ts
const $result = combine($source, (value) => {
  // логика трансформации
  return result;
});
```

* **Тип**

```ts
export function combine<A, R>(
  a: Store<A>,
  fn: (a: A) => R,
  config?: {
    skipVoid?: boolean;
  },
): Store<R>;
```

* **Особенности**

  * Функция трансформации `fn` должна быть чистой.
  * Если `fn` возвращает то же значение, что и предыдущее (сравнение через `!==`), стор не обновится.
  * Если `fn` выбрасывает ошибку во время выполнения, приложение завершится сбоем (это будет исправлено в [effector v24](https://github.com/effector/effector/issues/1163)).
  * Опциональный параметр `config`: см. конфигурацию  для деталей о `skipVoid`.

* **Примеры**

```ts
import { createStore, combine } from "effector";

const $name = createStore("John");
const $greeting = combine($name, (name) => `Hello, ${name}!`);

$greeting.watch((greeting) => console.log(greeting));
// => Hello, John!
```

```ts
import { createStore, combine } from "effector";

const $price = createStore(100);
const $priceWithTax = combine($price, (price) => price * 1.2);

$priceWithTax.watch((price) => console.log("Price with tax:", price));
// => Price with tax: 120
```

* **Возвращает**

Новый производный стор.

***

#### `combine(...$stores, fn?)`

Создает новый производный стор, который комбинирует любое количество сторов и значений. Принимает любое количество аргументов - сторы, примитивы или объекты. Последний аргумент может опционально быть функцией трансформации.

Без `fn` оборачивает все значения в массив. С `fn` трансформирует значения с помощью функции, где сторы передаются как отдельные аргументы.

* **Формула**

```ts
// без функции трансформации
const $result = combine($a);
const $result = combine($a, $b, $c);

// с функцией трансформации
const $result = combine($a, (value) => {
  // логика трансформации
  return result;
});

const $result = combine($a, $b, $c, (a, b, c) => {
  // логика трансформации
  return result;
});
```

* **Тип**

```ts
export function combine<T extends any[]>(
  ...stores: T
): Store<{ [K in keyof T]: T[K] extends Store<infer U> ? U : T[K] }>;

export function combine<T extends any[], R extends any>(
  ...stores: T,
  fn: (...stores: [K in keyof T]: T[K] extends Store<infer U> ? U : T[K]) => R,
  config?: { skipVoid?: boolean },
): Store<R>;

// также поддерживает любое количество сторов с опциональной fn в качестве последнего аргумента
```

* **Особенности**

  * Принимает любое количество сторов, примитивов или объектов в качестве аргументов.
  * Можно смешивать сторы со значениями как примитивы или объекты.
  * Без `fn` возвращает массив-стор со значениями в том же порядке, что и аргументы.
  * Когда предоставлена `fn`:
    * Функция трансформации `fn` должна быть чистой.
    * Если `fn` возвращает то же значение, что и предыдущее (сравнение через `!==`), стор не обновится.
    * Если `fn` выбрасывает ошибку во время выполнения, приложение завершится сбоем (это будет исправлено в [effector v24](https://github.com/effector/effector/issues/1163)).
    * Опциональный параметр `config`: см. конфигурацию  для деталей о `skipVoid`.

* **Примеры**

Без функции трансформации - создает массив-стор:

```ts
import { createStore, combine } from "effector";

const $firstName = createStore("John");
const $lastName = createStore("Doe");
const $age = createStore(30);

const $userData = combine($firstName, $lastName, $age);

$userData.watch((data) => console.log(data));
// => ["John", "Doe", 30]
```

С функцией трансформации - трансформирует комбинированные значения:

```ts
import { createStore, combine } from "effector";

const $firstName = createStore("John");
const $lastName = createStore("Doe");

const $fullName = combine($firstName, $lastName, (first, last) => {
  return `${first} ${last}`;
});

$fullName.watch((name) => console.log(name));
// => "John Doe"
```

Комбинирование нескольких сторов с трансформацией:

```ts
import { createStore, combine } from "effector";

const $price = createStore(100);
const $quantity = createStore(2);
const $discount = createStore(0.1);

const $total = combine($price, $quantity, $discount, (price, qty, disc) => {
  const subtotal = price * qty;
  return subtotal - subtotal * disc;
});

$total.watch((total) => console.log(`Total: $${total}`));
// => Total: $180
```

Смешивание сторов с примитивами:

```ts
import { createStore, combine } from "effector";

const $userName = createStore("Alice");
const API_URL = "https://api.example.com";

const $userEndpoint = combine($userName, API_URL, (name, url) => {
  return `${url}/users/${name}`;
});

$userEndpoint.watch((endpoint) => console.log(endpoint));
// => https://api.example.com/users/Alice
```

* **Возвращает**

Новый производный стор.

***

#### `combine({ a: $a, b: $b }, fn?)`

Создает новый производный стор, который комбинирует объект сторов. Без `fn` создает объект-стор со значениями из переданных сторов. С `fn` трансформирует комбинированные значения с помощью функции.

* **Формула**

```ts
// без функции трансформации
const $result = combine({
  a: $a,
  b: $b,
  // ... больше сторов
});

// с функцией трансформации
const $result = combine({ a: $a, b: $b, c: $c }, ({ a, b, c }) => {
  // логика трансформации
  return result;
});
```

* **Тип**

```ts
export function combine<State, R>(
  shape: State,
  fn?: (shape: { [K in keyof State]: State[K] extends Store<infer U> ? U : State[K] }) => R,
  config?: {
    skipVoid?: boolean;
  },
): Store<R>;
```

* **Особенности**

  * Обновления батчатся, когда несколько сторов изменяются одновременно.
  * Можно смешивать сторы со значениями как примитивы или объекты.
  * если предоставлена `fn`:
    * Функция трансформации `fn` должна быть чистой.
    * Если `fn` возвращает то же значение, что и предыдущее (сравнение через `!==`), стор не обновится.
    * Если `fn` выбрасывает ошибку во время выполнения, приложение завершится сбоем (это будет исправлено в [effector v24](https://github.com/effector/effector/issues/1163)).
    * Опциональный параметр `config`: см. конфигурацию  для деталей о `skipVoid`.

* **Примеры**

Без функции трансформации - создает объект-стор:

```ts
import { createStore, combine } from "effector";

const $firstName = createStore("John");
const $lastName = createStore("Doe");
const $age = createStore(30);

const $user = combine({
  firstName: $firstName,
  lastName: $lastName,
  age: $age,
});

$user.watch((user) => console.log(user));
// => { firstName: "John", lastName: "Doe", age: 30 }
```

С функцией трансформации - трансформирует значения объекта:

```ts
import { createStore, combine } from "effector";

const $firstName = createStore("John");
const $lastName = createStore("Doe");
const $age = createStore(30);

const $userSummary = combine(
  { firstName: $firstName, lastName: $lastName, age: $age },
  ({ firstName, lastName, age }) => {
    return `${firstName} ${lastName}, ${age} years old`;
  },
);

$userSummary.watch((summary) => console.log(summary));
// => "John Doe, 30 years old"
```

Практический пример - валидация формы:

```ts
import { createStore, combine } from "effector";

const $email = createStore("");
const $password = createStore("");
const $confirmPassword = createStore("");

const $formValidation = combine(
  { email: $email, password: $password, confirmPassword: $confirmPassword },
  ({ email, password, confirmPassword }) => {
    const errors = [];

    if (!email.includes("@")) {
      errors.push("Invalid email");
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords don't match");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
);
```

Смешивание сторов с примитивами и объектами:

```ts
import { createStore, combine } from "effector";

const $userId = createStore(123);
const $isActive = createStore(true);

const $userData = combine({
  id: $userId,
  isActive: $isActive,
  role: "user",
  permissions: ["read", "write"],
});

$userData.watch((data) => console.log(data));
// => { id: 123, isActive: true, role: "user", permissions: ["read", "write"] }
```

* **Возвращает**

Новый производный стор.

***

#### `combine([$a, $b], fn?)`

Создает новый производный стор, который комбинирует массив сторов. Без `fn` создает массив-стор со значениями из переданных сторов в том же порядке. С `fn` трансформирует комбинированные значения с помощью функции.

* **Формула**

```ts
// без функции трансформации
const $result = combine([$a, $b, $c]);

// с функцией трансформации
const $result = combine([$a, $b, $c], ([a, b, c]) => {
  // логика трансформации
  return result;
});
```

* **Тип**

```ts
export function combine<State extends any[]>(
  tuple: State,
): Store<{ [K in keyof State]: State[K] extends Store<infer U> ? U : State[K] }>;

export function combine<State extends any[], R>(
  tuple: State,
  fn: (tuple: { [K in keyof State]: State[K] extends Store<infer U> ? U : State[K] }) => R,
  config?: { skipVoid?: boolean },
): Store<R>;
```

* **Особенности**

  * Порядок массива совпадает с порядком переданных сторов.
  * Обновления батчатся, когда несколько сторов изменяются одновременно.
  * Можно смешивать сторы с не-сторовыми значениями, такими как примитивы или объекты.
  * Когда предоставлена `fn`:
    * Функция трансформации `fn` должна быть чистой.
    * Функция получает массив, в котором порядок совпадает с порядком входного массива.
    * Если `fn` возвращает то же значение, что и предыдущее (сравнение через `!==`), стор не обновится.
    * Если `fn` выбрасывает ошибку во время выполнения, приложение завершится сбоем (это будет исправлено в [effector v24](https://github.com/effector/effector/issues/1163)).
    * Опциональный параметр `config`: см. конфигурацию  для деталей о `skipVoid`.

* **Примеры**

Без функции трансформации - создает массив-стор:

```ts
import { createStore, combine } from "effector";

const $x = createStore(10);
const $y = createStore(20);
const $z = createStore(30);

const $coordinates = combine([$x, $y, $z]);

$coordinates.watch((coords) => console.log(coords));
// => [10, 20, 30]
```

С функцией трансформации - трансформирует значения массива:

```ts
import { createStore, combine } from "effector";

const $x = createStore(3);
const $y = createStore(4);

const $distance = combine([$x, $y], ([x, y]) => {
  return Math.sqrt(x * x + y * y);
});

$distance.watch((dist) => console.log(`Distance: ${dist}`));
// => Distance: 5
```

Практический пример - вычисление итогов из массива:

```ts
import { createStore, combine } from "effector";

const $itemPrice1 = createStore(10);
const $itemPrice2 = createStore(25);
const $itemPrice3 = createStore(15);

const $cartTotal = combine([$itemPrice1, $itemPrice2, $itemPrice3], (prices) => {
  return prices.reduce((sum, price) => sum + price, 0);
});

$cartTotal.watch((total) => console.log(`Total: $${total}`));
// => Total: $50
```

Массив с разными типами:

```ts
import { createStore, combine } from "effector";

const $userName = createStore("Alice");
const $score = createStore(100);
const $isActive = createStore(true);

const $playerInfo = combine([$userName, $score, $isActive], ([name, score, active]) => {
  return `Player ${name}: ${score} points (${active ? "online" : "offline"})`;
});

$playerInfo.watch((info) => console.log(info));
// => Player Alice: 100 points (online)
```

Смешивание сторов с примитивами в массиве:

```ts
import { createStore, combine } from "effector";

const $currentPage = createStore(1);
const MAX_PAGES = 10;

const $pagination = combine([$currentPage, MAX_PAGES], ([current, max]) => {
  return {
    current,
    max,
    hasNext: current < max,
    hasPrev: current > 1,
  };
});

$pagination.watch((pagination) => console.log(pagination));
// => { current: 1, max: 10, hasNext: true, hasPrev: false }
```

* **Возвращает**

Новый производный стор.

### Связанное API и статьи

* **API**
  * Store API - Описание сторов, их методов и свойств
  * createStore - Создание нового стора
  * sample - Ключевой оператор для построения связей между юнитами
  * createEvent - Создание события
* **Статьи**
  * Управление состояниями в effector и как использовать производные сторы


# createApi

Способ массового создания событий-команд для обновления стора на основе объекта с функциями-обработчиками. Если стор принадлежит какому-либо домену, то новые события также будут принадлежать ему

## Методы

### Формула

```ts
declare const $store: Store<T>; // управляемый стор

const api: {
  event1: Event<S>; // созданное событие-команда
  event2: Event<Q>; // созданное событие-команда
} = createApi(
  /*store*/ $store,
  /*handlers*/ {
    event1: /*handler*/ (state: T, data: S) => T,
    event2: /*handler*/ (state: T, data: Q) => T,
  },
);
```

#### Аргументы

1. **`store`**: Стор, чьим значением требуется управлять
2. **`handlers`**: Объект с функциями-обработчиками, на каждую функцию будет создано по событию

   **`handler`**: `(state: T, data: S) => T`

   Функция-обработчик, которая будет вычислять новое состояние `стора` на основе его предыдущего состояния и данных, отправленных в полученное событие-команду, должна быть&#x20;

   **Аргументы**

   * **`state`**: Текущее состояние стора
   * **`data`**: Значение, с которым было вызвано событие

   **Возвращает**

   Новое значение для хранения в `сторе`. Если функция возвращает undefined или текущее состояние стора, то обновления не будет

#### Возвращает

Объект с событиями, по событию на каждый переданный обработчик

### Примеры

#### Управление позицией игрока

```js
import { createStore, createApi } from "effector";

const playerPosition = createStore(0);

const api = createApi(playerPosition, {
  moveLeft: (pos, n) => pos - n,
  moveRight: (pos, n) => pos + n,
});

playerPosition.watch((pos) => {
  console.log("position", pos);
});
// => position 0

api.moveRight(10);
// => position 10

api.moveLeft(5);
// => position 5
```

Запустить пример


# createDomain

Метод для создания доменов

## Методы

```typescript
createDomain(name?)
```

**Аргументы**

1. `name`? (*string*): имя домена

**Возвращает**

: Новый домен

#### Пример

```js
import { createDomain } from "effector";

const domain = createDomain(); // безымянный домен
const httpDomain = createDomain("http"); // именованный домен

const statusCodeChanged = httpDomain.createEvent();
const downloadFx = httpDomain.createEffect();
const apiDomain = httpDomain.createDomain(); // вложенный домен
const $data = httpDomain.createStore({ status: -1 });
```

Запустить пример


# createEffect

## createEffect

```ts
import { createEffect } from "effector";

const effectFx = createEffect();
```

Метод для создания эффектов. Возвращает новый эффект.

### Способы создания эффектов

Метод `createEffect` поддерживает несколько способов создания эффектов:

1. С обработчиком - это самый простой способ.
2. С конфигурацией.
3. А также без обработчика, его можно будет задать позже с помощью метода .use(handler).

#### С обработчиком

* **Тип**

```ts
createEffect<Params, Done, Fail = Error>(
  handler: (params: Params) => Done | Promise<Done>,
): Effect<Params, Done, Fail>
```

* **Пример**

```ts
import { createEffect } from "effector";

const fetchUserReposFx = createEffect(async ({ name }) => {
  const url = `https://api.github.com/users/${name}/repos`;
  const req = await fetch(url);
  return req.json();
});

fetchUserReposFx.done.watch(({ params, result }) => {
  console.log(result);
});

await fetchUserReposFx({ name: "zerobias" });
```

#### С конфигурацией

Поле `name` используется для улучшения сообщений об ошибках и отладки.

* **Тип**

```ts
export function createEffect<Params, Done, Fail = Error>(config: {
  name?: string;
  handler?: (params: Params) => Promise<Done> | Done;
}): Effect<Params, Done, Fail>;
```

* **Пример**

```ts
import { createEffect } from "effector";

const fetchUserReposFx = createEffect({
  name: "fetch user repositories",
  async handler({ name }) {
    const url = `https://api.github.com/users/${name}/repos`;
    const req = await fetch(url);
    return req.json();
  },
});

await fetchUserReposFx({ name: "zerobias" });
```

#### Без обработчика

Чаще всего используется для тестов. Более подробная информация.

> WARNING use - это антипаттерн: 
>
> Старайтесь не использовать `.use()`, так как это является антипаттерном и ухудшает вывод типов.

* **Пример**

```ts
import { createEffect } from "effector";

const fetchUserReposFx = createEffect();

fetchUserReposFx.use(async ({ name }) => {
  const url = `https://api.github.com/users/${name}/repos`;
  const req = await fetch(url);
  return req.json();
});

await fetchUserReposFx({ name: "zerobias" });
```

### Примеры

* **Изменение состояния по завершению эффекта**:

```ts
import { createStore, createEffect } from "effector";

interface Repo {
  // ...
}

const $repos = createStore<Repo[]>([]);

const fetchUserReposFx = createEffect(async (name: string) => {
  const url = `https://api.github.com/users/${name}/repos`;
  const req = await fetch(url);
  return req.json();
});

$repos.on(fetchUserReposFx.doneData, (_, repos) => repos);

$repos.watch((repos) => {
  console.log(`${repos.length} repos`);
});
// => 0 репозиториев

await fetchUserReposFx("zerobias");
// => 26 репозиториев
```

Запустить пример

* **Наблюдение за состоянием эффекта**:

```js
import { createEffect } from "effector";

const fetchUserReposFx = createEffect(async ({ name }) => {
  const url = `https://api.github.com/users/${name}/repos`;
  const req = await fetch(url);
  return req.json();
});

fetchUserReposFx.pending.watch((pending) => {
  console.log(`effect is pending?: ${pending ? "yes" : "no"}`);
});

fetchUserReposFx.done.watch(({ params, result }) => {
  console.log(params); // {name: 'zerobias'}
  console.log(result); // разрешенное значение, результат
});

fetchUserReposFx.fail.watch(({ params, error }) => {
  console.error(params); // {name: 'zerobias'}
  console.error(error); //  отклоненное значение, ошибка
});

fetchUserReposFx.finally.watch(({ params, status, result, error }) => {
  console.log(params); // {name: 'zerobias'}
  console.log(`handler status: ${status}`);

  if (error) {
    console.log("handler rejected", error);
  } else {
    console.log("handler resolved", result);
  }
});

await fetchUserReposFx({ name: "zerobias" });
```

Запустить пример

### Основные ошибки

Ниже приведен список возможных ошибок, с которыми вы можете столкнуться при работе с эффектами:

* no handler used in \[effect name]

### Связанные API и статьи

* **API**
  * Effect API - Описание эффектов, его методов и свойств
  * sample - Ключевой оператор для построения связей между юнитами
  * attach - Создает новые эффекты на основе других эффектов
* **Статьи**
  * Работа с эффектами
  * Как типизировать эффекты и не только
  * Гайд по тестированию эффектов и других юнитов


# createEvent

## createEvent

```ts
import { createEvent } from "effector";

const event = createEvent();
```

Метод для создания [событий][eventApi].

### Формула

```ts
createEvent<E = void>(eventName?: string): EventCallable<E>
createEvent<E = void>(config: {
  name?: string
  sid?: string
  domain?: Domain
}): EventCallable<E>
```

* **Аргументы**

  * `eventName`: Опциональный аргумент. Имя события для отладки.
  * `config`: Опциональный аргумент. Объект конфигурации.

    * `name`: Имя события.
    * `sid`: Стабильный идентификатор для SSR.
    * `domain`: Домен для события.

* **Возвращаемое значение**

Возвращает новое вызываемое [событие][eventTypes].

### Примеры

Обновление состояния с помощью вызова события:

```js
import { createStore, createEvent } from "effector";

const addNumber = createEvent();

const $counter = createStore(0);

$counter.on(addNumber, (state, number) => state + number);

$counter.watch((state) => {
  console.log("state", state);
});
// => 0

addNumber(10);
// => 10

addNumber(10);
// => 20

addNumber(10);
// => 30
```

Запустить пример

Мы создали событие `addNumber` и стор `$counter`, после чего подписались на обновления стора.<br/>
Обратите внимание на вызов функции `addNumber(10)`. Всякий раз, когда вы будете вызывать `addNumber(10)`, вы можете посмотреть в консоль и увидеть, как меняется состояние.

Обработка данных с помощью производных событий:

```js
import { createEvent } from "effector";

const extractPartOfArray = createEvent();
const array = extractPartOfArray.map((arr) => arr.slice(2));

array.watch((part) => {
  console.log(part);
});
extractPartOfArray([1, 2, 3, 4, 5, 6]);
// => [3, 4, 5, 6]
```

Запустить пример

### Основные ошибки

Ниже приведён список возможных ошибок, с которыми вы можете столкнуться при работе с событиями:

* call of derived event is not supported, use createEvent instead
* unit call from pure function is not supported, use operators like sample instead

### Связанные API и статьи

* **API**
  * [`Event API`][eventApi] - API стора, его методы, свойства и описание
  * [`createApi`][createApi] - Создание набора событий для стора
  * [`merge`][merge] - Метод для объединения массива юнитов в одно новое событие
  * [`sample`][sample] - Связывание событий с другими юнитами
* **Статьи**
  * [Как работать с событиями][eventGuide]
  * [Как мыслить в effector и почему события важны][mindset]
  * [Гайд по типизации событий и других юнитов][typescript]

[eventApi]: /ru/api/effector/Event

[eventTypes]: /ru/api/effector/Event#event-types

[merge]: /ru/api/effector/merge

[eventGuide]: /ru/essentials/events

[mindset]: /ru/resources/mindset

[mindset]: /ru/resources/mindset

[typescript]: /ru/essentials/typescript

[sample]: /ru/api/effector/sample

[createApi]: /ru/api/effector/createApi


# createStore

## createStore

```ts
import { createStore } from "effector";

const $store = createStore();
```

Метод для создания [стора][storeApi].

### Формула

```ts
createStore(
  defaultState: State, // Исходное состояние стора
  config?: { // Объект конфигурации с дополнительными опциями
    skipVoid?: boolean; // Контролирует обновления со значением undefined
    name?: string; // Имя стора для отладки
    sid?: string // Стабильный идентификатор для SSR
    updateFilter?: (update: State, current: State) => boolean // Функция фильтрации обновлений
    serialize?: // Конфигурация сериализации для SSR
    | 'ignore'
    | {
        write: (state: State) => SerializedState
        read: (json: SerializedState) => State
      }
    domain?: Domain; // Домен, к которому принадлежит стор
  },
): StoreWritable<State>
```

* **Аргументы**

1. **`defaultState`**: Исходное состояние
2. **`config`**: Опциональный объект конфигурации

   * **`skipVoid`**: Опциональный аргумент. Определяет пропускает ли [стор][storeApi] `undefined` значения. По умолчанию `true`. В случае если передать в стор, у которого `skipVoid:true`, значение `undefined`, тогда вы получите [ошибку в консоль][storeUndefinedError].<br/><br/>

   * **`name`**: Опциональный аргумент. Имя стора. [Babel-plugin][babel] может определить его из имени переменной стора, если имя не передано явно в конфигурации.<br/><br/>

   * **`sid`**: Опциональный аргумент. Уникальный идентификатор стора. [Он используется для различения сторов между разными окружениями][storeSid]. При использовании [Babel-plugin][babel] проставляется автоматически.<br/><br/>

   * **`updateFilter`**:
     Опциональный аргумент. [Чистая функция][pureFn], которая предотвращает обновление стора, если она возвращает `false`. Следует использовать для случаев, когда стандартного запрета на обновление (если значение, которое предполагается записать в стор, равняется `undefined` или текущему значению стора) недостаточно. Если вызывать юниты внутри, то можно столкнуться с [ошибкой][unitCallError].

     <br/>

   * **`serialize`**: Опциональный аргумент отвечающий за сериализацию стора.

     * `'ignore'`: исключает стор из сериализации при вызовах [serialize][serialize].
     * Объект с методами `write` и `read` для кастомной сериализации. `write` вызывается при вызове serialize и приводит состояние стор к JSON-значению – примитив или простой объект/массив. `read` вызывается при fork, если предоставленные `values` – результат вызова [serialize][serialize].

* **Возвращаемое значение**

Возвращает новый [стор][storeApi].

### Примеры

Базовое использование стора:

```js
import { createEvent, createStore } from "effector";

const addTodo = createEvent();
const clearTodos = createEvent();

const $todos = createStore([])
  .on(addTodo, (todos, newTodo) => [...todos, newTodo])
  .reset(clearTodos);

const $selectedTodos = $todos.map((todos) => {
  return todos.filter((todo) => !!todo.selected);
});

$todos.watch((todos) => {
  console.log("todos", todos);
});
```

Запустить пример

Пример с кастомной конфигурацией `serialize`:

```ts
import { createEvent, createStore, serialize, fork, allSettled } from "effector";

const saveDate = createEvent();
const $date = createStore<null | Date>(null, {
  // Объект Date автоматически приводится в строку ISO-даты при вызове JSON.stringify
  // но не приводится обратно к Date при вызове JSON.parse – результатом будет та же строка ISO-даты
  // Это приведет к расхождению состояния стора при гидрации состояния на клиенте при серверном рендеринге
  //
  // Кастомная конфигурация `serialize` решает эту проблему
  serialize: {
    write: (dateOrNull) => (dateOrNull ? dateOrNull.toISOString() : dateOrNull),
    read: (isoStringOrNull) => (isoStringOrNull ? new Date(isoStringOrNull) : isoStringOrNull),
  },
}).on(saveDate, (_, p) => p);

const serverScope = fork();

await allSettled(saveDate, { scope: serverScope, params: new Date() });

const serverValues = serialize(serverScope);
// `serialize.write` стор `$date` был вызван

console.log(serverValues);
// => { nq1e2rb: "2022-11-05T15:38:53.108Z" }
// Объект Date из стора сохранен как ISO-дата

const clientScope = fork({ values: serverValues });
// `serialize.read` стор `$date` был вызван

const currentDate = clientScope.getState($date);
console.log(currentDate);
// => Date 11/5/2022, 10:40:13 PM
// Строка ISO-даты приведена обратно к объекту Date
```

Запустить пример

### Типичные ошибки

Ниже приведен список возможных ошибок, с которыми вы можете столкнуться при работе со сторами:

* [`store: undefined is used to skip updates. To allow undefined as a value provide explicit { skipVoid: false } option`][storeUndefinedError].
* [`serialize: One or more stores dont have sids, their values are omitted`][serializeError].
* [`unit call from pure function is not supported, use operators like sample instead`][unitCallError].

### Связанные API и статьи

* **API**
  * [`Store API`][storeApi] - API стора, его методы, свойства и описание
  * [`createApi`][createApi] - Создание набора событий для стора
  * [`combine`][combine] - Создание нового стора на основе других сторов
  * [`sample`][sample] - Связывание сторов с другими юнитами
* **Статьи**
  * [Как управлять состоянием][storeGuide]
  * [Гайд по работе с SSR][ssr]
  * [Что такое SID и зачем они нужны сторам][storeSid]
  * [Как типизировать сторы и другие юниты][typescript]

[storeApi]: /ru/api/effector/Store

[storeUndefinedError]: /ru/guides/troubleshooting#store-undefined

[storeSid]: /ru/explanation/sids

[ssr]: /ru/guides/server-side-rendering

[storeGuide]: /ru/essentials/manage-states

[combine]: /ru/api/effector/combine

[sample]: /ru/api/effector/sample

[createApi]: /ru/api/effector/createApi

[serialize]: /ru/api/effector/serialize

[typescript]: /ru/essentials/typescript

[babel]: /ru/api/effector/babel-plugin

[pureFn]: /ru/explanation/glossary/#purity

[unitCallError]: /ru/guides/troubleshooting#unit-call-from-pure-not-supported

[serializeError]: /ru/guides/troubleshooting/#store-without-sid


# createWatch

Создает подписку на юнит (store, ивент или эффект).

## Методы

```ts
createWatch<T>(config: {
  unit: Unit<T>
  fn: (payload: T) => void
  scope?: Scope
}): Subscription
```

**Аргументы**

1. `config` (*Object*): Конфигурация
   * `unit` (*Unit*): Целевой юнит (store, ивент или эффект), за которым нужно наблюдать
   * `fn` (*Function*): Функция, которая будет вызываться при каждом обновлении юнита. Первым аргументом получает содержимое обновления.
   * `scope` (): Опциональный скоуп. Если передан, то функция будет вызываться только при обновлении юнита именно на этом скоупе.

**Возвращает**

: Функция отмены подписки

##### Пример (со скоупом)

```js
import { createWatch, createEvent, fork, allSettled } from "effector";

const changeName = createEvent();

const scope = fork();

const unwatch = createWatch({ unit: changeName, scope, fn: console.log });

await allSettled(changeName, { scope, params: "Иван" }); // output: Иван
changeName("Иван"); // no output
```

##### Пример (без скоупа)

```js
import { createWatch, createEvent, fork, allSettled } from "effector";

const changeName = createEvent();

const scope = fork();

const unwatch = createWatch({ unit: changeName, fn: console.log });

await allSettled(changeName, { scope, params: "Иван" }); // output: Иван
changeName("Иван"); // output: Иван
```


# debug traces

## Debug Trace import

```ts
import "effector/enable_debug_traces";
```

A special import that enables detailed traces for difficult-to-debug errors, such as a Store missing a proper SID during Scope serialization.

> WARNING Performance cost: 
>
> Debug traces work by capturing additional information when Stores and Events are created.
> This introduces a performance overhead during module initialization.
>
> We do not recommend using this API in production environments.

To enable debug traces, add `import "effector/enable_debug_traces"` to the entrypoint of your bundle, like this:

```ts
// src/index.ts
import "effector/enable_debug_traces";

// ...rest of your code
```

### When to use it

If you encounter an error that can be diagnosed with this API, you will see a recommendation in the console: `Add "import 'effector/enable_debug_traces'" to your code entry module to see full stack traces`.

Don't forget to remove this import once the issue has been resolved.


# fork API

[scopeApi]: /ru/api/effector/Scope

[domainApi]: /ru/api/effector/Domain

[serializeApi]: /ru/api/effector/serialize

[allSettledApi]: /ru/api/effector/allSettled

[hydrateApi]: /ru/api/effector/hydrate

[sampleApi]: /ru/api/effector/sample

[storeApi]: /ru/api/effector/Store

[effectApi]: /ru/api/effector/Effect

## `fork` API

```ts
import { fork, type Scope } from "effector";
```

Метод `fork` создает изолированный [скоуп][scopeApi] приложения. Он нужен для SSR, тестирования и локальной изоляции состояния — вы запускаете вычисления в копии без влияния на глобальные юниты.

### Алгоритм работы

1. Вы вызываете `fork`, получая новый [скоуп][scopeApi].
2. Если переданы `values` или `handlers`, они применяются при создании этого [скоупа][scopeApi].
3. Юниты, вызванные с этим [скоупом][scopeApi], работают с изолированными значениями и обработчиками.
4. Состояние читается через `scope.getState(store)` или сериализуется через [`serialize`][serializeApi].

### Виды конфигураций `fork`

| <div style="width:220px">Форма</div>                    | Описание                                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| fork()                               | Создает новый чистый [скоуп][scopeApi] без предзаполненных данных и переопределений обработчиков.                           |
| fork({ values?, handlers? }) | Создает [скоуп][scopeApi] с начальными значениями сторов и пользовательскими обработчиками эффектов.                        |
| fork(domain, options?)        | Устаревшая форма, требующая `domain`. Используйте `fork({ values?, handlers? })`, если нет зависимости от старой сигнатуры. |

### Конфигурации

#### `fork()`

Создает новый прикладной [скоуп][scopeApi] без дополнительных настроек.

* **Формула**

```ts
fork(): Scope
```

* **Тип**

```ts
type SerializedState = Record<string, unknown>;
type StorePair<T = unknown> = [StoreWritable<T>, T];

export function fork(config?: {
  values?: StorePair<any>[] | SerializedState;
  handlers?: Array<[Effect<any, any, any>, Function]>;
}): Scope;
```

* **Особенности**

  * Возвращает новый [скоуп][scopeApi] без предзаполненных сторов и без замены обработчиков.
  * Подходит, когда данные и побочные эффекты должны остаться неизменными (например, первый рендер на сервере).

* **Примеры**

```ts
import { createStore, createEvent, fork, allSettled } from "effector";

const inc = createEvent();
const dec = createEvent();
const $counter = createStore(0);

$counter.on(inc, (value) => value + 1);
$counter.on(dec, (value) => value - 1);

const scopeA = fork();
const scopeB = fork();

await allSettled(inc, { scope: scopeA });
await allSettled(dec, { scope: scopeB });

console.log($counter.getState()); // => 0
console.log(scopeA.getState($counter)); // => 1
console.log(scopeB.getState($counter)); // => -1
```

* **Возвращаемое значение**

Новый [скоуп][scopeApi].

#### `fork({ values?, handlers? })`

Позволяет задать начальные значения для сторов и переопределить обработчики эффектов внутри [скоупа][scopeApi].

* **Формула**

```ts
fork({
  values?,      // например [[$store, value], ...] или сериализованный объект
  handlers?,    // например [[effect, handler], ...]
}): Scope
```

* **Тип**

```ts
type SerializedState = Record<string, unknown>;
type StorePair<T = unknown> = [StoreWritable<T>, T];

export function fork(config?: {
  values?: StorePair<any>[] | SerializedState;
  handlers?: Array<[Effect<any, any, any>, Function]>;
}): Scope;
```

* **Особенности**

  * `values` может быть массивом кортежей `[$store, value]` или объектом сериализованного состояния (обычно результат [`serialize`][serializeApi]); предпочтителен массив кортежей.
  * `handlers` принимает только массив кортежей, замены работают только в пределах созданного [скоупа][scopeApi].
  * Значения и обработчики применяются один раз при создании [скоупа][scopeApi] и не обновляются автоматически.

* **Примеры**

Задание начального состояния и подмена обработчика в тесте:

```ts
import { createEffect, createStore, fork, allSettled } from "effector";

const fetchFriendsFx = createEffect<{ limit: number }, string[]>(async ({ limit }) => {
  return [];
});
const $user = createStore("guest");
const $friends = createStore<string[]>([]);

$friends.on(fetchFriendsFx.doneData, (_, result) => result);

const testScope = fork({
  values: [[$user, "alice"]],
  handlers: [[fetchFriendsFx, () => ["bob", "carol"]]],
});

await allSettled(fetchFriendsFx, {
  scope: testScope,
  params: { limit: 10 },
});

console.log(testScope.getState($friends));
// => ['bob', 'carol']
```

Создание [скоупа][scopeApi] с сериализованным состоянием:

```ts
import { fork } from "effector";

const serialized = {
  userSid: "alice",
  ageSid: 21,
};

const scope = fork({ values: serialized });
```

* **Возвращаемое значение**

Новый [скоуп][scopeApi] с примененными `values` и `handlers`.

#### `fork(domain, options?)`

Устаревшая форма, требующая [domain][domainApi]; актуальна только для совместимости со старым кодом.

> ERROR Устарело: 
>
> Используйте `fork({ values?, handlers? })`, так как `fork` отслеживает юниты автоматически без передачи `domain`.

* **Формула**

```ts
fork(domain, {
  values?,      // например [[$store, value], ...] или сериализованный объект
  handlers?,    // например [[effect, handler], ...]
}): Scope
```

* **Тип**

```ts
type SerializedState = Record<string, unknown>;

export function fork(
  domain: Domain,
  config?: {
    values?: SerializedState | Array<[StoreWritable<any>, any]>;
    handlers?: Array<[Effect<any, any, any>, Function]>;
  },
): Scope;
```

* **Особенности**

  * Передача `domain` нужна только в проектах, где код еще зависит от старой сигнатуры.
  * Допустимые форматы `values` и `handlers` совпадают с конфигурацией без `domain`.

* **Пример**

```ts
import { createDomain, createStore, fork } from "effector";

const app = createDomain();
const $flag = app.createStore(false);

const scope = fork(app, {
  values: [[$flag, true]],
});

console.log(scope.getState($flag)); // => true
```

* **Возвращаемое значение**

Новый [скоуп][scopeApi], привязанный к указанному [domain][domainApi].

### Связанные API и статьи

* **API**
  * Scope — структура изолированного состояния
  * allSettled — выполнение эффекта внутри [скоупа][scopeApi] с ожиданием завершения
  * serialize — сериализация состояния [скоупа][scopeApi]
  * hydrate — восстановление состояния в [скоупе][scopeApi]
* **Статьи**
  * SSR и работа со скоупом
  * Тестирование с isolated скоупом
  * Работа со скоупом и потеря контекста


# forward

> ERROR Устаревшее АПИ: 
>
> Начиная с версии [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0).
>
> Используйте sample вместо `forward`.

Метод для создания связи между юнитами в декларативной форме. Отправляет обновления из одного набора юнитов в другой

## Методы

### Формула

```ts
declare const a: Event<T>
declare const fxA: Effect<T, any>
declare const $a: Store<T>

declare const b: Event<T>
declare const fxB: Effect<T, any>
declare const $b: Store<T>

forward({from: a, to: b})
forward({
  from: fxA,
  to:   [b, fxB, $b]
})
forward({
  from: [a, fxA, $a],
  to:   fxB
})
forward({
  from: [a, fxA, $a],
  to:   [b, fxB, $b]
})
-> Subscription
```

```

    from -> to

```

#### Аргументы

1. **`config`**: Объект конфигурации

   * **`from`**: Юнит или массив юнитов

     **Разновидности**:

     * **событие или эффект**: срабатывание этого события/эффекта будет запускать юниты `to`
     * **стор**: обновление этого стора будет запускать юниты `to`
     * **массив юнитов**: срабатывание любого из юнитов будет запускать юниты `to`

   * **`to`**: Юнит или массив юнитов

     **Разновидности**:

     * **событие или эффект**: при срабатывании `from` будет вызван данный юнит
     * **стор**: при срабатывании `from` состояние юнита будет обновлено
     * **массив юнитов**: при срабатывании `from` будут запущены все юниты

#### Возвращает

Subscription: Функция отмены подписки, после её вызова реактивная связь между `from` и `to` разрушается

> INFO: 
>
> Массивы юнитов поддерживаются с [effector 20.6.0](https://changelog.effector.dev/#effector-20-6-0)

Для наилучшей типизации при использовании массивов юнитов, типы значений должны совпадать либо быть явно приведены к общему базису

### Примеры

#### Сохранение в сторе данных из события

```js
import { createStore, createEvent, forward } from "effector";

const $store = createStore(1);
const event = createEvent();

forward({
  from: event,
  to: $store,
});

$store.watch((state) => console.log("store changed: ", state));
// => store changed: 1

event(200);
// => store changed: 200
```

Запустить пример

#### Создание связи между массивами юнитов

```js
import { createEvent, forward } from "effector";

const firstSource = createEvent();
const secondSource = createEvent();

const firstTarget = createEvent();
const secondTarget = createEvent();

forward({
  from: [firstSource, secondSource],
  to: [firstTarget, secondTarget],
});

firstTarget.watch((e) => console.log("first target", e));
secondTarget.watch((e) => console.log("second target", e));

firstSource("A");
// => first target A
// => second target A
secondSource("B");
// => first target B
// => second target B
```

Запустить пример


# fromObservable

Создаёт событие, которое будет срабатывать при каждом обновлении переданного observable. Применяется для реализации взаимодействия с библиотеками на основе стримов, например `rxjs` и `most`

Для обратного действия подписки стримов на юниты эффектора можно воспользоваться методами вроде `from` из `rxjs`: юниты эффектора распознаются как сущности, на которые можно подписаться

## Методы

### Формула

```ts
function fromObservable(stream: Observable<T>): Event<T>;
```

#### Аргументы

1. **`observable`**: Observable

#### Возвращает

Новое событие

### Пример

```js
import { interval } from "rxjs";
import { fromObservable } from "effector";

//emit value in sequence every 1 second
const source = interval(1000);

const event = fromObservable(source);

//output: 0,1,2,3,4,5....
event.watch(console.log);
```


# guard

> INFO: 
>
> C effector 22.2.0 предпочтительнее использовать sample

> INFO: 
>
> Добавлен в effector 20.4.0

Метод для запуска юнитов по условию, условием может быть функция-предикат или отдельный стор. Позволяет описывать бизнес-правила независимо от других сущностей.
Типичный вариант использования – когда необходимо запускать события лишь когда в определённом сторе значение равно `true`. Тем самым обеспечивается управление потоками данных без их смешивания

### Формула

```ts
guard({clock?, source?, filter, target?}): target
```

> INFO: 
>
> `clock` или `source` обязателен

При срабатывании `clock`, после проверки `filter` на [истинность](https://developer.mozilla.org/ru/docs/Glossary/Truthy), вызывается `target` с данными из `source`

* Если `clock` не передан, `guard` будет срабатывать при каждом обновлении `source`
* Если `source` не передан, `target` будет вызван с данными из `clock`
* Если `target` не передан, будет создано новое событие и возвращено в качестве результата
* Если `filter` это стор, то его значение будет проверено на [истинность](https://developer.mozilla.org/ru/docs/Glossary/Truthy)
* Если `filter` это функция-предикат, то она будет вызвана с данными из `source` и `clock`, а результат проверен на [истинность](https://developer.mozilla.org/ru/docs/Glossary/Truthy)

> INFO: 
>
> `clock` добавлен в effector 21.8.0

### `guard({clock?, source?, filter, target?})`

Основная запись метода

**Аргументы**

`params` (*Object*): Объект конфигурации

* **`filter`**: Стор или функция-предикат

  **Разновидности**:

  * **стор**: `target` будет запущен только если в этом сторе [истинное значение](https://developer.mozilla.org/ru/docs/Glossary/Truthy)
  * **функция-предикат** `(source, clock) => boolean`: `target` будет запущен только если эта функция вернёт [истинное значение](https://developer.mozilla.org/ru/docs/Glossary/Truthy). Функция должна быть&#x20;

* **`clock?`**: Юнит или массив юнитов

  **Разновидности**:

  * **событие или эффект**: срабатывание этого события/эффекта, после проверки условия в `filter` будет запускать `target`
  * **стор**: обновление этого стора, после проверки условия в `filter` будет запускать `target`
  * **массив юнитов**: срабатывание любого из юнитов, после проверки условия в `filter` будет запускать `target`. Сокращение для вызова merge
  * **поле отсутствует**: `source` будет использоваться в качестве `clock`

* **`source?`**: Юнит или массив/объект со сторами

  **Разновидности**:

  * **событие или эффект**: при срабатывании `clock` будет взято последнее значение с которым запускался этот юнит (перед этим он должен будет запуститься хотя бы раз)
  * **стор**: при срабатывании `clock` будет взято текущее значение этого стора
  * **массив или объект со сторами**: при срабатывании `clock` будут взяты текущие значения из заданных сторов, объединенных в объект или массив. Сокращение для вызова combine
  * **поле отсутствует**: `clock` будет использоваться в качестве `source`

* **`target?`**: Юнит или массив юнитов

  **Разновидности**:

  * **событие или эффект**: при срабатывании `clock`, после проверки условия в `filter` будет вызван данный юнит
  * **стор**: при срабатывании `clock`, после проверки условия в `filter` состояние юнита будет обновлено
  * **массив юнитов**: при срабатывании `clock`, после проверки условия в `filter` будут запущены все юниты
  * **поле отсутствует**: новое событие будет создано и возвращено в результате вызова `guard`

**Возвращает**

, событие, которое будет срабатывать после проверки условия в `filter`

#### Пример со стором в `filter`

```js
import { createStore, createEffect, createEvent, guard } from "effector";

const clickRequest = createEvent();
const fetchRequest = createEffect((n) => new Promise((rs) => setTimeout(rs, 2500, n)));

const clicks = createStore(0).on(clickRequest, (x) => x + 1);
const requests = createStore(0).on(fetchRequest, (x) => x + 1);

const isIdle = fetchRequest.pending.map((pending) => !pending);

/*
1. при срабатывании clickRequest
2. если значение isIdle равно true
3. прочитать значение из clicks
4. и вызвать с ним эффект fetchRequest
*/
guard({
  clock: clickRequest /* 1 */,
  filter: isIdle /* 2 */,
  source: clicks /* 3 */,
  target: fetchRequest /* 4 */,
});
```

Пример rate limiting

#### Пример с функцией-предикатом в `filter`

```js
import { createEffect, createEvent, guard } from "effector";

const searchUser = createEffect();
const submitForm = createEvent();

guard({
  source: submitForm,
  filter: (user) => user.length > 0,
  target: searchUser,
});

submitForm(""); // ничего не произошло
submitForm("alice"); // ~> searchUser('alice')
```

Запустить пример

### `guard(source, {filter})`

Альтернативная запись метода

**Аргументы**

* **`source`**: Юнит
* **`filter`**: Стор или функция-предикат

  **Разновидности**:

  * **стор**: `target` будет запущен только если в этом сторе [истинное значение](https://developer.mozilla.org/ru/docs/Glossary/Truthy)
  * **функция-предикат** `(source) => boolean`: `target` будет запущен только если эта функция вернёт [истинное значение](https://developer.mozilla.org/ru/docs/Glossary/Truthy). Функция должна быть&#x20;

##### Пример со стором в `filter`

```js
import { createEvent, createStore, createApi, guard } from "effector";

const trigger = createEvent();
const $unlocked = createStore(true);
const { lock, unlock } = createApi($unlocked, {
  lock: () => false,
  unlock: () => true,
});

const target = guard(trigger, {
  filter: $unlocked,
});

target.watch(console.log);
trigger("A");
lock();
trigger("B"); // ничего не произошло
unlock();
trigger("C");
```

Запустить пример

##### Пример с функцией-предикатом в `filter`

```js
import { createEvent, guard } from "effector";

const source = createEvent();
const target = guard(source, {
  filter: (x) => x > 0,
});

target.watch(() => {
  console.log("target вызван");
});

source(0);
// ничего не произошло
source(1);
// target вызван
```

Запустить пример


# hydrate

```ts
import { hydrate } from "effector";
```

Сопутствующий метод для . Гидрирует предоставленные значения в соответствующие сторы в рамках предоставленного домена или скоупа. Основная цель — гидрация состояния приложения на стороне клиента после SSR (Server-Side Rendering).

## Методы

#### `hydrate(domainOrScope, { values })`

> WARNING Важно: 
>
> Необходимо убедиться, что стор создан заранее, иначе гидрация может завершиться неудачей. Это может произойти, если вы разделяете скрипты инициализации/гидрации сторов от их создания.

##### Формула

```ts
hydrate(domainOrScope: Domain | Scope, { values: Map<Store<any>, any> | {[sid: string]: any} }): void
```

##### Аргументы (methods-hydrate-domainOrScope-values-arguments)

1. **`domainOrScope`**: домен или область видимости, который будет заполнен предоставленными `values`.
2. **`values`**: отображение из sid (идентификаторов сторов) в значения сторов или `Map`, где ключи — это объекты сторов, а значения содержат начальное значение стора.

##### Возвращает

`void`

##### Примеры

Заполнение стора предопределенным значением:

```js
import { createStore, createDomain, fork, serialize, hydrate } from "effector";

const domain = createDomain();
const $store = domain.createStore(0);

hydrate(domain, {
  values: {
    [$store.sid]: 42,
  },
});

console.log($store.getState()); // 42
```

Запустить пример


# effector

## Effector API

Перечень методов API, по группам:

### Типы юнитов

* Event\<T>
* Effect\<Params, Done, Fail>
* Store\<T>
* Domain
* Scope

### Создание юнитов

* createEvent()
* createStore(default)
* createEffect(handler)
* createDomain()

### Основные методы библиотеки

* combine(...stores, f)
* attach({effect, mapParams?, source?})
* sample({clock, source, fn, target})
* merge(\[eventA, eventB])
* split(event, cases)
* createApi(store, api)

### Fork API

* fork()
* serialize(scope)
* allSettled(unit, { scope })
* scopeBind(event)
* hydrate(domain)

### Плагины для компилятора

* effector/babel-plugin
* @effector-swc-plugin

### Служебные функции

* is
* fromObservable(observable)

### Низкоуровневый API

* clearNode()
* withRegion()
* launch()
* inspect()

### Import Map

Пакет `effector` предоставляет несколько дополнительных модулей, которые могут быть полезны в различных сценариях:

* effector/compat
* effector/inspect
* effector/babel-plugin

### Устаревшие методы

* forward({from, to})
* guard({source, filter, target})


# inspect

```ts
import { inspect } from "effector/inspect";
```

Специальные методы API, предназначенные для обработки сценариев отладки и мониторинга, не предоставляя слишком много доступа к внутренностям вашего приложения.

Полезны для создания девтулз, мониторинга и наблюдения в production.

## Inspect API

Позволяет отслеживать любые вычисления, происходящие в ядре effector.

### `inspect()`

#### Пример

```ts
import { inspect, type Message } from "effector/inspect";

import { someEvent } from "./app-code";

function logInspectMessage(m: Message) {
  const { name, value, kind } = m;

  return console.log(`[${kind}] ${name} ${value}`);
}

inspect({
  fn: (m) => {
    logInspectMessage(m);
  },
});

someEvent(42);
// выведет что-то вроде
// [event] someEvent 42
// [on] 42
// [store] $count 1337
// ☝️ допустим, что редьюсер добавляет 1295 к предоставленному числу
//
// и так далее, любые триггеры
```

Scope ограничивает область, в которой можно отслеживать вычисления. Если scope не предоставлен — будут отслеживаться вычисления вне scope.

```ts
import { fork, allSettled } from "effector";
import { inspect, type Message } from "effector/inspect";

import { someEvent } from "./app-code";

function logInspectMessage(m: Message) {
  const { name, value, kind } = m;

  return console.log(`[${kind}] ${name} ${value}`);
}

const myScope = fork();

inspect({
  scope: myScope,
  fn: (m) => {
    logInspectMessage(m);
  },
});

someEvent(42);
// ☝️ Нет логов! Это потому, что отслеживание было ограничено myScope

allSettled(someEvent, { scope: myScope, params: 42 });
// [event] someEvent 42
// [on] 42
// [store] $count 1337
```

### Трассировка

Добавление настройки `trace: true` позволяет просматривать предыдущие вычисления, которые привели к текущему. Это полезно для отладки конкретной причины возникновения некоторых событий.

#### Пример

```ts
import { fork, allSettled } from "effector";
import { inspect, type Message } from "effector/inspect";

import { someEvent, $count } from "./app-code";

function logInspectMessage(m: Message) {
  const { name, value, kind } = m;

  return console.log(`[${kind}] ${name} ${value}`);
}

const myScope = fork();

inspect({
  scope: myScope,
  trace: true, // <- явная настройка
  fn: (m) => {
    if (m.kind === "store" && m.sid === $count.sid) {
      m.trace.forEach((tracedMessage) => {
        logInspectMessage(tracedMessage);
        // ☝️ здесь мы логируем трассировку обновления конкретного стора
      });
    }
  },
});

allSettled(someEvent, { scope: myScope, params: 42 });
// [on] 42
// [event] someEvent 42
// ☝️ трассировки предоставляются в обратном порядке, так как мы смотрим назад во времени
```

### Ошибки

Effector не допускает исключений в чистых функциях. В таком случае вычисление ветви останавливается, и исключение логируется. Также в таком случае есть специальный тип сообщения:

#### Пример

```ts
inspect({
  fn: (m) => {
    if (m.type === "error") {
      // сделать что-то с этим
      console.log(`${m.kind} ${m.name} computation has failed with ${m.error}`);
    }
  },
});
```

## Inspect Graph

Позволяет отслеживать объявления юнитов, фабрик и регионов.

### Пример

```ts
import { createStore } from "effector";
import { inspectGraph, type Declaration } from "effector/inspect";

function printDeclaration(d: Declaration) {
  console.log(`${d.kind} ${d.name}`);
}

inspectGraph({
  fn: (d) => {
    printDeclaration(d);
  },
});

const $count = createStore(0);
// выведет "store $count" в консоль
```

### `withRegion`

Метаданные, предоставленные через корневой узел региона, доступны при объявлении.

#### Пример

```ts
import { createNode, withRegion, createStore } from "effector";
import { inspectGraph, type Declaration } from "effector/inspect";

function createCustomSomething(config) {
  const $something = createStore(0);

  withRegion(createNode({ meta: { hello: "world" } }), () => {
    // какой-то код
  });

  return $something;
}
inspectGraph({
  fn: (d) => {
    if (d.type === "region") console.log(d.meta.hello);
  },
});

const $some = createCustomSomething({});
// выведет "world"
```


# is

Объект с валидаторами юнитов

## Методы

### `is.store(value)`

Проверяет, является ли переданное значение 

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();

is.store(store);
// => true

is.store(event);
// => false

is.store(fx);
// => false

is.store(createDomain());
// => false

is.store(fx.pending);
// => true

is.store(fx.done);
// => false

is.store(store.updates);
// => false

is.store(null);
// => false
```

Запустить пример

### `is.event(value)`

Проверяет, является ли переданное значение 

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();

is.event(store);
// => false

is.event(event);
// => true

is.event(fx);
// => false

is.event(createDomain());
// => false

is.event(fx.pending);
// => false

is.event(fx.done);
// => true

is.event(store.updates);
// => true

is.event(null);
// => false
```

Запустить пример

### `is.effect(value)`

Проверяет, является ли переданное значение 

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();

is.effect(store);
// => false

is.effect(event);
// => false

is.effect(fx);
// => true

is.effect(createDomain());
// => false

is.effect(null);
// => false
```

Запустить пример

### `is.domain(value)`

Проверяет, является ли переданное значение 

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();

is.domain(store);
// => false

is.domain(event);
// => false

is.domain(fx);
// => false

is.domain(createDomain());
// => true

is.domain(null);
// => false
```

Запустить пример

### `is.scope(value)`

> INFO: 
>
> Добавлен в effector 22.0.0

Проверяет, является ли переданное значение 

**Возвращает**

boolean

```js
import { fork } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();
const scope = fork();

is.scope(scope);
// => true

is.scope(store);
// => false

is.scope(event);
// => false

is.scope(fx);
// => false

is.scope(createDomain());
// => false

is.scope(null);
// => false
```

Запустить пример

### `is.unit(value)`

Проверяет, является ли переданное значение юнитом: стором, эвентом, эффектом, доменом или скоупом

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain, fork } from "effector";

const store = createStore(null);
const event = createEvent();
const fx = createEffect();
const scope = fork();

is.unit(scope);
// => true

is.unit(store);
// => true

is.unit(event);
// => true

is.unit(fx);
// => true

is.unit(createDomain());
// => true

is.unit(fx.pending);
// => true

is.unit(fx.done);
// => true

is.unit(store.updates);
// => true

is.unit(null);
// => false
```

Запустить пример

### `is.attached(value)`

> INFO: 
>
> Добавлен в effector 22.4.0

Проверяет, что переданный  был создан с помощью метода .
Если в качестве аргумента был передан не effect, возвращает `false`.

**Возвращает**

boolean

```js
import { is, createStore, createEvent, createEffect, createDomain, attach } from "effector";

const $store = createStore(null);
const event = createEvent();
const fx = createEffect();

const childFx = attach({
  effect: fx,
});

is.attached(childFx);
// => true

is.attached(fx);
// => false

is.attached($store);
// => false

is.attached(event);
// => false

is.attached(createDomain());
// => false

is.attached(null);
// => false
```

Запустить пример

#### Пример использования

Иногда нужно добавить отображение ошибок на эффекты, но только на те, которые были "локализованы" через `attach`.
Если оставить `onCreateEffect` как есть, без проверок, то лог ошибки будет задублирован.

```js
import { createDomain, attach, is } from "effector";

const logFailuresDomain = createDomain();

logFailuresDomain.onCreateEffect((effect) => {
  if (is.attached(effect)) {
    effect.fail.watch(({ params, error }) => {
      console.warn(`Effect "${effect.compositeName.fullName}" failed`, params, error);
    });
  }
});

const baseRequestFx = logFailuresDomain.createEffect((path) => {
  throw new Error(`path ${path}`);
});

const loadDataFx = attach({
  mapParams: () => "/data",
  effect: baseRequestFx,
});

const loadListFx = attach({
  mapParams: () => "/list",
  effect: baseRequestFx,
});

loadDataFx();
loadListFx();
```

Запустить пример


# launch

Низкоуровневый метод для запуска вычислений в юнитах. В основном используется разработчиками библиотек для тонкого контроля вычислений

> INFO: 
>
> Добавлен в effector 20.10.0

## Методы

### Формула

```ts
declare const $store: Store<T>
declare const event: Event<T>
declare const fx: Effect<T, any>

launch({target: $store, params: T}): void
launch({target: event, params: T}): void
launch({target: fx, params: T}): void
```


# merge

Объединяет апдейты массива юнитов в новое событие, которое будет срабатывать при запуске любой из переданных сущностей

> INFO: 
>
> Добавлено в effector 20.0.0

## Методы

### Формула

```ts
declare const $store: Store<T>; // триггер
declare const event: Event<T>; // триггер
declare const fx: Effect<T, any>; // триггер

const result: Event<T> = merge(/*clock*/ [$store, event, fx]);
```

#### Аргументы

* **`clock`**: Массив юнитов для объединения

#### Возвращает

: Новое событие

> TIP: 
>
> В случае передачи стора, итоговое событие будет срабатывать при обновлении этого стора

### Примеры

##### Пример 1

```js
import { createEvent, merge } from "effector";

const foo = createEvent();
const bar = createEvent();
const baz = merge([foo, bar]);
baz.watch((v) => console.log("merged event triggered: ", v));

foo(1);
// => merged event triggered: 1
bar(2);
// => merged event triggered: 2
```

Запустить пример

##### Пример 2

```js
import { createEvent, createStore, merge } from "effector";

const setFoo = createEvent();
const setBar = createEvent();

const $foo = createStore(0).on(setFoo, (_, v) => v);

const $bar = createStore(100).on(setBar, (_, v) => v);

const anyUpdated = merge([$foo, $bar]);
anyUpdated.watch((v) => console.log(`state changed to: ${v}`));

setFoo(1); // => state changed to: 1
setBar(123); // => state changed to: 123
```

Запустить пример

##### Пример 3

```js
import { createEvent, createStore, merge } from "effector";

const setFoo = createEvent();
const otherEvent = createEvent();

const $foo = createStore(0).on(setFoo, (_, v) => v);

const merged = merge([$foo, otherEvent]);

merged.watch((v) => console.log(`merged event payload: ${v}`));

setFoo(999);
// => merged event payload: 999

otherEvent("bar");
// => merged event payload: bar
```

Запустить пример


# effector/babel-plugin

Поскольку Effector позволяет автоматизировать множество стандартных задач (например, задавание стабильных идентификаторов и предоставление отладочной информации для юнитов), существует встроенный плагин для Babel, который улучшает опыт разработчика при использовании библиотеки.

## Использование

Пожалуйста, обратитесь к документации Babel plugin для примеров использования.


# effector/compat

```ts
import {} from "effector/compat";
```

Библиотека предоставляет отдельный модуль с поддержкой совместимости до IE11 и Chrome 47 (браузер для устройств Smart TV).

> WARNING Бандлер, а не транспилятор: 
>
> Поскольку сторонние библиотеки могут импортировать `effector` напрямую, вам **не следует** использовать транспиляторы, такие как Babel, для замены `effector` на `effector/compat` в вашем коде, так как по умолчанию Babel не преобразует сторонний код.
>
> **Используйте бандлер**, так как он заменит `effector` на `effector/compat` во всех модулях, включая модули из сторонних библиотек.

### Необходимые полифиллы

Вам нужно установить полифиллы для этих объектов:

* `Promise`
* `Object.assign`
* `Array.prototype.flat`
* `Map`
* `Set`

В большинстве случаев бандлер может автоматически добавить полифиллы.

#### Vite

<details>
<summary>Пример конфигурации Vite</summary>

```js
import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      polyfills: ["es.promise", "es.object.assign", "es.array.flat", "es.map", "es.set"],
    }),
  ],
});
```

</details>

## Использование

### Ручная замена

Вы можете использовать `effector/compat` вместо пакета `effector`, если вам нужно поддерживать старые браузеры.

```diff
- import {createStore} from 'effector'
+ import {createStore} from 'effector/compat'
```

### Автоматическая замена

Однако вы можете настроить ваш бандлер для автоматической замены `effector` на `effector/compat` в вашем коде.

#### Webpack

<details>
<summary>Пример конфигурации Webpack</summary>

```js
module.exports = {
  resolve: {
    alias: {
      effector: "effector/compat",
    },
  },
};
```

</details>

#### Vite

<details>
<summary>Пример конфигурации Vite</summary>

```js
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      effector: "effector/compat",
    },
  },
});
```

</details>


# effector/inspect

## `effector/inspect`

Effector предоставляет специальные методы API, предназначенные для обработки задач отладки и мониторинга, не предоставляя слишком много доступа к внутренней логике вашего приложения — Inspect API.

### Почему отдельный модуль?

Inspect API разработан как опциональный модуль. По задумке, любая функциональность, использующая Inspect API, может быть удалена из production-сборки без каких-либо побочных эффектов. Чтобы подчеркнуть это, Inspect API не включён в основной модуль. Вместо этого он доступен в отдельном модуле `effector/inspect`.

### Использование

Пожалуйста, обратитесь к документации Inspect API для примеров использования.


# restore

```ts
import { restore } from "effector";
```

## Методы

### `restore(event, defaultState)`

Создает  из . Работает как сокращение для `createStore(defaultState).on(event, (_, payload) => payload)`.

> WARNING Это не производный стор: 
>
> `restore` создает новый стор. Это не производный стор. Это означает, что вы можете изменять его состояние через события и использовать его как `target` в sample.

#### Формула

```ts
restore(event: Event<T>, defaultState: T): StoreWritable<T>
```

#### Аргументы

1. `event` 
2. `defaultState` (*Payload*)

#### Возвращает

: Новый стор.

#### Примеры

##### Базовый пример

```js
import { createEvent, restore } from "effector";

const event = createEvent();
const $store = restore(event, "default");

$store.watch((state) => console.log("state: ", state));
// state: default

event("foo");
// state: foo
```

Запустить пример

### `restore(effect, defaultState)`

Создает  из успешных результатов . Работает как сокращение для `createStore(defaultState).on(effect.done, (_, {result}) => result)`.

#### Формула

```ts
restore(effect: Effect<Params, Done, Fail>, defaultState: Done): StoreWritable<Done>
```

#### Аргументы

1. `effect` 
2. `defaultState` (*Done*)

#### Возвращает

: Новый стор.

#### Типы

Store будет иметь тот же тип, что и `Done` из `Effect<Params, Done, Fail>`. Также `defaultState` должен иметь тип `Done`.

#### Примеры

##### Эффект

```js
import { createEffect, restore } from "effector";

const fx = createEffect(() => "foo");
const $store = restore(fx, "default");

$store.watch((state) => console.log("state: ", state));
// => state: default

await fx();
// => state: foo
```

Запустить пример

### `restore(shape)`

Создает объект с сторами из объекта с значениями.

#### Формула

TBD

#### Аргументы

1. `shape` (*State*)

#### Возвращает

: Новый стор.

#### Примеры

##### Объект

```js
import { restore } from "effector";

const { foo: $foo, bar: $bar } = restore({
  foo: "foo",
  bar: 0,
});

$foo.watch((foo) => {
  console.log("foo", foo);
});
// => foo 'foo'
$bar.watch((bar) => {
  console.log("bar", bar);
});
// => bar 0
```

Запустить пример


# sample API

[units]: /ru/explanation/glossary#common-unit

[eventApi]: /ru/api/effector/Event

[storeApi]: /ru/api/effector/Store

[effectApi]: /ru/api/effector/Effect

[purity]: /ru/explanation/glossary/#purity

## `sample` API

```ts
import { sample } from "effector";
```

Метод для связывания юнитов. Его главная задача - брать данные из одного места `source` и передавать их в другое место `target` при срабатывании определённого триггера `clock`.

Типичный вариант использования – когда необходимо обработать какое-либо событие используя данные из стора. Вместо использования `store.getState()`, которое может вызвать несогласованность состояния, лучше использовать метод `sample`.

> TIP как работать с sample: 
>
> Узнайте как композировать юниты и работать с методом&#x20;

### Алгоритм работы

* При срабатывании `clock` прочитать значение из `source`
* Если указан `filter`, и результат функции вернул `true` или стор со значением `true`, то продолжить
* Если указан `fn`, то преобразовать данные
* И передать данные в `target`.

### Особенности работы `sample`

* Если `clock` не передан, `sample` будет срабатывать при каждом обновлении `source`.
* Если `target` не передан, то `sample` создаст и вернёт новый производный юнит

### Возвращаемый юнит и значение

Если `target` не передан, то он будет создан при вызове. Тип создаваемого юнита описан в данной таблице:

| clock \ source                      |  |  |  |
| ----------------------------------- | --------------------------------- | --------------------------------- | ----------------------------------- |
|    | `Store`                           | `Event`                           | `Event`                             |
|    | `Event`                           | `Event`                           | `Event`                             |
|  | `Event`                           | `Event`                           | `Event`                             |

Использование таблицы:

1. Выбираем тип источника `clock`, это столбец
2. Тип `source` – это строка
3. Устанавливаем соответствие между столбцом и строкой

В случае, если `target` передан явно, то возвращаемым значением будет тот же самый `target`.

Например:

```ts
const event = createEvent();
const $store = createStore();
const $secondStore = createStore();

const $derivedStore = sample({
  clock: $store,
  source: $secondStore,
});
// Результатом будет производный стор,
// так как `source` и `clock` являются сторами

const derivedEvent = sample({
  clock: event,
  source: $store,
});
// Результатом будет производное событие, так как `clock` – событие
```

### Полная форма

* **Формула**

```ts
sample({
  clock?, // триггер
  source?, // источник данных
  filter?, // фильтр
  fn?, // функция-трансформатор
  target?, // целевой юнит
  batch?, // флаг батчинга
  name? // имя sample юнита
})
```

#### `clock`

Аргумент `clock` является триггером, определяющий момент взятия данных из source.<br/>
Является опциональным.

* **Тип**

```ts
sample({
  clock?: Unit<T> | Unit<T>[],
})
```

Может иметь сигнатуру:

* [`Event<T>`][eventApi] - срабатывает при вызове события
* [`Store<T>`][storeApi] - срабатывает при изменении стора
* [`Effect<T, Done, Fail>`][effectApi] - срабатывает при вызове эффекта
* `Unit<T>[]`- массив [юнитов][units] срабатывает при активации любого из них

> INFO либо clock либо source: 
>
> Хотя аргумент `clock` является опциональным, при использовании метода `sample` необходимо указать либо `clock`, либо source.

```ts
const clicked = createEvent();
const $store = createStore(0);
const fetchFx = createEffect();

// Event как clock
sample({
  source: $data,
  clock: clicked,
});

// Store как clock
sample({
  source: $data,
  clock: $store,
});

// Массив как clock
sample({
  source: $data,
  clock: [clicked, fetchFx.done],
});
```

***

#### `source`

Является источником данных, откуда берутся данные при срабатывании `clock`. Если `clock` не указан, тогда `source` используется как `clock`. <br/>
Является опциональным.

* **Тип**

```ts
sample({
  source?: Unit<T> | Unit<T>[] | {[key: string]: Unit<T>},
})
```

Может иметь сигнатуру:

* [`Store<T>`][storeApi] - данные берутся из текущего значения стора
* [`Event<T>`][eventApi] - возьмется последнее значение, с которым запускалось событие
* [`Effect<T, Done, Fail>`][effectApi] - возьмется последнее значение, с которым запускался эффект
* Объект с [юнитами][units] - для комбинирования нескольких источников
* Массив с [юнитами][units] - для комбинирования нескольких источников

> INFO либо source либо clock: 
>
> Хотя аргумент `source` является опциональным, при использовании метода `sample` необходимо указать либо `source`, либо clock.

***

#### `filter`

Функция-предикат для фильтрации. Если возвращает `false` или стор со значением `false`, данные не будут переданы в `target`.<br/>
Является опциональным.

* **Тип**

```ts
sample({
  filter?: Store<boolean> | (source: Source, clock: Clock) => (boolean | Store<boolean>),
})
```

Может иметь сигнатуру:

* [`Store<boolean>`][storeApi] – стор с `boolean` значением, как производный так и базовый
* Функция-предикат – функция возвращающая `boolean` значение

```ts
const $isUserActive = createStore(false);

sample({
  clock: checkScore,
  source: $score,
  filter: (score) => score > 100,
  target: showWinnerFx,
});

sample({
  clock: action,
  source: $user,
  filter: $isUserActive,
  target: adminActionFx,
});
```

***

#### `fn`

Функция для трансформации данных перед передачей в `target`. Функция [**должна быть чистой**][purity].<br/>
Является опциональным.

* **Тип**

```ts
sample({
  fn?: (source: Source, clock: Clock) => Target
})
```

> INFO возвращаемый тип данных: 
>
> Тип возвращаемых данных должен совпадать с типом данных в `target`.

```ts
const $user = createStore<User>({});
const saveUserFx = createEffect((user: User) => {
  // ...
});

sample({
  clock: updateProfile,
  source: $user,
  fn: (user, updates) => ({ ...user, ...updates }),
  target: saveUserFx,
});

sample({
  clock: submit,
  source: $form,
  fn: (form) => form.email,
  target: sendEmailFx,
});
```

***

#### `target`

Целевой юнит, который получит данные и будет вызван.<br/>
Является опциональным.

* **Тип**

```ts
sample({
  target?: Unit<T> | Unit<T>[],
})
```

Может иметь сигнатуру:

* EventCallable\<T> - событие (не производное) будет вызвано с данными
* [`Effect<T, Done, Fail>`][effectApi] - эффект будет вызван с данными
* StoreWritable\<T> - стор (не производный) будет обновлён данными
* Массив с [юнитами][units] - будет вызван каждый юнит в массиве

> INFO target без target: 
>
> Если `target` не указан, `sample` возвращает новый производный юнит.

```ts
const targetEvent = createEvent<string>();
const targetFx = createEffect<string, void>();
const $targetStore = createStore("");

// Event как target
sample({
  source: $store,
  clock: trigger,
  target: targetEvent,
});

// Effect как target
sample({
  source: $store,
  clock: trigger,
  target: targetFx,
});

// Store как target
sample({
  source: $store,
  clock: trigger,
  target: $targetStore,
});
```

***

#### `greedy`

> WARNING Deprecated: 
>
> Начиная с effector 23.0.0 свойство `greedy` устарело.
>
> Используйте `batch` вместо `greedy`.

***

#### `batch`

Группирует обновления для лучшей производительности. По умолчанию `true`.<br/>
Является опциональным.

* **Тип**

```ts
sample({
  batch?: boolean // По умолчанию true
})
```

***

#### `name`

Свойство `name` позволяет задать имя создаваемому юниту. Это имя используется для отладки.<br/>
Является опциональным.

* **Тип**

```ts
sample({
  name?: string
})
```

### Краткая форма

* **Формула**

```ts
sample(source, clock, fn?): Unit
```

Альтернативная запись метода, всегда имеет неявный `target`.

Краткая форма также имеет несколько паттернов написания:

1. Все аргументы: `sample(source, clock, fn)` - с функцией-трансформером
2. `source` и `clock`: `sample(source, clock)` - без функции-трансформера
3. `source` и `fn`: `sample(source, fn)` - с функцией-трансформером, но без`clock`, тогда `source`ведет как`clock`
4. Один аргумент: `sample(source)` - только `source`, тогда `source` ведет как `clock`

* **Возвращаемое значение**

Возвращаемое значение зависит от переданных юнитов, а тип данных от fn, если присутствует, иначе от `source`.

#### `source`

Является источником данных, откуда берутся данные при срабатывании `clock`. Если `clock` не указан, тогда `source` используется как `clock`.

* **Тип**

```ts
sample(source?: Unit<T> | Unit<T>[])
```

Может иметь сигнатуру:

* [`Store<T>`][storeApi] - данные берутся из текущего значения стора
* [`Event<T>`][eventApi] - возьмется последнее значение, с которым запускалось событие
* [`Effect<T, Done, Fail>`][effectApi] - возьмется последнее значение, с которым запускался эффект
* `Unit<T>[]`- массив [юнитов][units] срабатывает при активации любого из них

> INFO поведение без clock: 
>
> Если `clock` не указан, тогда `source` ведет себя как `clock` - то есть является триггером.

***

#### `clock`

Аргумент `clock` является триггером, определяющий момент взятия данных из source.<br/>
Является опциональным.

* **Тип**

```ts
sample(clock?: Unit<T> | Unit<T>[])
```

Может иметь сигнатуру:

* [`Event<T>`][eventApi] - срабатывает при вызове события
* [`Store<T>`][storeApi] - срабатывает при изменении стора
* [`Effect<T, Done, Fail>`][effectApi] - срабатывает при вызове эффекта
* `Unit<T>[]`- массив [юнитов][units] срабатывает при активации любого из них

```ts
const clicked = createEvent();
const $store = createStore(0);
const fetchFx = createEffect();

sample($data, clicked);

sample($data, $store);
```

***

#### `fn`

Функция для трансформации данных перед передачей в `target`. Функция [**должна быть чистой**][purity].<br/> Является опциональным.

* **Тип**

```ts
sample(fn: (source: Source, clock: Clock) => result)
```

* **Пример**

```ts
const $userName = createStore("john");

const submitForm = createEvent();

const sampleUnit = sample(
  $userName /* 2 */,
  submitForm /* 1 */,
  (name, password) => ({ name, password }) /* 3 */,
);

submitForm(12345678);

// 1. при вызове submitForm с аргументом 12345678
// 2. прочитать значение из стора $userName ('john')
// 3. преобразовать значение из submitForm (1) и $userName (2) и вызвать sampleUnit
```

### Связанные API и статьи

* **API**
  * merge - Объединяет апдейты массива юнитов
  * Store - Описание стора, а также его методов и свойств
  * Event - Описание событий, а также его методов и свойств
  * Effect - Описание эффектов, а также его методов и свойств
* **Статьи**
  * Типизация юнитов и методов
  * Композиция юнитов и работа с методов&#x20;


# scopeBind

```ts
import { scopeBind } from "effector";
```

`scopeBind` — метод для привязки юнита (эвента или эффекта) к скоупу, который может быть вызван позже. Эффектор поддерживает императивный вызов эвентов внутри обработчиков, однако существуют случаи, когда необходимо явно привязать эвенты к скоупу — например, при вызове эвентов из колбэков `setTimeout` или `setInterval`.

## Методы

### `scopeBind(event, options?)`

#### Формула

```ts
scopeBind<T>(event: EventCallable<T>): (payload: T) => void
scopeBind<T>(event: EventCallable<T>, options?: {scope?: Scope, safe?: boolean}): (payload: T) => void
```

#### Аргументы

1. `event`  или  для привязки к скоупу.
2. `options` (*Object*): опциональные настройки
   * `scope` (*Scope*): скоуп, к которому нужно привязать эвент
   * `safe` (*Boolean*): флаг для подавления исключений, если скоуп отсутствует

#### Возвращает

`(payload: T) => void` — функция с теми же типами, что и у `event`.

#### Примеры

##### Базовый пример

Мы собираемся вызвать `changeLocation` внутри колбэка `history.listen`, поэтому нет способа для эффектора ассоциировать эвент с соответствующим скоупом. Нам нужно явно привязать эвент к скоупу, используя `scopeBind`.

```ts
import { createStore, createEvent, attach, scopeBind } from "effector";

const $history = createStore(history);
const initHistory = createEvent();
const changeLocation = createEvent<string>();

const installHistoryFx = attach({
  source: $history,
  effect: (history) => {
    const locationUpdate = scopeBind(changeLocation);

    history.listen((location) => {
      locationUpdate(location);
    });
  },
});

sample({
  clock: initHistory,
  target: installHistoryFx,
});
```

Запустить пример

### `scopeBind(callback, options?)`

Привязывает произвольный колбэк к скоупу, чтобы его можно было вызвать позже. Полученная привязанная версия функции сохраняет все свойства оригинала — например, если оригинальная функция выбрасывала ошибку при определённых аргументах, то привязанная версия также будет выбрасывать ошибку при тех же условиях.

> INFO since: 
>
> Функциональность доступна, начиная с релиза `effector 23.1.0`.
> Поддержка нескольких аргументов функции появилась в `effector 23.3.0`.

> WARNING: 
>
> Чтобы быть совместимыми с Fork API, колбэки должны соблюдать те же правила, что и хендлеры эффектов:
>
> * Синхронные функции можно использовать как есть.
> * Асинхронные функции должны соответствовать правилам при работе с скоупом.

#### Формула

```ts
scopeBind(callback: (...args: Args) => T, options?: { scope?: Scope; safe?: boolean }): (...args: Args) => T;
```

#### Аргументы

1. `callback` (*Function*): любая функция, которую нужно привязать к скоупу.
2. `options` (*Object*): необязательные настройки.
   * `scope` (*Scope*): скоуп, к которому нужно привязать эвент.
   * `safe` (*Boolean*): флаг для подавления исключений, если скоуп отсутствует.

#### Возвращает

`(...args: Args) => T` — функция с теми же типами, что и у `callback`.

#### Примеры

```ts
import { createEvent, createStore, attach, scopeBind } from "effector";

const $history = createStore(history);
const locationChanged = createEvent();

const listenToHistoryFx = attach({
  source: $history,
  effect: (history) => {
    return history.listen(
      scopeBind((location) => {
        locationChanged(location);
      }),
    );
  },
});
```


# serialize

```ts
import { serialize, type Scope } from "effector";
```

## Методы

### `serialize(scope, params)`

Сопутствующий метод для . Позволяет получить сериализованное значение всех сторов в пределах scope. Основная цель — сериализация состояния приложения на стороне сервера во время SSR.

> WARNING Внимание: 
>
> Для использования этого метода требуется  или , так как эти плагины предоставляют sid для сторов, которые необходимы для стабильной сериализации состояния.
>
> Подробное объяснение можно найти здесь.

#### Формула

```ts
serialize(scope: Scope, { ignore?: Array<Store<any>>; onlyChanges?: boolean }): {[sid: string]: any}
```

#### Аргументы

1. `scope` : объект scope (форкнутый экземпляр)
2. `ignore` Опциональный массив , который будет пропущен при сериализации (добавлено в 20.14.0)
3. `onlyChanges` Опциональный флаг, чтобы игнорировать сторы, которые не изменились в форке (предотвращает передачу значений по умолчанию по сети)

> WARNING Устарело: 
>
> Начиная с [effector 23.0.0](https://changelog.effector.dev/#effector-23-0-0), свойство `onlyChanges` устарело.

#### Возвращает

Объект со значениями сторов, использующий sid в качестве ключей.

> WARNING Внимание: 
>
> Если у стора нет сида, его значение будет пропущено при сериализации.

#### Примеры

##### Сериализация состояния форкнутого экземпляра

```ts
import { createStore, createEvent, allSettled, fork, serialize } from "effector";

const inc = createEvent();
const $store = createStore(42);
$store.on(inc, (x) => x + 1);

const scope = fork();

await allSettled(inc, { scope });

console.log(serialize(scope)); // => {[sid]: 43}
```

Запустить пример

##### Использование с `onlyChanges`

С `onlyChanges` этот метод будет сериализовать только те сторы, которые были изменены каким-либо триггером во время работы или определены в поле `values` с помощью fork или hydrate(scope). После изменения стор останется помеченным как измененное в данном scope, даже если оно вернется к состоянию по умолчанию во время работы, иначе клиент не обновит этот стор на своей стороне, что является неожиданным и непоследовательным.
Это позволяет нам гидрировать состояние клиента несколько раз, например, во время смены маршрутов в next.js.

```ts
import { createDomain, fork, serialize, hydrate } from "effector";

const app = createDomain();

/** стор, который мы хотим гидрировать с сервера */
const $title = app.createStore("dashboard");

/** стор, который не используется сервером */
const $clientTheme = app.createStore("light");

/** скоуп в клиентском приложении */
const clientScope = fork(app, {
  values: new Map([
    [$clientTheme, "dark"],
    [$title, "profile"],
  ]),
});

/** scope на стороне сервера для страницы чатов, созданный для каждого запроса */
const chatsPageScope = fork(app, {
  values: new Map([[$title, "chats"]]),
});

/** этот объект будет содержать только данные $title
 * так как $clientTheme никогда не изменялся в server scope */
const chatsPageData = serialize(chatsPageScope, { onlyChanges: true });
console.log(chatsPageData);
// => {'-l644hw': 'chats'}

/** таким образом, заполнение значений с сервера затронет только соответствующие сторы */
hydrate(clientScope, { values: chatsPageData });

console.log(clientScope.getState($clientTheme));
// => dark
```

Запустить пример


# split

```ts
import { split } from "effector";
```

Выберите один из кейсов по заданным условиям. Эта функция "разделяет" исходный юнит на несколько событий, которые срабатывают, когда полезная нагрузка соответствует их условиям. Работает как сопоставление с образцом для значений полезной нагрузки и внешних сторов.

## Режимы

### "Case" режим

Режим, в котором кейс выбирается его имени. Кейс может быть выбран из данных в `source` с помощью функции кейса или из внешнего стора кейса, которое хранит текущее имя кейса. После выбора данные из `source` будут отправлены в соответствующий `cases[fieldName]` (если он есть), если ни одно из полей не совпадает, то данные будут отправлены в `cases.__` (если он есть).

**Смотрите также**:

* store кейса
* функция кейса

### Режим сопоставления

Режим, в котором каждый кейс последовательно сопоставляется с сторами и функциями в полях объекта `match`.
Если одно из полей получает `true` из значения стора или возврата функции, то данные из `source` будут отправлены в соответствующий `cases[fieldName]` (если он есть), если ни одно из полей не совпадает, то данные будут отправлены в `cases.__` (если он есть).

**Смотрите также**:

* store сопоставления
* функция сопоставления

### Стор кейса

Store со строкой, который будет использоваться для выбора итогового кейса по его имени. Размещается непосредственно в поле `match`.

```ts
split({
  source: Unit<T>
  // стор кейса
  match: Store<'first' | 'second'>,
  cases: {
    first: Unit<T> | Unit<T>[],
    second: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
```

### Функция кейса

Функция, возвращающая строку, которая будет вызвана со значением из `source` для выбора итогового кейса по его имени. Размещается непосредственно в поле `match`, должна быть .

```ts
split({
  source: Unit<T>
  // функция кейса
  match: (value: T) => 'first' | 'second',
  cases: {
    first: Unit<T> | Unit<T>[],
    second: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
```

### Стор сопоставления

`Boolean` store, который указывает, следует ли выбрать конкретный кейс или попробовать следующий. Размещается в полях объекта `match`, может быть смешано с функциями сопоставления.

```ts
split({
  source: Unit<T>
  match: {
    // стор сопоставления
    first: Store<boolean>,
    second: Store<boolean>
  },
  cases: {
    first: Unit<T> | Unit<T>[],
    second: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
```

### Функция сопоставления

> INFO Обратите внимание: 
>
> Стор кейса, функция кейса и стор сопоставления поддерживаются с [effector 21.8.0](https://changelog.effector.dev/#effector-21-8-0)

Функция, возвращающая `boolean` значение, которое указывает, следует ли выбрать конкретный кейс или попробовать следующий. Размещается в полях объекта `match`, может быть смешано с store сопоставления, должна быть .

```ts
split({
  source: Unit<T>
  match: {
    // функция сопоставления
    first: (value: T) => boolean,
    second: (value: T) => boolean
  },
  cases: {
    first: Unit<T> | Unit<T>[],
    second: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
```

## Методы

### `split({ source, match, cases })`

> INFO Начиная с: 
>
> [effector 21.0.0](https://changelog.effector.dev/#effector-21-0-0)

#### Формула

```ts
split({ source, match, cases });
```

```ts
split({
  source: Unit<T>
  // функция кейса
  match: (data: T) => 'a' | 'b',
  cases: {
    a: Unit<T> | Unit<T>[],
    b: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
split({
  source: Unit<T>
  // стор кейса
  match: Store<'a' | 'b'>,
  cases: {
    a: Unit<T> | Unit<T>[],
    b: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
split({
  source: Unit<T>
  match: {
    // функция сопоставления
    a: (data: T) => boolean,
    // стор сопоставления
    b: Store<boolean>
  },
  cases: {
    a: Unit<T> | Unit<T>[],
    b: Unit<T> | Unit<T>[],
    __?: Unit<T> | Unit<T>[]
  }
})
```

#### Аргументы

* `source`: Юнит, который будет запускать вычисления в `split`
* `match`: Одиночное store со строкой, одиночная функция, возвращающая строку или объект с boolean сторами и функциями, возвращающими boolean значение
* `cases`: Объект с юнитами или массивами юнитов, в которые будут переданы данные из `source` после выбора кейса

#### Возвращает

`void`

#### Примеры

##### Базовый

```js
import { split, createEffect, createEvent } from "effector";
const messageReceived = createEvent();
const showTextPopup = createEvent();
const playAudio = createEvent();
const reportUnknownMessageTypeFx = createEffect(({ type }) => {
  console.log("неизвестное сообщение:", type);
});

split({
  source: messageReceived,
  match: {
    text: (msg) => msg.type === "text",
    audio: (msg) => msg.type === "audio",
  },
  cases: {
    text: showTextPopup,
    audio: playAudio,
    __: reportUnknownMessageTypeFx,
  },
});

showTextPopup.watch(({ value }) => {
  console.log("новое сообщение:", value);
});

messageReceived({
  type: "text",
  value: "Привет",
});
// => новое сообщение: Привет
messageReceived({
  type: "image",
  imageUrl: "...",
});
// => неизвестное сообщение: image
```

Попробуйте

##### Прямое сопоставление

Вы также можете сопоставлять напрямую с API хранилища:

```js
import { split, createStore, createEvent, createApi } from "effector";

const messageReceived = createEvent();

const $textContent = createStore([]);

split({
  source: messageReceived,
  match: {
    text: (msg) => msg.type === "text",
    audio: (msg) => msg.type === "audio",
  },
  cases: createApi($textContent, {
    text: (list, { value }) => [...list, value],
    audio: (list, { duration }) => [...list, `аудио ${duration} мс`],
    __: (list) => [...list, "неизвестное сообщение"],
  }),
});

$textContent.watch((messages) => {
  console.log(messages);
});

messageReceived({
  type: "text",
  value: "Привет",
});
// => ['Привет']
messageReceived({
  type: "image",
  imageUrl: "...",
});
// => ['Привет', 'неизвестное сообщение']
messageReceived({
  type: "audio",
  duration: 500,
});
// => ['Привет', 'неизвестное сообщение', 'аудио 500 мс']
```

Попробуйте

##### Кейс с массивами юнитов

```js
import { createEffect, createEvent, createStore, sample, split } from "effector";

const $verificationCode = createStore("12345");
const $error = createStore("");

const modalToInputUsername = createEvent();
const modalToAuthorizationMethod = createEvent();

const checkVerificationCodeFx = createEffect((code) => {
  throw "500";
});

sample({
  clock: verificationCodeSubmitted,
  source: $verificationCode,
  target: checkVerificationCodeFx,
});

split({
  source: checkVerificationCodeFx.failData,
  match: (value) => (["400", "410"].includes(value) ? "verificationCodeError" : "serverError"),
  cases: {
    verificationCodeError: $verificationCodeError,
    serverError: [$error, modalToAuthorizationMethod],
  },
});

$error.updates.watch((value) => console.log("ОШИБКА: " + value));
modalToAuthorizationMethod.watch(() =>
  console.log("Модальное окно с содержимым метода авторизации."),
);
// => ОШИБКА: 500
// => Модальное окно с содержимым метода авторизации.
```

### `split(source, match)`

> INFO Начиная с: 
>
> [effector 20.0.0](https://changelog.effector.dev/#effector-20-0-0)

#### Формула

```ts
split(source, match);
```

#### Аргументы

1. `source`: Юнит, который будет запускать вычисления в `split`
2. `match` (*Объект*): Схема кейсов, которая использует имена результирующих событий как ключи и функцию сопоставления\*((value) => Boolean)\*

#### Возвращает

(Объект) – Объект, имеющий ключи, определенные в аргументе `match`, плюс `__`(два подчеркивания) – который обозначает кейс по умолчанию (если ни одно из условий не выполнено).

#### Примеры

##### Базовый

```js
import { createEvent, split } from "effector";

const message = createEvent();

const messageByAuthor = split(message, {
  bob: ({ user }) => user === "bob",
  alice: ({ user }) => user === "alice",
});
messageByAuthor.bob.watch(({ text }) => {
  console.log("[bob]: ", text);
});
messageByAuthor.alice.watch(({ text }) => {
  console.log("[alice]: ", text);
});

message({ user: "bob", text: "Привет" });
// => [bob]: Привет
message({ user: "alice", text: "Привет, bob" });
// => [alice]: Привет, bob

/* кейс по умолчанию, срабатывает, если ни одно из условий не выполнено */
const { __: guest } = messageByAuthor;
guest.watch(({ text }) => {
  console.log("[гость]: ", text);
});
message({ user: "незарегистрированный", text: "привет" });
// => [гость]: привет
```

Попробуйте

> INFO Обратите внимание: 
>
> Только первое выполненное сопоставление вызовет результирующее событие

##### Другой пример

```js
import { createEvent, split } from "effector";

const message = createEvent();

const { short, long, medium } = split(message, {
  short: (m) => m.length <= 5,
  medium: (m) => m.length > 5 && m.length <= 10,
  long: (m) => m.length > 10,
});

short.watch((m) => console.log(`короткое сообщение '${m}'`));
medium.watch((m) => console.log(`среднее сообщение '${m}'`));
long.watch((m) => console.log(`длинное сообщение '${m}'`));

message("Привет, Боб!");
// => длинное сообщение 'Привет, Боб!'

message("Привет!");
// => короткое сообщение 'Привет!'
```

Попробуйте

### `split({ source, clock?, match, cases })`

> INFO Начиная с: 
>
> [effector 22.2.0](https://changelog.effector.dev/#effector-22-2-0)

Работает так же, как split с кейсами, однако вычисления в `split` будут запущены после срабатывания `clock`.

#### Формула

```js
split({source, clock?, match, cases})
```

#### Аргументы

TBD

#### Примеры

```js
import { createStore, createEvent, createEffect, split } from "effector";

const options = ["save", "delete", "forward"];
const $message = createStore({ id: 1, text: "Принесите мне чашку кофе, пожалуйста!" });
const $mode = createStore("");
const selectedMessageOption = createEvent();
const saveMessageFx = createEffect(() => "save");
const forwardMessageFx = createEffect(() => "forward");
const deleteMessageFx = createEffect(() => "delete");

$mode.on(selectedMessageOption, (mode, opt) => options.find((item) => item === opt) ?? mode);

split({
  source: $message,
  clock: selectedMessageOption,
  match: $mode,
  cases: {
    save: saveMessageFx,
    delete: deleteMessageFx,
    forward: forwardMessageFx,
  },
});

selectedMessageOption("delete"); // ничего не происходит
selectedMessageOption("delete");
```

Попробуйте


# SWC плагин

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

Официальный SWC плагин необходим для SSR и обеспечивает более удобную отладку в проектах, использующих SWC, таких как [Next.js](https://nextjs.org) или Vite с плагином [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc).

Плагин обладает той же функциональностью, что и встроенный babel-plugin.\
Он предоставляет всем Юнитам уникальные `SID` (Стабильные Идентификаторы) и имена, а также другую отладочную информацию.

> WARNING Нестабильно: 
>
> Этот SWC плагин, как и все другие SWC плагины, в настоящее время считается экспериментальным и нестабильным.
>
> SWC и Next.js могут не следовать semver, когда речь идет о совместимости плагинов.

## Установка

Установите `@effector/swc-plugin` с помощью предпочитаемого менеджера пакетов.

<Tabs>
  <TabItem label="npm">

```bash
npm install --save-dev @effector/swc-plugin
```

  </TabItem>
  <TabItem label="yarn">

```bash
yarn add --dev @effector/swc-plugin
```

  </TabItem>
  <TabItem label="pnpm">

```bash
pnpm install --save-dev @effector/swc-plugin
```

  </TabItem>
</Tabs>

### Версионирование

Начиная с версий `@swc/core@>=1.15.0` и `next@>=16.1.0`, Plugin ABI стабилен и [обратно совместим](https://blog.swc.rs/2025-11-4-wasm-backward-compatibility) между версиями SWC. Установите последнюю версию плагина, используя инструкции выше.

<details>
<summary>Устаревшее версионирование</summary>

Если вы используете устаревшие версии SWC или окружения (например, `@swc/core@<1.15.0` или `next@<16.1.0`), установите версию плагина под вашу конкретную версию `@swc/core`. В `npm` опубликованы несколько версий плагина с разными ['метками'](https://semver.org/#spec-item-9), они доступны как `npm` теги – обратитесь к таблице ниже, чтобы выбрать правильную версию плагина для вашего проекта.

<br />

> TIP Примечание: 
>
> Для большей стабильности мы рекомендуем зафиксировать версии как вашей среды выполнения (например, Next.js или `@swc/core`), так и версию `@effector/swc-plugin`.
>
> Используйте опцию `--exact`/`--save-exact` в вашем менеджере пакетов, чтобы установить конкретные, совместимые версии. Это гарантирует, что обновления одной зависимости не сломают ваше приложение.

<br />

| Версия `@swc/core` | Версия Next.js                           | Версия плагина (`npm` тег) |
| ------------------ | ---------------------------------------- | -------------------------- |
| `>=1.4.0 <1.6.0`   | `>=14.2.0 <=14.2.15`                     | `@swc1.4.0`                |
| `>=1.6.0 <1.7.0`   | `>=15.0.0-canary.37 <=15.0.0-canary.116` | `@swc1.6.0`                |
| `>=1.7.0 <1.8.0`   | `>=15.0.0-canary.122 <=15.0.2`           | `@swc1.7.0`                |
| `>=1.9.0 <1.10.0`  | `>=15.0.3 <15.2.0`                       | `@swc1.9.0`                |
| `>=1.10.0 <1.11.0` | `>=15.2.0 <15.2.1`                       | `@swc1.10.0`               |
| `>=1.11.0`         | `>=15.2.1 <15.4.0`                       | `@swc1.11.0`               |
| `>=1.12.0`         | `>=15.4.0`                               | `@swc1.12.0`               |

<br />

Для получения дополнительной информации о совместимости обратитесь к документации SWC по [Выбору версии SWC](https://swc.rs/docs/plugin/selecting-swc-core) и интерактивной [таблице совместимости](https://plugins.swc.rs) на сайте SWC.

</details>

<br />

## Использование

Добавьте плагин в конфигурацию вашего инструмента для сборки проекта.

### Next.js

Если вы используете [Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler), работающий на SWC, добавьте этот плагин в ваш `next.config.js`.

```js
const nextConfig = {
  experimental: {
    // даже если конфигурация не нужна, передайте объект опций `{}` в плагин
    swcPlugins: [["@effector/swc-plugin", {}]],
  },
};
```

Вам также нужно установить официальную библиотеку [`@effector/next`](https://github.com/effector/next), чтобы использовать SSR/SSG.

> WARNING Turbopack: 
>
> Обратите внимание, что некоторые функции могут не работать при использовании Turbopack с Next.js, особенно с относительными путями в . Используйте на свой страх и риск.

### .swcrc

Добавьте новую запись в опцию `jsc.experimental.plugins` в вашем `.swcrc`.

```json
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "experimental": {
      "plugins": [["@effector/swc-plugin", {}]]
    }
  }
}
```

## Конфигурация

### `factories`

Укажите массив имен модулей или файлов, которые следует рассматривать как пользовательские фабрики. При использовании SSR фабрики необходимы для обеспечения уникальных SID по всему вашему приложению.

> TIP Примечание: 
>
> Пакеты ([`patronum`](https://patronum.effector.dev), [`@farfetched/core`](https://ff.effector.dev/), [`atomic-router`](https://atomic-router.github.io/), [`effector-action`](https://github.com/AlexeyDuybo/effector-action) и [`@withease/factories`](https://withease.effector.dev/factories/)) включены в список фабрик по умолчанию, поэтому вам не нужно явно их перечислять.

#### Формула

```json
["@effector/swc-plugin", { "factories": ["./path/to/factory", "factory-package"] }]
```

* Тип: `string[]`
* По умолчанию: `[]`

Если вы предоставляете относительный путь (начинающийся с `./`), плагин рассматривает его как локальную фабрику относительно корневой директории вашего проекта. Эти фабрики могут быть импортированы только с использованием относительных импортов в вашем коде.

В противном случае, если вы указываете имя пакета или алиас TypeScript, это интерпретируется как точный спецификатор импорта. Вы должны использовать такой импорт точно так, как указано в конфигурации.

#### Примеры

```json
["@effector/swc-plugin", { "factories": ["./src/factory"] }]
```

```ts title="/src/factory.ts"
import { createStore } from "effector";

/* createBooleanStore — это фабрика */
export const createBooleanStore = () => createStore(true);
```

```ts title="/src/widget/user.ts"
import { createBooleanStore } from "../factory";

const $boolean = createBooleanStore(); /* Рассматривается как фабрика! */
```

### `debugSids`

Добавляет полный путь к файлу и имя Юнита к сгенерированным сидам для более удобной отладки проблем с SSR.

#### Формула

```json
["@effector/swc-plugin", { "debugSids": false }]
```

* Тип: `boolean`
* По умолчанию: `false`

### `hmr`

> INFO Начиная с: 
>
> `@effector/swc-plugin@0.7.0`

Включите поддержку Hot Module Replacement (HMR) для очистки связей, подписок и побочных эффектов, управляемых Effector. Это предотвращает двойное срабатывание эффектов и наблюдателей.

> WARNING Взаимодействие с фабриками: 
>
> Hot Module Replacement работает лучше, когда все фабрики в проекте правильно описаны. Правильная конфигурация фабрик помогает плагину понять, какие подписки нужно удалять при обновлении.

#### Формула

```json
["@effector/swc-plugin", { "hmr": "es" }]
```

* Тип: `"es"` | `"cjs"` | `false`
  * `"es"`: Использует API HMR `import.meta.hot` в сборщиках, основанных на ESM, таких как Vite и Rollup
  * `"cjs"`: Использует API HMR `module.hot` в сборщиках, использующих CommonJS модули, таких как Webpack, Next.js или Metro (React Native)
  * `false`: Отключает Hot Module Replacement.
* По умолчанию: `false`

> INFO Обратите внимание: 
>
> При сборке для продакшена убедитесь, что установили опцию `hmr` в `false`, чтобы уменьшить размер бандла и улучшить производительность в runtime.

### `addNames`

Добавляет имена к Юнитам при вызове фабрик (таких как `createStore` или `createDomain`). Это полезно для отладки во время разработки и тестирования, но рекомендуется отключать это для минификации.

#### Формула

```json
["@effector/swc-plugin", { "addNames": true }]
```

* Тип: `boolean`
* По умолчанию: `true`

### `addLoc`

Включает информацию о местоположении (пути к файлам и номера строк) для Юнитов и фабрик. Это полезно для отладки с такими инструментами, как [`effector-logger`](https://github.com/effector/logger).

#### Формула

```json
["@effector/swc-plugin", { "addLoc": true }]
```

* Тип: `boolean`
* По умолчанию: `false`

### `forceScope`

Внедряет `forceScope: true` во все хуки или вызовы `@effector/reflect`, чтобы гарантировать, что ваше приложение всегда использует `Scope` во время рендеринга. Если `Scope` отсутствует, будет выброшена ошибка, что устраняет необходимость в импортах `/scope` или `/ssr`.

> INFO Примечание: 
>
> Подробнее о принудительном использовании Scope в документации `effector-react`.

#### Формула

```json
[
  "@effector/swc-plugin",
  {
    "forceScope": { "hooks": true, "reflect": false }
  }
]
```

* Тип: `boolean | { hooks: boolean, reflect: boolean }`
* По умолчанию: `false`

##### `hooks`

Принудительно заставляет все хуки из effector-react и effector-solid, такие как `useUnit` и `useList`, использовать `Scope` в runtime.

##### `reflect`

> INFO Начиная с: 
>
> Поддерживается библиотекой `@effector/reflect` начиная с версии `9.0.0`

Для пользователей [`@effector/reflect`](https://github.com/effector/reflect) принудительно заставляет все компоненты, созданные с помощью библиотеки `reflect`, использовать `Scope` в runtime.

### `transformLegacyDomainMethods`

Если включено (по умолчанию), эта опция преобразует создатели Юнитов в Доменах, такие как `domain.event()` или `domain.createEffect()`. Однако это преобразование может быть ненадежным и может повлиять на несвязанный код. Если это ваш случай, отключение этой опции может исправить эти проблемы.

Отключение этой опции **остановит** добавление SID и другой отладочной информации к этим создателям юнитов. Убедитесь, что ваш код не зависит от методов домена перед отключением.

> TIP: 
>
> Вместо использования создателей юнитов напрямую на домене, рассмотрите использование аргумента `domain` в обычных методах.

#### Формула

```json
["@effector/swc-plugin", { "transformLegacyDomainMethods": false }]
```

* Тип: `boolean`
* По умолчанию: `true`


# withRegion

```ts
import { withRegion } from "effector";
```

Метод основан на идее управления памятью на основе регионов (см. [Region-based memory management](https://en.wikipedia.org/wiki/Region-based_memory_management) для справки).

## Методы

### `withRegion(unit, callback)`

> INFO Начиная с: 
>
> [effector 20.11.0](https://changelog.effector.dev/#effector-20-11-0)

Метод позволяет явно передать владение всеми юнитами (включая связи, созданные с помощью `sample`, `forward` и т.д.), определенными в callback, на `unit`. Как следствие, все созданные связи будут удалены, как только будет вызван `clearNode` на .

#### Формула

```ts
withRegion(unit: Unit<T> | Node, callback: () => void): void
```

#### Аргументы

1. `unit`: *Unit* | *Node* — который будет служить "локальной областью" или "регионом", владеющим всеми юнитами, созданными внутри предоставленного callback. Обычно узел, созданный методом низкого уровня `createNode`, оптимален для этого случая.
2. `callback`: `() => void` — Callback, в котором должны быть определены все соответствующие юниты.

#### Примеры

```js
import { createNode, createEvent, restore, withRegion, clearNode } from "effector";

const first = createEvent();
const second = createEvent();
const $store = restore(first, "");
const region = createNode();

withRegion(region, () => {
  // Следующие связи, созданные с помощью `sample`, принадлежат предоставленному юниту `region`
  // и будут удалены, как только будет вызван `clearNode` на `region`.
  sample({
    clock: second,
    target: first,
  });
});

$store.watch(console.log);

first("привет");
second("мир");

clearNode(region);

second("не вызовет обновлений `$store`");
```


# Справочник API

import FeatureCard from "@components/FeatureCard.astro";
import IconReact from "@icons/React.astro";
import IconVue from "@icons/Vue.astro";
import IconSolid from "@icons/Solid.astro";
import IconEffector from "@icons/Effector.astro";
import IconNextJs from "@icons/NextJs.astro";
import MostUsefulMethods from "@components/MostUsefulMethods.astro";
import { MOST\_USEFUL } from "src/navigation";

## Справочник API

Самые часто используемые операторы из пакетов effector.

<MostUsefulMethods items={MOST_USEFUL} />


# Протокол @@unitShape

## Протокол `@@unitShape`

> INFO Начиная с: 
>
> [effector-react 22.4.0](https://changelog.effector.dev/#effector-react-22-4-0), effector-solid 0.22.7

Effector предоставляет способ использования юнитов (Store, Event, Effect) в UI-библиотеках с помощью специальных библиотек, таких как `effector-react`, `effector-solid` и т.д. Обычно они позволяют привязывать любые юниты к UI-фреймворку:

```ts
import { createStore } from "effector";
import { useUnit } from "effector-react";

const $value = createStore("Привет!");

const Component = () => {
  const { value } = useUnit({ value: $value });

  return <p>{value}</p>;
};
```

Но что, если вы хотите создать свою собственную библиотеку на основе effector с какими-то пользовательскими сущностями? Например, вы хотите создать библиотеку маршрутизации с пользовательской сущностью `Route`, и вы хотите позволить пользователям использовать её с привязками `effector-react`:

```ts
import { createRoute } from "my-router-library";
import { useUnit } from "effector-react";

const mainPageRoute = createRoute(/* ... */);

const Component = () => {
  const { params } = useUnit(mainPageRoute);

  return <p>{params.name}</p>;
};
```

Это возможно с помощью протокола `@@unitShape`. Он позволяет определить форму юнита в пользовательской сущности и затем использовать её в UI-библиотеках. Просто добавьте поле `@@unitShape` с функцией, которая возвращает форму юнитов, в вашу сущность:

```ts
function createRoute(/* ... */) {
  const $params = createStore(/* ... */);

  return {
    "@@unitShape": () => ({
      params: $params,
    }),
  };
}
```

### FAQ

***

**Вопрос**: Как часто вызывается функция `@@unitShape`?

**Ответ**: Столько же раз, сколько вызывается сам `useUnit` – это зависит от UI-библиотеки. Например, `effector-react` вызывает её как любой другой хук – один раз за рендер компонента, но `effector-solid` вызывает `useUnit` один раз за монтирование компонента.

***

**Вопрос**: Как я могу узнать, какая UI-библиотека используется для конкретного вызова `@@unitShape`?

**Ответ**: Вы не можете. `@@unitShape` должен быть универсальным для всех UI-библиотек или должен проверять, какая UI-библиотека используется внутри, с помощью методов UI-библиотеки (например, `Context` в React или Solid).


# Динамические модели

## Динамические модели

> ERROR дисклеймер: 
>
> В данный момент динамические модели все еще находятся на стадии разработки, их API может меняться со временем. Данная статья носит исключительно ознакомительный характер мы настоятельно не рекомендуем использовать в продакшене этот функционал.<br/>
>
> **НЕ РЕКОМЕНДУЕТСЯ ИСПОЛЬЗОВАТЬ В ПРОДАКШЕНЕ**.

На данный момент effector не имеет возможности динамически создавать юниты, юниты должны быть инициализированы статически на уровне модуля. Если же создавать юниты во время рантайма, то произойдет утечка памяти, потому что юниты навсегда останутся в графе. Хотя и можно попробовать использовать `withRegion`, `createNode` и `clearNode`, но это требует определенного навыка разработчика, поскольку это низкоуровневый API и более того придется самому отслеживать жизненный цикл юнитов, что может быть головной болью.

Поэтому для случаев когда нужно было иметь динамику использовались key-value сторы, которые хранили в себе объекты, где ключами были идентификаторы, а значениями состояния, например:

```ts
// model.ts
import { createStore, createEvent } from "effector";
import { useStoreMap } from "effector-react";

type Item = { id: string; count: number };
const $items = createStore<Record<string, Item>>({});

const addItem = createEvent<Item>();
const removeItem = createEvent<string>();

$items.on(addItem, (state, item) => ({
  ...state,
  [item.id]: item,
}));

$items.on(removeItem, (state, id) => {
  const copy = { ...state };
  delete copy[id];
  return copy;
});
```

При этом в UI подписывались с помощью `useStoreMap` только на ту часть, что соответствует `id` для получения данных:

```tsx
// counter.tsx
import { $items, addItem, removeItem } from "./model";
import { useStoreMap, useUnit } from "effector-react";

function Counter({ id }: { id: string }) {
  const item = useStoreMap({
    store: $items,
    keys: [id],
    fn: (state, [key]) => state[key],
  });

  const [onAddItem, onRemoveItem] = useUnit([addItem, removeItem]);

  if (!item) return null;

  return (
    <div>
      <span>{item.count}</span>
      <button onClick={() => onAddItem({ id, count: item.count + 1 })}>+</button>
      <button onClick={() => onRemoveItem(id)}>Удалить</button>
    </div>
  );
}
```

Хотя такой подход работает, это не очень удобно, особенно если структура куда сложнее, чем в этом примере.

Модели приносят новый способ работы с динамическими состояниями, позволяя создавать экземпляры моделей на лету, которые имеют свои собственные состояния и логику.

### Установка и работа с моделями

В данный момент модели реализованы в [отдельном репозитории](https://github.com/effector/model) и доступны отдельным пакетом:

```bash
npm install @effector/model
```

а также пакет для интеграции с React:

```bash
npm install @effector/model-react
```

В корне [репозитория](https://github.com/effector/model) вы сможете найти директорию `apps` , где есть примеры использования моделей в приложениях с около-реальным функционалом. В данной статье мы просто ознакомимся с API и что из себя будут представлять динамические модели.

### API моделей

Динамические модели приносят ряд новых API для работы:

* `keyval` – оператор который создаёт коллекцию инстансов модели, где каждый элемент идентифицируется ключом. Именно через `keyval` происходит динамическое создание и удаление экземпляров модели. `keyval` также может использоваться внутри `keyval` для вложенных структур. В аргументе ожидает колбэк который вернет объект со свойствами:

  * `state` – состояние модели, является объектом со сторами или `keyval` моделью . Одно из свойств также должно быть ключом модели
  * `key` – ключ модели, иначе говоря ее уникальный идентификатор
  * `api` – опциональный объект с событиями или эффектами для работы с моделью
  * `onMount` – опциональное событие или эффект, которое вызывается при создании инстанса модели
  * `optional` – опциональный массив строк с необязательными полями модели при создании

Например:

```ts
export const restaurantsList = keyval(() => {
  const $name = createStore("");
  const $description = createStore("");
  const $category = createStore<string[]>([]);

  const dishesList = keyval(() => {
    const $name = createStore("");
    const $description = createStore("");
    const $price = createStore(0);
    const $additives = createStore<Additive[]>([]);

    return {
      key: "name",
      state: {
        name: $name,
        description: $description,
        price: $price,
        additives: $additives,
      },
      optional: ["additives"],
    };
  });

  return {
    key: "name",
    state: {
      name: $name,
      description: $description,
      category: $category,
      dishes: dishesList,
    },
    api: {
      addDish: dishesList.edit.add,
      removeDish: dishesList.edit.remove,
    },
    optional: ["category", "dishes"],
  };
});
```

Теперь используя `restaurantsList` мы можем в рантайме добавлять, изменять или удалять экземпляры модели. Все, что описано внутри `keyval` будет динамически создано для каждого инстанса.

```ts
const addRestaurant = createEvent();

sample({
  clock: addRestaurant,
  fn: () => ({
    name: "Starbucks",
    description: "Американская корпорация и крупнейшая в мире сеть кофеен",
  }),
  target: restaurantsList.edit.add,
});
```

* `lens` – линза необходима нам чтобы погрузиться внутрь `keyval` для работы с данными, например имея вложенные `keyval` мы можем достучаться с самого верха до самого низа и получить данные или апи для работы с ним:

```ts
const menuItemIdLens = lens(orderKeyval).item(orderId).menuItemId;
const foodDescLens = lens(restaurantKeyval).item(restId).menu.item(menuItemIdLens).description;
```

> INFO lens api: 
>
> В данный момент API линзы дорабатывается и может отличаться от того, что есть в примерах репозитория.

Помимо основного пакета effector также имеется API для effector-react, чтобы удобно работать с моделями в React:

* `useEntityList(keyval, View)` – хук, который принимает `keyval` первым аругментом и компонент вторым. Итерирует по всем ключам коллекции и для каждого создаёт `EntityProvider`, передавая в него `View`. Проще говоря, это способ отрисовать список и в дальнейшем удобнее работать с остальными хуками без передачи `id`.
* `useEntityItem(keyval, key?)` – возвращает сущность по `id` в коллекции `keyval`. Если `key` передан явно, ищет элемент по этому ключу, если ключ не передан, пытается получить его из ближайшего `EntityProvider`.
* `useItemApi(keyval, key?)` – возвращает объект API сущности для работы с ней.
* `useEditItemField(keyval, key?)`– возвращает объект с функциями для обновления каждого поля модели. Если `key` передан явно, ищет элемент по этому ключу, если ключ не передан, пытается получить его из ближайшего `EntityProvider`.
* `useEditKeyval(keyval)` – возвращает объект методов для модификации модели, например добавить, удалить или обновить.

```ts
const { add, map, remove, replaceAll, set, update } = useEditKeyval(ordersList);
```

### Связанные API и статьи

* **API**

  * clearNode — Метод для уничтожения ноды и ее связей
  * withRegion — Метод установки региона для нод

* **Articles**
  * Инициализация юнитов


# События

import SideBySide from "@components/SideBySide/SideBySide.astro";

## События

Хотя в effector есть три основные концепции — события, сторы и эффекты, но именно события можно назвать основой для работы вашего приложения. Весь frontend построен поверх событийной модели, вы наверняка уже сталкивались с событиями при работе в JavaScript, например `addEventListener` или в React с `onClick` и другими обработчиками – это все события, на которые мы можем подписаться, так и в effector мы можем создать свое событие с помощью createEvent и подписаться на его вызов:

<SideBySide>

<Fragment slot="left">

```ts data-height="full"
let counter = 10;

document.addEventListener("click", () => {
  counter = 13;
});
```

</Fragment>

  <Fragment slot="right">

```ts data-height="full"
import { createEvent, createStore, sample } from "effector";

const $counter = createStore(10);

const click = createEvent();

sample({
  clock: click,
  fn: () => 13,
  target: $counter,
});
```

</Fragment>

</SideBySide>

> INFO События effector: 
>
> События в effector не то же самое, что события DOM, данный пример служит демонстрацией похожей концепции работы.

### Зачем нужны события

Весь код на effector строится поверх событий, например если вы передадите стор в параметр clock у метода sample, то такой sample будет вызываться при срабатывании события updates у переданного стора:

<SideBySide>

<Fragment slot="left">

```ts "clock: $someStore"
// этот код эквивалентен
import { createStore, sample } from "effector";

const $someStore = createStore();
sample({
  clock: $someStore,
  // ...
});
```

</Fragment>

  <Fragment slot="right">

```ts "clock: $someStore.updates"
// этот код эквивалентен
import { createStore, sample } from "effector";

const $someStore = createStore();
sample({
  clock: $someStore.updates,
  // ...
});
```

</Fragment>

</SideBySide>

Событие само по себе просто означает факт какого-то действия, клик по кнопке, обновление данных, показ уведомления, и прочее. Все что они делают это передают информацию и сообщают их подписчикам, что его вызвали.

Для более простого понимания – событиями является все, с чем пользователь может взаимодействовать, а также внутренняя работы вашей логики. То есть помимо UI ориентированных событий по типу `buttonClicked`, `inputChanged` и прочее, у вас также могут быть и события завязанные на обновлении данных: `valueUpdated` или `errorOccured`.

Например у эффектов имеются встроенные событие done, которое срабатывает при успешном завершении работы эффекта, а также событие fail, если во время выполнения выбросилась ошибка. А сторы имеют событие updates, которое вызывается при его обновлении.

События также позволяют нам держать код слабо связным, что упрощает поддержку и тестирование.

> TIP Важность событий: 
>
> На странице Как мыслить в парадигме effector мы подробно рассказываем о том, почему события важны, чем они еще полезны и какую пользу могут принести.

#### Как использовать события

Создать события мы можем с помощью метода createEvent, а далее подписываться на вызов этого события с помощью метода sample:

```ts
import { sample, createEvent } from "effector";

const event = createEvent();

sample({
  clock: event,
  // ...
});
```

> TIP Что такое sample: 
>
> Если вы не знакомы с методом sample, то в примере с событиями он создает подписку на переданное событие в clock, а когда событие вызывается запускает цепочку выполнения. Более подробно вы познакомиться с логикой его работы на странице Композиция юнитов.

С помощью событий мы можем как обновлять сторы, так и вызывать эффекты или другие события:

```ts
import { sample, createStore, createEvent } from "effector";

const $clicksCount = createStore(0);

const userClicked = createEvent<void>();

// обновляем стор счетчик
sample({
  clock: userClicked,
  source: $clicksCount,
  fn: (clicksCount) => count + 1,
  target: $clicksCount,
});

userClicked();
```

```ts
import { createEvent, createEffect, sample } from "effector";

const startFetch = createEvent<string>();
const fetchFx = createEffect((url: string) => {
  // ...
});

// вызываем эффект
sample({
  clock: startFetch,
  target: fetchFx,
});

startFetch("/fake-api/users");
```

Важная особенность событий, что они могут принимать только один аргумент, остальные будут проигнорированы. Если вам необходимо передать несколько аргументов, то используйте объект:

```ts
const event = createEvent<{ a: number; b: string }>();

event({
  a: 1,
  b: "string",
});
```

### Вызов события

Вызвать событие можно двумя путями: императивно и декларативно.

Императивным способ вызова это наиболее привычный, когда мы вызываем событие как функцию `event()`, такой способ, скорее всего, вы будете использовать при вызове события в UI, когда передаете в `onClick`, `onChange` обработчики и другие:

```tsx "const click = useUnit(clickHappened);" "click()" "useUnit"
import { createEvent } from "effector";
// можно использовать любой другой фреймворк и пакет с его интеграцией
import { useUnit } from "effector-react";

const clickHappened = createEvent<void>();

// view.tsx
import { useUnit } from "effector-react";

const Component = () => {
  const click = useUnit(clickHappened);

  return (
    <div>
      <button onClick={() => click()}>click</button>
    </div>
  );
};
```

> INFO события и фреймворки: 
>
> Заметьте, чтобы вызвать событие в UI при работе с фреймворком, вам нужно использовать хук `useUnit`.

Декларативный вызов это, например, когда мы подписываемся событием на другое событие с помощью метода sample и аргумента target. Событие переданное в target вызовется при срабатывании clock:

```ts
import { createEvent, sample } from "effector";

const firstTriggered = createEvent<void>();
const secondTriggered = createEvent<void>();

sample({
  clock: firstTriggered,
  target: secondTriggered,
});
```

> TIP А можно ли вызывать императивно в sample?: 
>
> Декларативыный способ вызова события это единственный правильный способ при работе с `sample`. Однако вы можете вызывать императивно с помощью метода  или в теле эффекта.

### Связанные API и статьи

* **API**
  * Event API — Описание событий, их методов и свойств
  * createEvent — Создание нового события
  * sample — Ключевой оператор для построения связей между юнитами
  * Store API — Описание сторов, его методов и свойств
* **Статьи**
  * Как мыслить в парадигме эффектор и почему события важны
  * Типизация событий, а также других юнитов
  * Как связывать юниты вместе с помощью методов&#x20;


# Разделение потоков данных с помощью split

import { Image } from "astro> ASSETS:&#x20;";
import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import ThemeImage from "@components/ThemeImage.astro";

## Разделение потоков данных с помощью split

Метод `split` был создан с целью разделения логики на несколько потоков данных.
Например, вам может потребоваться направить данные по разным путям в зависимости от их содержимого. Это похоже на железнодорожную стрелку, которая направляет поезда по разным путям:

* если форма заполнена неправильно – показать ошибку
* если все корректно – отправить запрос

> INFO Порядок проверки условий: 
>
> Условия в `split` проверяются последовательно сверху вниз. Когда находится первое подходящее условие, остальные не проверяются. Учитывайте это при составлении условий.

### Базовое использование `split`

Давайте посмотрим на простой пример – разбор сообщений разных типов:

```ts
import { createEvent, split } from "effector";

const updateUserStatus = createEvent();

const { activeUserUpdated, idleUserUpdated, inactiveUserUpdated } = split(updateUserStatus, {
  activeUserUpdated: (userStatus) => userStatus === "active",
  idleUserUpdated: (userStatus) => userStatus === "idle",
  inactiveUserUpdated: (userStatus) => userStatus === "inactive",
});
```

Логика этого кусочка кода максимально простая. При вызове события `updateUserStatus` мы попадаем в `split`, где проходимся по каждому условию сверху вниз до первого совпадения, а затем `effector` вызывает нужное нам событие.

Учтите, что каждое условие описывается предикатом – функцией, которая возвращает `true` или `false`.

Возможно вы подумали, зачем мне это, если я могу вызывать нужное событие при определенном условии в UI интерфейсе с использованием `if/else`. Однако это то, от чего effector старается избавить вашу UI часть, а именно **бизнес-логика**.

> TIP Примечание: 
>
> Вы можете относится к `split` как к реактивному `switch` для юнитов.

### Случай по умолчанию

При использовании метода `split` может произойти ситуация, когда ни один случай не подошел, для того, чтобы обработать такую ситуацию существует специальный случай по умолчанию `__`.

Рассмотрим тот же пример, что и выше, но с использованием случая по умолчанию:

```ts
import { createEvent, split } from "effector";

const updateUserStatus = createEvent();

const { activeUserUpdated, idleUserUpdated, inactiveUserUpdated, __ } = split(updateUserStatus, {
  activeUserUpdated: (userStatus) => userStatus === "active",
  idleUserUpdated: (userStatus) => userStatus === "idle",
  inactiveUserUpdated: (userStatus) => userStatus === "inactive",
});

__.watch((defaultStatus) => console.log("default case with status:", defaultStatus));
activeUserUpdated.watch(() => console.log("active user"));

updateUserStatus("whatever");
updateUserStatus("active");
updateUserStatus("default case");

// Вывод в консоль:
// default case with status: whatever
// active user
// default case with status: default case
```

> INFO По умолчанию отработает 'по умолчанию': 
>
> Если ни одно условие не сработает, то в таком случае отработает случай по умолчанию `__`.

### Короткая запись

Метод `split` поддерживает разные методы использование, в зависимости от того, что вам нужно.

Самый короткий способ использования метода `split` – это передать первым аргументом юнит, который служит триггером, а вторым аргументом объект со случаями.

Рассмотрим пример с кнопкой Star и Watch как у гитхаба, :

<ThemeImage
alt='Кнопка "Добавить звезду" для репозитория на гитхабе'
lightImage="/images/split/github-repo-buttons.png"
darkImage="/images/split/github-repo-buttons-dark.png"
height={20}
width={650}
/>

```ts
import { createStore, createEvent, split } from "effector";

type Repo = {
  // ... другие свойства
  isStarred: boolean;
  isWatched: boolean;
};

const toggleStar = createEvent<string>();
const toggleWatch = createEvent<string>();

const $repo = createStore<null | Repo>(null)
  .on(toggleStar, (repo) => ({
    ...repo,
    isStarred: !repo.isStarred,
  }))
  .on(toggleWatch, (repo) => ({ ...repo, isWatched: !repo.isWatched }));

const { starredRepo, unstarredRepo, __ } = split($repo, {
  starredRepo: (repo) => repo.isStarred,
  unstarredRepo: (repo) => !repo.isStarred,
});

// следим за случаем по умолчанию для дебага
__.watch((repo) =>
  console.log("[split toggleStar] Случай по умолчанию отработал со значением ", repo),
);

// где-то в приложении
toggleStar();
```

В этом случае `split` вернет нам объект с **производными событиями**, на которые мы можем подписаться для запуска реактивной цепочки действий.

> TIP Примечание: 
>
> Используйте этот вариант, когда у ваc:
>
> * нету зависимости от внешних данных, например от сторов
> * нужен простой и понятный код

### Расширенная запись

Использовании метода `split` в этом варианте нам ничего не возвращает, однако у нас появляется несколько новых возможностей:

1. Мы можем зависить от внешних данных, например от сторов, при помощи параметра `match`
2. Вызов нескольких юнитов при срабатывании кейса передав массив
3. Добавление источника данных через `source` и триггера срабатывания через `clock`

Возьмем в пример случай, когда у нас имеется два режима приложения `user` и `admin`. При срабатывании события в режиме `user` и `admin` у нас происходят разные действия:

```ts
import { createStore, createEvent, split } from "effector";

const adminActionFx = createEffect();
const secondAdminActionFx = createEffect();
const userActionFx = createEffect();
const defaultActionFx = createEffect();
// События для UI
const buttonClicked = createEvent();

// Текущий режим приложения
const $appMode = createStore<"admin" | "user">("user");

// Разные события для разных режимов
split({
  source: buttonClicked,
  match: $appMode, // Логика зависит от текущего режима
  cases: {
    admin: [adminActionFx, secondAdminActionFx],
    user: userActionFx,
    __: defaultActionFx,
  },
});

// При клике одна и та же кнопка делает разные вещи
// в зависимости от режима приложения
buttonClicked();
// -> "Выполняем пользовательское действие" (когда $appMode = 'user')
// -> "Выполняем админское действие" (когда $appMode = 'admin')
```

Более того, вы можете также добавить свойство `clock`, которое работает также как у sample, и будет триггером для срабатывания, а в `source` передать данные стора, которые передадутся в нужный case.
Дополним предыдущий пример следующим кодом:

```ts
// дополним предыдущий код

const adminActionFx = createEffect((currentUser) => {
  // ...
});
const secondAdminActionFx = createEffect((currentUser) => {
  // ...
});

// добавим новый стор
const $currentUser = createStore({
  id: 1,
  name: "Donald",
});

const $appMode = createStore<"admin" | "user">("user");

split({
  clock: buttonClicked,
  // и передадим его как источник данных
  source: $currentUser,
  match: $appMode,
  cases: {
    admin: [adminActionFx, secondAdminActionFx],
    user: userActionFx,
    __: defaultActionFx,
  },
});
```

> WARNING Случай по умолчанию: 
>
> Обратите внимание, если вам нужен случай по умолчанию, то вам нужно описать его в объекте `cases`, иначе он не обработается!

В этом случае у нас не получится определить логику работы в момент создания `split`, как в предыдущем примере, он определяется в runtime в зависимости от `$appMode`.

> INFO Особенности использования: 
>
> В этом варианте использование `match` принимает в себя юниты, функции и объект, но с определенными условиями:
>
> * **Стор**: если вы используете стор, тогда этот **store должен хранить в себе строковое значение**
> * **Функция:** если вы передаете функцию, то эта **фунция должна вернуть строковое значение, а также быть чистой**!
> * **Объект с сторами**: если вы передаете объект с сторами, тогда вам нужно, чтобы **каждый стор был с булевым значением**
> * **Объект с функциями**: если вы передаете объект с функциями, то **каждая функция должна возвращать булевое значение, и быть чистой**!

#### `match` как стор

Когда `match` принимает стор, значение из этого стора используется как ключ для выбора нужного case:

```ts
const $currentTab = createStore("home");

split({
  source: pageNavigated,
  match: $currentTab,
  cases: {
    home: loadHomeDataFx,
    profile: loadProfileDataFx,
    settings: loadSettingsDataFx,
  },
});
```

#### `match` как функция

При использовании функции в `match`, она должна возвращать строку, которая будет использоваться как ключ case:

```ts
const userActionRequested = createEvent<{ type: string; payload: any }>();

split({
  source: userActionRequested,
  match: (action) => action.type, // Функция возвращает строку
  cases: {
    update: updateUserDataFx,
    delete: deleteUserDataFx,
    create: createUserDataFx,
  },
});
```

#### `match` как объект с сторами

Когда `match` - это объект с сторами, каждый стор должен содержать булево значение. Сработает тот case, чей стор содержит `true`:

```ts
const $isAdmin = createStore(false);
const $isModerator = createStore(false);

split({
  source: postCreated,
  match: {
    admin: $isAdmin,
    moderator: $isModerator,
  },
  cases: {
    admin: createAdminPostFx,
    moderator: createModeratorPostFx,
    __: createUserPostFx,
  },
});
```

#### `match` как объект с функциями

При использовании объекта с функциями, каждая функция должна возвращать булево значение. Сработает первый case, чья функция вернула `true`:

```ts
split({
  source: paymentReceived,
  match: {
    lowAmount: ({ amount }) => amount < 100,
    mediumAmount: ({ amount }) => amount >= 100 && amount < 1000,
    highAmount: ({ amount }) => amount >= 1000,
  },
  cases: {
    lowAmount: processLowPaymentFx,
    mediumAmount: processMediumPaymentFx,
    highAmount: processHighPaymentFx,
  },
});
```

> WARNING Внимание: 
>
> Ваши условия в `match` должны быть взаимоисключающие, иначе данные могут пойти не по тому пути, который вы ожидаете. Всегда проверяйте, что условия не пересекаются.

### Практические примеры

#### Работа с формами

```ts
const showFormErrorsFx = createEffect(() => {
  // логика отображение ошибки
});
const submitFormFx = createEffect(() => {
  // логика отображение ошибки
});

const submitForm = createEvent();

const $form = createStore({
  name: "",
  email: "",
  age: 0,
}).on(submitForm, (_, submittedForm) => ({ ...submittedForm }));
// Отдельный стор для ошибок
const $formErrors = createStore({
  name: "",
  email: "",
  age: "",
}).reset(submitForm);

// Проверяем все поля и собираем все ошибки
sample({
  clock: submitForm,
  source: $form,
  fn: (form) => ({
    name: !form.name.trim() ? "Имя обязательно" : "",
    email: !isValidEmail(form.email) ? "Неверный email" : "",
    age: form.age < 18 ? "Возраст должен быть 18+" : "",
  }),
  target: $formErrors,
});

// И только после этого используем split для маршрутизации
split({
  source: $formErrors,
  match: {
    hasErrors: (errors) => Object.values(errors).some((error) => error !== ""),
  },
  cases: {
    hasErrors: showFormErrorsFx,
    __: submitFormFx,
  },
});
```

Давайте разберем этот пример:

Для начала создаём два эффекта: один для показа ошибок, другой для отправки формы. Потом нам нужно где-то хранить данные формы и отдельно ошибки - для этого создаем два стора `$form` и `$formErrors`.
Когда пользователь нажимает "Отправить", срабатывает событие `submitForm`. В этот момент происходят две вещи:

1. Обновляются данные в сторе формы
2. Запускается проверка всех полей на ошибки через sample

В процессе проверки мы смотрим каждое поле и валидируем его.

Все найденные ошибки сохраняются в сторе `$formErrors`.
И вот тут в игру вступает `split`. Он смотрит на все ошибки и решает:

* Если хотя бы в одном поле есть ошибка - ❌ показываем все ошибки пользователю
* Если все поля заполнены правильно - ✅ отправляем форму


# Управление состоянием

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import SideBySide from "@components/SideBySide/SideBySide.astro";

## Управление состоянием

Вся работа с состоянием происходит с помощью сторов, и ключевая особенность, что у сторов нету привычного `setState`. Стор обновляется реактивно при срабатывании события, на которое он подписывается, например:

```ts
import { createStore, createEvent } from "effector";

const $counter = createStore(0);

const incremented = createEvent();

// при каждом вызове incremented отработает переданный колбэк
$counter.on(incremented, (counterValue) => counterValue + 1);

incremented(); // $counter = 1
incremented(); // $counter = 2
```

Если вы не знакомы с событиями, то пока воспринимайте их просто как триггер для обновления стора. Подробнее о событиях можно узнать на странице события, а также как думать в парадигме effector, и почему события важны.

> INFO Иммутабельность данных: 
>
> Если вы храните в сторе [ссылочный тип данных](https://learn.javascript.ru/reference-type), например массив или объект, то для обновления такого стора вы можете использовать immer или сначала создать новый инстанс этого типа:
>
> <SideBySide>
>
> <Fragment slot="left">
>
> ```ts wrap data-border="good" data-height="full" "const updatedUsers = [...users];" "const updatedUser = { ...user };"
> // ✅ Все круто
>
> // обновление массива
> $users.on(userAdded, (users, newUser) => {
>   const updatedUsers = [...users];
>   updatedUsers.push(newUser);
>   return updatedUsers;
> });
>
> // обновление объекта
> $user.on(nameChanged, (user, newName) => {
>   const updatedUser = { ...user };
>   updatedUser.name = newName;
>   return updatedUser;
> });
> ```
>
> </Fragment>
>
>   <Fragment slot="right">
>
> ```ts wrap data-border="bad" data-height="full"
> // ❌ А тут все плохо
>
> $users.on(userAdded, (users, newUser) => {
>   users.push(newUser); // мутируем массив
>   return users;
> });
>
> $user.on(nameChanged, (user, newName) => {
>   user.name = newName; // мутируем объект
>   return user;
> });
> ```
>
> </Fragment>
>
> </SideBySide>

### Создание стора

Создание стора происходит при помощи метода createStore:

```ts
import { createStore } from "effector";

// создание стора с начальным значением
const $counter = createStore(0);
// и с явной типизацией
const $user = createStore<{ name: "Bob"; age: 25 } | null>(null);
const $posts = createStore<Post[]>([]);
```

> TIP Наименование сторов: 
>
> Команда effector предлагает использовать префикс , поскольку это улучшает ориентацию в коде и автокомплит в IDE.

### Чтение значений

Как вы уже знаете effector это реактивный стейт менеджер, а стор – реактивный юнит и реактивность создается не магическим образом. Если вы попробуете просто использовать стор, например:

```ts
import { createStore } from "effector";

const $counter = createStore(0);
console.log($counter);
```

Вы увидите непонятный объект с кучей свойств, который необходим effector для корректной работы, но не текущее значение. Чтобы получить текущее значение стора, есть несколько способов:

1. Скорее всего вы также используете какой-нибудь фреймворк [React](https://react.dev/), [Vue](https://vuejs.org/) или [Solid](https://docs.solidjs.com/) и тогда вам нужен адаптер под этот фреймворк effector-react, effector-vue или effector-solid. Каждый из этих пакетов предоставляет хук `useUnit` для получения данных из стора, а также подписки на его изменения. При работе с UI это единственный верный способ для чтения данных:

<Tabs>
  <TabItem label="React">

```ts "useUnit"
import { useUnit } from 'effector-react'
import { $counter } from './model.js'

const Counter = () => {
  const counter = useUnit($counter)

  return <div>{counter}</div>
}
```

  </TabItem>
  <TabItem label="Vue">

```html "useUnit"
<script setup>
  import { useUnit } from "effector-vue/composition";
  import { $counter } from "./model.js";

  const counter = useUnit($counter);
</script>
```

  </TabItem>
  <TabItem label="Solid">

```ts "useUnit"
import { useUnit } from 'effector-solid'
import { $counter } from './model.js'

const Counter = () => {
  const counter = useUnit($counter)

  return <div>{counter()}</div>
}
```

  </TabItem>
</Tabs>

2. Поскольку для построения вашей логики вне UI вам также может понадобится данные стора, вы можете использовать метод sample и передать стор в `source`, например:

```ts
import { createStore, createEvent, sample } from "effector";

const $counter = createStore(0);

const incremented = createEvent();

sample({
  clock: incremented,
  source: $counter,
  fn: (counter) => {
    console.log("Counter value:", counter);
  },
});

incremented();
```

Мы чуть попозже еще обсудим метод  используя сторы.

3. Можно подписаться на изменения стора через watch, однако это используется скорее для дебага либо каких-то самописных интеграций:

```ts
$counter.watch((counter) => {
  console.log("Counter changed:", counter);
});
```

4. Метод getState(), используется, как правило, только для работы с низкоуровневым API или интеграций. Старайтесь не использовать его в вашем коде, потому что может привести к гонке данных:

```ts
console.log($counter.getState()); // 0
```

> WARNING Почему не использовать getState?: 
>
> Чтобы effector корректно работал с реактивностью ему необходимо построить связи между юнитами, чтобы всегда были актуальные данные. В случае .getState() мы как бы ломаем эту систему и берем данные извне.

### Обновление состояния

Как говорилось ранее, обновление состояния происходит при помощи событий. Можно подписаться стором на события с помощью метода .on – хорош для примитивных реакций, или оператора sample – позволяет обновить стор в зависимости от другого стора, или фильтровать обновления.

> INFO что такое sample?: 
>
> Метод sample это оператор для связи между юнитами, с его помощью можно вызывать события или эффекты, а также записывать в сторы новые значения. Алгоритм его работы простой:
>
> ```ts
> const trigger = createEvent();
> const log = createEvent<string>();
>
> sample({
>   clock: trigger, // 1. когда trigger сработает
>   source: $counter, // 2. возьми значение из $counter
>   filter: (counter) => counter % 2 === 0, // 3. если значение четное
>   fn: (counter) => "Counter is even: " + counter, // 4. преобразуй его
>   target: log, // 5. вызови и передай в log
> });
> ```

#### С помощью `.on`

С помощью .on мы можем обновить стор примитивным способом: вызвалось событие -> вызови колбэк -> обнови стор возвращаемым значением:

```ts
import { createStore, createEvent } from "effector";

const $counter = createStore(0);

const incrementedBy = createEvent<number>();
const decrementedBy = createEvent<number>();

$counter.on(incrementedBy, (counterValue, delta) => counterValue + delta);
$counter.on(decrementedBy, (counterValue, delta) => counterValue - delta);

incrementedBy(11); // 0+11=11
incrementedBy(39); // 11+39=50
decrementedBy(25); // 50-25=25
```

#### С помощью `sample`

С методом sample мы можем как примитивно обновить стор:

```ts
import { sample } from "effector";

sample({
  clock: incrementedBy, // когда сработает incrementedBy
  source: $counter, // возьми данные из $counter
  fn: (counter, delta) => counter + delta, // вызови колбэк fn
  target: $counter, // обнови $counter возвращаемым значением из fn
});

sample({
  clock: decrementedBy, // когда сработает decrementedBy
  source: $counter, // возьми данные из $counter
  fn: (counter, delta) => counter - delta, // вызови колбэк fn
  target: $counter, // обнови $counter возвращаемым значением из fn
});
```

так и имеем более гибкие способы, например обновить стор только когда **другой стор** имеет нужное значение, к примеру искать только когда `$isSearchEnabled` имеет значение `true`:

```ts
import { createStore, createEvent, sample } from "effector";

const $isSearchEnabled = createStore(false);
const $searchQuery = createStore("");
const $searchResults = createStore<string[]>([]);

const searchTriggered = createEvent();

sample({
  clock: searchTriggered, // когда сработает searchTriggered
  source: $searchQuery, // возьми данные из $searchQuery
  filter: $isSearchEnabled, // если поиск активен то продолжаем
  fn: (query) => {
    // имитируем поиск
    return ["result1", "result2"].filter((item) => item.includes(query));
  },
  target: $searchResults, // обнови $searchResults возвращаемым значением из fn
});
```

Заметьте, что при передаче стора в `target` его предыдущее значение будет полностью заменено на возвращаемое значение из `fn`.

#### Обновление от нескольких событий

Стор не ограничен одной подпиской на событие, можно подписаться на сколько угодно событий, а также подписываться на одно и то же событие разными сторами:

```ts "categoryChanged"
import { createEvent, createStore } from "effector";

const $lastUsedFilter = createStore<string | null>(null);
const $filters = createStore({
  category: "all",
  searchQuery: "",
});

const categoryChanged = createEvent<string>();
const searchQueryChanged = createEvent<string>();

// подписываемся двумя разными сторами на одно и то же событие
$lastUsedFilter.on(categoryChanged, (_, category) => category);

sample({
  clock: categoryChanged,
  source: $filters,
  fn: (filters, category) => ({
    // придерживаемся принципа иммутабельности
    ...filters,
    category,
  }),
  // результат fn заменит предыдущее значение в $filters
  target: $filters,
});

// а также подписываемся стором на два события searchQueryChanged и categoryChanged
sample({
  clock: searchQueryChanged,
  source: $filters,
  fn: (filters, searchQuery) => ({
    // придерживаемся принципа иммутабельности
    ...filters,
    searchQuery,
  }),
  // результат fn заменит предыдущее значение в $filters
  target: $filters,
});
```

Мы подписались двумя сторами на одно и то же событие `categoryChanged`, а также стором `$filters` на еще одно событие `searchQueryChanged`.

### Производные сторы

Производный стор вычисляется **на основе других сторов** и **автоматически обновляется** при изменении этих сторов, представьте, что мы имеем вот такой стор:

```ts
import { createStore } from "effector";

const $author = createStore({
  name: "Hanz Zimmer",
  songs: [
    { title: "Time", likes: 123 },
    { title: "Cornfield Chase", likes: 97 },
    { title: "Dream is Collapsing", likes: 33 },
  ],
});
```

И мы хотим отобразить общее количество лайков, а также количество музыки для этого автора. Конечно мы могли бы просто в UI использовать этот стор с помощью хука `useUnit` и там уже высчитать эти значения, но это не очень правильно, поскольку мы будем описывать логику в компоненте и размазываем ее по всему приложению, это усложнит поддержку кода в будущем, а если мы захотим использовать эти данные в другом месте, то и вовсе придется дублировать код. <br/>

При такой логике правильным подходом будет создать производные сторы на основе `$author` используя метод combine:

```ts ins={13,15-17} "combine"
import { createStore, combine } from "effector";

const $author = createStore({
  name: "Hanz Zimmer",
  songs: [
    { title: "Time", likes: 123 },
    { title: "Cornfield Chase", likes: 97 },
    { title: "Dream is Collapsing", likes: 33 },
  ],
});

// общее количество песен
const $totalSongsCount = combine($author, (author) => author.songs.length);
// общее количество лайков
const $totalLikesCount = combine($author, (author) =>
  author.songs.reduce((acc, song) => acc + song.likes, 0),
);
```

Каждый из производных сторов будет автоматически обновляться при изменении исходного стора `$author`.

> WARNING Важно про производные сторы!: 
>
> Производные сторы обновляются автоматически при изменении исходных сторов, их нельзя передать в `target` у `sample` или подписаться на событие через `.on`.

При этом исходных сторов может быть сколько угодно, что позволяет, например, вычислить текущее состояния приложения:

```ts "$isLoading, $isSuccess, $error"
import { combine, createStore } from "effector";

const $isLoading = createStore(false);
const $isSuccess = createStore(false);
const $error = createStore<string | null>(null);

const $isAppReady = combine($isLoading, $isSuccess, $error, (isLoading, isSuccess, error) => {
  return !isLoading && isSuccess && !error;
});
```

### Значения `undefined`

Если вы попробуете использовать значение стора как `undefined` или положите в стор это значение:

```ts "return undefined;"
const $store = createStore(0).on(event, (_, newValue) => {
  if (newValue % 2 === 0) {
    return undefined;
  }

  return newValue;
});
```

то столкнетесь с ошибкой в консоли:

```console
store: undefined is used to skip updates. To allow undefined as a value provide explicit { skipVoid: false } option
```

По умолчанию возвращение `undefined` служит как команда "ничего не произошло, пропусти это обновление". Если вам действительно нужно использовать `undefined` как валидное значение, тогда необходимо явно указать это с помощью параметра `skipVoid: false` при создании стора:

```ts "skipVoid: false"
import { createStore } from "effector";

const $store = createStore(0, {
  skipVoid: false,
});
```

> INFO Будущее undefined: 
>
> В ближайших версиях это поведение будет изменено, как показала практика, лучше просто вернуть предыдущее значение для стора, чтобы его не обновлять.

### Связанные API и статьи

* **API**
  * createStore - Метод для создания стора
  * Store - Описание стора и его методов
* **Статьи**
  * Основные концепции
  * Работа с событиями


# TypeScript

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## TypeScript в effector

Effector предоставляет первоклассную поддержку TypeScript из коробки, что дает вам надежную типизацию и отличный опыт разработки при работе с библиотекой. В этом разделе мы рассмотрим как базовые концепции типизации, так и продвинутые техники работы с типами в effector.

### Типизация событий

События в effector могут быть типизированы при помощи передачи типа в дженерик функции, однако если не передавать ничего, то в таком случае событие будет с типом `EventCallable<void>`:

```ts
import { createEvent } from "effector";

// Событие без параметров
const clicked = createEvent();
// EventCallable<void>

// Событие с параметром
const userNameChanged = createEvent<string>();
// EventCallable<string>

// Событие со сложным параметром
const formSubmitted = createEvent<{
  username: string;
  password: string;
}>();
// EventCallable<{ username: string;password: string; }>
```

#### Типы событий

В effector для событий может быть несколько типов, где `T` - тип хранимого значения:

1. `EventCallable<T>` - событие, которое может вызвать.
2. `Event<T>` - производное событие, которое нельзя вызвать вручную.

#### Типизация методов событий

##### `event.prepend`

Чтобы добавить типы к событиям, созданным с помощью event.prepend, необходимо добавить тип либо в аргумент функции `prepend`, либо как дженерик

```typescript
const message = createEvent<string>();

const userMessage = message.prepend((text: string) => text);
// userMessage имеет тип EventCallable<string>

const warningMessage = message.prepend<string>((warnMessage) => warnMessage);
// warningMessage имеет тип EventCallable<string>
```

### Типизация сторов

Сторы также можно типизировать при помощи передачи типа в дженерик функции, либо указав дефолтное значение при инициализации, тогда ts будет выводить тип из этого значения:

```ts
import { createStore } from "effector";

// Базовый стор с примитивным значением
// StoreWritable<number>
const $counter = createStore(0);

// Стор со сложным объектным типом
interface User {
  id: number;
  name: string;
  role: "admin" | "user";
}

// StoreWritable<User>
const $user = createStore<User>({
  id: 1,
  name: "Bob",
  role: "user",
});

// Store<string>
const $userNameAndRole = $user.map((user) => `User name and role: ${user.name} and ${user.role}`);
```

#### Типы сторов

В эффектор существуют два типа сторов, где `T` - тип хранимого значения:

1. `Store<T>` - тип производного стора, в который нельзя записать новые данные.
2. `StoreWritable<T>` - тип стора, в который можно записывать новые данные при помощи `on` или `sample`.

### Типизация эффектов

При обычном использовании TypeScript будет выводить типы в зависимости от возвращаемого результата функции, а также ее аргументов.<br/>
Однако, `createEffect` поддерживает типизацию входных параметров, возвращаемого результата и ошибок через дженерик:

<Tabs>
  <TabItem label="Обычное использование">

```ts
import { createEffect } from "effector";

// Базовый эффект
// Effect<string, User, Error>
const fetchUserFx = createEffect(async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  const result = await response.json();

  return result as User;
});
```

  </TabItem>

  <TabItem label="Типизация через дженерик">

```ts
import { createEffect } from "effector";

// Базовый эффект
// Effect<string, User, Error>
const fetchUserFx = createEffect<string, User>(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  const result = await response.json();

  return result;
});
```

  </TabItem>
</Tabs>

#### Типизация функции обработчика вне эффекта

В случае, если функция обработчик определен вне эффекта, то для типизации вам нужно будет передать тип этой функции:

```ts
const sendMessage = async (params: { text: string }) => {
  // ...
  return "ok";
};

const sendMessageFx = createEffect<typeof sendMessage, AxiosError>(sendMessage);
// => Effect<{text: string}, string, AxiosError>
```

#### Кастомные ошибки эффекта

Некоторый код может выдать исключения только некоторых типов. В эффектах для описания типов ошибок используется третий дженерик `Fail`.

```ts
// Определяем типы ошибок API
interface ApiError {
  code: number;
  message: string;
}

// Создаём типизированный эффект
const fetchUserFx = createEffect<string, User, ApiError>(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw {
      code: response.status,
      message: "Failed to fetch user",
    } as ApiError;
  }

  return response.json();
});
```

### Типизация методов

#### `sample`

##### Типизация `filter`

Если вам необходимо получить конкретный тип, то для этого вам нужно вручную указать ожидаемый тип, сделать это можно при помощи [типов придикатов](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates):

```ts
type UserMessage = { kind: "user"; text: string };
type WarnMessage = { kind: "warn"; warn: string };

const message = createEvent<UserMessage | WarnMessage>();
const userMessage = createEvent<UserMessage>();

sample({
  clock: message,
  filter: (msg): msg is UserMessage => msg.kind === "user",
  target: userMessage,
});
```

Если вам нужно произвести проверку в `filter` на существование данных, то вы можете просто передать `Boolean`:

```ts
import { createEvent, createStore, sample } from "effector";

interface User {
  id: string;
  name: string;
  email: string;
}

// События
const formSubmitted = createEvent();
const userDataSaved = createEvent<User>();

// Состояния
const $currentUser = createStore<User | null>(null);

// При сабмите формы отправляем данные только если юзер существует
sample({
  clock: formSubmitted,
  source: $currentUser,
  filter: Boolean, // отфильтровываем null
  target: userDataSaved,
});

// Теперь userDataSaved получит только существующие данные пользователя
```

##### Типизация `filter` и `fn`

Как упоминалось выше, если использовать предикаты типов в `filter`, то все отработает корректно и в `target` попадет нужный тип.<br/>
Однако, такая механика не отработает как нужно при использовании `filter` и `fn` вместе. В таком случае вам потребуется вручную указать тип данных параметров `filter`, а также добавить [предикаты типов](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates). Это происходит из-за того, что TypeScript не может корректно вывести тип в `fn` после `filter`, если тип не указан явно. Это ограничение системы типов TypeScript.

```ts
type UserMessage = { kind: "user"; text: string };
type WarnMessage = { kind: "warn"; warn: string };
type Message = UserMessage | WarnMessage;

const message = createEvent<Message>();
const userText = createEvent<string>();

sample({
  clock: message,
  filter: (msg: Message): msg is UserMessage => msg.kind === "user",
  fn: (msg) => msg.text,
  target: userText,
});

// userMessage has type Event<string>
```

> TIP Оно стало умнее!: 
>
> Начиная с TypeScript версии >= 5.5 вы можете не писать предикаты типов, а просто указать тип аргумента, а TypeScript сам поймет, что нужно вывести:
> `filter: (msg: Message) => msg.kind === "user"`,

#### `attach`

Чтобы позволить TypeScript выводить типы создаваемого эффекта, можно добавить тип к первому аргументу `mapParams`, который станет дженериком `Params` у результата:

```ts
const sendTextFx = createEffect<{ message: string }, "ok">(() => {
  // ...

  return "ok";
});

const sendWarningFx = attach({
  effect: sendTextFx,
  mapParams: (warningMessage: string) => ({ message: warningMessage }),
});
// sendWarningFx имеет тип Effect<{message: string}, 'ok'>
```

#### `split`

Вы можете использовать [предикаты типов](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates) для разделения исходного типа события на несколько вариантов:

<Tabs>
  <TabItem label="до 5.5 версии TS">

```ts
type UserMessage = { kind: "user"; text: string };
type WarnMessage = { kind: "warn"; warn: string };

const message = createEvent<UserMessage | WarnMessage>();

const { userMessage, warnMessage } = split(message, {
  userMessage: (msg): msg is UserMessage => msg.kind === "user",
  warnMessage: (msg): msg is WarnMessage => msg.kind === "warn",
});
// userMessage имеет тип Event<UserMessage>
// warnMessage имеет тип Event<WarnMessage>
```

  </TabItem>

  <TabItem label="после 5.5 версии TS">

```ts
type UserMessage = { kind: "user"; text: string };
type WarnMessage = { kind: "warn"; warn: string };

const message = createEvent<UserMessage | WarnMessage>();

const { userMessage, warnMessage } = split(message, {
  userMessage: (msg) => msg.kind === "user",
  warnMessage: (msg) => msg.kind === "warn",
});
// userMessage имеет тип Event<UserMessage>
// warnMessage имеет тип Event<WarnMessage>
```

  </TabItem>
</Tabs>

#### `createApi`

Чтобы позволить TypeScript выводить типы создаваемых событий, можно добавить тип ко второму аргументу обработчиков

```typescript
const $count = createStore(0);

const { add, sub } = createApi($count, {
  add: (x, add: number) => x + add,
  sub: (x, sub: number) => x - sub,
});

// add имеет тип Event<number>
// sub имеет тип Event<number>
```

#### `is`

Методы группы is могут помочь вывести тип юнита, то есть они действуют как [TypeScript type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types). Это применяется в написании типизированных утилит:

```ts
export function getUnitType(unit: unknown) {
  if (is.event(unit)) {
    // здесь юнит имеет тип Event<any>
    return "event";
  }
  if (is.effect(unit)) {
    // здесь юнит имеет тип Effect<any, any>
    return "effect";
  }
  if (is.store(unit)) {
    // здесь юнит имеет тип Store<any>
    return "store";
  }
}
```

#### `merge`

При объединении событий можно получить союз их типов:

```ts
import { createEvent, merge } from "effector";

const firstEvent = createEvent<string>();
const secondEvent = createEvent<number>();

const merged = merge([firstEvent, secondEvent]);
// Event<string | number>

// Можно также объединять события с одинаковыми типами
const buttonClicked = createEvent<MouseEvent>();
const linkClicked = createEvent<MouseEvent>();

const anyClick = merge([buttonClicked, linkClicked]);
// Event<MouseEvent>
```

`merge` принимает дженерик параметр, где можно указать какого типа событий он ожидает:

```ts
import { createEvent, merge } from "effector";

const firstEvent = createEvent<string>();
const secondEvent = createEvent<number>();

const merged = merge<number>([firstEvent, secondEvent]);
//                                ^
// Type 'EventCallable<string>' is not assignable to type 'Unit<number>'.
```

### Утилиты для типов

Effector предоставляет набор утилитных типов для работы с типами юнитов:

#### UnitValue

Тип `UnitValue` служит для извлечение типа данных из юнитов:

```ts
import { UnitValue, createEffect, createStore, createEvent } from "effector";

const event = createEvent<{ id: string; name?: string } | { id: string }>();
type UnitEventType = UnitValue<typeof event>;
// {id: string; name?: string | undefined} | {id: string}

const $store = createStore([false, true]);
type UnitStoreType = UnitValue<typeof $store>;
// boolean[]

const effect = createEffect<{ token: string }, any, string>(() => {});
type UnitEffectType = UnitValue<typeof effect>;
// {token: string}

const scope = fork();
type UnitScopeType = UnitValue<typeof scope>;
// any
```

#### StoreValue

`StoreValue` по своей сути похож на `UnitValue`, но работает только со стором:

```ts
import { createStore, StoreValue } from "effector";

const $store = createStore(true);

type StoreValueType = StoreValue<typeof $store>;
// boolean
```

#### EventPayload

Извлекает тип данных из событий.
Похож на `UnitValue`, но только для событий

```ts
import { createEvent, EventPayload } from "effector";

const event = createEvent<{ id: string }>();

type EventPayloadType = EventPayload<typeof event>;
// {id: string}
```

#### EffectParams

Принимает тип эффекта в параметры дженерика, позволяет получить тип параметров эффекта.

```ts
import { createEffect, EffectParams } from "effector";

const fx = createEffect<
  { id: string },
  { name: string; isAdmin: boolean },
  { statusText: string; status: number }
>(() => {
  // ...
  return { name: "Alice", isAdmin: false };
});

type EffectParamsType = EffectParams<typeof fx>;
// {id: string}
```

#### EffectResult

Принимает тип эффекта в параметры дженерика, позволяет получить тип возвращаемого значения эффекта.

```ts
import { createEffect, EffectResult } from "effector";

const fx = createEffect<
  { id: string },
  { name: string; isAdmin: boolean },
  { statusText: string; status: number }
>(() => ({ name: "Alice", isAdmin: false }));

type EffectResultType = EffectResult<typeof fx>;
// {name: string; isAdmin: boolean}
```

#### EffectError

Принимает тип эффекта в параметры дженерика, позволяет получить тип ошибки эффекта.

```ts
import { createEffect, EffectError } from "effector";

const fx = createEffect<
  { id: string },
  { name: string; isAdmin: boolean },
  { statusText: string; status: number }
>(() => ({ name: "Alice", isAdmin: false }));

type EffectErrorType = EffectError<typeof fx>;
// {statusText: string; status: number}
```


# Композиция юнитов

import SideBySide from "@components/SideBySide/SideBySide.astro";
import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## Композиция юнитов

Если считать, что каждый юнит это кирпичик нашего приложения, тогда для полноценного функционирования нам необходимо как-то склеить эти кирпичики вместе, например при срабатывании события подтверждении формы, провалидировать данные формы, если все корректно вызвать эффект с отправкой данных, а также обновить наш стор, иначе говоря построить связи между юнитами. Чтобы такое реализовать необходимо использовать оператор sample или [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction).

Концептуально оба оператора выполняют одинаковую работу, однако у них есть отличие: sample – декларативный оператор, в то время как [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction) – более императивный, который позволяет в более привычном стиле описывать логику работу.

<SideBySide>

<Fragment slot="left">

```ts data-height="full"
// sample
import { sample, createEvent } from "effector";

const sendButtonClicked = createEvent();

sample({
  clock: sendButtonClicked,
  source: $formData,
  filter: (form) => form.username.length > 0 && form.age >= 18,
  fn: (form) => ({
    ...form,
    timestamp: Date.now(),
  }),
  target: [sendFormFx, formSubmitted],
});
```

</Fragment>

  <Fragment slot="right">

```ts data-height="full"
// createAction
import { createAction } from "effector-action";
import { createEvent } from "effector";

const sendButtonClicked = createEvent();

createAction(sendButtonClicked, {
  source: $formData,
  target: {
    sendForm: sendFormFx,
    formSubmitted,
  },
  fn: (target, form) => {
    if (form.username.length > 0 && form.age >= 18) {
      const updatedForm = {
        ...form,
        timestamp: Date.now(),
      };
      target.sendForm(updatedForm);
      target.formSubmitted();
    }
  },
});
```

</Fragment>

</SideBySide>

Оба оператора срабатывают при вызове события `sendButtonClicked`, затем берут данные из source, а дальше:

* В sample используются отдельные параметры: filter для проверки условий, fn для трансформации данных, и target для вызова юнитов.
* В [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction) вся логика находится в одной `fn`, где можно использовать обычные `if` для условий и явно вызывать нужные `target`.

> INFO action: 
>
> `createAction` является оператором из внешнего пакета [`effector-action`](https://github.com/AlexeyDuybo/effector-action), который в ближайшем мажоре переедет в кор пакет effector. Также в дополнение нужно установить пакет [patronum](https://patronum.effector.dev).
>
> <Tabs>
>   <TabItem label="npm">
>
> ```bash
> npm install effector-action patronum
> ```
>
>   </TabItem>
>   <TabItem label="yarn">
>
> ```bash
> yarn install effector-action patronum
> ```
>
>   </TabItem>
>   <TabItem label="pnpm">
>
> ```bash
> pnpm install effector-action patronum
> ```
>
>   </TabItem>
> </Tabs>

### Базовое использование

Давайте рассмотрим базовый пример на примере из начала статьи: мы хотим при срабатывании события подтверждении формы, провалидировать данные формы, если все корректно вызвать эффект с отправкой данных, а также обновить наш стор. Давай сначала рассмотрим какие юниты нам нужны:

* Нам нужно событие `submitForm` для отправки формы
* Несколько сторов – `$formData` для хранения данных формы и `$formSubmitted` для статуса отправки формы
* И эффект `sendFormFx` чтобы отправлять данные на сервер

> TIP Почему не вызывать эффект напрямую из UI?: 
>
> На странице Как мыслить в парадигме effector мы рассказываем почему стоит создавать события, а не просто вызывать эффекты напрямую из UI.

```ts
import { createEvent, createStore, sample, createEffect } from "effector";

const submitForm = createEvent();

const $formData = createStore({ username: "", age: 0 });
const $formSubmitted = createStore(false);

const sendFormFx = createEffect((formData: { username: string; age: number }) => {
  // какая-то логика отправки данных на сервер
});
```

В UI мы будем вызывать событие `submitForm`, когда пользователь нажмет на кнопку отправки формы. Осталось построить связи между юнитами:

<Tabs syncId="preferred-operator">
<TabItem label="sample">

```ts ins={12-30}
import { createEvent, createStore, sample, createEffect } from "effector";

const submitForm = createEvent();

const $formData = createStore({ username: "", age: 0 });
const $formSubmitted = createStore(false);

const sendFormFx = createEffect((formData: { username: string; age: number }) => {
  // какая-то логика отправки данных на сервер
});

sample({
  clock: submitForm,
  source: $formData,
  filter: (form) => form.age >= 18 && form.username.length > 0,
  target: sendFormFx,
});

sample({
  clock: submitForm,
  fn: () => true,
  target: $formSubmitted,
});
```

</TabItem >

<TabItem label="createAction">

```ts ins={12-30}
import { createEvent, createStore, sample, createEffect } from "effector";

const submitForm = createEvent();

const $formData = createStore({ username: "", age: 0 });
const $formSubmitted = createStore(false);

const sendFormFx = createEffect((formData: { username: string; age: number }) => {
  // какая-то логика отправки данных на сервер
});

createAction(submitForm, {
  source: $formData,
  target: {
    sendForm: sendFormFx,
    formSubmitted: $formSubmitted,
  },
  fn: (target, form) => {
    if (form.age >= 18 && form.username.length > 0) {
      target.sendForm(form);
    }

    target.formSubmitted(true);
  },
});
```

</TabItem >

</Tabs>

### Возможности использования

Как и говорилось оба оператора концептуально схожи друг с другом, поэтому вам не нужно делать выбор в пользу какого-либо из них, вы можете использовать в приложении и тот и другой, однако есть некоторые кейсы, когда [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction) будет приоритетнее sample:

1. Условная логика выполнения. При использовании sample может возникнуть сложность в сужении типов после , чего нет при использовании [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction) за счет использования нативной конструкция языка, которую TypeScript отлично понимает – `if`.
2. Группировка по триггеру. Использовать [`createAction`](https://github.com/AlexeyDuybo/effector-action?tab=readme-ov-file#createaction) также удобнее, когда у нас имеется один общий триггер, но требуется разные вычисления для каждого из `target`

Давайте теперь рассмотрим основные возможности использования операторов:

* Вы можете обновлять стор передав его в `target`, старое значение будет полностью заменено новым:

<Tabs syncId="preferred-operator">
<TabItem label="sample">

```ts
import { createEvent, createStore, sample } from "effector";

const $query = createStore("");

const queryChanged = createEvent<string>();

sample({
  clock: queryChanged,
  target: $query,
});
```

</TabItem >

<TabItem label="createAction">

```ts
import { createStore, createEvent } from "effector";
import { createAction } from "effector-action";

const $query = createStore("");

const queryChanged = createEvent<string>();

createAction(queryChanged, {
  target: $query,
  fn: (target, query) => {
    target(query);
  },
});
```

</TabItem >

</Tabs>

* Также можете вызывать эффект или событие передав его в target, при этом аргументы будут декларативно переданы в `target`:

<Tabs syncId="preferred-operator">
<TabItem label="sample">

```ts
import { createEvent, createStore, sample } from "effector";

const updateQuery = createEvent<string>();
const queryChanged = createEvent<string>();

sample({
  clock: updateQuery,
  target: queryChanged,
});

updateQuery("new query");
```

</TabItem >

<TabItem label="createAction">

```ts
import { createStore, createEvent } from "effector";
import { createAction } from "effector-action";

const updateQuery = createEvent<string>();
const queryChanged = createEvent<string>();

createAction(updateQuery, {
  target: queryChanged,
  fn: (target, query) => {
    target(query);
  },
});

updateQuery("new query");
```

</TabItem >

</Tabs>

* Вы можете контролировать вызов `target` по условию, подробнее об этом на странице API для sample:

<Tabs syncId="preferred-operator">
<TabItem label="sample">

```ts
import { createEvent, createStore, sample } from "effector";

const $query = createStore("");
const $shouldUpdate = createStore(false);

const queryChanged = createEvent<string>();

sample({
  clock: queryChanged,
  filter: $shouldUpdate,
  target: $query,
});
```

</TabItem >

<TabItem label="createAction">

```ts
import { createStore, createEvent } from "effector";
import { createAction } from "effector-action";

const $query = createStore("");
const $shouldUpdate = createStore(false);

const queryChanged = createEvent<string>();

createAction(queryChanged, {
  source: {
    $shouldUpdate,
  },
  target: $query,
  fn: (target, { shouldUpdate }, query) => {
    if (shouldUpdate) {
      target(query);
    }
  },
});
```

</TabItem >

</Tabs>

* Вы также можете производить вычисления в `fn` функции, однако держите в голове, что это должно быть чистой функцией, а также синхронной.

#### Ограничения `createAction`

У оператора `createAction` есть важное ограничение: при вызове одного и того же `target` несколько раз, только последний будет вызван:

```ts
import { createStore, createEvent } from "effector";
import { createAction } from "effector-action";

const $counter = createStore(0);

const increase = createEvent<number>();

createAction(increase, {
  target: $counter,
  fn: (target, delta) => {
    target(delta);
    // отработает только последний вызов target
    target(delta + 5);
  },
});
```

### Как использовать эти операторы

Использование этих операторов подразумевает построение атомарных связей вместо одного крупного блока кода. Для примера давайте рассмотрим еще один сценарий приложения – форма поиска с параметрами. Давайте в начале посмотрим как бы такое мы писали на ванильном js коде:
Предположим у нас есть какой-то стейт в UI фреймворке:

```ts
const state = {
  query: "",
  category: "all",
  results: [],
  isLoading: false,
  error: null,
};
```

Функции для изменения стейта:

```ts
function handleQueryChanged(payload) {
  // здесь может быть любое изменение стейта из React/Vue/Solid и других фреймворков
  state.query = payload;
}

function handleCategoryChanged(payload) {
  // здесь может быть любое изменение стейта из React/Vue/Solid и других фреймворков
  state.category = payload;
}
```

И основная функция для запроса данных:

```ts
async function handleSearchClick() {
  state.error = null;
  state.results = [];

  state.isLoading = true;

  try {
    const currentQuery = state.query;
    const currentCategory = state.category;
    // какой-то вызов api
    const data = await apiCall(currentQuery, currentCategory);
    state.results = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.isLoading = false;
  }
}
```

Осталось только в UI вызывать эти функции в нужный момент. С помощью операторов `sample` или `createAction` работа обстоит чуть иначе, мы будем создавать атомарные независимые связи между юнитами. Для начала перепишем предыдущий код на юниты:

```ts del={1-7} ins={9-14}
// model.ts
const state = {
  query: "",
  category: "all",
  results: [],
  isLoading: false,
  error: null,
};

const $query = createStore("");
const $category = createStore("all");
const $results = createStore([]);
const $error = createStore(null);
const $isLoading = createStore(false);
```

Нам нужны события для изменения сторов и также добавить логику изменения этих сторов:

```ts del={1-7} ins={9-22}
// model.ts
function handleQueryChanged(payload) {
  state.query = payload;
}

function handleCategoryChanged(payload) {
  state.category = payload;
}

const queryChanged = createEvent<string>();
const categoryChanged = createEvent<string>();

sample({
  clock: queryChanged,
  target: $query,
});

sample({
  clock: categoryChanged,
  target: $category,
});
```

И теперь нам нужно также реализовать основную логику поиска:

```ts del={1-19} ins={21-51}
// model.ts
async function handleSearchClick() {
  state.error = null;
  state.results = [];

  state.isLoading = true;

  try {
    const currentQuery = state.query;
    const currentCategory = state.category;
    // какой-то вызов api
    const data = await apiCall(currentQuery, currentCategory);
    state.results = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.isLoading = false;
  }
}

const searchClicked = createEvent();

const searchFx = createEffect(async ({ query, category }) => {
  const data = await apiCall(currentQuery, currentCategory);
  return data;
});

sample({
  clock: searchClicked,
  source: {
    query: $query,
    category: $category,
  },
  target: searchFx,
});

sample({
  clock: searchFx.$pending,
  target: $isLoading,
});

sample({
  clock: searchFx.failData,
  fn: (error) => error.message,
  target: $error,
});

sample({
  clock: searchFx.doneData,
  target: $results,
});
```

В итоговом виде мы будем иметь такую модель данных:

```ts
// model.ts
import { createStore, createEvent, createEffect, sample } from "effector";

const $query = createStore("");
const $category = createStore("all");
const $results = createStore([]);
const $error = createStore(null);
const $isLoading = createStore(false);

const queryChanged = createEvent<string>();
const categoryChanged = createEvent<string>();
const searchClicked = createEvent();

const searchFx = createEffect(async ({ query, category }) => {
  const data = await apiCall(query, category);
  return data;
});

sample({
  clock: queryChanged,
  target: $query,
});

sample({
  clock: categoryChanged,
  target: $category,
});

sample({
  clock: searchClicked,
  source: {
    query: $query,
    category: $category,
  },
  target: searchFx,
});

sample({
  clock: searchFx.$pending,
  target: $isLoading,
});

sample({
  clock: searchFx.failData,
  fn: (error) => error.message,
  target: $error,
});

sample({
  clock: searchFx.doneData,
  target: $results,
});
```

### Связанные API и статьи

* **API**
  * sample - Оператор для построения связей между юнитами
  * Event - Описание события и его методов
  * Store - Описание стора и его методов
  * Effect - Описание эффекта и его методов
* **Статьи**
  * Гайд по типизация юнитов и операторов
  * Описание основных ошибок, частых проблем и методы их решения
  * Как мыслить в парадигме effector


# Сайд-эффекты и  асинхронность

## Сайд-эффекты и асинхронность

Для работы с сайд-эффектами и любой асинхронностью effector предоставляет эффекты. Сайд-эффектами является все, что может повлиять на чистоту вашей функции, например:

* HTTP запрос на сервер
* Изменение или работа с глобальными переменными
* Взаимодействие с браузерным API (`addEventListener`, `setTimeout` и тд)
* Работа с `localStorage`, `IndexedDB` и другими хранилищами
* Любой код, который может выбросить ошибку, или выполняться какое-то время

```ts
import { createEffect, sample, createStore } from "effector";

const $user = createStore(null);

const fetchUserFx = createEffect(async (userId: string) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
});

// при успешном выполнении эффекта $user будет обновлен возвращаемым значением
sample({
  clock: fetchUserFx.doneData,
  target: $user,
});
```

Однако зачем нам вообще эффекты? В effector большинство функций, например store.on, sample.fn и другие являются чистыми, то есть работают только с данными полученными через аргументы. Такие функции **не могут быть** асинхронными или иметь сайд-эффектов, так как это нарушит предсказуемость и реактивность.

### Преимущества эффектов

Эффект является контейнером для сайд-эффектов или асинхронных функций, которые могут либо выкинуть ошибку во время выполнения, либо же выполняться неопределенное время, и чтобы связать эффекты с реактивной системой у них есть удобные свойства.
Вот несколько из них:

* pending — стор, который указывает выполняется ли эффект, удобно чтобы показывать лоадер в UI.
* doneData — событие, срабатывает когда эффект завершился без ошибок.
* failData — еще одно событие, которое сработает если во время выполнения эффекта выбросилась ошибка с результатом ошибки.

> WARNING Производные юниты: 
>
> Любое из свойств эффектов вызывается само ядром effector, это значит, что вам не нужно самим пытаться вызвать их вручную.

Поскольку у эффектов есть свои события, то работа с ними происходит также, как и при работе с обычными событиями, однако давайте посмотрим на простой пример использования эффектов:

```ts
// model.ts
import { createEffect, createEvent, createStore, sample } from "effector";

export const $error = createStore<string | null>(null);

export const submit = createEvent();

// простая отправка формы, но обертнутая в эффект
const sendFormFx = createEffect(async ({ name, email }: { name: string; email: string }) => {
  try {
    await fetch("/api/user-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
  } catch {
    throw new Error("Failed to send form");
  }
});

export const $isLoading = sendFormFx.pending;

sample({
  clock: sendFormFx.failData,
  fn: (error) => error.message,
  target: $error,
});

sample({
  clock: submit,
  target: sendFormFx,
});
```

> INFO один аргумент: 
>
> Эффекты, как и события, способны принимать только один аргумент. Если вам необходимо передать несколько аргументов, то используйте объект, как в примере выше `{ name, email }`

В UI мы просто будем вызывать `submit` событие, отображать лоадер во время загрузки и показывать ошибку, если таковая будет:

```tsx "{isLoading && <div>Loading...</div>}" "{error && <div>{error}</div>}" "onSubmit"
// view.tsx
import { useUnit } from "effector-react";
import { $error, $isLoading, submit } from "./model.ts";

const Form = () => {
  const { isLoading, error } = useUnit({
    isLoading: $isLoading,
    error: $error,
  });
  const onSubmit = useUnit(submit);

  return (
    <form onSubmit={onSubmit}>
      <input name="name" />
      <input name="email" />
      <button type="submit">Submit</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error}</div>}
    </form>
  );
};
```

Рассмотрим чуть подробнее пример модели, в примере ниже мы связываем событие failData эффекта и стора `$error`, событие failData передаст значение ошибки в стор `$error`:

```ts
sample({
  clock: sendFormFx.failData,
  fn: (error) => error.message,
  target: $error,
});
```

А при вызове события `submit` просто вызвать эффект положив его в target:

```ts
sample({
  clock: submit,
  target: sendFormFx,
});
```

### Вызовы эффектов

Вызовы эффектов аналогичны вызову событий, вы можете вызывать его внутри компонента, обернув его перед этим в хук `useUnit` и использовав возвращаемое значение как функцию:

```ts
const fetchUser = useUnit(fetchUserFx);
```

Однако такой способ не рекомендуется, чтобы наш UI слой не знал много о бизнес-логике. Альтернатива это создать событие, которое мы будем экспортировать, для запуске этого эффекта в модели и связать их с помощью sample, при этом аргументы с которыми было вызвано событие будут переданы в эффект:

```ts
import { createEvent, sample } from "effector";

export const updateProfileButtonPressed = createEvent<string>();

sample({
  clock: updateProfileButtonPressed,
  target: fetchUserFx,
});
```

> TIP Зачем мне событие для вызова эффекта?: 
>
> На странице Как мыслить в парадигме effector мы рассказали, почему нужно разделять бизнес-логику и UI.

Вы также можете вызывать эффекты внутри самих эффектов:

```ts
import { createEffect } from "effector";

const fetchInitialData = createEffect(async (userId: string) => {
  const userData = await getUserByIdFx(userId);

  const friends = await getUserByIds(userData.friends);

  return userData.name;
});
```

#### Вызов событий в эффекте

Вы можете вызывать события внутри эффекта, например это может быть полезно когда мы хотим запустить событие по таймеру:

```ts
import { createEffect, createEvent } from "effector";

const tick = createEvent();

const fetchInitialData = createEffect(async () => {
  //не забудьте в будущем очистить id!
  const id = setInterval(() => {
    tick();
  }, 1000);
});
```

Однако здесь может возникнуть Потеря скоупа если вы работаете со скоупом, в этом случае вам нужно использовать scopeBind. Если вы не используете скоуп, то ничего оборачивать не нужно.

### Обновить стор с помощью эффекта

Классический пример использования эффектов – мы хотим обновить стор по его завершению. Логика работы здесь такая же, как и при работе с событиями, просто подписываемся на doneData и передаем нужный стор в target:

```ts
import { createStore, createEffect } from "effector";

const fetchUserNameFx = createEffect(async (userId: string) => {
  const userData = await fetch(`/api/users/${userId}`);

  return userData.name;
});

const $error = createStore<string | null>(null);
const $userName = createStore("");
const $isLoading = fetchUserNameFx.pending;

sample({
  clock: fetchUserNameFx.doneData,
  target: $userName,
});

sample({
  clock: fetchUserNameFx.failData,
  fn: (error) => error.message,
  target: $error,
});
```

### Обработка ошибок

Эффект способен отловить, когда во время его выполнения происходит ошибка и передать ее в событие failData. И порой мы хотим выкинуть свою ошибку, а не обычный `Error`:

```ts
import { createEffect } from "effector";

class CustomError extends Error {
  // реализация
}

const effect = createEffect(async () => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    // Вы можете выбрасывать ошибки, которые будут перехвачены обработчиком .failData
    throw new CustomError(`Не удалось загрузить пользователя: ${response.statusText}`);
  }

  return response.json();
});
```

Код выше абсолютно валидный и отработает как надо, однако если мы перехватим ошибку с помощью события failData, то заметим тип `Error` вместо нашей кастомной ошибки `CustomError`:

```ts
sample({
  clock: effect.failData,
  // error будет типа Error, а не CustomError
  fn: (error) => error.message,
  target: $error,
});
```

Вся проблема кроется в типах, по умолчанию эффект ожидает, что выкинет тип ошибки `Error` и конечно не может знать, что у нас в теле функции выкидывается `CustomError`. Решение проблемы простое, нужно передать нужный тип в дженерик createEffect, однако также придется и прокинуть тип принимаемых параметров и возвращаемое значение:

```ts ins="<Params, Done, CustomError>"
import { createEffect } from "effector";

class CustomError extends Error {
  // реализация
}

const effect = createEffect<Params, Done, CustomError>(async () => {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    // Вы можете выбрасывать ошибки, которые будут перехвачены обработчиком .failData
    throw new CustomError(`Не удалось загрузить пользователя: ${response.statusText}`);
  }

  return response.json();
});
```

Более подробнее о типизации эффектов и других юнитов можно прочитать на странице Типизация.

### Переиспользование эффектов

Нередкий кейс, это когда у нас имеется общий эффект, например `fetchShopCardsFx`, который мы можем переиспользовать в нескольких местах приложения и при этом мы все также хотим подписаться на его события doneData, failData или любое другое, однако если мы это сделаем, то столкнемся с проблемным поведением, когда на одной странице будет вызываться этот эффект, а его подписчики будут тригириться везде, потому что мы использовали один и тот же общий эффект. И это нормальное поведение, потому что юниты эффектора должны объявляться статически на уровне модуля, но все же не то, которое бы мы хотели. Решением проблемы будет использовать оператор attach, который создаст копию прикрепленного эффекта, а с этой копией мы можем уже работать только на нашей странице:

```ts "attach"
import { createEffect, attach, createEvent } from "effector";

const showNotification = createEvent();

// где-то в общем переипользуемом месте
const fetchShopCardsFx = createEffect(async () => {
  const response = await fetch("/api/shop-cards");
  return response.json();
});

// наша локальная копия, на которую можем смело подписаться
const fetchShopCardsAttachedFx = attach({
  effect: fetchShopCards,
});

sample({
  clock: fetchShopCardsAttachedFx.failData,
  target: showNotification,
});
```

При вызове прикрепленного эффекта, созданного с помощью attach,также будет вызываться и оригинальный эффект, переданный в effect.

### Связанные API и статьи

* **API**
  * Effect - Описание эффекта и его методов
  * createEffect - Метод для создания эффектов
  * attach - Метод, который позволяет создавать новые эффекты на основе существующих
* **Статьи**
  * Типизация эффектов и других юнитов
  * Почему юниты должны объявляться статически на уровне модуля
  * Связывание юнитов с помощью&#x20;
  * Рассказываем об изолированных скоупах, когда их нужно использовать и зачем, а также раскрываем проблему потери скоупа


# Приоритет вычислений

## Приоритет вычислений

Наверняка вы заметили, что функция должна быть чистой... или следить за тем, чтобы в ней не было побочных эффектов. Мы поговорим об этом в текущем разделе – **Приоритет вычислений**.

Реальный пример приоритета в очереди — люди, ожидающие медицинской помощи в больнице, экстренные случаи будут иметь наивысший приоритет и перемещаться в начало очереди, а менее значительные — в конец.

Приоритет вычислений позволяет нам иметь побочные эффекты, и это одна из основных причин создания этой концепции:

* Позволяет сначала выполнить чистые функции.
* Побочные эффекты могут следовать за согласованным состоянием приложения.

На самом деле, чистое вычисление не может быть наблюдаемо вне своей области видимости, поэтому определение ***чистого вычисления***, используемое в этой библиотеке, дает нам возможность оптимизировать группировку.

Приоритет:

[Исходный код](https://github.com/effector/effector/blob/master/src/effector/kernel.ts#L169)

```
1. child -> forward
2. pure -> map, on
3. sampler -> sample, guard, combine
4. effect -> watch, обработчик эффекта
```

> Всякий раз, когда вы разрешаете побочные эффекты в чистых вычислениях, библиотека будет работать по наихудшему сценарию. Тем самым увеличивая несогласованность приложения и нарушая чистые вычисления. Не игнорируйте это.

Давайте рассмотрим приоритизацию на примере ниже.

```js
let count = 0;
const fx = createEffect(() => {
  // побочный эффект 1
  count += 1;
});

fx.done.watch(() => {
  // побочный эффект 1 уже выполнен
  console.log("ожидаем, что count будет 1", count === 1);
  // побочный эффект 2
  count += 1;
});

fx();
// побочный эффект 1 уже выполнен
// побочный эффект 2 также уже выполнен
// это то, что мы ожидали
// это эффект watchmen
console.log("ожидаем, что count будет 2", count === 2);
// пример, который нарушает это соглашение: setState в react
// который откладывает любой побочный эффект на долгое время после вызова setState
```

Запустить пример

> INFO Обратите внимание: 
>
> Всякий раз, когда библиотека замечает побочный эффект в чистой функции, она перемещает его в конец [**очереди приоритетов**](https://en.wikipedia.org/wiki/Priority_queue).

Мы надеемся, что эта информация прояснила некоторые моменты в том, как работает библиотека.


# Глоссарий

## Глоссарий

### Event

*Event* (*событие*, *ивент*) это функция, на вызовы которой можно подписаться. Она может обозначать намерение изменить состояния в приложении, указанием на то, что происходит в приложении, быть командой для управления сущностями, триггером вычислений и так далее.

Event в документации.

### Store

*Store* (*состояние*, *стор*) это объект который хранит состояние. В приложении могут совместно существовать множество состояний

Store в документации.

### Производный стор (Derived store)

*Производный стор* (*derived store*) это стор только для чтения, который создается из других сторов и автоматически обновляется при изменении исходных сторов. Производные сторы создаются с помощью методов таких как Store.map, combine, или как свойства эффектов (например, Effect.pending).

Ключевые особенности:

* Не может быть изменен напрямую событиями
* Не может быть использован как `target` в sample
* Всегда зависит от исходных сторов
* Обновляется автоматически при изменении исходных сторов

Store в документации.

### Effect

*Effect* это контейнер для сайд-эффектов, возможно асинхронных. В комплекте имеет ряд заранее созданных эвентов и сторов, облегчающих стандартные действия

При императивном вызове всегда возвращает Promise с результатом.

Может иметь один аргумент или не иметь ни одного

Effect в документации

### Domain

*Domain* это способ группировки и применения массовых обработок к юнитам. Домены получают уведомления о создании событий, сторов, эффектов и вложенных доменов. Часто используются для логирования и SSR

Domain в документации

### Unit

Тип данных, используемый для описания бизнес-логики приложений. Большинство методов эффектора имеют дело с обработкой юнитов.
Существует пять типов юнитов: , Event, Effect, Domain и 

### Common unit

Обычные юниты можно использовать для запуска обновлений других юнитов. Существует три типа обычных юнитов: Store (стор), Event (событие) и Effect (эффект). **Когда метод принимает юниты, это означает, что он принимает события, эффекты и сторы** в качестве источника реактивных обновлений

### Purity

Большинство функций, передаваемых в методы api не должны вызывать другие события или эффекты: легче рассуждать о потоке данных приложения, когда императивные триггеры сгруппированы внутри обработчиков эффектов, а не рассредоточены по всей бизнес-логике

**Правильно**, императивно:

```js
import { createStore, createEvent } from "effector";

const login = createStore("guest");

const loginSize = login.map((login) => login.length);

const submitLoginSize = createEvent();

loginSize.watch((size) => {
  submitLoginSize(size);
});
```

Запустить пример

`store.map` в документации

`store.watch` в документации

**Правильно**, декларативно:

```js
import { createStore, createEvent, sample } from "effector";

const login = createStore("guest");

const loginSize = login.map((login) => login.length);

const submitLoginSize = createEvent();

sample({
  clock: loginSize,
  target: submitLoginSize,
});
```

Запустить пример

sample в документации

**Неправильно**:

```js
import { createStore, createEvent } from "effector";

const submitLoginSize = createEvent();

const login = createStore("guest");
const loginSize = login.map((login) => {
  // лучше переместить этот вызов в watch или эффект
  submitLoginSize(login.length);
  return login.length;
});
```

### Reducer

```typescript
type StoreReducer<State, E> = (state: State, payload: E) => State | void;
type EventOrEffectReducer<T, E> = (state: T, payload: E) => T;
```

*Reducer* вычисляет новое состояние, учитывая предыдущее состояние и данные из события. Для сторов, если reducer возвращает undefined или то же состояние (===), то обновления не будет

### Watcher

```typescript
type Watcher<T> = (update: T) => any;
```

*Watcher* – функция с сайд-эффектами, для работы которых не нужны возможности по перехвату ошибок и уведомления подписчиков об завершении асинхронной работы. Используется в event.watch, store.watch и хуках домена. Возвращаемое значение игнорируется

### Subscription

```typescript
type Subscription = {
  (): void;
  unsubscribe(): void;
};
```

Функция отмены подписки, после её вызова watcher перестаёт получать обновления и удаляется из памяти. Повторные вызовы функции отмены подписки не делают ничего

> WARNING Предупреждение: 
>
> **Ручное управление подписками мешает сосредоточиться на управлении данными и бизнес-логикой** <br/><br/>
> Эффектор предоставляет широкий набор возможностей, чтобы свести необходимость удаления подписок к минимуму. Это отличает его от большинства других реактивных библиотек

[effect]: /ru/api/effector/Effect

[store]: /ru/api/effector/Store

[event]: /ru/api/effector/Event

[domain]: /ru/api/effector/Domain

[scope]: /ru/api/effector/Scope


# Prior Art

## Prior Art

### Пейперы

* **Functional Pearl. Weaving a Web** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/weaver+zipper.pdf) *Ralf Hinze and Johan Jeuring*
* **A graph model of data and workflow provenance** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/A+graph+model+of+data+and+workflow+provenance.pdf) <br/> *Umut Acar, Peter Buneman, James Cheney, Jan Van den Bussche, Natalia Kwasnikowska and Stijn Vansummeren*
* **An Applicative Control-Flow Graph Based on Huet’s Zipper** [\[pdf\]](http://zero-bias-papers.s3-website-eu-west-1.amazonaws.com/zipcfg.pdf) <br/> *Norman Ramsey and Joao Dias*
* **Elm: Concurrent FRP for Functional GUIs** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/elm-concurrent-frp.pdf) <br/> *Evan Czaplicki*
* **Inductive Graphs and Functional Graph Algorithms** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/Inductive+Graphs+and+Functional+Graph+Algorithms.pdf) <br/> *Martin Erwig*
* **Notes on Graph Algorithms Used in Optimizing Compilers** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/Graph+Algorithms+Used+in+Optimizing+Compilers.pdf) <br/> *Carl D. Offner*
* **Backtracking, Interleaving, and Terminating Monad Transformers** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/Backtracking%2C+Interleaving%2C+and+Terminating+Monad+Transformers.pdf) <br/> *Oleg Kiselyov, Chung-chieh Shan, Daniel P. Friedman and Amr Sabry*
* **Typed Tagless Final Interpreters** [\[pdf\]](https://zero-bias-papers.s3-eu-west-1.amazonaws.com/Typed+Tagless+Final+Interpreters.pdf) *Oleg Kiselyov*

### Книги

* **Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions** [\[book\]](https://www.amazon.com/o/asin/0321200683/ref=nosim/enterpriseint-20), [\[messaging patterns overview\]](https://www.enterpriseintegrationpatterns.com/patterns/messaging/) <br/> *Gregor Hohpe and Bobby Woolf*

### API

* [re-frame](https://github.com/day8/re-frame)
* [flux](https://facebook.github.io/flux/)
* [redux](https://redux.js.org/)
* [redux-act](https://github.com/pauldijou/redux-act)
* [most](https://github.com/cujojs/most)
* nodejs [events](https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_emitter_on_eventname_listener)


# Sids

## Сторы и их sid

Effector основан на идее атомарного стора. Это означает, что в приложении нет централизованного контроллера состояния или другой точки входа для сбора всех состояний в одном месте.

Итак, возникает вопрос — как отличать юниты между разными окружениями? Например, если мы запускаем приложение на сервере и сериализуем его состояние в JSON, как узнать, какая часть этого JSON должна быть помещена в конкретный стор на клиенте?

Давайте обсудим, как эта проблема решается другими менеджерами состояний.

### Другие менеджеры состояний

#### Один стор

В менеджере состояний с одним стором (например, Redux) этой проблемы вообще не существует. Это один стор, который можно сериализовать и десериализовать без какой-либо дополнительной информации.

> INFO: 
>
> Фактически, один стор принуждает вас к созданию уникальных имен для каждой его части неявным образом. В любом объекте вы не сможете создать дублирующие ключи, так что путь к части стора — это уникальный идентификатор этой части.

```ts
// server.ts
import { createStore } from "single-store-state-manager";

function handlerRequest() {
  const store = createStore({ initialValue: null });

  return {
    // Можно просто сериализовать весь стор
    state: JSON.stringify(store.getState()),
  };
}

// client.ts
import { createStore } from "single-store-state-manager";

// Предположим, что сервер поместил состояние в HTML
const serverState = readServerStateFromWindow();

const store = createStore({
  // Просто парсим все состояние и используем его как состояние клиента
  initialValue: JSON.parse(serverState),
});
```

Это здорово, что не нужно никаких дополнительных инструментов для сериализации и десериализации, но у одного стора есть несколько проблем:

* Он не поддерживает tree-shaking и code-splitting, вам все равно придется загружать весь стор
* Из-за своей архитектуры он требует дополнительных инструментов для исправления производительности (например, `reselect`)
* Он не поддерживает микрофронтенды и другие вещи, которые становятся все более популярными

#### Множественные сторы

К сожалению, менеджеры состояний, построенные вокруг идеи множественных сторов, плохо решают эту проблему. Некоторые инструменты предлагают решения, подобные одному стору (MobX), некоторые вообще не пытаются решить эту проблему (Recoil, Zustand).

> INFO: 
>
> Например, общий паттерн для решения проблемы сериализации в MobX — это [Root Store Pattern](https://dev.to/ivandotv/mobx-root-store-pattern-with-react-hooks-318d), который разрушает всю идею множественных сторов.

Мы рассматриваем SSR как первоклассного гражданина современных веб-приложений и собираемся поддерживать code-splitting или микрофронтенды.

### Уникальные идентификаторы для каждого стора

Из-за архитектуры с множественными сторов, Effector требует уникального идентификатора для каждого стора. Это строка, которая используется для различения сторов между разными окружениями. В мире Effector такие строки называются `sid`.

\:::tip TL;DR

`sid` — это уникальный идентификатор стора. Он используется для различения сторов между разными окружениями.

\:::

Давайте добавим его в некоторые сторы:

```ts
const $name = createStore(null, { sid: "name" });
const $age = createStore(null, { sid: "age" });
```

Теперь мы можем сериализовать и десериализовать сторы:

```ts
// server.ts
async function handlerRequest() {
  // создаем изолированный экземпляр приложения
  const scope = fork();

  // заполняем сторы данными
  await allSettled($name, { scope, params: "Igor" });
  await allSettled($age, { scope, params: 25 });

  const state = JSON.serialize(serialize(scope));
  // -> { "name": "Igor", "age": 25 }

  return { state };
}
```

После этого кода у нас есть сериализованное состояние нашего приложения. Это простой объект со значениями сторов. Мы можем вернуть его обратно в сторы на клиенте:

```ts
// Предположим, что сервер поместил состояние в HTML
const serverState = readServerStateFromWindow();

const scope = fork({
  // Просто парсим все состояние и используем его как состояние клиента
  values: JSON.parse(serverState),
});
```

Конечно, написание `sid` для каждого стора — это скучная работа. Effector предоставляет способ сделать это автоматически с помощью плагинов для трансформации кода.

#### Автоматический способ

Безусловно, создание уникальных идентификаторов вручную — это довольно скучная работа.

К счастью, существуют effector/babel-plugin и @effector/swc-plugin, которые автоматически создадут sid.

Поскольку инструменты трансляции кода работают на уровне файла и запускаются до этапа сборки, возможно сделать sid **стабильными** для каждого окружения.

> TIP: 
>
> Предпочтительно использовать effector/babel-plugin или @effector/swc-plugin вместо добавления sid вручную.

**Пример кода**

Обратите внимание, что здесь нет никакой центральной точки — любое событие любой "фичи" может быть вызвано из любого места, и остальные части будут реагировать соответствующим образом.

```tsx
// src/features/first-name/model.ts
import { createStore, createEvent } from "effector";

export const firstNameChanged = createEvent<string>();
export const $firstName = createStore("");

$firstName.on(firstNameChanged, (_, firstName) => firstName);

// src/features/last-name/model.ts
import { createStore, createEvent } from "effector";

export const lastNameChanged = createEvent<string>();
export const $lastName = createStore("");

$lastName.on(lastNameChanged, (_, lastName) => lastName);

// src/features/form/model.ts
import { createEvent, sample, combine } from "effector";

import { $firstName, firstNameChanged } from "@/features/first-name";
import { $lastName, lastNameChanged } from "@/features/last-name";

export const formValuesFilled = createEvent<{ firstName: string; lastName: string }>();

export const $fullName = combine($firstName, $lastName, (first, last) => `${first} ${last}`);

sample({
  clock: formValuesFilled,
  fn: (values) => values.firstName,
  target: firstNameChanged,
});

sample({
  clock: formValuesFilled,
  fn: (values) => values.lastName,
  target: lastNameChanged,
});
```

Если это приложение было бы SPA или каким-либо другим клиентским приложением, на этом статья была бы закончена.

#### Граница сериализации

Но в случае с рендерингом на стороне сервера всегда есть **граница сериализации** — точка, где все состояние преобразуется в строку, добавляется в ответ сервера и отправляется в браузер клиента.

##### Проблема

И в этот момент нам **все еще нужно собрать состояния всех сторов приложения** каким-то образом!

Кроме того, после того как клиентский браузер получил страницу, нам нужно "гидрировать" все обратно: распаковать эти значения на клиенте и добавить это "серверное" состояние в клиентские экземпляры всех сторов.

##### Решение

Это сложная проблема, и для ее решения effector нужен способ связать "серверное" состояние какого-то стора с его клиентским экземпляром.

Хотя **это можно было бы** сделать путем введения "корневого стора" или чего-то подобного, что управляло бы экземплярами сторов и их состоянием за нас, это также принесло бы нам все минусы этого подхода, например, гораздо более сложный code-splitting — поэтому это все еще нежелательно.

Здесь нам очень помогут сиды. Поскольку сид, по определению, одинаков для одного и того же стора в любом окружении, effector может просто полагаться на него для обработки сериализации состояния и гидрации.

##### Пример

Это универсальный обработчик рендеринга на стороне сервера. Функция `renderHtmlToString` — это деталь реализации, которая будет зависеть от используемого вами фреймворка.

```tsx
// src/server/handler.ts
import { fork, allSettled, serialize } from "effector";

import { formValuesFilled } from "@/features/form";

async function handleServerRequest(req) {
  const scope = fork(); // создает изолированный контейнер для состояния приложения

  // вычисляем состояние приложения в этом scope
  await allSettled(formValuesFilled, {
    scope,
    params: {
      firstName: "John",
      lastName: "Doe",
    },
  });

  // извлекаем значения scope в простой js объект `{[storeSid]: storeState}`
  const values = serialize(scope);

  const serializedState = JSON.stringify(values);

  return renderHtmlToString({
    scripts: [
      `
        <script>
            self._SERVER_STATE_ = ${serializedState}
        </script>
      `,
    ],
  });
}
```

Обратите внимание, что здесь нет прямого импорта каких-либо сторов приложения.
Состояние собирается автоматически, и его сериализованная версия уже содержит всю информацию, которая понадобится для гидрации.

Когда сгенерированный ответ поступает в браузер клиента, серверное состояние должно быть гидрировано в клиентские сторы.
Благодаря сидам, гидрация состояния также работает автоматически:

```tsx
// src/client/index.ts
import { Provider } from "effector-react";

const serverState = window._SERVER_STATE_;

const clientScope = fork({
  values: serverState, // просто назначаем серверное состояние на scope
});

clientScope.getState($lastName); // "Doe"

hydrateApp(
  <Provider value={clientScope}>
    <App />
  </Provider>,
);
```

На этом этапе состояние всех сторов в `clientScope` такое же, как было на сервере, и для этого не потребовалось **никакой** ручной работы.

### Уникальные sid

Стабильность sid'а обеспечивается тем, что они добавляются в код до того, как произойдет какая-либо сборка.

Но поскольку оба плагина, и `babel`, и `swc`, могут "видеть" содержимое только одного файла в каждый момент времени, есть случай, когда sid будут стабильными, но **могут быть не уникальными**.

Чтобы понять почему, нам нужно углубиться немного дальше во внутренности плагинов.

Оба плагина `effector` используют один и тот же подход к трансформации кода. По сути, они делают две вещи:

1. Добавляют `sid` и любую другую мета-информацию к вызовам фабрик Effector, таким как `createStore` или `createEvent`.
2. Оборачивают любые кастомные фабрики с помощью вспомогательной функции `withFactory`, которая позволяет сделать `sid` внутренних юнитов также уникальными.

#### Встроенные фабрики юнитов

Рассмотрим первый случай. Для следующего исходного кода:

```ts
const $name = createStore(null);
```

Плагин применит следующие трансформации:

```ts
const $name = createStore(null, { sid: "j3l44" });
```

> TIP: 
>
> Плагины создают `sid` как хэш от местоположения юнита в исходном коде. Это позволяет сделать `sid` уникальными и стабильными.

#### Кастомные фабрики

Второй случай касается кастомных фабрик. Эти фабрики обычно создаются для абстрагирования какого-то общего паттерна.

Примеры кастомных фабрик:

* `createQuery`, `createMutation` из [`farfetched`](https://ff.effector.dev/)
* `debounce`, `throttle` и т.д. из [`patronum`](https://patronum.effector.dev/)
* Любая кастомная фабрика в вашем коде, например фабрика сущности [feature-flag](https://ff.effector.dev/recipes/feature_flags.html)

> TIP: 
>
> farfetched, patronum, @effector/reflect, atomic-router и @withease/factories поддерживаются по умолчанию и не требуют дополнительной настройки.

Для этого объяснения мы создадим очень простую фабрику:

```ts
// src/shared/lib/create-name/index.ts
export function createName() {
  const updateName = createEvent();
  const $name = createStore(null);

  $name.on(updateName, (_, nextName) => nextName);

  return { $name };
}

// src/feature/persons/model.ts
import { createName } from "@/shared/lib/create-name";

const personOne = createName();
const personTwo = createName();
```

Сначала плагин добавит `sid` во внутренние сторы фабрики:

```ts
// src/shared/lib/create-name/index.ts
export function createName() {
  const updateName = createEvent();
  const $name = createStore(null, { sid: "ffds2" });

  $name.on(updateName, (_, nextName) => nextName);

  return { $name };
}

// src/feature/persons/model.ts
import { createName } from "@/shared/lib/create-name";

const personOne = createName();
const personTwo = createName();
```

Но этого недостаточно, потому что мы можем создать два экземпляра `createName`, и внутренние сторы обоих этих экземпляров будут иметь одинаковые sid!
Эти sid будут стабильными, но не уникальными.

Чтобы исправить это, нам нужно сообщить плагину о нашей кастомной фабрике:

```json
// .babelrc
{
  "plugins": [
    [
      "effector/babel-plugin",
      {
        "factories": ["@/shared/lib/create-name"]
      }
    ]
  ]
}
```

Поскольку плагин "видит" только один файл за раз, нам нужно предоставить ему фактический путь импорта, используемый в модуле.

> TIP: 
>
> Если в модуле используются относительные пути импорта, то полный путь от корня проекта должен быть добавлен в список `factories`, чтобы плагин мог его разрешить.
>
> Если используются абсолютные или псевдонимы путей (как в примере), то именно этот псевдонимный путь должен быть добавлен в список `factories`.
>
> Большинство популярных проектов экосистемы уже включены в настройки плагина по умолчанию.

Теперь плагин знает о нашей фабрике, и он обернет `createName` внутренней функцией `withFactory`:

```ts
// src/shared/lib/create-name/index.ts
export function createName() {
  const updateName = createEvent();
  const $name = createStore(null, { sid: "ffds2" });

  $name.on(updateName, (_, nextName) => nextName);

  return { $name };
}

// src/feature/persons/model.ts
import { withFactory } from "effector";
import { createName } from "@/shared/lib/create-name";

const personOne = withFactory({
  sid: "gre24f",
  fn: () => createName(),
});
const personTwo = withFactory({
  sid: "lpefgd",
  fn: () => createName(),
});
```

Благодаря этому sid внутренних юнитов фабрики также уникальны, и мы можем безопасно сериализовать и десериализовать их.

```ts
personOne.$name.sid; // gre24f|ffds2
personTwo.$name.sid; // lpefgd|ffds2
```

#### Как работает `withFactory`

`withFactory` — это вспомогательная функция, которая позволяет создавать уникальные `sid` для внутренних юнитов. Это функция, которая принимает объект с `sid` и `fn` свойствами. `sid` — это уникальный идентификатор фабрики, а `fn` — функция, которая создает юниты.

Внутренняя реализация `withFactory` довольно проста: она помещает полученный `sid` в глобальную область видимости перед вызовом `fn` и удаляет его после. Любая функция создателя Effector пытается прочитать это глобальное значение при создании и добавляет его значение к `sid` юнита.

```ts
let globalSid = null;

function withFactory({ sid, fn }) {
  globalSid = sid;

  const result = fn();

  globalSid = null;

  return result;
}

function createStore(initialValue, { sid }) {
  if (globalSid) {
    sid = `${globalSid}|${sid}`;
  }

  // ...
}
```

Из-за однопоточной природы JavaScript, использование глобальных переменных для этой цели безопасно.

> INFO: 
>
> Конечно, реальная реализация немного сложнее, но идея остается той же.

### Резюме

1. Любой менеджер состояний с множественными сторами требует уникальных идентификаторов для каждого стора, чтобы различать их между разными окружениями.
2. В мире Effector такие строки называются `sid`.
3. Плагины для трансформации кода добавляют `sid` и мета-информацию к созданию юнитов Effector, таких как `createStore` или `createEvent`.
4. Плагины для трансформации кода оборачивают кастомные фабрики вспомогательной функцией `withFactory`, которая позволяет сделать `sid` внутренних юнитов уникальными.


# Лучшие практики и рекомендации

import Tabs from '@components/Tabs/Tabs.astro';
import TabItem from '@components/Tabs/TabItem.astro';

## Лучшие практики в Effector

В этом разделе собраны рекомендации по эффективной работе с Effector, основанные на опыте сообщества и команды разработчиков.

### Создавайте маленькие сторы

В отличие от Redux, в Effector рекомендуется делать сторы максимально атомарными. Давайте разберем, почему это важно и какие преимущества это дает.

Большие сторы с множеством полей создают несколько проблем:

* Лишние ре-рендеры: При изменении любого поля обновляются все компоненты, подписанные на стор
* Тяжелые вычисления: Каждое обновление требует копирования всего объекта
* Лишние вычисления: если вы имеете производные сторы зависящие от большого стора, то они будут перевычисляться

Атомарные сторы позволяют:

* Обновлять только то, что действительно изменилось
* Подписываться только на нужные данные
* Эффективнее работать с реактивными зависимостями

```ts
// ❌ Большой стор - любое изменение вызывает обновление всего
const $bigStore = createStore({
  profile: { /* много полей */ },
  settings: { /* много полей */ },
  posts: [ /* много постов */ ]
})

// ✅ Атомарные сторы - точечные обновления
const $userName = createStore('')
const $userEmail = createStore('')
const $posts = createStore<Post[]>([])
const $settings = createStore<Settings>({})

// Компонент подписывается только на нужные данные
const UserName = () => {
  const name = useUnit($userName) // Обновляется только при изменении имени
  return <h1>{name}</h1>
}
```

Правила атомарных сторов:

* Один стор = одна ответственность
* Стор должен быть неделимым
* Сторы можно объединять через combine
* Обновление стора не должно затрагивать другие данные

### Immer для сложных объектов

Если ваш стор содержит в себе вложенные структуры, то вы можете использовать всеми любимый [Immer](https://github.com/immerjs/immer) для упрощенного обновления:

```ts
import { createStore } from 'effector';
import { produce } from 'immer';

const $users = createStore<User[]>([]);

$users.on(userUpdated, (users, updatedUser) =>
  produce(users, (draft) => {
    const user = draft.find((u) => u.id === updatedUser.id);
    if (user) {
      user.profile.settings.theme = updatedUser.profile.settings.theme;
    }
  }),
);
```

### Явный старт приложения

Чтобы лучше контролировать жизненный цикл вашего приложения мы рекомендуем создавать явные событие, например `appStarted`. Если вам необходим более гранулярный контроль, то не стесняйтесь создавать больше дополнительных событий. Более полную информацию вы найдете на странице Явный запуск приложения.

```ts
export const appStarted = createEvent();
```

### Используйте `scope`

Команда effector рекомендует всегда использовать `Scope`, даже если ваше приложение не использует SSR.
Это необходимо, чтобы в будущем вы могли спокойно мигрировать на режим работы со `Scope`.

### Хук `useUnit`

Использование хука `useUnit` является рекомендуемым способом для работы с юнитами при использовании фреймворков (📘React, 📗Vue и 📘Solid).
Почему нужно использовать `useUnit`:

* Корректная работа со сторами
* Оптимизированные обновления
* Автоматическая работа со  – юниты сами знают в каком скоупе они были вызваны

### Чистые функции

Используйте чистые функции везде, кроме эффектов, для обработки данных, это обеспечивает:

* Детерминированный результат
* Отсутствие сайд-эффектов
* Проще для тестирования
* Легче поддерживать

> TIP Эта работа для эффектов: 
>
> Если ваш код может выбросить ошибку или может закончится успехом/неуспехом - то это отличное место для эффектов.

### Отладка

Мы настоятельно рекомендуем вам использовать библиотеку [`patronum`](https://patronum.effector.dev/operators/) и метод [`debug`](https://patronum.effector.dev/operators/debug/).

```ts
import { createStore, createEvent, createEffect } from 'effector';
import { debug } from 'patronum/debug';

const event = createEvent();
const effect = createEffect().use((payload) => Promise.resolve('result' + payload));
const $store = createStore(0)
  .on(event, (state, value) => state + value)
  .on(effect.done, (state) => state * 10);

debug($store, event, effect);

event(5);
effect('demo');

// => [store] $store 1
// => [event] event 5
// => [store] $store 6
// => [effect] effect demo
// => [effect] effect.done {"params":"demo", "result": "resultdemo"}
// => [store] $store 60
```

Однако вам никто не запрещает использовать `.watch` или createWatch для отладки.

### Фабрики

Создание фабрик это частый паттерн при работе с effector, он облегчает использование однотипного кода. Однако вы можете столкнуться с проблемой одинаковых sid, которые могу помешать при работе с SSR.

Чтобы избежать этой проблемы, мы рекомендуем использовать библиотеку [@withease/factories](https://withease.effector.dev/factories/).

Если если ваша среда не позволяет добавлять дополнительные зависимости, то вы можете создать свою собственную фабрику следуя этим указаниями.

### Работа с сетью

Для удобной работы effector с запросами по сети вы можете использовать [farfetched](https://ff.effector.dev/).

Farfetched предоставляет:

* Мутации и квери
* Готовое апи для кеширование и др.
* Независимость от фреймворков

### Утилиты для работы с effector

В экосистеме Effector находится библиотека [patronum](https://patronum.effector.dev/operators/), которая предоставляет готовые решения для работы с юнитами:

* Управление состоянием (`condition`, `status` и др.)
* Работа со временем (`debounce`, `interval` и др.)
* Функции предикаты (`not`, `or`, `once` и др.)

### Упрощение сложной логики с `createAction`

[`effector-action`](https://github.com/AlexeyDuybo/effector-action) - это библиотека, которая позволяет писать императивный код для сложной условной логики, сохраняя при этом декларативную природу effector.
При этом `effector-action` помогает сделать ваш код более читабельным:

<Tabs>
  <TabItem label="❌ Сложный sample">

```ts
import { sample } from 'effector';

sample({
  clock: formSubmitted,
  source: {
    form: $form,
    settings: $settings,
    user: $user,
  },
  filter: ({ form }) => form.isValid,
  fn: ({ form, settings, user }) => ({
    data: form,
    theme: settings.theme,
  }),
  target: submitFormFx,
});

sample({
  clock: formSubmitted,
  source: $form,
  filter: (form) => !form.isValid,
  target: showErrorMessageFx,
});

sample({
  clock: submitFormFx.done,
  source: $settings,
  filter: (settings) => settings.sendNotifications,
  target: sendNotificationFx,
});
```

  </TabItem>

<TabItem label="✅ С createAction">

```ts
import { createAction } from 'effector-action';

const submitForm = createAction({
  source: {
    form: $form,
    settings: $settings,
    user: $user,
  },
  target: {
    submitFormFx,
    showErrorMessageFx,
    sendNotificationFx,
  },
  fn: (target, { form, settings, user }) => {
    if (!form.isValid) {
      target.showErrorMessageFx(form.errors);
      return;
    }

    target.submitFormFx({
      data: form,
      theme: settings.theme,
    });
  },
});

createAction(submitFormFx.done, {
  source: $settings,
  target: sendNotificationFx,
  fn: (sendNotification, settings) => {
    if (settings.sendNotifications) {
      sendNotification();
    }
  },
});

submitForm();
```

  </TabItem>
</Tabs>

### Именование

Используйте принятые соглашения об именовании:

* Для сторов – префикс `$`
* Для эффектов – постфикс `fx`, это позволит вам отличать ваши эффекты от событий
* Для событий – правил нет, однако мы предлагаем вам называть события, которые напрямую запускают обновления сторов, как будто они уже произошли.

```ts
const updateUserNameFx = createEffect(() => {});

const userNameUpdated = createEvent();

const $userName = createStore('JS');

$userName.on(userNameUpdated, (_, newName) => newName);

userNameUpdated('TS');
```

> INFO Соглашение об именовании: 
>
> Выбор между префиксом или постфиксом в основном является вопросом личных предпочтений. Это необходимо для улучшения опыта поиска в вашей IDE.

### Антипаттерны

#### Использование watch для логики

`watch` следует использовать только для отладки.

<Tabs>
  <TabItem label="❌ Неправильно">

```ts
// Логика в watch
$user.watch((user) => {
  localStorage.setItem('user', JSON.stringify(user));
  api.trackUserUpdate(user);
  someEvent(user.id);
});
```

  </TabItem>
  <TabItem label="✅ Правильно">

```ts
// Отдельные эффекты для сайд-эффектов
const saveToStorageFx = createEffect((user: User) =>
  localStorage.setItem('user', JSON.stringify(user)),
);

const trackUpdateFx = createEffect((user: User) => api.trackUserUpdate(user));

// Связываем через sample
sample({
  clock: $user,
  target: [saveToStorageFx, trackUpdateFx],
});

// Для событий тоже используем sample
sample({
  clock: $user,
  fn: (user) => user.id,
  target: someEvent,
});
```

</TabItem>
</Tabs>

#### Сложные вложенные sample

Избегайте сложных и вложенных цепочек `sample`.

#### Абстрактные названия в колбеках

Используйте осмысленные имена вместо абстрактных `value`, `data`, `item`.

<Tabs>
  <TabItem label="❌ Неправильно">

```ts
$users.on(userAdded, (state, payload) => [...state, payload]);

sample({
  clock: buttonClicked,
  source: $data,
  fn: (data) => data,
  target: someFx,
});
```

  </TabItem>
  <TabItem label="✅ Правильно">

```ts
$users.on(userAdded, (users, newUser) => [...users, newUser]);

sample({
  clock: buttonClicked,
  source: $userData,
  fn: (userData) => userData,
  target: updateUserFx,
});
```

  </TabItem>
</Tabs>

#### Императивные вызовы в эффектах

Не вызывайте события или эффекты императивно внутри других эффектов, вместо этого используйте декларативный стиль.

<Tabs>
  <TabItem label="❌ Неправильно">

```ts
const loginFx = createEffect(async (params) => {
  const user = await api.login(params);

  // Императивные вызовы
  setUser(user);
  redirectFx('/dashboard');
  showNotification('Welcome!');

  return user;
});
```

  </TabItem>
  <TabItem label="✅ Правильно">

```ts
const loginFx = createEffect((params) => api.login(params));
// Связываем через sample
sample({
  clock: loginFx.doneData,
  target: [
    $user, // Обновляем стор
    redirectToDashboardFx,
    showWelcomeNotificationFx,
  ],
});
```

 </TabItem>
</Tabs>

#### Использование getState

Не используйте `$store.getState` для получения значений. Если вам нужно получить данные какого-то стора, то передайте его туда, например в `source` у `sample`:

<Tabs>
  <TabItem label="❌ Неправильно">

```ts
const submitFormFx = createEffect((formData) => {
  // Получаем значения через getState
  const user = $user.getState();
  const settings = $settings.getState();

  return api.submit({
    ...formData,
    userId: user.id,
    theme: settings.theme,
  });
});
```

</TabItem>
  <TabItem label="✅ Правильно">

```ts
// Получаем значения через параметры
const submitFormFx = createEffect(({ form, userId, theme }) => {});

// Получаем все необходимые данные через sample
sample({
  clock: formSubmitted,
  source: {
    form: $form,
    user: $user,
    settings: $settings,
  },
  fn: ({ form, user, settings }) => ({
    form,
    userId: user.id,
    theme: settings.theme,
  }),
  target: submitFormFx,
});
```

  </TabItem>
</Tabs>

#### Бизнес-логика в UI

Не тащите вашу логику в UI элементы, это основная философия effector и то, от чего effector пытается избавить вас, а именно зависимость логики от UI.

#### Создание юнитов в рантайме

Никогда не создавайте юниты и связи между ними в рантайме или другим динамическим образом. Корректная инициализация юнитов является статичным образом на уровне модуля.

Кратко об антипаттернах:

1. Не используйте `watch` для логики, только для отладки
2. Избегайте прямых мутаций в сторах
3. Не создавайте сложные вложенные `sample`, их сложно читать
4. Не используйте большие сторы, используйте атомарный подход
5. Используйте осмысленные названия параметров, а не абстрактные
6. Не вызывайте события внутри эффектов императивно
7. Не используйте `$store.getState` для работы
8. Не тащите логику в UI
9. Не создавайте юниты в рантайме


# Как реагировать на события модели в UI

## Как реагировать на события модели в UI

Иногда у вас может возникнуть необходимость что-то сделать на уровне UI фреймворка при вызове события в модели данных. Например, вы хотите показать оповещение когда запрос на получение данных завершился ошибкой.

### Описание проблемы

> TIP Выбор UI фреймворка: 
>
> В этой статье мы будем использовать [React](https://reactjs.org/) в качестве примера UI фреймворка. Однако те же принципы могут быть применены к любому другому UI фреймворку.

Давайте представим, что у нас есть приложение, которое использует [Ant Design](https://ant.design/) и его [систему оповещений](https://ant.design/components/notification). Показать оповещение на уровне UI достаточно просто:

```tsx
import { notification } from "antd";

function App() {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = () => {
    api.info({
      message: "Hello, React",
      description: "Notification from UI-layer",
    });
  };

  return (
    <>
      {contextHolder}
      <button onClick={showNotification}>Show notification</button>
    </>
  );
}
```

Но, мы хотим показывать оповещение когда запрос на получение данных завершился ошибкой. При этом, весь поток данных приложения не должен быть доступен на уровне UI. Нам нужно найти способ реагировать на вызов событий в модели данных не раскрывая всю модель.

Давайте представим, что у нас есть событие, которое отвечает за ошибку при загрузке данных:

```ts
// model.ts
import { createEvent } from "effector";

const dataLoadingFailed = createEvent<{ reason: string }>();
```

Наше приложение вызывает это событие каждый раз, когда запрос на получение данных завершается ошибкой.

### Решение проблемы

Нам как-то нужно связать `dataLoadingFailed` и `notification.useNotification`.

Давай посмотрим на идеальное решение этой проблемы, а также на пару не очень хороших решений.

#### Сохранить `notification` инстанс в стор

Лучший способ - сохранить API-инстанс `notification` в стор и использовать его через эффект. Давайте создадим пару новых юнитов для этого.

```ts
// notifications.ts
import { createEvent, createStore, sample } from "effector";

// Мы будем использовать инстанс из этого стора в приложении
const $notificationApi = createStore(null);

// Это событие должно вызываться каждый раз, когда создается новый инстанс notification API
export const notificationApiChanged = createEvent();

// Сохраняем новый инстанс в стор
sample({
  clock: notificationApiChanged,
  target: $notificationApi,
});
```

Теперь нам нужно вызывать `notificationApiChanged`, чтобы сохранить инстанс `notification` API в стор `$notificationApi`.

```tsx {8-15}
import { notification } from "antd";
import { useEffect } from "react";
import { useUnit } from "effector-react";

import { notificationApiChanged } from "./notifications";

function App() {
  // Используем useUnit чтобы получить событие из модели
  const onNewApiInstance = useUnit(notificationApiChanged);
  const [api, contextHolder] = notification.useNotification();

  // вызываем onNewApiInstance на каждое изменение api
  useEffect(() => {
    onNewApiInstance(api);
  }, [api]);

  return (
    <>
      {contextHolder}
      {/* ...остальное приложение */}
    </>
  );
}
```

После этого мы имеем валидный стор `$notificationApi` с инстансом `notification` API. Мы можем использовать его в любом месте приложения. Давайте создадим пару эффектов, чтобы удобно с ним работать.

```ts
// notifications.ts
import { attach } from "effector";

// ...

export const showWarningFx = attach({
  source: $notificationApi,
  effect(api, { message, description }) {
    if (!api) {
      throw new Error("Notification API is not ready");
    }

    api.warning({ message, description });
  },
});
```

> TIP чуть-чуть об attach: 
>
> attach - это функция, которая позволяет привязать конкретный стор к эффекту. Это значит, что мы можем использовать `notificationApi` в `showWarningFx` без передачи его в качестве параметра.

Теперь эффект `showWarningFx` можно использовать в любом месте приложения без дополнительной возни.

```ts {8-13}
// model.ts
import { createEvent, sample } from "effector";

import { showWarningFx } from "./notifications";

const dataLoadingFailed = createEvent<{ reason: string }>();

// Вызываем showWarningFx когда происходит dataLoadingFailed
sample({
  clock: dataLoadingFailed,
  fn: ({ reason }) => ({ message: reason }),
  target: showWarningFx,
});
```

Теперь у нас есть валидное решение для обработки событий на уровне UI без раскрытия всего потока данных. Такой подход вы можете использовать для любых UI API, даже положить инстанс роутера в стор и управлять им из модели данных.

Однако , если вы хотите узнать, почему другие (возможно более очевидные) решения не так хороши, вы можете прочитать о них ниже.

#### Плохое решение №1

Плохое решение номер один - использовать глобальный инстанс `notification`.
Ant Design позволяет использовать глобальный инстанс notification.

```ts {7-17}
// model.ts
import { createEvent, createEffect, sample } from "effector";
import { notification } from "antd";

const dataLoadingFailed = createEvent<{ reason: string }>();

// Создаем эффект для показа оповещения
const showWarningFx = createEffect((params: { message: string }) => {
  notification.warning(params);
});

// Вызываем showWarningFx когда происходит dataLoadingFailed
sample({
  clock: dataLoadingFailed,
  fn: ({ reason }) => ({ message: reason }),
  target: showWarningFx,
});
```

В этом решение невозможно использовать какие-либо настройки Ant из React Context, потому что у него нет доступа к React вообще. Это значит, что оповещения не будут стилизованы должным образом и могут выглядеть иначе, чем остальная часть приложения.

**Так что, это не решение.**

#### Плохое решение №2

Второй плохое решение – использовать метод `.watch` события в компоненте.
Можно вызвать метод `.watch` события

```tsx {9-17}
import { useEffect } from "react";
import { notification } from "antd";

import { dataLoadingFailed } from "./model";

function App() {
  const [api, contextHolder] = notification.useNotification();

  useEffect(
    () =>
      dataLoadingFailed.watch(({ reason }) => {
        api.warning({
          message: reason,
        });
      }),
    [api],
  );

  return (
    <>
      {contextHolder}
      {/* ...остальное приложение */}
    </>
  );
}
```

Но в этом решении мы не соблюдаем правила для scope, а это значит, что у нас могут быть утечки памяти, проблемы с тестовой средой и инструментами типа Storybook.

**Так что, это не решение.**

### Связанные API и статьи

* **API**

  * Scope – Описание скоупа и его методов
  * Event – Описание события и его методов
  * Store – Описание стора и его методов

* **Статьи**

  * Почему вам нужно явное событие запуска приложения
  * Методы и правила работы со скоупом
  * Гайд по тестированию


# Migrating from Redux

## Migrating from Redux

If you are coming from Redux, this guide will help you understand how Effector's concepts map to what you already know and how to translate common Redux patterns into idiomatic Effector code.

> TIP: 
>
> For **gradual, incremental migration** of an existing Redux codebase (where Redux and Effector coexist), see the dedicated [@withease/redux migration guide](https://withease.effector.dev/magazine/migration_from_redux.html).
>
> This page focuses on the **conceptual differences** and pattern translations to help you think in Effector.

### Concept mapping

| Redux | Effector | Notes |
|-------|----------|-------|
| Store (single, global) | **Store** (`createStore`) | Effector uses many small stores instead of one big state tree |
| Action | **Event** (`createEvent`) | Events are first-class callable units, no action types or creators needed |
| Reducer | `.on()` handler | Stores subscribe to events via `.on(event, reducer)` |
| Thunk / Saga | **Effect** (`createEffect`) | A container for side effects with built-in pending/done/fail events |
| `useSelector` | `useUnit` | From `effector-react`; subscribes to stores reactively |
| `useDispatch` | `useUnit` | Events and effects returned by `useUnit` are already bound |
| `combineReducers` | `combine` | Derives a new store from multiple stores |
| Middleware | `sample` / `Effect` | `sample` connects units declaratively; effects handle side effects |
| Reselect (`createSelector`) | `.map()` / `combine` | Derived stores update only when their source changes |
| Redux Toolkit `createSlice` | Store + Events + `.on()` | No boilerplate wrapper needed |

### Key differences

#### Many stores instead of one

Redux puts all state into a single store and uses selectors to extract slices. Effector encourages **many independent stores**, each holding a specific piece of state:

```ts
// Redux: one store, nested state
const initialState = { count: 0, user: null, todos: [] };

// Effector: independent stores
const $count = createStore(0);
const $user = createStore(null);
const $todos = createStore([]);
```

This eliminates the need for deeply nested state updates and makes each store independently testable.

#### No action types or switch statements

Redux actions require string types and reducers use `switch` statements. In Effector, events are callable functions and stores subscribe to them directly:

```ts
// Redux
const INCREMENT = "INCREMENT";
const increment = () => ({ type: INCREMENT });

function counterReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    default:
      return state;
  }
}

// Effector
const increment = createEvent();
const $count = createStore(0).on(increment, (state) => state + 1);

// Usage: just call the event
increment();
```

#### Declarative connections with `sample`

Where Redux uses middleware (thunks, sagas) for orchestration, Effector uses `sample` to declaratively connect units:

```ts
// Redux: thunk with imperative dispatch
const fetchUser = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  const user = await api.getUser(id);
  dispatch(setUser(user));
  dispatch(setLoading(false));
};

// Effector: declarative connections
const pageOpened = createEvent<number>(); // carries user id
const fetchUserFx = createEffect((id: number) => api.getUser(id));
const $user = createStore(null).on(fetchUserFx.doneData, (_, user) => user);
const $loading = fetchUserFx.pending; // built-in!

sample({
  clock: pageOpened, // id comes from the event payload
  target: fetchUserFx,
});
```

Notice that `$loading` comes for free — every effect has a `.pending` store and `.done` / `.fail` / `.doneData` / `.failData` events built in.

### Common patterns

#### Counter

```ts
// Redux (with Redux Toolkit)
const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {
    incremented: (state) => state + 1,
    decremented: (state) => state - 1,
    incrementedBy: (state, action) => state + action.payload,
  },
});

// Effector
const incremented = createEvent();
const decremented = createEvent();
const incrementedBy = createEvent();

const $counter = createStore(0)
  .on(incremented, (n) => n + 1)
  .on(decremented, (n) => n - 1)
  .on(incrementedBy, (n, amount) => n + amount);
```

#### Async data fetching

```ts
// Redux: createAsyncThunk
const fetchTodos = createAsyncThunk("todos/fetch", async () => {
  const response = await fetch("/api/todos");
  return response.json();
});

const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [], status: "idle", error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Effector
const fetchTodosFx = createEffect(async () => {
  const response = await fetch("/api/todos");
  return response.json();
});

const $todos = createStore([]).on(fetchTodosFx.doneData, (_, todos) => todos);
const $loading = fetchTodosFx.pending;
const $error = createStore(null)
  .on(fetchTodosFx.failData, (_, error) => error.message)
  .reset(fetchTodosFx);
```

Effector's `createEffect` gives you `.pending`, `.done`, `.fail`, `.doneData`, and `.failData` for free — no need to manually track loading states.

#### Derived state

```ts
// Redux: Reselect
const selectCompletedTodos = createSelector(
  (state) => state.todos,
  (todos) => todos.filter((t) => t.completed)
);

const selectCompletedCount = createSelector(
  selectCompletedTodos,
  (todos) => todos.length
);

// Effector: .map() and combine()
const $completedTodos = $todos.map((todos) =>
  todos.filter((t) => t.completed)
);
const $completedCount = $completedTodos.map((todos) => todos.length);

// Or combine multiple stores
const $filter = createStore("all"); // e.g., "all" | "active" | "completed"
const $filteredTodos = combine($todos, $filter, (todos, filter) =>
  filter === "all" ? todos : todos.filter((t) => t.status === filter)
);
```

#### Conditional logic (replacing middleware)

```ts
// Redux: middleware or thunk with conditionals
const conditionalFetch = (id) => (dispatch, getState) => {
  if (getState().cache[id]) return;
  dispatch(fetchItem(id));
};

// Effector: sample with filter
const itemRequested = createEvent<string>(); // carries item id
const fetchItemFx = createEffect((id: string) => api.getItem(id));
const $cache = createStore<Record<string, Item>>({});

sample({
  clock: itemRequested,
  source: $cache,
  filter: (cache, id) => !cache[id], // skip if already cached
  fn: (_, id) => id,
  target: fetchItemFx,
});
```

#### React integration

```tsx
// Redux
import { useSelector, useDispatch } from "react-redux";

function Counter() {
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(increment())}>Count: {count}</button>;
}

// Effector
import { useUnit } from "effector-react";

function Counter() {
  const { count, increment: onIncrement } = useUnit({
    count: $counter,
    increment: incremented,
  });
  return <button onClick={onIncrement}>Count: {count}</button>;
}
```

With `useUnit`, stores are subscribed reactively and events are already bound — no dispatch wrapper needed.

### Testing

Effector provides `fork` and `allSettled` for isolated testing without mocking global state:

```ts
// Redux: requires configuring a mock store
const mockStore = configureStore({ reducer: rootReducer });
mockStore.dispatch(increment());
expect(mockStore.getState().counter).toBe(1);

// Effector: fork creates an isolated scope
import { fork, allSettled } from "effector";

const scope = fork();
await allSettled(incremented, { scope });
expect(scope.getState($counter)).toBe(1);
```

Each test gets a completely independent scope with no shared mutable state between tests.

### Migration strategy

1. **Start small**: Pick one isolated feature and rewrite it in Effector
2. **Coexist**: Use `@withease/redux` to bridge Redux and Effector during the transition (see the [gradual migration guide](https://withease.effector.dev/magazine/migration_from_redux.html))
3. **Move outward**: Migrate features one by one, replacing selectors with stores and thunks with effects
4. **Remove Redux**: Once all features are migrated, remove the Redux dependency

### Further reading

* Core Concepts — Effector fundamentals in depth
* API Reference — full API documentation
* [@withease/redux](https://withease.effector.dev/magazine/migration_from_redux.html) — gradual migration tooling
* Best Practices — naming conventions, patterns, and tips
* Testing — testing with `fork` and `allSettled`


# Руководство по миграции

## Руководство по миграции

Это руководство охватывает шаги, необходимые для перехода на Effector 23 с предыдущей версии.
В этом релизе несколько функций были объявлены устаревшими:

* Операторы `forward` и `guard`
* Опция `greedy` в `sample` была переименована в `batch`
* Типы "производных" и "вызываемых" юнитов теперь официально разделены
* Возможность использовать `undefined` как магическое значение "пропуска" в редьюсерах

### Устаревание `forward` и `guard`

Эти операторы довольно старые и прошли через множество релизов Effector.
Но все их случаи использования уже покрываются оператором `sample`, поэтому пришло время их убрать. Вы увидите предупреждение об устаревании в консоли для каждого вызова этих операторов в вашем коде.

> TIP Примечание: 
>
> Вы можете мигрировать с обоих операторов, используя официальный [ESLint-плагин Effector](https://eslint.effector.dev/), который имеет правила `no-forward` и `no-guard` со встроенной [функцией авто-исправления](https://eslint.org/docs/latest/use/command-line-interface#fix-problems).

### Переименование `greedy` в `batch`

Оператор `sample` имел опцию `greedy` для отключения батчинга обновлений в редких крайних случаях.
Но название "greedy" не было очевидным для пользователей, поэтому оно было переименовано в `batch`, и его сигнатура была инвертирована.

Вы увидите предупреждение об устаревании в консоли для каждого использования опции `greedy` в вашем коде.

> TIP Примечание: 
>
> Вы можете мигрировать с одного на другое, просто выполнив "Найти и заменить" от `greedy: true` к `batch: false` в IDE.

### Разделение типов для производных и вызываемых юнитов

Производные юниты теперь полностью отделены от "вызываемых/записываемых":

* Основные фабрики `createEvent` и `createStore` теперь возвращают типы `EventCallable` и `StoreWritable` (поскольку вы можете вызывать и записывать в эти юниты в любой момент).
* Методы и операторы, такие как `unit.map(...)` или `combine(...)`, теперь возвращают типы `Event` и `Store`, которые являются "только для чтения", т.е. вы можете использовать их только как `clock` или `source`, но не как `target`.
* Тип `EventCallable` может быть присвоен типу `Event`, но не наоборот, то же самое для сторов.
* Также есть исключения в рантайме для несоответствия типов.

Скорее всего, вам не нужно будет ничего делать, вы просто получите улучшенные типы.

Но у вас могут возникнуть проблемы с внешними библиотеками, **которые еще не обновлены до Effector 23**:

* Большинство библиотек просто *принимают* юниты как `clock` и `source` – в таком случае всё в порядке.
* Если какой-то оператор из внешней библиотеки принимает юнит как `target`, вы всё равно увидите старый добрый тип `Event` в этом случае, поэтому у вас не будет ошибки типа, даже если на самом деле есть проблема.
* Если какая-то *фабрика* возвращает событие, которое вы должны вызывать в своем коде, то вы получите ошибку типа, и вам нужно будет привести это событие к типу `EventCallable`.

> TIP Примечание: 
>
> Если вы столкнулись с любым из этих случаев, просто создайте issue в репозитории этой библиотеки с запросом на поддержку версии Effector 23.
> Владельцы проекта увидят соответствующие ошибки типов в своем исходном коде и тестах, как только обновят Effector в своем репозитории.

Если у вас есть эти проблемы в ваших собственных фабриках или библиотеках, то вы уже должны видеть соответствующие ошибки типов в исходном коде вашей библиотеки.
Просто замените `Event` на `EventCallable`, `Store` на `StoreWritable` или `Unit` на `UnitTargetable` везде, где это уместно (т.е. вы собираетесь вызывать или записывать в эти юниты каким-то образом).

### Устаревание магического `undefined` для пропуска

В Effector есть старая функция: `undefined` используется как "магическое" значение для пропуска обновлений в редьюсерах в редких случаях, например:

```ts
const $value = createStore(0).on(newValueReceived, (_oldValue, newValue) => newValue);
```

☝️ если `newValue` равно `undefined`, то обновление будет пропущено.

Идея сделать каждый маппер и редьюсер работающим как своего рода `filterMap` считалась полезной в ранних версиях Effector, но очень редко используется правильно, а также сбивает с толку и отвлекает, поэтому она должна быть устаревшей и удалена.

Для этого каждая фабрика сторов теперь поддерживает специальную настройку `skipVoid`, которая контролирует, как именно стор должен обрабатывать значение `undefined`. Если установлено `false` – стор будет использовать `undefined` как значение.
Если установлено `true` (устаревшее), стор будет интерпретировать `undefined` как команду "пропустить обновление" и ничего не делать.

Вы увидите предупреждение для каждого возврата `undefined` в ваших мапперах или редьюсерах в вашем коде, с требованием указать явную настройку `skipVoid` для вашего стора.

> TIP Примечание: 
>
> Если вы хотите пропустить обновление стора в определенных случаях, то лучше явно вернуть предыдущее состояние, когда это возможно.

Рекомендуется использовать `{skipVoid: false}` всегда, чтобы вы могли использовать `undefined` как обычное значение.

Если вам действительно нужно `undefined` как "магическое значение пропуска" – тогда вы можете использовать `{skipVoid: true}`, чтобы сохранить текущее поведение. Вы всё равно получите предупреждение об устаревании, но только одно для объявления вместо одного для каждого такого обновления.

Настройка `skipVoid` временная и нужна только как способ правильно устареть от этой функции в Effector. В Effector 24 `skipVoid` сам будет устаревшим, а затем удален.

### `useStore` и `useEvent` заменены на `useUnit` в `effector-react`

Мы объединили два старых хука в один, его преимущество в том, что вы можете передать много юнитов сразу, и он батчит все обновления сторов в одно обновление.

Можно безопасно заменить вызовы старых хуков на новый:

```ts
const Component = () => {
  const foo = useStore($foo);
  const bar = useStore($bar);
  const onSubmit = useEvent(triggerSubmit);
};
```

Превращается в:

```ts
const Component = () => {
  const foo = useUnit($foo);
  const bar = useUnit($bar);
  const onSubmit = useUnit(triggerSubmit);
};
```

Или короче:

```ts
const Component = () => {
  const [foo, bar, onSubmit] = useUnit([$foo, $bar, triggerSubmit]);
};
```


# Потеря скоупа

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import SideBySide from "@components/SideBySide/SideBySide.astro";

## Потеря скоупа

Работа юнитов в effector всегда происходит внутри скоупа — глобального или изолированного, созданного через fork(). В глобальном случае контекст потерять невозможно, так как он используется по умолчанию. С изолированным скоупом всё сложнее: при потере скоупа операции начнут выполняться в глобальном режиме, а все обновления данных **не попадут** в скоуп в котором велась работа, и как следствие, клиенту отправится неконсистентное состояние.

Типичные места, где это проявляется:

* `setTimeout` / `setInterval`
* `addEventListener`
* WebSocket
* прямой вызов промисов в эффектах
* сторонние библиотеки с асинхронными API или колбэки.

### Пример проблемы

Мы создадим простой таймер на React, хотя такая же модель поведения при потере скоупа будет соответствовать для любого фреймворка или среды:

<Tabs>

<TabItem label='timer.tsx'>

```tsx
import React from "react";
import { createEvent, createStore, createEffect, scopeBind } from "effector";
import { useUnit } from "effector-react";

const tick = createEvent();
const $timer = createStore(0);

$timer.on(tick, (s) => s + 1);

export function Timer() {
  const [timer, startTimer] = useUnit([$timer, startTimerFx]);

  return (
    <div className="App">
      <div>Timer:{timer} sec</div>
      <button onClick={startTimer}>Start timer</button>
    </div>
  );
}
```

</TabItem>
<TabItem label='app.tsx'>

```tsx
import React from "react";
import { Provider } from "effector-react";
import { fork } from "effector";
import { Timer } from "./timer";

export const scope = fork();

export default function App() {
  return (
    <Provider value={scope}>
      <Timer />
    </Provider>
  );
}
```

</TabItem>

</Tabs>

Теперь добавим эффект, который каждую секунду вызывает `tick`:

```ts
const startTimerFx = createEffect(() => {
  setInterval(() => {
    tick();
  }, 1000);
});
```

[Вот здесь можно потыкать пример](https://codesandbox.io/p/sandbox/nrqw96).<br/>
На первый взгляд мы написали вполне рабочий код, но если запустить таймер, то вы заметите, что UI не обновляется. Это из-за того, что изменения таймера происходят в глобальном скоупе, а наше приложение работает в изолированном, который мы передали в \<Provider>, вы можете это заметить по логам в консоли.

### Как исправить потерю скоупа ?

Чтобы исправить исправить потерю скоупа нужно использовать функцию scopeBind. Этот метод возвращает функцию, привязанную к скоупу в котором метод был вызван, которую в последствии можно безопасно вызывать:

```ts ins={2} "bindedTick"
const startTimerFx = createEffect(() => {
  const bindedTick = scopeBind(tick);

  setInterval(() => {
    bindedTick();
  }, 1000);
});
```

[Обновленный пример кода](https://codesandbox.io/p/devbox/scope-loss-forked-vx4r9x?workspaceId=ws_BJxLCP4FhfNzjg1qXth95S).

Заметьте, что метод scopeBind сам умеет работать с текущим используемым скоупом. Однако, если вам нужно, то вы можете передать нужный скоуп в конфигурационный объект вторым аргументом.

```ts
scopeBind(tick, { scope });
```

> TIP Очистка интервалов: 
>
> Не забывайте очищать `setInterval` после завершения работы во избежания утечек памяти. Очищать `setInterval` можно отдельным эффектом, предварительно вернув из первого эффекта его id и сохранив в отдельный стор.

### Почему происходит потеря скоупа?

Давайте представим, то как работает скоуп в effector:

```ts
// наш активный скоуп
let scope;

function process() {
  try {
    scope = "effector";
    asyncProcess();
  } finally {
    scope = undefined;
    console.log("наш скоуп undefined");
  }
}

async function asyncProcess() {
  console.log("у нас есть скоуп", scope); // effector

  await 1;

  // тут мы уже потеряли контекст
  console.log("а здесь скоупа уже нет ", scope); // undefined
}

process();

// Вывод:
// у нас есть скоуп effector
// наш скоуп undefined
// а здесь скоупа уже нет undefined
```

Возможно вас интересует вопрос **"Это проблема именно эффектора?"**, однако это общий принцип работы с асинхронностью в JavaScript, все технологии, которые сталкиваются с необходимостью сохранения контекста в котором происходят вызовы так или иначе обходят это затруднение. Самый характерный пример это [zone.js](https://github.com/angular/angular/tree/main/packages/zone.js),
который для сохранения контекста оборачивает все асинхронные глобальные функции вроде `setTimeout` или `Promise.resolve`. Также способами решения этой проблемы бывает использование генераторов или `ctx.schedule(() => asyncCall())`.

> INFO Будущее решение: 
>
> В JavaScript готовится proposal [Async Context](https://github.com/tc39/proposal-async-context), который призван решить проблему потери контекста на уровне языка. Это позволит:
>
> * Сохранять контекст автоматически через все асинхронные вызовы
> * Избавиться от необходимости явного использования scopeBind
> * Получить более предсказуемое поведение асинхронного кода
>
> Как только это предложение войдет в язык и получит широкую поддержку, effector будет обновлен для использования этого нативного решения.

### Связанные API и статьи

* **API**
  * Effect - Описание эффекта, его методов и свойств
  * Scope - Описание скоупа и его методов
  * scopeBind - Метод для привязки юнита к скоупу
  * fork - Оператор для создания скоупа
  * allSettled - Метод для вызова юнита в предоставленном скоупе и ожидания завершения всей цепочки эффектов
* **Статьи**
  * Изолированные контексты
  * Гайд по работе с SSR
  * Гайд по тестированию
  * Важность SID для гидрации сторов


# Рендеринг на стороне сервера (SSR)

## Рендеринг на стороне сервера

Рендеринг на стороне сервера (SSR) означает, что содержимое вашего сайта генерируется на сервере, а затем отправляется в браузер – в наши дни это достигается различными способами.

> INFO Обратите внимание: 
>
> Обычно, если рендеринг происходит во время выполнения – это называется SSR. Если рендеринг происходит во время сборки – это обычно называется генерацией на стороне сервера (SSG), что, по сути, является подмножеством SSR.
>
> Эта разница не важна для данного руководства, всё сказанное применимо как к SSR, так и к SSG.

В этом руководстве мы рассмотрим два основных вида шаблонов рендеринга на стороне сервера и то, как effector должен использоваться в этих случаях.

### Неизоморфный SSR

Вам не нужно делать ничего особенного для поддержки неизоморфного SSR/SSG.

В этом случае начальный HTML обычно генерируется отдельно с использованием какого-либо шаблонизатора, который часто работает на другом языке программирования (не JS). Клиентский код в этом случае работает только в браузере клиента и **не используется никаким образом** для генерации ответа сервера.

Этот подход работает для effector, как и для любого другого JavaScript-кода. Любое SPA-приложение, по сути, является крайним случаем этого, так как его HTML-шаблон не содержит никакого контента, кроме ссылки `<script src="my-app.js" />`.

> TIP Примечание: 
>
> Если у вас неизоморфный SSR – просто используйте effector так же, как и для SPA-приложения.

### Изоморфный SSR

Когда у вас изоморфное SSR-приложение, **большая часть клиентского кода используется совместно с серверным кодом** и **используется для генерации HTML-ответа**.

Вы также можете думать об этом как о подходе, при котором ваше приложение **начинается на сервере** – а затем передается по сети в браузер клиента, где оно **продолжает** работу, начатую на сервере.

Отсюда и название – несмотря на то, что код собирается и выполняется в разных средах, его вывод остается (в основном) одинаковым при одинаковых входных данных.

Существует множество различных фреймворков, построенных на этом подходе – например, Next.js, Remix.run, Razzle.js, Nuxt.js, Astro и т.д.

> TIP Next.js: 
>
> Next.js выполняет SSR/SSG особым образом, что требует некоторой кастомной обработки на стороне effector.
>
> Это делается с помощью специального пакета [`@effector/next`](https://github.com/effector/next) – используйте его, если хотите использовать effector с Next.js.

В этом руководстве мы не будем фокусироваться на каком-либо конкретном фреймворке или реализации сервера – эти детали будут абстрагированы.

#### Sid (Стабильные Идентификаторы)

Для обработки изоморфного SSR с effector нам нужен надежный способ сериализации состояния, чтобы передать его по сети. Для этого нам нужно иметь стабильные идентификаторы (сиды) для каждого стора в нашем приложении.

> INFO Обратите внимание: 
>
> Подробное объяснение о sid можно найти здесь.

Чтобы добавить sid'ы – просто используйте один из плагинов effector.

#### Общий код приложения

Основная особенность изоморфного SSR – один и тот же код используется как для серверного, так и для клиентского приложения.

Для примера мы будем использовать очень простое React-приложение счетчик – весь код будет содержаться в одном модуле:

```tsx
// app.tsx
import React from "react";
import { createEvent, createStore, createEffect, sample, combine } from "effector";
import { useUnit } from "effector-react";

// модель
export const appStarted = createEvent();
export const $pathname = createStore<string | null>(null);

const $counter = createStore<number | null>(null);

const fetchUserCounterFx = createEffect(async () => {
  await sleep(100); // в реальной жизни это был бы какой-то API-запрос

  return Math.floor(Math.random() * 100);
});

const buttonClicked = createEvent();
const saveUserCounterFx = createEffect(async (count: number) => {
  await sleep(100); // в реальной жизни это был бы какой-то API-запрос
});

sample({
  clock: appStarted,
  source: $counter,
  filter: (count) => count === null, // если счетчик уже загружен – не загружать его снова
  target: fetchUserCounterFx,
});

sample({
  clock: fetchUserCounterFx.doneData,
  target: $counter,
});

sample({
  clock: buttonClicked,
  source: $counter,
  fn: (count) => count + 1,
  target: [$counter, saveUserCounterFx],
});

const $countUpdatePending = combine(
  [fetchUserCounterFx.pending, saveUserCounterFx.pending],
  (updates) => updates.some((upd) => upd === true),
);

const $isClient = createStore(typeof document !== "undefined", {
  /**
   * Здесь мы явно указываем effector, что это стор, которое зависит от окружения,
   * никогда не должно включаться в сериализацию,
   * так как оно должно всегда вычисляться на основе текущего окружения.
   *
   * Это не обязательно, так как в сериализацию включается только разница изменений состояния,
   * и этот стор не будет изменяться.
   *
   * Но всё же хорошо добавить эту настройку – чтобы подчеркнуть намерение.
   */
  serialize: "ignore",
});

const notifyFx = createEffect((message: string) => {
  alert(message);
});

sample({
  clock: [
    saveUserCounterFx.done.map(() => "Обновление счетчика успешно сохранено"),
    saveUserCounterFx.fail.map(() => "Не удалось сохранить обновление счетчика :("),
  ],
  // Совершенно нормально иметь некоторые ветвления в логике приложения в зависимости от текущего окружения.
  //
  // Здесь мы хотим вызвать уведомление только на клиенте.
  filter: $isClient,
  target: notifyFx,
});

// UI
export function App() {
  const clickButton = useUnit(buttonClicked);
  const { count, updatePending } = useUnit({
    count: $counter,
    updatePending: $countUpdatePending,
  });

  return (
    <div>
      <h1>Приложение-счетчик</h1>
      <h2>
        {updatePending ? "Счетчик обновляется" : `Текущее значение: ${count ?? "неизвестно"}`}
      </h2>
      <button onClick={() => clickButton()}>Обновить счетчик</button>
    </div>
  );
}
```

Это код нашего приложения, который будет использоваться как для рендеринга на стороне сервера, так и для обработки нужд клиента.

> TIP Примечание: 
>
> Обратите внимание, что важно, чтобы все юниты effector – сторы, события и т.д. – были "привязаны" к React-компоненту через хук `useUnit`.
>
> Вы можете использовать официальный eslint-плагин effector для проверки этого и следования другим лучшим практикам – посетите сайт [eslint.effector.dev](https://eslint.effector.dev/).

### Точка входа сервера

Путь `<App />` к браузерам клиентов начинается на сервере. Для этого нам нужно создать **отдельную точку входа** для специфического серверного кода, который также будет обрабатывать рендеринг на стороне сервера.

В этом примере мы не будем углубляться в различные возможные реализации серверов – вместо этого мы сосредоточимся на самом обработчике запросов.

> INFO Обратите внимание: 
>
> Помимо базовых нужд SSR, таких как вычисление конечного состояния приложения и его сериализация, effector также обрабатывает **изоляцию данных пользователей между запросами**.
>
> Это очень важная функция, так как серверы на Node.js обычно обрабатывают более одного пользовательского запроса одновременно.
>
> Поскольку платформы на основе JS, включая Node.js, обычно имеют один "главный" поток – все логические вычисления происходят в одном контексте, с одной и той же доступной памятью.
> Таким образом, если состояние не изолировано должным образом, один пользователь может получить данные, подготовленные для другого пользователя, что крайне нежелательно.
>
> effector автоматически обрабатывает эту проблему внутри функции `fork`. Подробнее читайте в соответствующей документации.

Это код для обработчика запросов сервера, который содержит всё специфичное для сервера, что нужно сделать.
Обратите внимание, что для значимых частей нашего приложения мы всё ещё используем "общий" код `app.tsx`.

```tsx
// server.tsx
import { renderToString } from "react-dom/server";
import { Provider } from "effector-react";
import { fork, allSettled, serialize } from "effector";

import { appStarted, App, $pathname } from "./app";

export async function handleRequest(req) {
  // 1. Создаем отдельный экземпляр состояния effector – специальный объект `Scope`.
  const scope = fork({
    values: [
      // некоторые части состояния приложения могут быть сразу установлены в нужные значения,
      // до начала любых вычислений.
      [$pathname, req.pathname],
    ],
  });

  // 2. Запускаем логику приложения – все вычисления будут выполнены в соответствии с логикой модели,
  // а также любые необходимые эффекты.
  await allSettled(appStarted, {
    scope,
  });

  // 3. Сериализуем вычисленное состояние, чтобы его можно было передать по сети.
  const storesValues = serialize(scope);

  // 4. Рендерим приложение – также в сериализуемую версию.
  const app = renderToString(
    // Используя Provider с scope, мы указываем <App />, какое состояние сторов использовать.
    <Provider value={scope}>
      <App />
    </Provider>,
  );

  // 5. Подготавливаем сериализованный HTML-ответ.
  //
  // Это граница сериализации (или сети).
  // Точка, в которой всё состояние преобразуется в строку для отправки по сети.
  //
  // Состояние effector сохраняется в виде `<script>`, который установит состояние в глобальный объект.
  // Состояние `react` сохраняется как часть DOM-дерева.
  return `
    <html>
      <head>
        <script>
          self._SERVER_STATE_ = ${JSON.stringify(storesValues)}
        </script>
        <link rel="stylesheet" href="styles.css" />
        <script defer src="app.js" />
      </head>
      <body>
        <div id="app">
          ${app}
        </div>
      </body>
    </html>
  `;
}
```

☝️ В этом коде мы создали HTML-строку, которую пользователь получит по сети и которая содержит сериализованное состояние всего приложения.

### Точка входа клиента

Когда сгенерированная HTML-строка достигает браузера клиента, обрабатывается парсером и все необходимые ресурсы загружены – наш код приложения начинает работать на клиенте.

На этом этапе `<App />` должен восстановить своё предыдущее состояние (которое было вычислено на сервере), чтобы не начинать с нуля, а продолжить с того же места, где работа остановилась на сервере.

Процесс восстановления состояния сервера на клиенте обычно называется **гидрацией**, и это то, что должна делать точка входа клиента:

```tsx
// client.tsx
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { fork, allSettled } from "effector";
import { Provider } from "effector-react";

import { App, appStarted } from "./app";

/**
 * 1. Находим, где сохранено состояние сервера, и извлекаем его.
 *
 * Смотрите код обработчика сервера, чтобы узнать, где оно было сохранено в HTML.
 */
const effectorState = globalThis._SERVER_STATE_;
const reactRoot = document.querySelector("#app");

/**
 * 2. Инициализируем клиентский scope effector с вычисленными на сервере значениями.
 */
const clientScope = fork({
  values: effectorState,
});

/**
 * 3. "Гидрируем" состояние React в DOM-дереве.
 */
hydrateRoot(
  reactRoot,
  <Provider value={clientScope}>
    <App />
  </Provider>,
);

/**
 * 4. Вызываем то же стартовое событие на клиенте.
 *
 * Это необязательно и зависит от того, как организована логика вашего приложения.
 */
allSettled(appStarted, { scope: clientScope });
```

☝️ На этом этапе приложение готово к использованию!

### Итог

1. Вам не нужно делать ничего особенного для **неизоморфного** SSR, все шаблоны, как в SPA, будут работать.
2. Изоморфный SSR требует небольшой специальной подготовки – вам понадобятся sid для сторов.
3. Общий код **изоморфного** SSR-приложения обрабатывает все значимые части – как должен выглядеть UI, как должно вычисляться состояние, когда и какие эффекты должны выполняться.
4. Серверный код вычисляет и **сериализует** всё состояние приложения в HTML-строку.
5. Клиентский код извлекает это состояние и использует его для **"гидрации"** приложения на клиенте.


# Тестирование

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## Написание тестов

Тестирование логики управления состоянием — одна из сильных сторон Effector. Благодаря изолированным контекстам (fork) и контролируемым асинхронным процессам (allSettled), вы можете проверять поведение приложения без необходимости эмулировать весь его цикл работы.

> INFO Что делает fork?: 
>
> При помощи вызова функции `fork` мы создаем scope, который можно рассматривать как независимый экземпляр нашего приложения Effector

### Основы тестирования

Effector предоставляет встроенные инструменты для:

* Изоляции состояния: Каждое тестируемое состояние может быть создано в своём собственном контексте. Это предотвращает побочные эффекты.
* Асинхронного выполнения: Все эффекты и события могут быть выполнены и проверены с помощью allSettled.

#### Тестирование сторов

Сторы в Effector тестируются очень просто, так как они представляют собой чистую функцию, управляющую состоянием.

<Tabs>

  <TabItem label="counter.test.js">

```ts
import { counterIncremented, $counter } from "./counter.js";

test("counter should increase by 1", async () => {
  const scope = fork();

  expect(scope.getState($counter)).toEqual(0);

  await allSettled(counterIncremented, { scope });

  expect(scope.getState($counter)).toEqual(1);
});
```

  </TabItem>

```
<TabItem label="counter.js">
```

```ts
import { createStore, createEvent } from "effector";

const counterIncremented = createEvent();

const $counter = createStore(0);

$counter.on(counterIncremented, (counter) => counter + 1);
```

  </TabItem>
</Tabs>

Для изолированного тестирования логики состояния используется fork. Это позволяет тестировать сторы и события **без влияния** на глобальное состояние.

#### Тестирование событий

Для того, чтобы протестировать было ли вызвано событие и сколько раз, можно воспользоваться методом `createWatch`, который создаст подписку на переданный юнит:

```ts
import { createEvent, createWatch, fork } from "effector";
import { userUpdated } from "../";

test("should handle user update with scope", async () => {
  const scope = fork();
  const fn = jest.fn();

  // Создаем watcher в конкретном scope
  const unwatch = createWatch({
    unit: userUpdated,
    fn,
    scope,
  });

  // Запускаем событие в scope
  await allSettled(userUpdated, {
    scope,
  });

  expect(fn).toHaveBeenCalledTimes(1);
});
```

> INFO Почему не watch?: 
>
> Мы не использовали `watch` свойство событий, потому что при параллельных тестах мы можем вызывать одно и то же событие, что может вызвать конфликты.

#### Тестирование эффектов

Эффекты можно тестировать, проверяя их успешное выполнение или обработку ошибок.
В случае unit тестирования мы не хотим, чтобы наши эффекты действительно отправляли запрос на сервер, чтобы избежать этого поведения мы можем передать в `fork` дополнительный объект параметр, где в свойство `handlers` добавить список пар `[эффект, замоканный обработчик]`.

<Tabs>

  <TabItem label="effect.test.js">

```ts
import { fork, allSettled } from "effector";
import { getUserProjectsFx } from "./effect.js";

test("effect executes correctly", async () => {
  const scope = fork({
    handlers: [
      // Список [эффект, моковый обработчик] пар
      [getUserProjectsFx, () => "user projects data"],
    ],
  });

  const result = await allSettled(getUserProjectsFx, { scope });

  expect(result.status).toBe("done");
  expect(result.value).toBe("user projects data");
});
```

  </TabItem>

```
<TabItem label="effect.js">
```

```ts
import { createEffect } from "effector";

const getUserProjectsFx = async () => {
  const result = await fetch("/users/projects/2");

  return result.json();
};
```

  </TabItem>
</Tabs>

### Полноценный пример тестирования

Например, у нас есть типичный счетчик, но с асинхронной проверкой через наш бэкэнд. Предположим, у нас следующие требования:

* Когда пользователь нажимает кнопку, мы проверяем, меньше ли текущий счетчик чем 100, и затем проверяем этот клик через наш API бэкэнда.
* Если валидация успешна, увеличиваем счетчик на 1.
* Если проверка не пройдена, нужно сбросить счетчик до нуля.

```ts
import { createEvent, createStore, createEffect, sample } from "effector";

export const buttonClicked = createEvent();

export const validateClickFx = createEffect(async () => {
  /* вызов внешнего api */
});

export const $clicksCount = createStore(0);

sample({
  clock: buttonClicked,
  source: $clicksCount,
  filter: (count) => count < 100,
  target: validateClickFx,
});

sample({
  clock: validateClickFx.done,
  source: $clicksCount,
  fn: (count) => count + 1,
  target: $clicksCount,
});

sample({
  clock: validateClickFx.fail,
  fn: () => 0,
  target: $clicksCount,
});
```

#### Настройка тестов

Наш основной сценарий следующий:

1. Пользователь нажимает на кнопку.
2. Валидация заканчивается успешно.
3. Счетчик увеличивается на 1.

Давайте протестируем это:

1. Создадим новый экземпляр Scope посредством вызова `fork`.
2. Проверим, что изначально счет равен `0`.
3. Затем сымитируем событие `buttonClicked` с использованием `allSettled` – этот промис будет разрешен после завершения всех вычислений.
4. Проверим, что в конце у нас имеется нужное состояние.

```ts
import { fork, allSettled } from "effector";

import { $clicksCount, buttonClicked, validateClickFx } from "./model";

test("main case", async () => {
  const scope = fork(); // 1

  expect(scope.getState($clicksCount)).toEqual(0); // 2

  await allSettled(buttonClicked, { scope }); // 3

  expect(scope.getState($clicksCount)).toEqual(1); // 4
});
```

Однако в этом тесте есть проблема — он использует реальный API бэкенда. Но поскольку это юнит тест, нам следует каким-то образом подменить этот запрос.

#### Кастомные обработчики эффектов

Для того, чтобы нам избежать реального запроса на сервер, мы можем замокать ответ от сервера предоставив кастомный обработчик через конфигурацию `fork`.

```ts
test("main case", async () => {
  const scope = fork({
    handlers: [
      // Список пар [effect, mock handler]
      [validateClickFx, () => true],
    ],
  });

  expect(scope.getState($clicksCount)).toEqual(0);

  await allSettled(buttonClicked, { scope });

  expect(scope.getState($clicksCount)).toEqual(1);
});
```

#### Кастомные значения стора

У нас есть еще один сценарий:

1. Счетчик уже больше 100.
2. Пользователь нажимает кнопку.
3. Должен отсутствовать вызов эффекта.

Для этого случая нам потребуется как-то подменить начальное состояние «больше 100» каким-то образом.

Мы также можем предоставить кастомное начальное значение через конфигурацию `fork`.

```ts
test("bad case", async () => {
  const MOCK_VALUE = 101;
  const mockFunction = testRunner.fn();

  const scope = fork({
    values: [
      // Список пар [store, mockValue]
      [$clicksCount, MOCK_VALUE],
    ],
    handlers: [
      // Список пар [effect, mock handler]
      [
        validateClickFx,
        () => {
          mockFunction();

          return false;
        },
      ],
    ],
  });

  expect(scope.getState($clicksCount)).toEqual(MOCK_VALUE);

  await allSettled(buttonClicked, { scope });

  expect(scope.getState($clicksCount)).toEqual(MOCK_VALUE);
  expect(mockFunction).toHaveBeenCalledTimes(0);
});
```

Вот так мы можем протестировать каждый случай использования, который хотим проверить.


# Исправление ошибок

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import SideBySide from "@components/SideBySide/SideBySide.astro";

## Исправление ошибок

### Основные ошибки

#### `store: undefined is used to skip updates. To allow undefined as a value provide explicit { skipVoid: false } option`

Эта ошибка сообщает вам о том, что вы пытаетесь передать в ваш стор значение `undefined`, что, возможно, является некорректным поведением.

Если вам действительно нужно передать в ваш стор значение `undefined`, то вам надо вторым аргументом в `createStore` передать объект со свойством `skipVoid: false`.

```ts
const $store = createStore(0, {
  skipVoid: false,
});
```

#### `no handler used in [effect name]`

Эта ошибка возникает при вызове эффекта без обработчика. Убедитесь, что вы передали обработчик в метод `createEffect` при создании, или позже при использовании метода `.use(handler)`.

#### `serialize: One or more stores dont have sids, their values are omitted`

> INFO До версии 23.3.0: 
>
> До версии 23.3.0 эта ошибка также известна как: `There is a store without sid in this scope, its value is omitted`.

Эта ошибка часто встречается при работе с SSR, она связана с тем, что у вашего стора отсутствует `сид` (stable id), который необходим для корректной гидрации данных с сервера на клиент.
Чтобы исправить эту проблему вам нужно добавить этот `сид`.<br/>
Сделать это вы можете несколькими способами:

1. Использовать babel или SWC плагин, который сделает все за вас
2. Или добавить `сид` вручную, передав во второй аргумент `createStore` объект со свойством `sid`:

   ```ts
   const $store = createStore(0, {
     sid: "unique id",
   });
   ```

Более подробно про .

#### `scopeBind: scope not found`

Эта ошибка случается когда скоуп потерялся на каком-то из этапов выполнения и `scopeBind` не может связать событие или эффект с нужным скоупом выполнения.<br/>
Эта ошибка могла быть вызвана:

1. Вы используете режим работы 'без скоупа' и у вас их нет в приложении
2. Ваши юниты были вызваны вне скоупа

Возможные решения:

1. Используйте `scopeBind` внутри эффектов:

   ```ts
   const event = createEvent();

   // ❌ - не вызывайте scopeBind внутри колбеков
   const effectFx = createEffect(() => {
     setTimeout(() => {
       scopeBind(event)();
     }, 1111);
   });

   // ✅ - используйте scopeBind внутри эффекта
   const effectFx = createEffect(() => {
     const scopeEvent = scopeBind(event);

     setTimeout(() => {
       scopeEvent();
     }, 1111);
   });
   ```

2. Ваши юниты должны быть вызваны внутри скоупа:
   * При работе с фреймворком используйте `useUnit`
   * Если у вас происходит вызов события или эффекта вне фреймворка, то используйте `allSettled` и передайте нужный `scope` в аргумент

Если того требует ваша реализация, а от ошибки нужно избавиться, то вы можете передать свойство `safe:true` во второй аргумент метода.

```ts
const scopeEvent = scopeBind(event, {
  safe: true,
});
```

#### `call of derived event is not supported, use createEvent instead`

Эта ошибка возникает, когда вы пытаетесь вызвать производное событие как функцию. Производные события создаются методами как `.map()`, `.filter()`, `.filterMap()`, а также оператором `sample`.

Чтобы исправить используйте событие созданное через `createEvent`.

#### `unit call from pure function is not supported, use operators like sample instead`

Эта ошибка возникает, когда вы пытаетесь вызвать события или эффекты из чистых функций в Effector:

* **Вызов событий в методах событий**<br/>
  Когда вы пытаетесь вызвать одно событие внутри `.map()`, `.filter()`, `.filterMap()` или `.prepend()` другого события.

* **Вызов событий в обработчиках сторов**<br/>
  При попытке вызвать событие в обработчике .on(), внутри метода .map(), или свойства конфигурации updateFilter() стора.

* **Вызов событий в функциях `sample`**<br/>
  При вызове события в функции `fn` или `filter` оператора `sample`.

Как исправить: Вместо вызова событий в чистых функциях используйте декларативные операторы, например `sample`.

### Частые проблемы

#### `sample.fn` не сужает тип, который приходит из `sample.filter`

Частая проблема с типизацией `sample` происходит когда мы делаем проверку в `filter` на что-то, но не получаем необходимый тип в `fn`. Чтобы это исправить вы можете добавить предикаты типов или использовать [`effector-action`](https://github.com/AlexeyDuybo/effector-action) билблиотеку, которая поможет проще работать с условными типами:

<SideBySide>
<Fragment slot="left">

```tsx wrap data-height="full"
import { sample } from "effector";

const messageSent = createEvent<Message>();
const userText = createEvent<string>();

sample({
  clock: messageSent,
  filter: (msg: Message): msg is UserMessage => msg.kind === "user",
  fn: (msg) => msg.text,
  target: userText,
});
```

</Fragment>
<Fragment slot="right">

```tsx wrap data-height="full"
import { createAction } from "effector-action";

const userText = createEvent<string>();

const messageSent = createAction({
  target: userText,
  fn: (userText, msg: Message) => {
    if (msg.kind === "user") {
      userText(msg.txt);
    }
  },
});
```

</Fragment>
</SideBySide>

#### Мое состояние не изменилось

Если ваше состояние не изменилось, то скорее всего вы работаете со скоупами и в какой-то момент активный скоуп потерялся и ваш юнит выполнился в глобальной области.<br/>

Типичные места, где это проявляется:

* `setTimeout` / `setInterval`
* `addEventListener`
* WebSocket
* прямой вызов промисов в эффектах
* сторонние библиотеки с асинхронными API или колбэки.

**Решение**: Привяжите ваше событие или эффект к текущему скоупу при помощи :

<SideBySide>
<Fragment slot="left">

```tsx wrap data-border="good" data-height="full" mark={6} "scopedEvent"
// ✅ все отработает корректно

const event = createEvent();

const effectFx = createEffect(() => {
  const scopedEvent = scopeBind(event);

  setTimeout(() => {
    scopedEvent();
  }, 1000);
});
```

</Fragment>
<Fragment slot="right">

```tsx wrap data-border="bad" data-height="full"
// ❌ событие вызовется в глобальном скоупе

const event = createEvent();

const effectFx = createEffect(() => {
  setTimeout(() => {
    event();
  }, 1000);
});
```

</Fragment>
</SideBySide>

##### Использование юнитов без `useUnit`

Если вы используете события или эффекты во фреймворках без использования хука `useUnit`, что может также повлиять на потерю скоупа.<br/>
Чтобы исправить это поведение передайте нужный юнит в `useUnit` хук и используйте возвращаемое значение:

<SideBySide>
<Fragment slot="left">

```tsx wrap data-border="good" data-height="full" "useUnit"
// ✅ использование хука

import { event } from "./model.js";
import { useUnit } from "effector-react";

const Component = () => {
  const onEvent = useUnit(event);

  return <button onClick={() => onEvent()}>click me</button>;
};
```

</Fragment>
<Fragment slot="right">

```tsx wrap data-border="bad" data-height="full"
// ❌ прямой вызов юнита

import { event } from "./model.js";

const Component = () => {
  return <button onClick={() => event()}>click me</button>;
};
```

</Fragment>
</SideBySide>

> INFO Информация: 
>
> Использования хука  с юнитами.

### Не нашли ответ на свой вопрос ?

Если вы не нашли ответ на свой вопрос, то вы всегда можете задать сообществу:

* [RU Telegram](https://t.me/effector_ru)
* [EN Telegram](https://t.me/effector_en)
* [Discord](https://discord.gg/t3KkcQdt)
* [Reddit](https://www.reddit.com/r/effectorjs/)


# Настройка работы WebSocket

## Работа с WebSocket в Effector

В этом руководстве мы рассмотрим как правильно организовать работу с WebSocket соединением используя Effector.

> INFO WebSocket и типы данных: 
>
> WebSocket API поддерживает передачу данных в виде строк или бинарных данных (`Blob`/`ArrayBuffer`). В этом руководстве мы сфокусируемся на работе со строками, так как это наиболее распространённый случай при обмене данными. При необходимости работы с бинарными данными, можно адаптировать примеры под нужный формат.

### Базовая модель

Создадим простую, но рабочую модель WebSocket клиента. Для начала определим основные события и состояния:

```ts
import { createStore, createEvent, createEffect, sample } from "effector";

// События для работы с сокетом
const disconnected = createEvent();
const messageSent = createEvent<string>();
const rawMessageReceived = createEvent<string>();

const $connection = createStore<WebSocket | null>(null)
  .on(connectWebSocketFx.doneData, (_, ws) => ws)
  .reset(disconnected);
```

Создадим эффект для установки соединения:

```ts
const connectWebSocketFx = createEffect((url: string): Promise<WebSocket> => {
  const ws = new WebSocket(url);

  const scopeDisconnected = scopeBind(disconnected);
  const scopeRawMessageReceived = scopeBind(rawMessageReceived);

  return new Promise((res, rej) => {
    ws.onopen = () => {
      res(ws);
    };

    ws.onmessage = (event) => {
      scopeRawMessageReceived(event.data);
    };

    ws.onclose = () => {
      scopeDisconnected();
    };

    ws.onerror = (err) => {
      scopeDisconnected();
      rej(err);
    };
  });
});
```

Обратите внимание, что мы использовали здесь функцию scopeBind, чтобы связать юниты с текущим скоупом выполнения, так как мы не знаем когда вызовется `scopeMessageReceived` внутри `socket.onmessage`. Иначе событие попадет в глобальный скоуп.
Читать более подробно.

> WARNING Работа в режиме 'без скоупа': 
>
> Если вы по какой-то причине работаете в режиме без скоупа, то вам не нужно использовать `scopeBind`.<br/>
> Учитывайте, что работа со скоупом это рекомундуемый вариант работы!

### Обработка сообщений

Создадим стор для последнего полученного сообщения:

```ts
const $lastMessage = createStore("");

$lastMessage.on(messageReceived, (_, newMessage) => newMessage);
```

А также реализуем эффект для отправки сообщения:

```ts
const sendMessageFx = createEffect((params: { socket: WebSocket; message: string }) => {
  params.socket.send(params.message);
});

// Связываем отправку сообщения с текущим сокетом
sample({
  clock: messageSent,
  source: $connection,
  filter: Boolean, // Отправляем только если есть соединение
  fn: (socket, message) => ({
    socket,
    message,
  }),
  target: sendMessageFx,
});
```

> TIP Состояния соединения: 
>
> WebSocket имеет несколько состояний подключения (`CONNECTING`, `OPEN`, `CLOSING`, `CLOSED`). В базовой модели мы упрощаем это до простой проверки через `Boolean`, но в реальном приложении может потребоваться более детальное отслеживание состояния.

### Обработка ошибок

При работе с WebSocket важно корректно обрабатывать различные типы ошибок для обеспечения надежности приложения.

Расширим нашу базовую модель добавив обработку ошибок:

```ts
const TIMEOUT = 5_000;

// Добавляем события для ошибок
const socketError = createEvent<Error>();

const connectWebSocketFx = createEffect((url: string): Promise<WebSocket> => {
  const ws = new WebSocket(url);

  const scopeDisconnected = scopeBind(disconnected);
  const scopeRawMessageReceived = scopeBind(rawMessageReceived);
  const scopeSocketError = scopeBind(socketError);

  return new Promise((res, rej) => {
    const timeout = setTimeout(() => {
      const error = new Error("Connection timeout");

      socketError(error);
      reject(error);
      socket.close();
    }, TIMEOUT);

    ws.onopen = () => {
      clearTimeout(timeout);
      res(ws);
    };

    ws.onmessage = (event) => {
      scopeMessageReceived(event.data);
    };

    ws.onclose = () => {
      disconnected();
    };

    ws.onerror = (err) => {
      const error = new Error("WebSocket error");
      scopeDisconnected();
      scopeSocketError(error);
      rej(err);
    };
  });
});

// Стор для хранения ошибки
const $error = createStore("")
  .on(socketError, (_, error) => error.message)
  .reset(connectWebSocketFx.done);
```

> WARNING Обработка ошибок: 
>
> Всегда обрабатывайте ошибки WebSocket соединения, так как они могут возникнуть по множеству причин: проблемы с сетью, таймауты, невалидные данные и т.д.

### Типизация сообщений

При работе с WebSocket важно обеспечить типобезопасность данных. Это позволяет предотвратить ошибки на этапе разработки и повысить надёжность приложения при обработке различных типов сообщений.

Для этого воспользуемся библиотекой [Zod](https://zod.dev/), хотя можно использовать любую другую библиотеку для валидации.

> INFO TypeScript и проверка типов: 
>
> Даже если вы не используете Zod или другую библиотеку валидации, базовую типизацию WebSocket сообщений можно реализовать и с помощью обычных TypeScript-интерфейсов. Но помните — они проверяют типы только на этапе компиляции и не защитят вас от неожиданных данных во время выполнения.

Предположим, что мы ожидаем два типа сообщений: `balanceChanged` и `reportGenerated`, содержащие следующие поля:

```ts
export const messagesSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("balanceChanged"),
    balance: z.number(),
  }),
  z.object({
    type: z.literal("reportGenerated"),
    reportId: z.string(),
    reportName: z.string(),
  }),
]);

// Получаем тип из схемы
type MessagesSchema = z.infer<typeof messagesSchema>;
```

Теперь добавим эффект обработки сообщений, чтобы гарантировать, что они соответствуют ожидаемым типам, а также логику получения сообщений:

```ts
const parsedMessageReceived = createEvent<MessagesSchema>();

const parseFx = createEffect((message: unknown): MessagesSchema => {
  return messagesSchema.parse(JSON.parse(typeof message === "string" ? message : "{}"));
});

// Парсим сообщение при его получении
sample({
  clock: rawMessageReceived,
  target: parseFx,
});

// Если парсинг удался — отправляем сообщение дальше
sample({
  clock: parseFx.doneData,
  target: parsedMessageReceived,
});
```

Мы также должны обработать ситуацию, когда сообщение не соответствует схеме:

```ts
const validationError = createEvent<Error>();

// Если парсинг не удался — обрабатываем ошибку
sample({
  clock: parseFx.failData,
  target: validationError,
});
```

Вот и всё, теперь все входящие сообщения будут проверяться на соответствие схеме перед их обработкой, а также иметь типизацию.

> TIP Типизация отправляемых сообщений: 
>
> Такой же подход можно применить и для исходящих сообщений. Это позволит проверять их структуру перед отправкой и избежать ошибок.

Если хочется более точечного контроля, можно сделать событие, которое будет срабатывать только для определенного типа сообщений:

```ts
type MessageType<T extends MessagesSchema["type"]> = Extract<MessagesSchema, { type: T }>;

export const messageReceivedByType = <T extends MessagesSchema["type"]>(type: T) => {
  return sample({
    clock: parsedMessageReceived,
    filter: (message): message is MessageType<T> => {
      return message.type === type;
    },
  });
};
```

Пример использования:

```ts
sample({
  clock: messageReceivedByType("balanceChanged"),
  fn: (message) => {
    // Typescript знает структуру message
  },
  target: doWhateverYouWant,
});
```

> INFO Возвращаемые значения sample: 
>
> Если вы не уверены, какие данные возвращает sample, рекомендуем ознакомиться с документацией по sample.

### Работа с `Socket.IO`

[Socket.IO](https://socket.io/) предоставляет более высокоуровневый API для работы с WebSocket, добавляя множество полезных возможностей "из коробки".

> INFO Преимущества Socket.IO: 
>
> * Автоматическое переподключение
> * Поддержка комнат и пространств имён
> * Fallback на HTTP Long-polling если WebSocket недоступен
> * Встроенная поддержка событий и подтверждений (acknowledgments)
> * Автоматическая сериализация/десериализация данных

```ts
import { io, Socket } from "socket.io-client";
import { createStore, createEvent, createEffect, sample } from "effector";

const API_URL = "wss://your.ws.server";

// События
const connected = createEvent();
const disconnected = createEvent();
const socketError = createEvent<Error>();

// Типизация для событий
type ChatMessage = {
  room: string;
  message: string;
  author: string;
};

const messageSent = createEvent<ChatMessage>();
const messageReceived = createEvent<ChatMessage>();
const socketConnected = createEvent();
const connectSocket = createEvent();

const connectFx = createEffect((): Promise<Socket> => {
  const socket = io(API_URL, {
    //... ваша конфигурация
  });

  // нужно для корректной работы со скоупами
  const scopeConnected = scopeBind(connected);
  const scopeDisconnected = scopeBind(disconnected);
  const scopeSocketError = scopeBind(socketError);
  const scopeMessageReceived = scopeBind(messageReceived);

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      scopeConnected();
      resolve(socket);
    });

    socket.on("disconnect", () => scopeDisconnected());
    socket.on("connect_error", (error) => scopeSocketError(error));
    socket.on("chat message", (msg: ChatMessage) => scopeMessageReceived(msg));
  });
});

const sendMessageFx = createEffect(
  ({
    socket,
    name,
    payload,
  }: SocketResponse<any> & {
    socket: Socket;
  }) => {
    socket.emit(name, payload);
  },
);

// Состояния
const $socket = createStore<Socket | null>(null)
  .on(connectFx.doneData, (_, socket) => socket)
  .reset(disconnected);

// инициализация подключения
sample({
  clock: connectSocket,
  target: connectFx,
});

// вызываем событие после успешного подключения
sample({
  clock: connectSocketFx.doneData,
  target: socketConnected,
});
```


# Сообщество

## Сообщество

### Материалы

* [dev.to/effector](https://dev.to/effector) — пространство на публичной платформе
* [reddit.com/r/effectorjs](https://reddit.com/r/effectorjs) — сабреддит
* [twitter.com/effectorJS](https://twitter.com/effectorJS) — ретвиты, релизы, анонсы

### Видео

* [Канал на Youtube](https://www.youtube.com/channel/UCm8PRc_yjz3jXHH0JylVw1Q)

### Где я могу задать вопрос?

1. Прежде всего, вы можете посмотреть [ишью](https://github.com/effector/effector/issues) и [дискуссии](https://github.com/effector/effector/discussions) в репозитории
2. У нас есть несколько чатов:
   * Telegram — [t.me/effector\_en](https://t.me/effector_en)
   * Discord — [discord.gg/t3KkcQdt](https://discord.gg/t3KkcQdt)
   * Reddit — [reddit.com/r/effectorjs](https://www.reddit.com/r/effectorjs/)
   * Gitter — [gitter.im/effector/community](https://gitter.im/effector/community)

### Русскоязычное сообщество

* Задать вопрос — [t.me/effector\_ru](https://t.me/effector_ru)
* Новости и анонсы — [t.me/effector\_news](https://t.me/effector_news)
* Видео:
  * Effector Meetup 1 — [youtube.com/watch?v=IacUIo9fXhI](https://www.youtube.com/watch?v=IacUIo9fXhI)
  * Effector Meetup 2 — [youtube.com/watch?v=nLYc4PaTXYk](https://www.youtube.com/watch?v=nLYc4PaTXYk)
  * Пишем фичу в проекте с EffectorJS — [youtube.com/watch?v=dtrWzH8O\_4k](https://www.youtube.com/watch?v=dtrWzH8O_4k)
  * Как и зачем мы мигрировали Авиасейлс на Effector — [youtube.com/watch?v=HYaSnVEZiFk](https://www.youtube.com/watch?v=HYaSnVEZiFk)
  * Делаем игру — [youtube.com/watch?v=tjjxIQd0E8c](https://www.youtube.com/watch?v=tjjxIQd0E8c)
  * Effector 22.2.0 Halley — [youtube.com/watch?v=pTq9AbmS0FI](https://www.youtube.com/watch?v=pTq9AbmS0FI)
  * Effector 22.4.0 Encke — [youtube.com/watch?v=9UjgcNn0K\_o](https://www.youtube.com/watch?v=9UjgcNn0K_o)

### Поддержка и спонсирование

* Sponsr — [sponsr.ru/effector](https://sponsr.ru/effector/)
* OpenCollective — [opencollective.com/effector](https://opencollective.com/effector)
* Patreon — [patreon.com/zero\_bias](https://www.patreon.com/zero_bias)

<br /><br />

### Познакомьтесь с командой Effector

Команда Effector постоянно работает над проектами, которые используют Effector для решения бизнес-задач.
Каждый участник команды использует библиотеку ежедневно как пользователь и пытается улучшить пользовательский опыт как основной член команды.

#### Дмитрий Болдырев

<img width="256" src="https://avatars.githubusercontent.com/u/15912112?v=4" />

[Github](https://github.com/zerobias) • [Twitter](https://twitter.com/zero__bias) • [Commits](https://github.com/effector/effector/commits?author=zerobias)

Дмитрий создал первую версию Effector в 2018 году, чтобы решить проблему реактивной архитектуры, управляемой событиями, в мессенджере.
Теперь его основная цель - улучшить пользовательский опыт самого Effector и ускорить ядро.

#### Сергей Сова

<img width="256" src="https://avatars.githubusercontent.com/u/5620073?v=4" />

[Github](https://github.com/sergeysova) • [Twitter](https://twitter.com/_sergeysova) • [Commits](https://github.com/effector/effector/commits?author=sergeysova)

С 2018 года Сергей создал несколько пакетов экосистемы: [patronum](https://github.com/effector/patronum), [logger](https://github.com/effector/logger), [inspector](https://github.com/effector/inspector).
Его основная задача - улучшать пользовательский опыт через экосистему и документацию.

#### Александр Хороших

<img width="256" src="https://avatars.githubusercontent.com/u/32790736?v=4" />

[Github](https://github.com/AlexandrHoroshih) • [Telegram](https://t.me/AlexandrHoroshih) • [Commits](https://github.com/effector/effector/commits?author=AlexandrHoroshih)

Александр внес вклад в каждый пакет ядра и репозитория Effector.
Он рассматривал вклады и улучшал DX основной функциональности.

#### Кирилл Миронов

<img width="256" src="https://i.imgur.com/JFaZkm9.jpg" />

[Github](https://github.com/Drevoed) • [Telegram](https://t.me/vetrokm)

Кирилл сделал [swc-plugin](https://github.com/effector/swc-plugin), [биндинги для SolidJS](https://github.com/effector/effector/tree/master/packages/effector-solid),
и теперь улучшает экосистему и основную функциональность.

#### Игорь Камышев

<img width="256" src="https://avatars.githubusercontent.com/u/26767722?v=4" />

[Github](https://github.com/igorkamyshev) • [Telegram](https://t.me/igorkamyshev) • [Commits](https://github.com/effector/effector/commits?author=igorkamyshev)

Игорь работает над [Farfetched](https://ff.effector.dev) - это продвинутый инструмент для получения данных.
Игорь сделал [eslint-plugin-effector](https://eslint.effector.dev) и ревьюит многие PR и ишью пакетов effector и экосистемы.

#### Ян Лобатый

<img width="256" src="https://i.imgur.com/DomL22D.jpg" />

[Github](https://github.com/YanLobat) • [Telegram](https://t.me/lobatik) • [Commits](https://github.com/effector/effector/commits?author=YanLobat)

Ян внес многочисленные исправления и улучшения во все репозитории Effector.
Ян помогает нам писать объяснения и справочную документацию. Возможно вы слышали о воркшопе, который провел Ян по Effector.

#### Егор Гуща

<img width="256" src="https://avatars.githubusercontent.com/u/22044607?v=4" />

[Github](https://github.com/egorguscha) • [Twitter](https://twitter.com/simpleigich)

С 2019 года работает в команде ядра Effector над документацией, учебными материалами и улучшением экосистемы.

<br /><br />

### Благодарности

#### Илья Лесик

<img width="256" src="https://avatars.githubusercontent.com/u/1270648?v=4" />

[Github](https://github.com/ilyalesik) • [Twitter](https://twitter.com/ilialesik)

Илья составил список замечательных пакетов экосистемы Effector.

#### Евгений Федотов

<img width="256" src="https://avatars.githubusercontent.com/u/18236014?v=4" />

[Github](https://github.com/EvgenyiFedotov) • [Telegram](https://t.me/evgeniyfedotov)

Евгений создал [effector-reflect](https://github.com/effector/reflect) и помогает нам писать документацию.

#### Валерий Кобзарь

<img width="256" src="https://avatars.githubusercontent.com/u/1615093?v=4" />

[Github](https://github.com/kobzarvs) • [Telegram](https://t.me/ValeryKobzar) • [Commits](https://github.com/effector/effector/commits?author=kobzarvs)

Валерий разработал серверный код для [REPL](https://share.effector.dev) и написал множество страниц документации.

#### Антон Косых

<img width="256" src="https://i.imgur.com/GD0zWpH.jpg" />

[Github](https://github.com/Kelin2025) • [Telegram](https://t.me/kelin2025)

Один из первых пользователей Effector, работающий над [Atomic Router](https://atomic-router.github.io/) и пакетами экосистемы, такими как [effector-history](https://github.com/kelin2025/effector-history),
[effector-pagination](https://github.com/kelin2025/effector-pagination) и [effector-factorio](https://github.com/Kelin2025/effector-factorio).

#### Андрей Чурочкин

[Github](https://github.com/goodmind)

Андрей стоял у истоков Effector. Он написал всю первую документацию, реализовал первую версию REPL и внедрил многие основные методы.

#### Роман Титов

[Github](https://github.com/popuguytheparrot) • [Telegram](https://t.me/popuguy)

Роман продвигает Effector среди сообщества фронтенд-разработчиков и работает над документацией.

*Этот список не является исчерпывающим.*

<br /><br />

### Участники

Пожалуйста, откройте [README.md](https://github.com/effector/effector#contributors), чтобы увидеть полный список наших участников.
У нас есть [GitHub экшн](https://github.com/effector/effector/blob/master/.github/workflows/contributors.yml), который генерирует этот список.
Также вы можете открыть страницу [Insights](https://github.com/effector/effector/graphs/contributors) на основном репозитории.

Мы хотели бы поблагодарить всех участников за Effector и экосистему.

Спасибо за вашу поддержку и любовь на протяжении всего этого времени \:heart:


# Основные концепции

## Основные концепции

Effector – это библиотека для работы с состоянием приложения, которая позволяет разработчикам создавать масштабируемые и предсказуемые реактивные приложения.

В основе Effector лежит концепция **юнитов** - независимых строительных блоков приложения. Каждый юнит: стор, событие или эффект, выполняет свою конкретную роль. <br/>
Объединяя юниты, разработчики могут создавать сложные, но понятные потоки данных в приложении.

Разработка с effector строится по нескольким принципам:

* **Декларативность** – вы описываете *что* должно произойти, а не *как* это должно работать
* **Реактивность** – вам не нужно вручную синхронизировать изменения, все работает автоматически
*  – вся логика работы с юнитами должна быть описана статично на уровне модуля

Effector использует умную систему отслеживания зависимостей, которая гарантирует, что при изменении данных обновятся только действительно зависимые части приложения.

### Юниты

Юнит - это базовое понятие в Effector. Store, Event и Effect – это все юниты, то есть базовые строительные блоки для создания бизнес-логики приложения. Каждый юнит представляет собой независимую сущность, которая может быть:

* Связана с другими юнитами
* Подписана на изменения других юнитов
* Использована для создания новых юнитов

```ts
import { createStore, createEvent, createEffect, is } from "effector";

const $counter = createStore(0);
const event = createEvent();
const fx = createEffect(() => {});

// Проверка, является ли значение юнитом
is.unit($counter); // true
is.unit(event); // true
is.unit(fx); // true
is.unit({}); // false
```

#### Событие (##event)

Событие (Event) — Событие в Effector представляет собой точку входа в реактивный поток данных, проще говоря это способ сказать приложению "что-то произошло".

##### Особенности события

* Простота: События в Effector являются минималистичными и легко создаются с помощью createEvent.
* Композиция: Вы можете комбинировать события, фильтровать их, изменять данные и передавать их в другие обработчики или сторы.

```js
import { createEvent } from "effector";

// Создаем событие
const formSubmitted = createEvent();

// Подписываемся на событие
formSubmitted.watch(() => console.log("Форма отправлена!"));

formSubmitted();

// Вывод в консоль:
// "Форма отправлена!"
```

#### Стор

Стор (Store) — это место, где живут данные вашего приложения. Он представляет собой реактивное значение, обеспечивающую строгий контроль над мутациями и потоком данных.

##### Особенности сторов

* У вас может быть столько сторов, сколько вам нужно
* Стор поддерживает реактивность — изменения автоматически распространяются на все подписанные компоненты
* Effector оптимизирует ререндеры компонентов, подписанных на сторы, минимизируя лишние обновления
* Данные в сторе иммутабельнные
* Здесь нет `setState`, изменение состояния происходит через события

```ts
import { createStore, createEvent } from "effector";

// Создаем событие
const superAdded = createEvent();

// Создаем стор
const $supers = createStore([
  {
    name: "Человек-паук",
    role: "hero",
  },
  {
    name: "Зеленый гоблин",
    role: "villain",
  },
]);

// Обновляем стор при срабатывании события
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// Вызываем событие
superAdded({
  name: "Носорог",
  role: "villain",
});
```

#### Эффект

Эффект (Effect) — Эффекты предназначены для обработки побочных действий — то есть для взаимодействия с внешним миром, например с http запросами, или для работы с таймерами.<br/>

##### Особенности эффекта

* У эффекта есть встроенные состояния `pending` и события `done`, `fail`, которые облегчают отслеживание выполнения операций.
* Логика, связанная с взаимодействием с внешним миром, вынесена за пределы основной логики приложения. Это упрощает тестирование и делает код более предсказуемым.
* Может быть как асинхронным, так и синхронным

```js
import { createEffect } from "effector";

const fetchUserFx = createEffect(async (userId) => {
  const response = await fetch(`/api/user/${userId}`);
  return response.json();
});

// Подписываемся на результат эффекта
fetchUserFx.done.watch(({ result }) => console.log("Данные пользователя:", result));
// Если эффект выкинет ошибку, то мы отловим ее при помощи события fail
fetchUserFx.fail.watch(({ error }) => console.log("Произошла ошибка! ", error));

// Запускаем эффект
fetchUserFx(1);
```

### Реактивность

Как мы говорили в самом начале effector основан на принципах реактивности, где изменения **автоматически** распространяются через приложение. При этом вместо императивного подхода, где вы явно указываете как и когда обновлять данные, вы декларативно описываете связи между различными частями приложения.

#### Как работает реактивность?

Рассмотрим пример из части про сторы, где мы имеем стор с массивом суперлюдей. Допустим у нас появилось новое требование это выводить отдельно друг от друга героев и злодеев. Реализовать это будет очень просто при помощи производных сторов:

```ts
import { createStore, createEvent } from "effector";

// Создаем событие
const superAdded = createEvent();

// Создаем стор
const $supers = createStore([
  {
    name: "Человек-паук",
    role: "hero",
  },
  {
    name: "Зеленый гоблин",
    role: "villain",
  },
]);

// Создали производные сторы, которые зависят от $supers
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

// Обновляем стор при срабатывании события
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// Добавляем супера
superAdded({
  name: "Носорог",
  role: "villain",
});
```

В этом примере мы создали производные сторы `$superHeroes` и `$superVillains`, которые будут зависеть от оригинального `$supers`. При этом изменяя оригинальный стор, у нас также будут изменяться и производные – это и есть реактивность!

### Как это все работает вместе?

А теперь давайте посмотрим как все это работает вместе.
Все наши концепции объединяются в мощный, реактивный поток данных:

1. **Событие** инициирует изменения (например, нажатие кнопки).
2. Эти изменения влияют на **стор**, обновляя состояние приложения.
3. При необходимости, **Эффекты** выполняют побочные действия, такие как взаимодействие с сервером.

Для примера мы все также возьмем код выше с суперами, однако немного изменим его добавив эффект с загрузкой первоначальных данных, как и в реальных приложениях:

```ts
import { createStore, createEvent, createEffect } from "effector";

// определяем наши сторы
const $supers = createStore([]);
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

// создаем события
const superAdded = createEvent();

// создаем эффекты для получения данных
const getSupersFx = createEffect(async () => {
  const res = await fetch("/server/api/supers");
  if (!res.ok) {
    throw new Error("something went wrong");
  }
  const data = await res.json();
  return data;
});

// создаем эффекты для получения данных
const saveNewSuperFx = createEffect(async (newSuper) => {
  // симуляция сохранения нового супера
  await new Promise((res) => setTimeout(res, 1500));
  return newSuper;
});

// когда загрузка завершилась успешно, устанавливаем данные
$supers.on(getSupersFx.done, ({ result }) => result);
// добавляем нового супера
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// вызываем загрузку данных
getSupersFx();
```

> INFO Почему $ и Fx?: 
>
> Это рекомендации команды effector использовать `$` для сторов и `fx` для эффектов.
> Более подробно об этом можно почитать здесь.

#### Связываем юниты в единый поток

Все что нам осталось сделать это как-то связать вызов события `superAdded` и его сохранение `saveNewSuperFx`, а также после успешного сохранения запросить свежие данные с сервера. <br/>
Здесь нам на помощь приходит метод sample. Если юниты это строительные блоки, то `sample` – это клей, который связывает ваши юниты вместе.

> INFO о sample: 
>
> `sample` является основным методом работы с юнитами, который позволяет декларативно запустить цепочку действий.

```ts ins={27-37}
import { createStore, createEvent, createEffect, sample } from "effector";

const $supers = createStore([]);
const $superHeroes = $supers.map((supers) => supers.filter((sup) => sup.role === "hero"));
const $superVillains = $supers.map((supers) => supers.filter((sup) => sup.role === "villain"));

const superAdded = createEvent();

const getSupersFx = createEffect(async () => {
  const res = await fetch("/server/api/supers");
  if (!res.ok) {
    throw new Error("something went wrong");
  }
  const data = await res.json();
  return data;
});

const saveNewSuperFx = createEffect(async (newSuper) => {
  // симуляция сохранения нового супера
  await new Promise((res) => setTimeout(res, 1500));
  return newSuper;
});

$supers.on(getSupersFx.done, ({ result }) => result);
$supers.on(superAdded, (supers, newSuper) => [...supers, newSuper]);

// здесь мы говорим, при запуске clock вызови target и передай туда данные
sample({
  clock: superAdded,
  target: saveNewSuperFx,
});

// когда эффект saveNewSuperFx завершится успешно, то вызови getSupersFx
sample({
  clock: saveNewSuperFx.done,
  target: getSupersFx,
});

// вызываем загрузку данных
getSupersFx();
```

Вот так вот легко и незамысловато мы написали часть бизнес-логики нашего приложения, а часть с отображением этих данных оставили на UI фреймворк.


# Экосистема

## Экосистема

Пакеты и шаблоны экосистемы effector

Больше контента - [awesome-effector repository](https://github.com/effector/awesome)

> INFO Условные обозначения: 
>
> Stage 4: 💚 — стабильный, поддерживается, крутой<br/>
> Stage 3: 🛠️ — стабильный, находиться в разработке, v0.x<br/>
> Stage 2: ☢️️ — Нестабильный/неполный, в большинстве случаев работает, может быть переработан.<br/>
> Stage 1: 🧨 — Ломается в большинстве случаев, надо переделывать, не использовать в production<br/>
> Stage 0: ⛔️ — Заброшен/нужен maintainer, может быть сломан<br/>

### Пакеты

* [patronum](https://github.com/effector/patronum) 💚 — Библиотека утилит Effector, обеспечивающая модульность и удобства.
* [@effector/reflect](https://github.com/effector/reflect) 💚 — Классические HOC переработаны для соединения компонентов React с модулями, компонуемым и (своего рода) «мелкозернистым реактивным» способом..
* [@withease/redux](https://withease.effector.dev/redux/) 💚 — Плавный переход от redux к effector.
* [@withease/i18next](https://withease.effector.dev/i18next) 💚 — Мощные привязки структуры интернационализации.
* [@withease/web-api](https://withease.effector.dev/web-api/) 💚 — Web API - состояние сети, видимость вкладок и многое другое.
* [@withease/factories](https://withease.effector.dev/factories/) 💚 — Набор помощников для создания фабрик в вашем приложении.
* [effector-storage](https://github.com/yumauri/effector-storage) 💚 - Небольшой модуль для синхронизации хранилищ со всеми типами хранилищ (локальное/сессионное хранилище, IndexedDB, файлы cookie, серверное хранилище и т. д.).
* [farfetched](https://ff.effector.dev) 🛠 — Усовершенствованный инструмент получения данных для веб-приложений..
* [@effector/next](https://github.com/effector/next) 🛠 - Официальные привязки для Next.js
* [effector-localstorage](https://github.com/lessmess-dev/effector-localstorage) 🛠 — Модуль для effector, который синхронизирует хранилища с localStorage.
* [effector-hotkey](https://github.com/kelin2025/effector-hotkey) 🛠 — Горячие клавиши — это просто.
* [atomic-router](https://github.com/atomic-router/atomic-router) 🛠 — Роутер, не привязанный к view.
* [effector-undo](https://github.com/tanyaisinmybed/effector-undo) ☢️ — Простая функция отмены/повтора.
* [forest](https://github.com/effector/effector/tree/master/packages/forest) ☢️ — Реактивный движок ui для веб-приложений.
* [effector-utils](https://github.com/Kelin2025/effector-utils) ⛔ — Библиотека утилит Effector.

### DX

* [eslint-plugin-effector](https://eslint.effector.dev) 💚 — Применение лучших практик.
* [@effector/swc-plugin](https://github.com/effector/swc-plugin) 💚 — Официальный SWC-плагин для Effector.
* [effector-logger](https://github.com/effector/logger) 🛠 — Простой логгер сторов, событий, эффектов и доменов.
* [@effector/redux-devtools-adapter](https://github.com/effector/redux-devtools-adapter) 🛠 - Простой адаптер, который логгирует обновления в Redux DevTools.

### Управление формами

* [effector-final-form](https://github.com/binjospookie/effector-final-form) 🛠️ – Привязки effector для Final Form.
* [filledout](https://filledout.github.io) ☢️ — Менеджер форм с простой в использовании проверкой.
* [effector-forms](https://github.com/aanation/effector-forms) ☢️ — Менеджер форм для effector.
* [effector-react-form](https://github.com/GTOsss/effector-react-form) ☢️ — Подключите свои формы к state-менеджеру.
* [efform](https://github.com/tehSLy/efform) ⛔ — Менеджер форм, основанный на менеджере состояний, предназначенный для высококачественного DX.
* [effector-reform](https://github.com/movpushmov/effector-reform) ☢️️ — Менеджер форм, реализующий концепцию составных форм.

### Шаблоны

* [ViteJS+React Template](https://github.com/effector/vite-react-template) 💚 — Попробуйте эффектор с React и TypeScript за считанные секунды!
* [ViteJS+TypeScript Template](https://github.com/mmnkuh/effector-vite-template) 🛠 — Еще один шаблон ViteJS + TypeScript.


# Примеры

## Примеры

### Простые примеры

#### Индикатор загрузки

Показать индикатор загрузки во время выполнения эффектов

#### Последовательность эффектов

Когда второй запрос к серверу предполагает, что первый запрос уже обработан

#### Отмена эффекта

Когда нужно отменить эффект, не дожидаясь его завершения

#### Модальное окно

Подключить React модальное окно с состоянием

#### Кастомный инпут диапазона

Подключить кастомный инпут диапазона с состоянием

### Больше примеров

* [Змейка](https://dmitryshelomanov.github.io/snake/) ([исходный код](https://github.com/dmitryshelomanov/snake))
* [Игра Ballcraft](https://ballcraft.now.sh/) ([исходный код](https://github.com/kobzarvs/effector-craftball))
* [Клиент-серверное взаимодействие с помощью эффектов](https://github.com/effector/effector/tree/master/examples/worker-rpc)
* Древовидная структура папок
* Фильтрация на основе условий
* Динамическая смена страниц с помощью useStoreMap
* Обновление при скролле
* Компонент переключения ночной темы
* История изменений переменной
* Чтение состояния по умолчанию от бекенда
* [Недавние проекты сообщества](https://github.com/effector/effector/network/dependents)
* [Игра BallSort](https://ballsort.sova.dev/) [исходный код](https://github.com/sergeysova/ballsort)
* [Судоку](https://sudoku-effector.pages.dev/) [исходный код](https://github.com/Shiyan7/sudoku-effector)


# Начало работы

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## Быстрый старт

Effector — это мощный менеджер состояний, который предлагает принципиально новый подход к управлению данными в приложениях. В отличие от традиционных решений, где состояние изменяется напрямую через действия, Effector использует реактивный и декларативный подход.

### Как работать с документацией

Прежде чем начать погружение стоит сказать, что мы поддерживаем `llms.txt` для возможности использования AI-помощников [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), [Gemini](https://gemini.google.com) и других. Вам просто нужно скинуть ссылку в чат, либо загрузить документацию в IDE типа [Cursor](https://www.cursor.com/en).
На текущий момент доступны следующие документы:

* https://effector.dev/ru/llms-full.txt
* https://effector.dev/docs/llms.txt
* https://effector.dev/docs/llms-full.txt

Помимо прочего у нас также существует [ChatGPT effector ассистент](https://chatgpt.com/g/g-thabaCJlt-effector-assistant), [репозиторий загруженный в DeepWiki](https://deepwiki.com/effector/effector), и загруженную документацию на [Context7](https://context7.com/effector/effector).

### Особенности Effector

* Реактивность: Effector автоматически отслеживает зависимости и обновляет все связанные части приложения, избавляя вас от необходимости вручную управлять обновлениями.
* Декларативный код: Вы описываете связи между данными и их трансформации, а Effector сам заботится о том, как и когда выполнять эти преобразования.
* Поддержка SSR и тестов из коробки: Изолированные контексты позволяют легко работать с SSR и писать тесты.
* Гибкая архитектура: Effector одинаково хорошо подходит как для небольших приложений, так и для крупных корпоративных систем.
* Универсальность: Хотя Effector прекрасно интегрируется с популярными фреймворками, он может использоваться в любой JavaScript-среде.

Больше о ключевых особенностях эффектора вы можете прочитать здесь

### Установка effector

Для начала установим effector при помощи вашего любимого пакетного менеджера

<Tabs>
  <TabItem label="npm">

```bash
npm install effector
```

  </TabItem>
  <TabItem label="yarn">

```bash
yarn install effector
```

  </TabItem>
  <TabItem label="pnpm">

```bash
pnpm install effector
```

  </TabItem>
</Tabs>

#### Создаем ваш первый стор

Теперь давайте создадим стор, который является состоянием вашего приложения.

```ts
// counter.js
import { createStore } from "effector";

const $counter = createStore(0);
```

#### Добавление событий

Дальше давайте добавим события, при вызове которых, мы будем обновлять данные стора.

```ts ins={4-5}
// counter.js
import { createEvent } from "effector";

const incremented = createEvent();
const decremented = createEvent();
```

#### Подписываем стор на событие

И свяжем событие вместе с стором.

```ts ins={9-10}
// counter.js
import { createEvent, createStore } from "effector";

const $counter = createStore(0);

const incremented = createEvent();
const decremented = createEvent();

$counter.on(incremented, (counter) => counter + 1);
$counter.on(decremented, (counter) => counter - 1);

// и вызовите событие в вашем приложении
incremented();
// counter увеличится на 1
decremented();
// counter уменьшится на -1
decremented();
// counter уменьшится на -1
```

### Интеграция с фреймворками

#### Установка

Если вы хотите использовать **effector** вместе с фреймворком, то для этого вам потребуется установить дополнительный пакет:

<Tabs syncId="framework-choice">
  <TabItem label="React">

```bash
npm install effector effector-react
```

  </TabItem>
  <TabItem label="Vue">

```bash
npm install effector effector-vue
```

  </TabItem>
  <TabItem label="Solid">

```bash
npm install effector effector-solid
```

  </TabItem>
</Tabs>

#### Примеры использования

И использовать

<Tabs syncId="framework-choice">
  <TabItem label="React">

```jsx
import { useUnit } from "effector-react";
import { createEvent, createStore } from "effector";
import { $counter, incremented, decremented } from "./counter.js";

export const Counter = () => {
  const [counter, onIncremented, onDecremented] = useUnit([$counter, incremented, decremented]);
  // или
  const { counter, onIncremented, onDecremented } = useUnit({ $counter, incremented, decremented });
  // или
  const counter = useUnit($counter);
  const onIncremented = useUnit(incremented);
  const onDecremented = useUnit(decremented);

  return (
    <div>
      <h1>Count: {counter}</h1>
      <button onClick={onIncremented}>Increment</button>
      <button onClick={onDecremented}>Decrement</button>
    </div>
  );
};
```

  </TabItem>
  <TabItem label="Vue">

```html
<script setup>
  import { useUnit } from "@effector-vue/composition";
  import { $counter, incremented, decremented } from "./counter.js";
  const [counter, onIncremented, onDecremented] = useUnit([$counter, incremented, decremented]);
  // или
  const { counter, onIncremented, onDecremented } = useUnit({ $counter, incremented, decremented });
  // или
  const counter = useUnit($counter);
  const onIncremented = useUnit(incremented);
  const onDecremented = useUnit(decremented);
</script>

<template>
  <div>
    <h1>Count: {{ counter }}</h1>
    <button @click="onIncremented">Increment</button>
    <button @click="onDecremented">Decrement</button>
  </div>
</template>
```

  </TabItem>
  <TabItem label="Solid">

```jsx
import { createEvent, createStore } from "effector";
import { useUnit } from "effector-solid";
import { $counter, incremented, decremented } from "./counter.js";

const Counter = () => {
  const [counter, onIncremented, onDecremented] = useUnit([$counter, incremented, decremented]);
  // или
  const { counter, onIncremented, onDecremented } = useUnit({ $counter, incremented, decremented });
  // или
  const counter = useUnit($counter);
  const onIncremented = useUnit(incremented);
  const onDecremented = useUnit(decremented);

  return (
    <div>
      <h1>Count: {counter()}</h1>
      <button onClick={onIncremented}>Increment</button>
      <button onClick={onDecremented}>Decrement</button>
    </div>
  );
};

export default Counter;
```

  </TabItem>
</Tabs>

> INFO А где Svelte ?: 
>
> Для работы со Svelte не требуется дополнительные пакеты, он прекрасно работает с базовым пакетом effector.

### Дополнительные способы установки

#### Старые браузеры

Для совместимости с устаревшими версиями браузеров до IE11 и Chrome 47 (версия браузера для Smart TV) используйте импорты из файлов: `effector/compat`, `effector-react/compat` и `effector-vue/compat`.

Вы можете заменить импорты вручную:

```ts ins={2} del={1}
import { createStore } from "effector";
import { createStore } from "effector/compat";
```

А также используя плагин [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver).
Примерная конфигурация в `.babelrc`:

```json
{
  "plugins": [
    [
      "babel-plugin-module-resolver",
      {
        "alias": {
          "^effector$": "effector/compat",
          "^effector-react$": "effector-react/compat"
        }
      }
    ]
  ]
}
```

#### Другие среды выполнения

Вы также можете использовать `effector` и в других средах выполнения, например `deno`. Чтобы использовать effector, просто импортируйте `effector.mjs` из любого CDN.

```typescript
import { createStore } from "https://cdn.jsdelivr.net/npm/effector/effector.mjs";
```

Примеры CDN:

* https://www.jsdelivr.com/package/npm/effector
* https://cdn.jsdelivr.net/npm/effector/effector.cjs.js
* https://cdn.jsdelivr.net/npm/effector/effector.mjs
* https://cdn.jsdelivr.net/npm/effector-react/effector-react.cjs.js
* https://cdn.jsdelivr.net/npm/effector-vue/effector-vue.cjs.js

### Песочницы

Все примеры в этой документации запускаются в [нашей онлайн песочнице](https://share.effector.dev). Она позволяет запускать, тестировать и распространять свои идеи бесплатно и без установки. React и синтаксис TypeScript поддерживаются без дополнительной настройки. [Репозиторий проекта](https://github.com/effector/repl).

В дополнение к нашей песочнице вы также можете [поиграться в песочнице TypeScript](https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbwMZQKYEMaoMo2qgGhQywFEAzc1JGAXznKghDgHJVLq8pWAofoA).


# Мотивация

## Мотивация

Разработка современных веб-приложений становится сложнее с каждым днем. Множество фреймворков, сложная бизнес-логика, различные подходы к управлению состоянием — все это создает дополнительные сложности для разработчиков. Effector предлагает элегантное решение этих проблем.

### Почему Effector?

Effector был разработан с целью описывать бизнес-логику приложения простым и понятным языком, используя три базовых примитива:

* Событие (Event) — для описания событий
* Стор (Store) — для управления состоянием
* Эффект (Effect) — для работы с сайд эффектами

В то же время логика пользовательского интерфейса остается ответственностью фреймворка.
Пусть каждый фреймворк решает свою задачу настолько эффективно, насколько это возможно.

### Принцип разделения ответственности

В современной разработке существует четкое разделение между бизнес-логикой и пользовательским интерфейсом:

**Бизнес-логика** — это суть вашего приложения, то ради чего оно создается. Она может быть сложной и основанной на реактивных принципах, но именно она определяет, как работает ваш продукт.

**UI-логика** — это то, как пользователи взаимодействуют с бизнес-логикой через интерфейс. Это кнопоки, формы и другие элементы управления.

### Вот почему Effector!

В реальных проектах задачи от менеджера продукта редко содержат детали реализации интерфейса. Вместо этого они описывают сценарии взаимодействия пользователя с системой. Effector позволяет описывать эти сценарии на том же языке, на котором общается команда разработки:

* Пользователи взаимодействуют с приложением → Events
* Видят изменения на странице → Store
* Приложение взаимодействует с внешним миром → Effects

### Независимость от фреймворков

Несмотря на то, что React, Angular и Vue имеют разные подходы к разработке, бизнес-логика приложения остается неизменной. Effector позволяет описать её единообразно, независимо от выбранного фреймворка.
Это означает, что вы можете:

1. Сфокусироваться на бизнес-логике, а не на особенностях фреймворка
2. Легко переиспользовать код между разными частями приложения
3. Создавать более поддерживаемые и масштабируемые решения


# Countdown timer on setTimeout

Sometimes we need a simple countdown. The next example allows us to handle each tick and abort the timer.

Link to a playground

Task:

1. Execute tick every `timeout` milliseconds
2. Each tick should send left seconds to listeners
3. Countdown can be stopped (`abort` argument)
4. Countdown can't be started if already started

```js
function createCountdown(name, { start, abort = createEvent(`${name}Reset`), timeout = 1000 }) {
  // tick every 1 second
  const $working = createStore(true, { name: `${name}Working` });
  const tick = createEvent(`${name}Tick`);
  const timerFx = createEffect(`${name}Timer`).use(() => wait(timeout));

  $working.on(abort, () => false).on(start, () => true);

  sample({
    source: start,
    filter: timerFx.pending.map((is) => !is),
    target: tick,
  });

  sample({
    clock: tick,
    target: timerFx,
  });

  const willTick = sample({
    source: timerFx.done.map(({ params }) => params - 1),
    filter: (seconds) => seconds >= 0,
  });

  sample({
    source: willTick,
    filter: $working,
    target: tick,
  });

  return { tick };
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

Usage:

```js
const startCountdown = createEvent();
const abortCountdown = createEvent();

const countdown = createCountdown("simple", {
  start: startCountdown,
  abort: abortCountdown,
});

// handle each tick
countdown.tick.watch((remainSeconds) => {
  console.info("Tick. Remain seconds: ", remainSeconds);
});

// let's start
startCountdown(15); // 15 ticks to count down, 1 tick per second

// abort after 5 second
setTimeout(abortCountdown, 5000);
```


# Integrate Next.js

There is the official Next.js bindings package - [`@effector/next`](https://github.com/effector/next). Follow its documentation to find out, how to integrate Next.js with effector.


# Integrate with Next.js router

> TIP: 
>
> There is the official Next.js bindings package - [`@effector/next`](https://github.com/effector/next). Follow its documentation to find out, how to integrate Next.js with effector.

This is a simplified example of integration with the Next.js router.
We create a similar model for storing the router instance:

```js
import { attach, createEvent, createStore, sample } from 'effector'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const routerAttached = createEvent<AppRouterInstance>()
const navigationTriggered = createEvent<string>()

const $router = createStore<AppRouterInstance | null>(null).on(
  routerAttached,
  (_, router) => router,
)

const navigateFx = attach({
  source: $router,
  effect: (router, path) => {
    if (!router) return
    return router.push(path)
  },
})

sample({
  clock: navigationTriggered,
  target: navigateFx,
})

export { navigationTriggered, routerAttached }

```

We make provider:

```js
import { useUnit } from 'effector-react';
import { useRouter } from 'next/navigation'

export function EffectorRouterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const attachRouter = useUnit(routerAttached)

  useEffect(() => {
    attachRouter(router)
  }, [router, attachRouter])

  return <>{children}</>
}
```

We use provider:

```js
import { EffectorRouterProvider } from '@/providers/effector-router-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <EffectorRouterProvider>
          {children}
        </EffectorRouterProvider>
      </body>
    </html>
  );
}
```

And we use it in our models:

```js
import { sample } from 'effector';

    ...

sample({
    clock: getUserFx.done,
    fn: () => '/home',
    target: navigationTriggered,
});

```

or in components:

```js
'use client';

import { useUnit } from 'effector-react';
import { navigationTriggered } from '@/your-path-name';

    ...

export function goToSomeRouteNameButton() {
  const goToSomeRouteName = useUnit(navigationTriggered);

  return (
    <button onClick={() => goToSomeRouteName('/some-route-name')}>
      do it!
    </button>
  );
}


```


# Use scopeBind in Next.js

> TIP: 
>
> There is the official Next.js bindings package - [`@effector/next`](https://github.com/effector/next). Follow its documentation to find out, how to integrate Next.js with effector.

There are situations when we need to get values from external libraries through callbacks.
If we directly bind events, then we will face the loss of the scope.
To solve this problem, we can use scopeBind.

We have some external library that returns us the status of our connection.
Let's call it an instance in the store and call it *$service*, and we will take the status through an event.

```js
import { createEvent, createStore } from "effector";

const $connectStatus = createStore("close");
const connectEv = createEvent();

sample({
  clock: connectEv,
  targt: $connectStatus,
});
```

Next, we need to create an effect, within which we will connect our event and *service*.

```js
import { attach, scopeBind } from "effector";

const connectFx = attach({
  source: {
    service: $service,
  },
  async effect({ service }) {
    /**
     * `scopeBind` will automatically derive current scope, if called inside of an Effect
     */
    const serviceStarted = scopeBind(connectEv);

    return await service.on("service_start", serviceStarted);
  },
});
```

After calling our effect, the event will be tied to the scope and will be able to take the current value from our *service*.


# AsyncStorage Counter on React Native

The following example is a React Native counter that stores data to AsyncStorage. It uses store, events and effects.

```js
import * as React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { createStore, createEvent, createEffect, sample } from "effector";
import { useUnit } from "effector-react";

const init = createEvent();
const increment = createEvent();
const decrement = createEvent();
const reset = createEvent();

const fetchCountFromAsyncStorageFx = createEffect(async () => {
  const value = parseInt(await AsyncStorage.getItem("count"));
  return !isNaN(value) ? value : 0;
});

const updateCountInAsyncStorageFx = createEffect(async (count) => {
  try {
    await AsyncStorage.setItem("count", `${count}`, (err) => {
      if (err) console.error(err);
    });
  } catch (err) {
    console.error(err);
  }
});

const $counter = createStore(0);

sample({
  clock: fetchCountFromAsyncStorageFx.doneData,
  target: init,
});

$counter
  .on(init, (state, value) => value)
  .on(increment, (state) => state + 1)
  .on(decrement, (state) => state - 1)
  .reset(reset);

sample({
  clock: $counter,
  target: updateCountInAsyncStorageFx,
});

fetchCountFromAsyncStorageFx();

export default () => {
  const count = useUnit(counter);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{count}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity key="dec" onPress={decrement} style={styles.button}>
          <Text style={styles.label}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity key="reset" onPress={reset} style={styles.button}>
          <Text style={styles.label}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity key="inc" onPress={increment} style={styles.button}>
          <Text style={styles.label}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 60,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  button: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4287f5",
    borderRadius: 5,
  },
  label: {
    fontSize: 30,
    color: "#ffffff",
    fontWeight: "bold",
  },
});
```


# React Counter

```js
import React from "react";
import ReactDOM from "react-dom";
import { createEvent, createStore, combine } from "effector";
import { useUnit } from "effector-react";

const plus = createEvent();

const $counter = createStore(1);

const $counterText = $counter.map((count) => `current value = ${count}`);
const $counterCombined = combine({ counter: $counter, text: $counterText });

$counter.on(plus, (count) => count + 1);

function App() {
  const counter = useUnit($counter);
  const counterText = useUnit($counterText);
  const counterCombined = useUnit($counterCombined);

  return (
    <div>
      <button onClick={plus}>Plus</button>
      <div>counter: {counter}</div>
      <div>counterText: ${counterText}</div>
      <div>
        counterCombined: {counterCombined.counter}, {counterCombined.text}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

Try it


# Dynamic form schema

Try it

```js
import { createEvent, createEffect, createStore, createApi, sample } from "effector";
import { useList, useUnit } from "effector-react";

const submitForm = createEvent();
const addMessage = createEvent();
const changeFieldType = createEvent();

const showTooltipFx = createEffect(() => new Promise((rs) => setTimeout(rs, 1500)));

const saveFormFx = createEffect((data) => {
  localStorage.setItem("form_state/2", JSON.stringify(data, null, 2));
});
const loadFormFx = createEffect(() => {
  return JSON.parse(localStorage.getItem("form_state/2"));
});

const $fieldType = createStore("text");
const $message = createStore("done");
const $mainForm = createStore({});
const $types = createStore({
  username: "text",
  email: "text",
  password: "text",
});

const $fields = $types.map((state) => Object.keys(state));

$message.on(addMessage, (_, message) => message);

$mainForm.on(loadFormFx.doneData, (form, result) => {
  let changed = false;

  form = { ...form };
  for (const key in result) {
    const { value } = result[key];
    if (value == null) continue;
    if (form[key] === value) continue;
    changed = true;
    form[key] = value;
  }
  if (!changed) return;

  return form;
});

const mainFormApi = createApi($mainForm, {
  upsertField(form, name) {
    if (name in form) return;

    return { ...form, [name]: "" };
  },
  changeField(form, [name, value]) {
    if (form[name] === value) return;

    return { ...form, [name]: value };
  },
  addField(form, [name, value = ""]) {
    if (form[name] === value) return;

    return { ...form, [name]: value };
  },
  deleteField(form, name) {
    if (!(name in form)) return;
    form = { ...form };
    delete form[name];

    return form;
  },
});

$types.on(mainFormApi.addField, (state, [name, value, type]) => {
  if (state[name] === type) return;

  return { ...state, [name]: value };
});
$types.on(mainFormApi.deleteField, (state, name) => {
  if (!(name in state)) return;
  state = { ...state };
  delete state[name];

  return state;
});
$types.on(loadFormFx.doneData, (state, result) => {
  let changed = false;

  state = { ...state };
  for (const key in result) {
    const { type } = result[key];

    if (type == null) continue;
    if (state[key] === type) continue;
    changed = true;
    state[key] = type;
  }
  if (!changed) return;

  return state;
});

const changeFieldInput = mainFormApi.changeField.prepend((e) => [
  e.currentTarget.name,
  e.currentTarget.type === "checkbox" ? e.currentTarget.checked : e.currentTarget.value,
]);

const submitField = mainFormApi.addField.prepend((e) => [
  e.currentTarget.fieldname.value,
  e.currentTarget.fieldtype.value === "checkbox"
    ? e.currentTarget.fieldvalue.checked
    : e.currentTarget.fieldvalue.value,
  e.currentTarget.fieldtype.value,
]);

const submitRemoveField = mainFormApi.deleteField.prepend((e) => e.currentTarget.field.value);

$fieldType.on(changeFieldType, (_, e) => e.currentTarget.value);
$fieldType.reset(submitField);

submitForm.watch((e) => {
  e.preventDefault();
});
submitField.watch((e) => {
  e.preventDefault();
  e.currentTarget.reset();
});
submitRemoveField.watch((e) => {
  e.preventDefault();
});

sample({
  clock: [submitForm, submitField, submitRemoveField],
  source: { values: $mainForm, types: $types },
  target: saveFormFx,
  fn({ values, types }) {
    const form = {};

    for (const [key, value] of Object.entries(values)) {
      form[key] = {
        value,
        type: types[key],
      };
    }

    return form;
  },
});

sample({
  clock: addMessage,
  target: showTooltipFx,
});
sample({
  clock: submitField,
  fn: () => "added",
  target: addMessage,
});
sample({
  clock: submitRemoveField,
  fn: () => "removed",
  target: addMessage,
});
sample({
  clock: submitForm,
  fn: () => "saved",
  target: addMessage,
});

loadFormFx.finally.watch(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
});

function useFormField(name) {
  const type = useStoreMap({
    store: $types,
    keys: [name],
    fn(state, [field]) {
      if (field in state) return state[field];

      return "text";
    },
  });
  const value = useStoreMap({
    store: $mainForm,
    keys: [name],
    fn(state, [field]) {
      if (field in state) return state[field];

      return "";
    },
  });
  mainFormApi.upsertField(name);

  return [value, type];
}

function Form() {
  const pending = useUnit(saveFormFx.pending);

  return (
    <form onSubmit={submitForm} data-form autocomplete="off">
      <header>
        <h4>Form</h4>
      </header>
      {useList($fields, (name) => (
        <InputField name={name} />
      ))}

      <input type="submit" value="save form" disabled={pending} />
    </form>
  );
}

function InputField({ name }) {
  const [value, type] = useFormField(name);
  let input = null;

  switch (type) {
    case "checkbox":
      input = (
        <input
          id={name}
          name={name}
          value={name}
          checked={value}
          onChange={changeFieldInput}
          type="checkbox"
        />
      );
      break;
    case "text":
    default:
      input = <input id={name} name={name} value={value} onChange={changeFieldInput} type="text" />;
  }

  return (
    <>
      <label htmlFor={name} style={{ display: "block" }}>
        <strong>{name}</strong>
      </label>
      {input}
    </>
  );
}

function FieldForm() {
  const currentFieldType = useUnit($fieldType);
  const fieldValue =
    currentFieldType === "checkbox" ? (
      <input id="fieldvalue" name="fieldvalue" type="checkbox" />
    ) : (
      <input id="fieldvalue" name="fieldvalue" type="text" defaultValue="" />
    );

  return (
    <form onSubmit={submitField} autocomplete="off" data-form>
      <header>
        <h4>Insert new field</h4>
      </header>
      <label htmlFor="fieldname">
        <strong>name</strong>
      </label>
      <input id="fieldname" name="fieldname" type="text" required defaultValue="" />
      <label htmlFor="fieldvalue">
        <strong>value</strong>
      </label>
      {fieldValue}
      <label htmlFor="fieldtype">
        <strong>type</strong>
      </label>
      <select id="fieldtype" name="fieldtype" onChange={changeFieldType}>
        <option value="text">text</option>
        <option value="checkbox">checkbox</option>
      </select>
      <input type="submit" value="insert" />
    </form>
  );
}

function RemoveFieldForm() {
  return (
    <form onSubmit={submitRemoveField} data-form>
      <header>
        <h4>Remove field</h4>
      </header>
      <label htmlFor="field">
        <strong>name</strong>
      </label>
      <select id="field" name="field" required>
        {useList($fields, (name) => (
          <option value={name}>{name}</option>
        ))}
      </select>
      <input type="submit" value="remove" />
    </form>
  );
}

const Tooltip = () => {
  const [visible, text] = useUnit([showTooltipFx.pending, $message]);

  return <span data-tooltip={text} data-visible={visible} />;
};

const App = () => (
  <>
    <Tooltip />
    <div id="app">
      <Form />
      <FieldForm />
      <RemoveFieldForm />
    </div>
  </>
);

await loadFormFx();

css`
  [data-tooltip]:before {
    display: block;
    background: white;
    width: min-content;
    content: attr(data-tooltip);
    position: sticky;
    top: 0;
    left: 50%;
    color: darkgreen;
    font-family: sans-serif;
    font-weight: 800;
    font-size: 20px;
    padding: 5px 5px;
    transition: transform 100ms ease-out;
  }

  [data-tooltip][data-visible="true"]:before {
    transform: translate(0px, 0.5em);
  }

  [data-tooltip][data-visible="false"]:before {
    transform: translate(0px, -2em);
  }

  [data-form] {
    display: contents;
  }

  [data-form] > header {
    grid-column: 1 / span 2;
  }

  [data-form] > header > h4 {
    margin-block-end: 0;
  }

  [data-form] label {
    grid-column: 1;
    justify-self: end;
  }

  [data-form] input:not([type="submit"]),
  [data-form] select {
    grid-column: 2;
  }

  [data-form] input[type="submit"] {
    grid-column: 2;
    justify-self: end;
    width: fit-content;
  }

  #app {
    width: min-content;
    display: grid;
    grid-column-gap: 5px;
    grid-row-gap: 8px;
    grid-template-columns: repeat(2, 3fr);
  }
`;

function css(tags, ...attrs) {
  const value = style(tags, ...attrs);
  const node = document.createElement("style");
  node.id = "insertedStyle";
  node.appendChild(document.createTextNode(value));
  const sheet = document.getElementById("insertedStyle");

  if (sheet) {
    sheet.disabled = true;
    sheet.parentNode.removeChild(sheet);
  }
  document.head.appendChild(node);

  function style(tags, ...attrs) {
    if (tags.length === 0) return "";
    let result = " " + tags[0];

    for (let i = 0; i < attrs.length; i++) {
      result += attrs[i];
      result += tags[i + 1];
    }

    return result;
  }
}
```


# Effects with React

```js
import React from "react";
import ReactDOM from "react-dom";
import { createEffect, createStore, sample } from "effector";
import { useUnit } from "effector-react";

const url =
  "https://gist.githubusercontent.com/" +
  "zerobias/24bc72aa8394157549e0b566ac5059a4/raw/" +
  "b55eb74b06afd709e2d1d19f9703272b4d753386/data.json";

const loadUserClicked = createEvent();

const fetchUserFx = createEffect((url) => fetch(url).then((req) => req.json()));

const $user = createStore(null);

sample({
  clock: loadUserClicked,
  fn: () => url,
  target: fetchUserFx,
});

$user.on(fetchUserFx.doneData, (_, user) => user.username);

const App = () => {
  const [user, pending] = useUnit([$user, fetchUserFx.pending]);
  const handleUserLoad = useUnit(loadUserClicked);
  return (
    <div>
      {user ? <div>current user: {user}</div> : <div>no current user</div>}
      <button disable={pending} onClick={handleUserLoad}>
        load user
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

Try it


# Forms

### Example 1

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createEffect, createStore, createEvent, sample } from "effector";
import { useStoreMap } from "effector-react";

const formSubmitted = createEvent();
const fieldUpdate = createEvent();

const sendFormFx = createEffect((params) => {
  console.log(params);
});

const $form = createStore({});

$form.on(fieldUpdate, (form, { key, value }) => ({
  ...form,
  [key]: value,
}));

sample({
  clock: formSubmitted,
  source: $form,
  target: sendFormFx,
});

const handleChange = fieldUpdate.prepend((event) => ({
  key: event.target.name,
  value: event.target.value,
}));

const Field = ({ name, type, label }) => {
  const value = useStoreMap({
    store: $form,
    keys: [name],
    fn: (values) => values[name] ?? "",
  });
  return (
    <div>
      {label} <input name={name} type={type} value={value} onChange={handleChange} />
    </div>
  );
};

const App = () => (
  <form onSubmit={formSubmitted}>
    <Field name="login" label="Login" />
    <Field name="password" type="password" label="Password" />
    <button type="submit">Submit!</button>
  </form>
);

formSubmitted.watch((e) => {
  e.preventDefault();
});

ReactDOM.render(<App />, document.getElementById("root"));
```

Try it

Let's break down the code above.

These are just events & effects definitions.

```js
const sendFormFx = createEffect((params) => {
  console.log(params);
});
const formSubmitted = createEvent(); // will be used further, and indicates, we have an intention to submit form
const fieldUpdate = createEvent(); //has intention to change $form's state in a way, defined in reducer further
const $form = createStore({});

$form.on(fieldUpdate, (form, { key, value }) => ({
  ...form,
  [key]: value,
}));
```

The next piece of code shows how we can obtain a state in effector in the right way. This kind of state retrieving provides state consistency, and removes any possible race conditions, which can occur in some cases, when using `getState`.

```js
sample({
  clock: formSubmitted, // when `formSubmitted` is triggered
  source: $form, // Take LATEST state from $form, and
  target: sendFormFx, // pass it to `sendFormFx`, in other words -> sendFormFx(state)
  //fn: (sourceState, clockParams) => transformedData // we could additionally transform data here, but if we need just pass source's value, we may omit this property
});
```

So far, so good, we've almost set up our model (events, effects and stores). Next thing is to create event, which will be used as `onChange` callback, which requires some data transformation, before data appear in `fieldUpdate` event.

```js
const handleChange = fieldUpdate.prepend((event) => ({
  key: event.target.name,
  value: event.target.value,
})); // upon trigger `handleChange`, passed data will be transformed in a way, described in function above, and returning value will be passed to original `setField` event.
```

Next, we have to deal with how inputs should work. useStoreMap hook here prevents component rerender upon non-relevant changes.

```jsx
const Field = ({ name, type, label }) => {
  const value = useStoreMap({
    store: $form, // take $form's state
    keys: [name], // watch for changes of `name`
    fn: (values) => values[name] ?? "", // retrieve data from $form's state in this way (note: there will be an error, if undefined is returned)
  });

  return (
    <div>
      {label}{" "}
      <input
        name={name}
        type={type}
        value={value}
        onChange={handleChange /*note, bound event is here!*/}
      />
    </div>
  );
};
```

And, finally, the `App` itself! Note, how we got rid of any business-logic in view layer. It's simpler to debug, to share logic, and even more: logic is framework independent now.

```jsx
const App = () => (
  <form onSubmit={submitted /*note, there is an event, which is `clock` for `sample`*/}>
    <Field name="login" label="Login" />
    <Field name="password" type="password" label="Password" />
    <button type="submit">Submit!</button>
  </form>
);
```

Prevent the default html form submit behavior using react event from `submitted`:

```js
submitted.watch((e) => {
  e.preventDefault();
});
```

### Example 2

This example demonstrates how to manage state by using an uncontrolled form, handle data loading, create components that depend on stores, and transform data passed between events.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { createEffect, createStore } from "effector";
import { useUnit } from "effector-react";

//defining simple Effect, which results a string in 3 seconds
const sendFormFx = createEffect(
  (formData) => new Promise((rs) => setTimeout(rs, 1000, `Signed in as [${formData.get("name")}]`)),
);

const Loader = () => {
  //typeof loading === "boolean"
  const loading = useUnit(sendFormFx.pending);
  return loading ? <div>Loading...</div> : null;
};

const SubmitButton = (props) => {
  const loading = useUnit(sendFormFx.pending);
  return (
    <button disabled={loading} type="submit">
      Submit
    </button>
  );
};

//transforming upcoming data, from DOM Event to FormData
const onSubmit = sendFormFx.prepend((e) => new FormData(e.target));

const App = () => {
  const submit = useUnit(onSubmit);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(e);
      }}
    >
      Login: <input name="name" />
      <br />
      Password: <input name="password" type="password" />
      <br />
      <Loader />
      <SubmitButton />
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

Try it


# Gate

Gate is a bridge between props and stores.

Imagine you have the task of transferring something from React props to the effector store.
Suppose you pass the history object from the react-router to the store, or pass some callbacks from render-props.
In a such situation Gate will help.

```js
import { createStore, createEffect, sample } from "effector";
import { useUnit, createGate } from "effector-react";

// Effect for api request
const getTodoFx = createEffect(async ({ id }) => {
  const req = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return req.json();
});

// Our main store
const $todo = createStore(null);
const TodoGate = createGate();

$todo.on(getTodoFx.doneData, (_, todo) => todo);

// We call getTodoFx effect every time Gate updates its state.
sample({ clock: TodoGate.state, target: getTodoFx });

TodoGate.open.watch(() => {
  //called each time when TodoGate is mounted
});
TodoGate.close.watch(() => {
  //called each time when TodoGate is unmounted
});

function Todo() {
  const [todo, loading] = useUnit([$todo, getTodoFx.pending]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!todo || Object.keys(todo).length === 0) {
    return <div>empty</div>;
  }

  return (
    <div>
      <p>title: {todo.title}</p>
      <p>id: {todo.id}</p>
    </div>
  );
}

const App = () => {
  // value which need to be accessed outside from react
  const [id, setId] = React.useState(0);

  return (
    <>
      <button onClick={() => setId(id + 1)}>Get next Todo</button>
      {/*In this situation, we have the ability to simultaneously
      render a component and make a request, rather than wait for the component*/}
      <TodoGate id={id} />
      <Todo />
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

Try it


# Slots

A slot is a place in a component where you can insert any unknown component. It's a well-known abstraction used by frameworks
such as Vue.js and Svelte.

Slots aren't present in the React. With React, you can achieve this goal using props or `React.Context`.
In large projects, this is not convenient, because it generates "props hell" or smears the logic.

Using React with effector, we can achieve slot goals without the problems described above.

* [Slots proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Slots-Proposal)
* [Vue.js docs](https://v3.vuejs.org/guide/component-slots.html)
* [Svelte docs](https://svelte.dev/docs#slot)
* [@space307/effector-react-slots](https://github.com/space307/effector-react-slots)

[Open ReplIt](https://replit.com/@binjospookie/effector-react-slots-example)

```tsx
import { createApi, createStore, createEvent, sample, split } from "effector";
import { useStoreMap } from "effector-react";
import React from "react";

import type { ReactElement, PropsWithChildren } from "react";

type Component<S> = (props: PropsWithChildren<S>) => ReactElement | null;
type Store<S> = {
  readonly component: Component<S>;
};

function createSlotFactory<Id>({ slots }: { readonly slots: Record<string, Id> }) {
  const api = {
    remove: createEvent<{ readonly id: Id }>(),
    set: createEvent<{ readonly id: Id; readonly component: Component<any> }>(),
  };

  function createSlot<P>({ id }: { readonly id: Id }) {
    const defaultToStore: Store<P> = {
      component: () => null,
    };
    const $slot = createStore<Store<P>>(defaultToStore);
    const slotApi = createApi($slot, {
      remove: (state) => ({ ...state, component: defaultToStore.component }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
    });
    const isSlotEventCalling = (payload: { readonly id: Id }) => payload.id === id;

    sample({
      clock: api.remove,
      filter: isSlotEventCalling,
      target: slotApi.remove,
    });

    sample({
      clock: api.set,
      filter: isSlotEventCalling,
      fn: ({ component }) => component,
      target: slotApi.set,
    });

    function Slot(props: P = {} as P) {
      const Component = useStoreMap({
        store: $slot,
        fn: ({ component }) => component,
        keys: [],
      });

      return <Component {...props} />;
    }

    return {
      $slot,
    };
  }

  return {
    api,
    createSlot,
  };
}

const SLOTS = { FOO: "foo" } as const;

const { api, createSlot } = createSlotFactory({ slots: SLOTS });

const { Slot: FooSlot } = createSlot({ id: SLOTS.FOO });

const ComponentWithSlot = () => (
  <>
    <h1>Hello, Slots!</h1>
    <FooSlot />
  </>
);

const updateFeatures = createEvent<string>("");
const $featureToggle = createStore<string>("");

const MyAwesomeFeature = () => <p>Look at my horse</p>;
const VeryAwesomeFeature = () => <p>My horse is amaizing</p>;

$featureToggle.on(updateFeatures, (_, feature) => feature);

split({
  source: $featureToggle,
  match: {
    awesome: (data) => data === "awesome",
    veryAwesome: (data) => data === "veryAwesome",
    hideAll: (data) => data === "hideAll",
  },
  cases: {
    awesome: api.set.prepend(() => ({
      id: SLOTS.FOO,
      component: MyAwesomeFeature,
    })),
    veryAwesome: api.set.prepend(() => ({
      id: SLOTS.FOO,
      component: VeryAwesomeFeature,
    })),
    hideAll: api.remove.prepend(() => ({ id: SLOTS.FOO })),
  },
});

// updateFeatures('awesome'); // render MyAwesomeFeature in slot
// updateFeatures('veryAwesome'); // render VeryAwesomeFeature in slot
// updateFeatures('hideAll'); // render nothing in slot
```


# ToDo creator

Try it

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { createStore, createEvent, sample } from "effector";
import { useUnit, useList } from "effector-react";

function createTodoListApi(initial: string[] = []) {
  const insert = createEvent<string>();
  const remove = createEvent<number>();
  const change = createEvent<string>();
  const reset = createEvent<void>();

  const $input = createStore<string>("");
  const $todos = createStore<string[]>(initial);

  $input.on(change, (_, value) => value);

  $input.reset(insert);
  $todos.on(insert, (todos, newTodo) => [...todos, newTodo]);

  $todos.on(remove, (todos, index) => todos.filter((_, i) => i !== index));

  $input.reset(reset);

  const submit = createEvent<React.SyntheticEvent>();
  submit.watch((event) => event.preventDefault());

  sample({
    clock: submit,
    source: $input,
    target: insert,
  });

  return {
    submit,
    remove,
    change,
    reset,
    $todos,
    $input,
  };
}

const firstTodoList = createTodoListApi(["hello, world!"]);
const secondTodoList = createTodoListApi(["hello, world!"]);

function TodoList({ label, model }) {
  const input = useUnit(model.$input);

  const todos = useList(model.$todos, (value, index) => (
    <li>
      {value}{" "}
      <button type="button" onClick={() => model.remove(index)}>
        Remove
      </button>
    </li>
  ));

  return (
    <>
      <h1>{label}</h1>
      <ul>{todos}</ul>
      <form>
        <label>Insert todo: </label>
        <input
          type="text"
          value={input}
          onChange={(event) => model.change(event.currentTarget.value)}
        />
        <input type="submit" onClick={model.submit} value="Insert" />
      </form>
    </>
  );
}

function App() {
  return (
    <>
      <TodoList label="First todo list" model={firstTodoList} />
      <TodoList label="Second todo list" model={secondTodoList} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```


# TODO list with input validation

Try it

```js
import { createEvent, createStore, createEffect, restore, combine, sample } from "effector";
import { useUnit, useList } from "effector-react";

const submit = createEvent();
const submitted = createEvent();
const completed = createEvent();
const changed = createEvent();
const removed = createEvent();

const validateFx = createEffect(([todo, todos]) => {
  if (todos.some((item) => item.text === todo)) throw "This todo is already on the list";
  if (!todo.trim().length) throw "Required field";
  return null;
});

const $todo = createStore("");
const $todos = createStore([]);
const $error = createStore("");

$todo.on(changed, (_, todo) => todo);
$error.reset(changed);

$todos.on(completed, (list, index) =>
  list.map((todo, foundIndex) => ({
    ...todo,
    completed: index === foundIndex ? !todo.completed : todo.completed,
  })),
);
$todos.on(removed, (state, index) => state.filter((_, i) => i !== index));

sample({
  clock: submit,
  source: [$todo, $todos],
  target: validateFx,
});

sample({
  clock: validateFx.done,
  source: $todo,
  target: submitted,
});

$todos.on(submitted, (list, text) => [...list, { text, completed: false }]);
$todo.reset(submitted);

$error.on(validateFx.failData, (_, error) => error);

submit.watch((e) => e.preventDefault());

const App = () => {
  const [todo, error] = useUnit([$todo, $error]);
  const list = useList($todos, (todo, index) => (
    <li style={{ textDecoration: todo.completed ? "line-through" : "" }}>
      <input type="checkbox" checked={todo.completed} onChange={() => completed(index)} />
      {todo.text}
      <button type="button" onClick={() => removed(index)} className="delete">
        x
      </button>
    </li>
  ));
  return (
    <div>
      <h1>Todos</h1>
      <form>
        <input
          className="text"
          type="text"
          name="todo"
          value={todo}
          onChange={(e) => changed(e.target.value)}
        />
        <button type="submit" onClick={submit} className="submit">
          Submit
        </button>
        {error && <div className="error">{error}</div>}
      </form>

      <ul style={{ listStyle: "none" }}>{list}</ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```


# Явный запуск приложения

## Явный запуск приложения

В effector события не могут быть вызваны неявно. Это дает вам больше контроля над жизненным циклом приложения и помогает избежать непредвиденного поведения.

### Пример

Самый простой пример это вы можете создать что-то вроде события `appStarted` и вызвать его сразу после инициализации приложения. Давайте пройдемся по коду построчно и объясним, что здесь происходит.

1. Создаем `appStarted` событие.

Оно будет вызываться при запуске приложения.

```ts {3}
import { createEvent, fork, allSettled } from 'effector';

const appStarted = createEvent();

const scope = fork();

await allSettled(appStarted, { scope });
```

2. Создайте изолированный контекст приложения с помощью `fork()`. Это позволит создать скоуп, который будет использоваться по всему приложению.

```ts {5}
import { createEvent, fork, allSettled } from 'effector';

const appStarted = createEvent();

const scope = fork();

await allSettled(appStarted, { scope });
```

3. Вызовите стартовое событие `appStarted` в изолированном контексте с помощью allSettled(). Это гарантирует, что все вычисления, связанные с этим событием, будут завершены до продолжения выполнения кода.

```ts {7}
import { createEvent, fork, allSettled } from 'effector';

const appStarted = createEvent();

const scope = fork();

await allSettled(appStarted, { scope });
```

### Зачем это нужно ?

Основная цель такого подхода – это позволить нам контролировать жизненный цикл приложения. Это помогает избежать неожиданного поведения и сделать ваше приложение более предсказуемым. Допустим, у нас есть модуль со следующим кодом:

```ts
// app.ts
import { createStore, createEvent, sample, scopeBind } from 'effector';

const $counter = createStore(0);
const increment = createEvent();

const startIncrementationIntervalFx = createEffect(() => {
  const boundIncrement = scopeBind(increment, { safe: true });

  setInterval(() => {
    boundIncrement();
  }, 1000);
});

sample({
  clock: increment,
  source: $counter,
  fn: (counter) => counter + 1,
  target: $counter,
});

startIncrementationIntervalFx();
```

#### Тесты

Мы верим, что любое серьезное приложение должно быть покрыто тестами, поэтому мы должны изолировать жизненный цикл приложения внутри конкретного теста. В случае неявного старта (старта логики модели при выполнении модуля) будет невозможно протестировать поведение приложения в разных состояниях.

> INFO scopeBind: 
>
> scopeBind позволяет привязать событие к конкретному скоупу, больше деталей можете найти на странице Изолированные контексты, а также Потеря скоупа.

Теперь, чтобы протестировать приложение нам нужно замокать функцию `setInterval` и проверить, что значение `$counter` корректно через определенное время.

```ts
// app.test.ts
import { $counter } from './app';

test('$counter should be 5 after 5 seconds', async () => {
  // ... test
});

test('$counter should be 10 after 10 seconds', async () => {
  // ... test
});
```

Но `$counter` будет увеличиваться сразу после загрузки модуля `app.ts` и у нас просто не будет возможности протестировать поведение приложения в разных состояниях.

#### SSR

Еще одна причина использовать явный старт приложения – это серверный рендеринг (SSR). В этом случае нам нужно запускать логику приложения при каждом запросе пользователя, и это будет невозможно сделать с неявным стартом.

```ts
// server.ts
import * as app from './app';

function handleRequest(req, res) {
  // ...
}
```

Но опять же, счетчик начнет свое выполнения сразу же после выполнения модуля (инициализации приложения), и мы не сможем запускать логику приложения при каждом запросе пользователя.

#### Добавим явный старт

Теперь давайе перепишем код и добавим явный старт приложения:

```ts del={22} ins={24-28}
// app.ts
import { createStore, createEvent, sample, scopeBind } from 'effector';

const $counter = createStore(0);
const increment = createEvent();

const startIncrementationIntervalFx = createEffect(() => {
  const boundIncrement = scopeBind(increment, { safe: true });

  setInterval(() => {
    boundIncrement();
  }, 1000);
});

sample({
  clock: increment,
  source: $counter,
  fn: (counter) => counter + 1,
  target: $counter,
});

startIncrementationIntervalFx();

const appStarted = createEvent();
sample({
  clock: appStarted,
  target: startIncrementationIntervalFx,
});
```

Вот и все, теперь мы можем тестировать поведение приложения в разных состояниях и запускать логику приложения при каждом запросе пользователя.

> TIP Не ограничивайтесь стартом: 
>
> В реальных приложениях лучше добавлять не только явный старт приложения, но и явную остановку приложения. Это поможет избежать утечек памяти и непредвиденного поведения.
> Также вы можете реализовывать такое поведение и для фич вашего приложения, чтобы контролировать жизненный цикл каждой фичи отдельно.

В примерах выше мы использовали одно событие `appStarted` для запуска всей логики приложения. В реальных приложениях лучше использовать более гранулярные события для запуска конкретной части приложения.

### Связанные API и статьи

* **API**

  * Scope - Описание скоупа и его методов
  * scopeBind - Метод для привязки юнита к скоупу
  * fork - Оператор для создания скоупа
  * allSettled - Метод для вызова юнита в предоставленном скоупе и ожидания завершения всей цепочки эффектов

* **Статьи**
  * Что такое потеря скоупа и как исправить эту проблему
  * Гайд по работе с SSR
  * Гайд по тестированию
  * Как мыслить в парадигме Effector


# Как мыслить в парадигме effector

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

## Как мыслить в парадигме effector

На самом деле effector это не только про управление состоянием приложения, а также и про масштабируемое построение логики вашего приложения. Effector никак не ограничивает вас в написании кода, однако если понять следующие принципы, то будет гораздо проще писать код и мыслить, когда вы используете effector:

* События – это описание вашего приложения, основа всего.
* Бизнес-логика и UI – это разные вещи, нужно стараться разделять ответственность между данными и их отображением.

### События — основа всего

Каждое взаимодействие пользователя с вашим приложением – это событие. Событие не решает, что должно произойти, оно просто фиксирует факт произошедшего, например: пользователь отправил форму - `formSubmitted`, пользователь кликнул по кнопке обновить - `refreshButtonClicked`, пользователь изменил фильтр поиска - `searchFilterChanged` и так далее.
При этом события не ограничиваются только действиями пользователя, они также могут описывать логику вашей модели, например: явный запуск работы вашей модели (микрофронтенд или фича) - , произошла ошибка - `errorOccurred` и так далее.

Не стесняйтесь заводить столько событий, сколько требуется, чтобы полно описать действия приложения, так проще видеть и отслеживать, как работает ваше приложение.

При проектировании нового функционала проще всего начать с событий, поскольку они сразу наглядны в интерфейсе.

> TIP Давайте осмысленные названия: 
>
> Давайте событиям осмысленные название. Например, если вам надо загрузить данные при каком-то действии, то событие связано с действием, а не реализацией:
>
> ```ts
> ❌ const fetchData = createEvent()
> ✅ const appStarted = createEvent()
> ```

### Разделяйте бизнес-логику и UI

Effector позволяет разделять отображение (UI) и логику вашего приложения (бизнес-логику). Вся логика работы вашего приложения, как правило, должна описываться отдельно от вашего UI, в отдельном модуле, например `model.ts` и отдавать наружу для UI только то, что нужно для отображения или взаимодействие с пользователем.

Например, при срабатывании события `formSubmitted` вы можете вызвать эффект для отправки данных на сервер, еще один эффект для отправки аналитики, а также отобразить оповещение пользователю при срабатывании события:

```ts
const formSubmitted = createEvent();

const sendFormDataFx = createEffect(() => {});
const sendAnalyticsFx = createEffect(() => {});
const showNotificationFx = createEffect(() => {});

sample({
  clock: formSubmitted,
  target: [sendFormDataFx, sendAnalyticsFx, showNotificationFx],
});
```

В какой-то момент у вас может изменится логика, и вы решите отправлять аналитику только после успешной отправки формы, а оповещение показывать не только при отправке формы, но и при ошибке:

```ts
const formSubmitted = createEvent();

const sendFormDataFx = createEffect(() => {});
const sendAnalyticsFx = createEffect(() => {});
const showNotificationFx = createEffect(() => {});

sample({
  clock: formSubmitted,
  target: [sendFormDataFx, showNotificationFx],
});

sample({
  clock: sendFormDataFx.doneData,
  target: sendAnalyticsFx,
});

sample({
  clock: sendFormDataFx.failData,
  target: showNotificationFx,
});
```

У нас изменилась логика приложения, но UI не изменился. Нашему UI не нужно знать какие эффекты мы отправляем и что у нас меняется, все что знает наш UI это что была нажата кнопка обновления и ему нужно вызвать событие `refreshButtonClicked`.
В ином случае, если мы будем смешивать логику и UI, то при изменении логики нам придется менять код и в UI.

### Как это выглядит в реальном приложении?

Давайте рассмотрим для примера GitHub с его функционалом для репозиториев. Каждое действие пользователя — это событие:

![кнопки действий для репозитория в гитхаб](/images/github-repo-actions.png)

* Пользователь поставил/убрал звездочку - `repoStarToggled`
* Пользователь изменил ветку репозитория - `repoBranchChanged`
* Строка поиска по репозиторию изменилась - `repoFileSearchChanged`
* Репозиторий был форкнут - `repoForked`

Всю логику приложения строить гораздо проще вокруг событий и реакций на них. UI просто сообщает о действии, а их обработка это уже часть бизнес-логики.

Упрощенный пример логики с кнопкой звездочки:

<Tabs>
<TabItem label="Бизнес-логика">

```ts
// repo.model.ts

// событие – факт действия
const repoStarToggled = createEvent();

// эффекты как дополнительная реакция на события
// (предположим эффекты возвращают обновленное значение)
const starRepoFx = createEffect(() => {});
const unstarRepoFx = createEffect(() => {});

// состояние приложения
const $isRepoStarred = createStore(false);
const $repoStarsCount = createStore(0);

// логика переключения звездочки
sample({
  clock: repoStarToggled,
  source: $isRepoStarred,
  fn: (isRepoStarred) => !isRepoStarred,
  target: $isRepoStarred,
});

// отправка запроса на сервер при переключении звезды
sample({
  clock: $isRepoStarred,
  filter: (isRepoStarred) => isRepoStarred,
  target: starRepoFx,
});

sample({
  clock: $isRepoStarred,
  filter: (isRepoStarred) => !isRepoStarred,
  target: unstarRepoFx,
});

// обновляем счетчик
sample({
  clock: [starRepoFx.doneData, unstarRepoFx.doneData],
  target: $repoStarsCount,
});
```

</TabItem>
<TabItem label="UI">

```tsx
import { repoStarToggled, $isRepoStarred, $repoStarsCount } from "./repo.model.ts";

const RepoStarButton = () => {
  const [onStarToggle, isRepoStarred, repoStarsCount] = useUnit([
    repoStarToggled,
    $isRepoStarred,
    $repoStarsCount,
  ]);

  return (
    <div>
      <button onClick={onStarToggle}>{isRepoStarred ? "unstar" : "star"}</button>
      <span>{repoStarsCount}</span>
    </div>
  );
};
```

</TabItem>
</Tabs>

### Связанные API и статьи

* **API**
  * Event - Описание события и его методов
  * Store - Описание стора и его методов
  * Effect - Описание эффекта и его методов
* **Статьи**
  * Почему вам нужно явное событие запуска вашего приложения
  * Как управлять состоянием
  * Работа с событиями
  * Как реагировать на события в UI


# Политика релизов

## Политика релизов

Основная цель effector - **улучшить опыт разработчиков**, и как часть этой стратегии мы следуем определенным правилам выпуска релизов effector.

### Никаких критических изменений без предварительной пометки об устаревании

Перед каждым критическим изменением effector должен предоставить предупреждение об устаревании **как минимум за год до этого.**

Например:

* Когда была выпущена версия 22, функция "A" была помечена как устаревшая. Библиотека выводит предупреждение в консоль при её использовании.
* Через год, в релизе версии 23, функция "A" удаляется.

### Цикл релизов

Мажорные обновления (т.е. с критическими изменениями) effector выпускаются **не чаще одного раза в год.**

Минорные обновления и патчи (т.е. с исправлениями и новыми функциями) выпускаются по мере готовности. Если новая функция требует критических изменений – она также выпускается в мажорном обновлении.

Это необходимо, чтобы разработчики могли плавно планировать свою работу, учитывая возможные изменения в effector.

Это также обязывает мейнтейнеров effector быть крайне осторожными при проектировании новых функций и внесении критических изменений в старые функции библиотеки, поскольку возможность удалить или серьезно изменить что-то в публичном API появляется только раз в два года.


# Инициализация юнитов

## Инициализация юнитов

При работе с effector важно соблюдать ключевое правило - создавать юниты и связи между ними не в рантайме, а статически на уровне модуля, чтобы избежать утечки памяти в вашем приложении.

Чтобы понять, почему это происходит, нужно заглянуть в ядро effector и разобраться, как он устроен. В основе лежит модель [графа](https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D0%BE%D1%80%D0%B8%D1%8F_%D0%B3%D1%80%D0%B0%D1%84%D0%BE%D0%B2). Каждый юнит — это узел в графе, каждый узел хранит в себе информацию о состоянии, операциях и связи с зависимыми юнитами. Например в таком коде:

```ts
import { combine, createStore } from "effector";

const $store = createStore(0);
const $derivedStore = combine($store, (storeVal) => !!storeVal);
```

При создании `$store` мы добавляем новый узел в граф effector'а, который хранит ссылку на стор. Для производного стора тоже создается узел, а также связь с исходным стором, вы можете это проверить если выведите в консоль исходный стор, раскроете свойство `graphite.next` - массив ссылок на последующие ноды, найдите там ноду где `meta.op` будет `combine` и также раскройте у такой ноды `next` – это и есть наш производный стор. Так как ссылки на объекты юнитов сохраняются в графе, то [GC](https://javascript.info/garbage-collection) в Javascript не способен удалить их из памяти. Поэтому, например, если вы создадите юниты или связи между ними внутри React компонента, то у вас при каждом маунте компонента они будут создаваться по новой, а старые юниты все также будут жить и работать.

### А что с динамикой?

Конечно команда effector понимает насколько важно динамическое поведение, поэтому сейчас активно ведется разработка динамических моделей, которые следует ожидать в следующем мажорном обновлении!


# Использование с пакетом effector-react

## Использование с React

**TypeScript** - это типизированное расширение JavaScript. Он стал популярным
в последнее время благодаря преимуществам, которые он может принести. Если вы новичок в TypeScript,
рекомендуется сначала ознакомиться с ним, прежде чем продолжить.
Вы можете ознакомиться с документацей
[здесь](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

Какие преимущества Typescript может принести вашему приложению:

1. Безопасность типов для состояний, сторов и событий
2. Простой рефакторинг типизированного кода
3. Превосходный опыт разработчика в командной среде

**Практический пример**

Мы пройдемся по упрощенному приложению чата,
чтобы продемонстрировать возможный подход к включению статической типизации. Это приложение для чата будет иметь API-модель, которая загружает и сохраняет данные из локального хранилища localStorage.

Полный исходный код можно посмотреть на
[github](https://github.com/effector/effector/tree/master/examples/react-and-ts).
Обратите внимание, что, следуя этому примеру самостоятельно, вы ощутите пользу от использования TypeScript.

### Давайте создадим API-модель

Здесь будет использоваться структура каталогов на основе методологии [feature-sliced](https://feature-sliced.design).

Давайте определим простой тип, который наша импровизированная API будет возвращать.

```ts
// Файл: /src/shared/api/message.ts
interface Author {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  author: Author;
  text: string;
  timestamp: number;
}
```

Наша API будет загружать и сохранять данные в `localStorage`, и нам нужны некоторые функции для загрузки данных:

```ts
// Файл: /src/shared/api/message.ts
const LocalStorageKey = "effector-example-history";

function loadHistory(): Message[] | void {
  const source = localStorage.getItem(LocalStorageKey);
  if (source) {
    return JSON.parse(source);
  }
  return undefined;
}
function saveHistory(messages: Message[]) {
  localStorage.setItem(LocalStorageKey, JSON.stringify(messages));
}
```

Также нам надо создать несколько библиотек для генерации идентификатров и ожидания для имитации сетевых запросов.

```ts
// Файл: /src/shared/lib/oid.ts
export const createOid = () =>
  ((new Date().getTime() / 1000) | 0).toString(16) +
  "xxxxxxxxxxxxxxxx".replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)).toLowerCase();
```

```ts
// Файл: /src/shared/lib/wait.ts
export function wait(timeout = Math.random() * 1500) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
```

Отлично! Теперь мы можем создать эффекты, которые будут загружать сообщения.

```ts
// Файл: /src/shared/api/message.ts
// Здесь эффект определен со статическими типами. Void определяет отсутствие аргументов.
// Второй аргумент в типе определяет тип успешного результата.
// Третий аргумент является необязательным и определяет тип неудачного результата.
export const messagesLoadFx = createEffect<void, Message[], Error>(async () => {
  const history = loadHistory();
  await wait();
  return history ?? [];
});

interface SendMessage {
  text: string;
  author: Author;
}

// Но мы можем использовать вывод типов и задавать типы аргументов в определении обработчика.
// Наведите курсор на `messagesLoadFx`, чтобы увидеть выведенные типы:
// `Effect<{ text: string; authorId: string; authorName: string }, void, Error>`
export const messageSendFx = createEffect(async ({ text, author }: SendMessage) => {
  const message: Message = {
    id: createOid(),
    author,
    timestamp: Date.now(),
    text,
  };
  const history = await messagesLoadFx();
  saveHistory([...history, message]);
  await wait();
});

// Пожалуйста, обратите внимание, что мы будем использовать `wait()` для `messagesLoadFx` и `wait()` в текущем эффекте
// Также, обратите внимание, что `saveHistory` и `loadHistory` могут выбрасывать исключения,
// в этом случае эффект вызовет событие `messageDeleteFx.fail`.
export const messageDeleteFx = createEffect(async (message: Message) => {
  const history = await messagesLoadFx();
  const updated = history.filter((found) => found.id !== message.id);
  await wait();
  saveHistory(updated);
});
```

Отлично, теперь мы закончили с сообщениями, давайте создадим эффекты для управления сессией пользователя.

На самом деле я предпочитаю начинать написание кода с реализации интерфейсов:

```ts
// Файл: /src/shared/api/session.ts
// Это называется сессией, потому что описывает текущую сессию пользователя, а не Пользователя в целом.
export interface Session {
  id: string;
  name: string;
}
```

Кроме того, чтобы генерировать уникальные имена пользователей и не требовать от них ввода вручную, импортируйте `unique-names-generator`:

```ts
// Файл: /src/shared/api/session.ts
import { uniqueNamesGenerator, Config, starWars } from "unique-names-generator";

const nameGenerator: Config = { dictionaries: [starWars] };
const createName = () => uniqueNamesGenerator(nameGenerator);
```

Создадим эффекты для управления сессией:

```ts
// Файл: /src/shared/api/session.ts
const LocalStorageKey = "effector-example-session";

// Обратите внимание, что в этом случае требуется явное определение типов, поскольку `JSON.parse()` возвращает `any`
export const sessionLoadFx = createEffect<void, Session | null>(async () => {
  const source = localStorage.getItem(LocalStorageKey);
  await wait();
  if (!source) {
    return null;
  }
  return JSON.parse(source);
});

// По умолчанияю, если нет аргументов, не предоставлены явные аргументы типа и нет оператора `return`,
// эффект будет иметь тип: `Effect<void, void, Error>`
export const sessionDeleteFx = createEffect(async () => {
  localStorage.removeItem(LocalStorageKey);
  await wait();
});

// Взгляните на тип переменной `sessionCreateFx`.
// Там будет `Effect<void, Session, Error>` потому что TypeScript может вывести тип из переменной `session`
export const sessionCreateFx = createEffect(async () => {
  // Я явно установил тип для следующей переменной, это позволит TypeScript помочь мне
  // Если я забуду установить свойство, то я увижу ошибку в месте определения
  // Это также позволяет IDE автоматически дополнять и завершать имена свойств
  const session: Session = {
    id: createOid(),
    name: createName(),
  };
  localStorage.setItem(LocalStorageKey, JSON.stringify(session));
  return session;
});
```

Как нам нужно импортировать эти эффекты?

Я настоятельно рекомендую писать короткие импорты и использовать реэкспорты.
Это позволяет безопасно рефакторить структуру кода внутри `shared/api` и тех же слайсов,
и не беспокоиться о рефакторинге других импортов и ненужных изменениях в истории git.

```ts
// Файл: /src/shared/api/index.ts
export * as messageApi from "./message";
export * as sessionApi from "./session";

// Types reexports made just for convenience
export type { Message } from "./message";
export type { Session } from "./session";
```

### Создадим страницу с логикой

Типичная структура страниц:

```
src/
  pages/
    <page-name>/
      page.tsx — только View-слой (представление)
      model.ts — код бизнес-логики (модель)
      index.ts — реэкспорт, иногда здесь может быть связующий код
```

Я рекомендую писать код в слое представления сверху вниз, более общий код - сверху.
Моделируем наш слой представления. На странице у нас будет два основных раздела: история сообщений и форма сообщения.

```tsx
// Файл: /src/pages/chat/page.tsx
export function ChatPage() {
  return (
    <div className="parent">
      <ChatHistory />
      <MessageForm />
    </div>
  );
}

function ChatHistory() {
  return (
    <div className="chat-history">
      <div>Тут будет список сообщений</div>
    </div>
  );
}

function MessageForm() {
  return (
    <div className="message-form">
      <div>Тут будет форма сообщения</div>
    </div>
  );
}
```

Отлично. Теперь мы знаем, какую структуру мы имеем, и мы можем начать моделировать процессы бизнес-логики.
Слой представления должен выполнять две задачи: отображать данные из хранилищ и сообщать события модели.
Слой представления не знает, как загружаются данные, как их следует преобразовывать и отправлять обратно.

```ts
// Файл: /src/pages/chat/model.ts
import { createEvent, createStore } from "effector";

// События просто сообщают о том, что что-то произошло
export const messageDeleteClicked = createEvent<Message>();
export const messageSendClicked = createEvent();
export const messageEnterPressed = createEvent();
export const messageTextChanged = createEvent<string>();
export const loginClicked = createEvent();
export const logoutClicked = createEvent();

// В данный момент есть только сырые данные без каких-либо знаний о том, как их загрузить.
export const $loggedIn = createStore<boolean>(false);
export const $userName = createStore("");
export const $messages = createStore<Message[]>([]);
export const $messageText = createStore("");

// Страница НЕ должна знать, откуда пришли данные.
// Поэтому мы просто реэкспортируем их.
// Мы можем переписать этот код с использованием `combine` или оставить независимые хранилища,
// страница НЕ должна меняться, просто потому что мы изменили реализацию
export const $messageDeleting = messageApi.messageDeleteFx.pending;
export const $messageSending = messageApi.messageSendFx.pending;
```

Теперь мы можем реализовать компоненты.

```tsx
// Файл: /src/pages/chat/page.tsx
import { useList, useUnit } from "effector-react";
import * as model from "./model";

// export function ChatPage { ... }

function ChatHistory() {
  const [messageDeleting, onMessageDelete] = useUnit([
    model.$messageDeleting,
    model.messageDeleteClicked,
  ]);

  // Хук `useList` позволяет React не перерендерить сообщения, которые действительно не изменились.
  const messages = useList(model.$messages, (message) => (
    <div className="message-item" key={message.timestamp}>
      <h3>From: {message.author.name}</h3>
      <p>{message.text}</p>
      <button onClick={() => onMessageDelete(message)} disabled={messageDeleting}>
        {messageDeleting ? "Deleting" : "Delete"}
      </button>
    </div>
  ));
  // Здесь не нужен `useCallback` потому что мы передаем функцию в HTML-элемент, а не в кастомный компонент

  return <div className="chat-history">{messages}</div>;
}
```

Я разделил `MessageForm` на разные компоненты, чтобы упростить код:

```tsx
// Файл: /src/pages/chat/page.tsx
function MessageForm() {
  const isLogged = useUnit(model.$loggedIn);
  return isLogged ? <SendMessage /> : <LoginForm />;
}

function SendMessage() {
  const [userName, messageText, messageSending] = useUnit([
    model.$userName,
    model.$messageText,
    model.$messageSending,
  ]);

  const [handleLogout, handleTextChange, handleEnterPress, handleSendClick] = useUnit([
    model.logoutClicked,
    model.messageTextChanged,
    model.messageEnterPressed,
    model.messageSendClicked,
  ]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEnterPress();
    }
  };

  return (
    <div className="message-form">
      <h3>{userName}</h3>
      <input
        value={messageText}
        onChange={(event) => handleTextChange(event.target.value)}
        onKeyPress={handleKeyPress}
        className="chat-input"
        placeholder="Type a message..."
      />
      <button onClick={() => handleSendClick()} disabled={messageSending}>
        {messageSending ? "Sending..." : "Send"}
      </button>
      <button onClick={() => handleLogout()}>Log out</button>
    </div>
  );
}

function LoginForm() {
  const handleLogin = useUnit(model.loginClicked);

  return (
    <div className="message-form">
      <div>Please, log in to be able to send messages</div>
      <button onClick={() => handleLogin()}>Login as a random user</button>
    </div>
  );
}
```

### Управляем сессией пользователя как Про

Создадим сущность сессии. Сущность (entity) - это бизнес-юнит.

```ts
// Файл: /src/entities/session/index.ts
import { Session } from "shared/api";
import { createStore } from "effector";

// Сущность просто хранит сессию и некоторую внутреннюю информацию о ней
export const $session = createStore<Session | null>(null);
// Когда стор `$session` обновляется, то стор `$isLogged` тоже будет обновлен
// Они синхронизированы. Производный стор зависит от данных из исходного
export const $isLogged = $session.map((session) => session !== null);
```

Теперь мы можем реализовать функции входа в систему или выхода на странице. Почему не здесь?
Если мы разместим логику входа здесь, у нас будет очень неявная ситуация,
когда вы вызываете `sessionCreateFx` вы не увидите код, который вызывается после эффекта.
Но последствия будут видны в DevTools и поведении приложения.

Попробуйте написать код таким очевидным способом в одном файле,
чтобы вы и любой член команды могли отследить последовательность выполнения.

### Реализуем логику

Отлично. Теперь мы можем загрузить сеанс пользователя и список сообщений на странице.
Но у нас нет никакого события, когда мы можем начать это делать. Давайте исправим это.

Вы можете использовать Gate, но я предпочитаю использовать явные события.

```ts
// Файл: /src/pages/chat/model.ts
// Просто добавьте новое событие
export const pageMounted = createEvent();
```

Просто добавте `useEffect` и вызовите связанное событие внутри.

```tsx
// Файл: /src/pages/chat/page.tsx
export function ChatPage() {
  const handlePageMount = useUnit(model.pageMounted);

  React.useEffect(() => {
    handlePageMount();
  }, [handlePageMount]);

  return (
    <div className="parent">
      <ChatHistory />
      <MessageForm />
    </div>
  );
}
```

> Примечание: если вы не планируете писать тесты для кода эффектора и/или реализовывать SSR, вы можете опустить любое использование `useEvent`.

В данный момент мы можем загрузить сеанс и список сообщений.

Просто добавьте реакцию на событие, и любой другой код должен быть написан в хронологическом порядке после каждого события:

```ts
// Файл: /src/pages/chat/model.ts
// Не забудьте про import { sample } from "effector"
import { Message, messageApi, sessionApi } from "shared/api";
import { $session } from "entities/session";

// export stores
// export events

// Здесь место для логики

// Вы можете прочитать этот код так:
// При загрузке страницы, одновременно вызываются загрузка сообщений и сессия пользователя
sample({
  clock: pageMounted,
  target: [messageApi.messagesLoadFx, sessionApi.sessionLoadFx],
});
```

После этого нужно определить реакции на `messagesLoadFx.done` и `messagesLoadFx.fail`, а также то же самое для `sessionLoadFx`.

```ts
// Файл: /src/pages/chat/model.ts
// `.doneData` это сокращение для `.done`, поскольку `.done` returns `{ params, result }`
// Постарайтесь не называть свои аргументы как `state` или `payload`
// Используйте явные имена для содержимого
$messages.on(messageApi.messagesLoadFx.doneData, (_, messages) => messages);

$session.on(sessionApi.sessionLoadFx.doneData, (_, session) => session);
```

Отлично. Сессия и сообщения получены. Давайте позволим пользователям войти.

```ts
// Файл: /src/pages/chat/model.ts
// Когда пользователь нажимает кнопку входа, нам нужно создать новую сессию
sample({
  clock: loginClicked,
  target: sessionApi.sessionCreateFx,
});
// Когда сессия создана, просто положите его в хранилище сессий
sample({
  clock: sessionApi.sessionCreateFx.doneData,
  target: $session,
});
// Если создание сессии не удалось, просто сбросьте сессию
sample({
  clock: sessionApi.sessionCreateFx.fail,
  fn: () => null,
  target: $session,
});
```

Давайте реализуем процесс выхода:

```ts
// Файл: /src/pages/chat/model.ts
// Когда пользователь нажал на кнопку выхода, нам нужно сбросить сессию и очистить наше хранилище
sample({
  clock: logoutClicked,
  target: sessionApi.sessionDeleteFx,
});
// В любом случае, успешно или нет, нам нужно сбросить хранилище сессий
sample({
  clock: sessionApi.sessionDeleteFx.finally,
  fn: () => null,
  target: $session,
});
```

> Примечание: большинство комментариев написано только для образовательных целей. В реальной жизни код приложения будет самодокументируемым

Но если мы запустим dev-сервер и попытаемся войти в систему, то мы ничего не увидим.
Это связано с тем, что мы создали стор `$loggedIn` в модели, но не изменяем его. Давайте исправим:

```ts
// Файл: /src/pages/chat/model.ts
import { $isLogged, $session } from "entities/session";

// В данный момент есть только сырые данные без каких-либо знаний о том, как их загрузить
export const $loggedIn = $isLogged;
export const $userName = $session.map((session) => session?.name ?? "");
```

Здесь мы просто реэкспортировали наш собственный стор из сущности сессии, но слой представления не меняется.
Такая же ситуация и со стором `$userName`. Просто перезагрузите страницу, и вы увидите, что сессия загружена правильно.

### Отправка сообщений

Теперь мы можем войти в систему и выйти из нее. Думаю, что вы захотите отправить сообщение. Это довольно просто:

```ts
// Файл: /src/pages/chat/model.ts
$messageText.on(messageTextChanged, (_, text) => text);

// У нас есть два разных события для отправки сообщения
// Пусть событие `messageSend` реагирует на любое из них
const messageSend = merge([messageEnterPressed, messageSendClicked]);

// Нам нужно взять текст сообщения и информацию об авторе, а затем отправить ее в эффект
sample({
  clock: messageSend,
  source: { author: $session, text: $messageText },
  target: messageApi.messageSendFx,
});
```

Но если в файле `tsconfig.json` вы установите `"strictNullChecks": true`, вы получите ошибку.
Это связано с тем, что стор `$session` содержит `Session | null`, а `messageSendFx` хочет `Author` в аргументах.
`Author` и `Session` совместимы, но не должны быть `null`.

Чтобы исправить странное поведение, нам нужно использовать `filter`:

```ts
// Файл: /src/pages/chat/model.ts
sample({
  clock: messageSend,
  source: { author: $session, text: $messageText },
  filter: (form): form is { author: Session; text: string } => {
    return form.author !== null;
  },
  target: messageApi.messageSendFx,
});
```

Я хочу обратить ваше внимание на тип возвращаемого значения `form is {author: Session; text: string}`.
Эта функция называется [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
и позволяет TypeScript сузить тип `Session | null` до более конкретного `Session` через условие внутри функции.

Теперь мы можем прочитать это так: когда сообщение должно быть отправлено, возьмите сессию и текст сообщения, проверьте, существует ли сессия, и отправьте его.

Отлично. Теперь мы можем отправить новое сообщение на сервер.
Но если мы не вызовем `messagesLoadFx` снова, мы не увидим никаких изменений,
потому что стор `$messages` не обновился. Мы можем написать универсальный код для этого случая.
Самый простой способ - вернуть отправленное сообщение из эффекта.

```ts
// Файл: /src/shared/api/message.ts
export const messageSendFx = createEffect(async ({ text, author }: SendMessage) => {
  const message: Message = {
    id: createOid(),
    author,
    timestamp: Date.now(),
    text,
  };
  const history = await messagesLoadFx();
  await wait();
  saveHistory([...history, message]);
  return message;
});
```

Теперь мы можем просто добавить сообщение в конец списка:

```ts
// Файл: /src/pages/chat/model.ts
$messages.on(messageApi.messageSendFx.doneData, (messages, newMessage) => [
  ...messages,
  newMessage,
]);
```

Но в данный момент отправленное сообщение все еще остается в поле ввода.

```ts
// Файл: /src/pages/chat/model.ts
$messageText.on(messageSendFx, () => "");

// Если отправка сообщения не удалась, просто восстановите сообщение
sample({
  clock: messageSendFx.fail,
  fn: ({ params }) => params.text,
  target: $messageText,
});
```

### Удаление сообщения

Это довольно просто.

```ts
// Файл: /src/pages/chat/model.ts
sample({
  clock: messageDeleteClicked,
  target: messageApi.messageDeleteFx,
});

$messages.on(messageApi.messageDeleteFx.done, (messages, { params: toDelete }) =>
  messages.filter((message) => message.id !== toDelete.id),
);
```

Но вы можете заметить ошибку, когда состояние "Deleting" не отклчено.
Это связано с тем, что `useList` кэширует рендеры, и не знает о зависимости от состояния `messageDeleting`.
Чтобы исправить это, нам нужно предоставить `keys`:

```tsx
// Файл: /src/pages/chat/page.tsx
const messages = useList(model.$messages, {
  keys: [messageDeleting],
  fn: (message) => (
    <div className="message-item" key={message.timestamp}>
      <h3>From: {message.author.name}</h3>
      <p>{message.text}</p>
      <button onClick={() => handleMessageDelete(message)} disabled={messageDeleting}>
        {messageDeleting ? "Deleting" : "Delete"}
      </button>
    </div>
  ),
});
```

### Заключение

Это простой пример приложения на эффекторе с использованием React и TypeScript.

Вы можете склонировать себе репозиторий [effector/examples/react-and-ts](https://github.com/effector/effector/tree/master/examples/react-and-ts) и запустить пример самостоятельно на собственном компьютере.


# withRegion

```ts
import { withRegion } from "effector";
```

The method is based on the idea of region-based memory management (see [Region-based memory management](https://en.wikipedia.org/wiki/Region-based_memory_management) for reference).

## Methods

### `withRegion(unit, callback)`

> INFO since: 
>
> [effector 20.11.0](https://changelog.effector.dev/#effector-20-11-0)

The method allows to explicitly transfer ownership of all units (including links created with `sample`, `forward`, etc...) defined in the callback to `unit`. As an implication, all the created links will be erased as soon as `clearNode` is called on .

#### Formulae

```ts
withRegion(unit: Unit<T> | Node, callback: () => void): void
```

#### Arguments

1. `unit`: *Unit* | *Node* — which will serve as "local area" or "region" owning all the units created within the provided callback. Usually a node created by low level `createNode` method is optimal for this case.
2. `callback`: `() => void` — The callback where all the relevant units should be defined.

#### Examples

```js
import { createNode, createEvent, restore, withRegion, clearNode } from "effector";

const first = createEvent();
const second = createEvent();
const $store = restore(first, "");
const region = createNode();

withRegion(region, () => {
  // Following links created with `sample` are owned by the provided unit `region`
  // and will be disposed as soon as `clearNode` is called on `region`.
  sample({
    clock: second,
    target: first,
  });
});

$store.watch(console.log);

first("hello");
second("world");

clearNode(region);

second("will not trigger updates of `$store`");
```



RPC errors in microservices are never thrown; they are thrown as Problems according to the RFC7807 standard. An exception class inheriting from RFC7807 is created in the exceptions directory, for example, in the application layer or domain layer.
