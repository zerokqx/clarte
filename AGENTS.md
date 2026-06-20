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
   * Разделение слоев во всех сервисах должно быть строгим:
     - `domain`: содержит сущности-агрегаты (Aggregate Roots), объекты-значения (Value Objects) для валидации полей (например, `IdVo`, `TitleVo`) и доменные исключения. Логика сущностей не должна зависеть от внешних библиотек.
     - `application`: прикладной слой, содержит CQRS-команды/запросы (`commands`/`queries`), порты (`ports`/интерфейсы) и декораторы.
     - `infrastructure`: техническая реализация (адаптеры БД TypeORM, клиенты gRPC/RMQ).
     - `presentation`: контроллеры gRPC/RMQ и HTTP-эндпоинты шлюза (api-gateway).

2. **Внедрение зависимостей (Dependency Injection) и декораторы**:
   * Никогда не внедряйте классы инфраструктуры напрямую в прикладной слой или контроллеры.
   * Всегда объявляйте интерфейсы (порты) в `application/ports/`.
   * Объявляйте символьные токены (DI Tokens) в `application/ports/di-tokens.ts`:
     ```typescript
     export const MY_SERVICE = Symbol('My service');
     ```
   * Создавайте кастомные декораторы инъекции в `application/decorators/` с помощью утилиты `mkInject` из `@clarte/shared-nest/functions`:
     ```typescript
     export const InjectMyService = mkInject(MY_SERVICE);
     ```
   * Внедряйте зависимости только через эти декораторы: `@InjectMyService() private readonly service: IMyService`.

3. **Событийно-ориентированная архитектура (RabbitMQ)**:
   * Описание событий находится в библиотеке `packages/shared-event-types`. Паттерны событий объявляются в `UserEventPattern`, а типы полезной нагрузки — в `UserEventPayloadMap`.
   * При публикации событий используйте `ClientProxy.emit()` совместно с RxJS `firstValueFrom` и конструкцией `satisfies` для строгой проверки типов:
     ```typescript
     firstValueFrom(
       this.rmqClient.emit(UserEventPattern.UserCreated, {
         userId: user.id,
         login: user.login,
       } satisfies UserEventPayloadMap[UserEventPattern.UserCreated])
     ).catch((err) => console.error(err));
     ```
   * Обработчики событий в микросервисах декорируются `@EventPattern(...)` и принимают строго типизированные аргументы `@Payload() data: IEventPayload`.

4. **Функциональный подход и Effect TS**:
   * Сложные асинхронные цепочки, таймауты, ретраи и обработку ошибок в прикладных обработчиках (Handlers) следует реализовывать в функциональном стиле с использованием библиотеки `effect`:
     ```typescript
     const exit = await pipe(
       Effect.tryPromise({
         try: () => this.client.getData(),
         catch: (err) => new CustomException(err),
       }),
       Effect.timeout('3 seconds'),
       Effect.runPromiseExit
     );
     ```

5. **Правила TypeScript и Линтера**:
   * Строго соблюдайте правила `@typescript-eslint/no-inferrable-types`. Не пишите тип свойства класса или переменной, если он тривиально выводится из дефолтного значения (пишите `public readonly userAgent = ''` вместо `public readonly userAgent: string = ''`).


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

export function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
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

* `RichTextEditor.H1`
* `RichTextEditor.H2`
* `RichTextEditor.H3`
* `RichTextEditor.H4`
* `RichTextEditor.H5`
* `RichTextEditor.H6`
* `RichTextEditor.BulletList`
* `RichTextEditor.OrderedList`
* `RichTextEditor.Bold`
* `RichTextEditor.Italic`
* `RichTextEditor.Strikethrough`
* `RichTextEditor.ClearFormatting`
* `RichTextEditor.Blockquote`
* `RichTextEditor.Code`
* `RichTextEditor.CodeBlock`
* `RichTextEditor.Hr`
* `RichTextEditor.Undo`
* `RichTextEditor.Redo`
* `RichTextEditor.Underline`
* `RichTextEditor.Unlink`

Controls that require [@tiptap/extension-text-align](https://www.npmjs.com/package/@tiptap/extension-text-align) extension:

* `RichTextEditor.AlignLeft`
* `RichTextEditor.AlignRight`
* `RichTextEditor.AlignCenter`
* `RichTextEditor.AlignJustify`

Controls that require [@tiptap/extension-color](https://www.npmjs.com/package/@tiptap/extension-color) and [@tiptap/extension-text-style](https://www.npmjs.com/package/@tiptap/extension-text-style) extensions:

* `RichTextEditor.ColorPicker`
* `RichTextEditor.Color`
* `RichTextEditor.UnsetColor`

Other controls with required extensions:

* `RichTextEditor.Superscript` requires [@tiptap/extension-superscript](https://www.npmjs.com/package/@tiptap/extension-superscript)
* `RichTextEditor.Subscript` requires [@tiptap/extension-subscript](https://www.npmjs.com/package/@tiptap/extension-subscript)
* `RichTextEditor.Highlight` requires [@tiptap/extension-highlight](https://www.npmjs.com/package/@tiptap/extension-highlight)

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

* `RichTextEditor.ColorPicker` – allows you to pick colors from given predefined color swatches and with the [ColorPicker](https://mantine.dev/llms/core-color-picker.md) component
* `RichTextEditor.Color` – allows you to apply a given color with one click
* `RichTextEditor.UnsetColor` – clears color styles

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

* `RichTextEditor.SourceCode` – allows switching on/off source code mode

```tsx
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { useState } from 'react';

function Demo() {
  const [isSourceCodeModeActive, onSourceCodeTextSwitch] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    shouldRerenderOnTransaction: true,
    content: '<p>Source code control example</p><p>New line with <strong>bold text</strong></p><p>New line with <em>italic</em> <em>text</em></p>',
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
  return (
    <Button
      onClick={() => editor?.chain().focus().toggleBold().run()}
    >
      Make bold
    </Button>
  );
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
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>Back</Button>
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

* `locale` – dayjs locale. Note that you also need to import the corresponding locale module from dayjs. The default value is `en`.
* `firstDayOfWeek` – a number from 0 to 6, where 0 is Sunday and 6 is Saturday. The default value is 1 – Monday.
* `weekendDays` – an array of numbers from 0 to 6, where 0 is Sunday and 6 is Saturday. The default value is `[0, 6]` – Saturday and Sunday.
* `consistentWeeks` – boolean. If `true`, every month will have 6 weeks. The default value is `false`.

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
  return (
    <DatesProvider settings={{ locale: 'ru' }}>
      {/* Your app  */}
    </DatesProvider>
  );
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
  return (
    <DatesProvider settings={{ locale: 'ru' }}>
      {/* Your app  */}
    </DatesProvider>
  );
}
```
