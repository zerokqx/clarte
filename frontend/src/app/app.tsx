import './app.module.css';
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
import CollaborationCursor from '@tiptap/extension-collaboration-caret';

import { WebrtcProvider } from 'y-webrtc';
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
const provider = new WebrtcProvider('clarte-cursor-demo-123', doc);

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
              A
            </RichTextEditor.Control>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link />
            <RichTextEditor.Blockquote />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
        <RichTextEditor.Toolbar sticky>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignRight />
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
