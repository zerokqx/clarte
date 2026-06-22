import { TextAlign } from '@tiptap/extension-text-align';
import { Stack } from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Image from '@tiptap/extension-image';
import { useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Collaboration from '@tiptap/extension-collaboration';
import Placeholder from '@tiptap/extension-placeholder';
import * as Y from 'yjs';
import {
  AlignLeftIcon,
  AlignRightIcon,
  ImageSquareIcon,
  LinkIcon,
  QuotesIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextBIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react';

import CollaborationCursor from '@tiptap/extension-collaboration-caret';

import { HocuspocusProvider } from '@hocuspocus/provider';
import { useCallback } from 'react';

function stringToPastelColor(name: string): string {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  const saturation = 55;
  const lightness = 75;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const doc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: 'ws://localhost:5006/yjs',
  name: 'clarte-cursor-demo-123',
  document: doc,
});

export function App() {
  const name = 'User ' + Math.floor(Math.random() * 1500);
  const editor = useEditor({
    extensions: [
      Collaboration.configure({ document: doc }),
      StarterKit.configure({ link: false, history: false }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          avatar: 'https://avatars.githubusercontent.com/u/89585170?v=4',
          name,
          color: stringToPastelColor(name), // Красный курсор
        },
        render: (user) => {
          const cursor = document.createElement('span');
          cursor.classList.add('collaboration-carets__caret');
          cursor.setAttribute('style', `border-color: ${user.color}`);

          const label = document.createElement('div');
          label.classList.add('collaboration-carets__label');
          label.setAttribute('style', `background-color: ${user.color}`);

          if (user.avatar) {
            const avatar = document.createElement('img');
            avatar.src = user.avatar;
            avatar.classList.add('collaboration-carets__avatar');
            label.appendChild(avatar);
          }

          const nameNode = document.createElement('span');
          nameNode.textContent = user.name;
          label.appendChild(nameNode);

          cursor.insertBefore(label, null);
          return cursor;
        },
        selectionRender: (user) => {
          let backgroundColor = `${user.color}50`;
          const hslMatch = user.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
          if (hslMatch) {
            backgroundColor = `hsla(${hslMatch[1]}, ${hslMatch[2]}%, ${hslMatch[3]}%, 0.3)`;
          }
          return {
            class: 'collaboration-carets__selection',
            style: `background-color: ${backgroundColor}`,
          };
        },
      }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: 'Напишите что нибудь...' }),
      Image,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'], // Разрешаем выравнивать заголовки и текст
        alignments: ['left', 'center', 'right', 'justify'], // Доступные режимы
      }),
    ],
  });
  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <Stack p={'lg'}>
      <RichTextEditor editor={editor}>
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control onClick={addImage}>
              <ImageSquareIcon />
            </RichTextEditor.Control>
            <RichTextEditor.Bold icon={TextBIcon} />
            <RichTextEditor.Italic icon={TextItalicIcon} />
            <RichTextEditor.Link icon={LinkIcon} />
            <RichTextEditor.Blockquote icon={QuotesIcon} />
            <RichTextEditor.Underline icon={TextUnderlineIcon} />
            <RichTextEditor.Strikethrough icon={TextStrikethroughIcon} />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.AlignLeft icon={AlignLeftIcon} />
          <RichTextEditor.AlignJustify icon={TextAlignJustifyIcon} />
          <RichTextEditor.AlignCenter icon={TextAlignCenterIcon} />
          <RichTextEditor.AlignRight icon={AlignRightIcon} />
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
    </Stack>
  );
}
