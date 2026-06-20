import { useMemo, useState, useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import { Paper, Title, Text, Stack, Code, Button, Group, SimpleGrid, Card, Badge } from '@mantine/core';

export function TiptapDemo() {
  // Create a single shared Y.Doc
  const sharedDoc = useMemo(() => new Y.Doc(), []);
  
  const [editor1Html, setEditor1Html] = useState('');
  const [editor2Html, setEditor2Html] = useState('');

  // Configure Editor 1
  const editor1 = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: false, // Disable history/undoRedo since Yjs Collaboration handles it
      }),
      Collaboration.configure({
        document: sharedDoc,
        field: 'content',
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditor1Html(html);
      console.log('Editor 1 update:', {
        html,
        json: editor.getJSON(),
        yjsXmlText: sharedDoc.getXmlFragment('content').toString(),
      });
    },
  });

  // Configure Editor 2
  const editor2 = useEditor({
    extensions: [
      StarterKit.configure({
        undoRedo: false, // Disable history/undoRedo since Yjs Collaboration handles it
      }),
      Collaboration.configure({
        document: sharedDoc,
        field: 'content',
      }),
    ],
    onUpdate({ editor }) {
      const html = editor.getHTML();
      setEditor2Html(html);
      console.log('Editor 2 update:', {
        html,
        json: editor.getJSON(),
        yjsXmlText: sharedDoc.getXmlFragment('content').toString(),
      });
    },
  });

  // Initialize display HTML and initial document content
  useEffect(() => {
    if (editor1 && editor1Html === '') {
      // Set initial content if document is empty
      const xmlFragment = sharedDoc.getXmlFragment('content');
      if (xmlFragment.length === 0) {
        sharedDoc.transact(() => {
          const type = sharedDoc.getText('content');
          // Start with some text if empty
          if (type.toString() === '') {
            editor1.commands.setContent('<p>Привет! Попробуй отредактировать этот текст.</p><p>Изменения мгновенно отобразятся во втором редакторе ниже, так как они подключены к одному Yjs <b>Y.Doc</b>.</p>');
          }
        });
      }
      setEditor1Html(editor1.getHTML());
    }
  }, [editor1, sharedDoc, editor1Html]);

  useEffect(() => {
    if (editor2 && editor2Html === '') {
      setEditor2Html(editor2.getHTML());
    }
  }, [editor2, editor2Html]);

  const logYjsState = () => {
    console.log('--- Yjs Document State Info ---');
    console.log('Shared document:', sharedDoc);
    console.log('Content XML representation:', sharedDoc.getXmlFragment('content').toString());
    console.log('JSON structure:', editor1?.getJSON());
    console.log('-------------------------------');
    alert('Состояние Yjs выведено в консоль браузера (DevTools)!');
  };

  return (
    <Card withBorder padding="lg" radius="md" mt="xl" shadow="xs">
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Title order={3}>Демонстрация Mantine TipTap + Yjs</Title>
            <Text size="sm" c="dimmed">
              Два независимых редактора подключены к одному локальному Yjs документу (`Y.Doc`).
            </Text>
          </div>
          <Badge color="violet" size="lg" variant="filled">
            Yjs Integration Active
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Editor 1 */}
          <Stack gap="xs">
            <Text fw={600} size="sm" c="blue">Редактор А (Пользователь 1)</Text>
            {editor1 && (
              <RichTextEditor editor={editor1}>
                <RichTextEditor.Toolbar>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            )}
          </Stack>

          {/* Editor 2 */}
          <Stack gap="xs">
            <Text fw={600} size="sm" c="teal">Редактор Б (Пользователь 2)</Text>
            {editor2 && (
              <RichTextEditor editor={editor2}>
                <RichTextEditor.Toolbar>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            )}
          </Stack>
        </SimpleGrid>

        <Paper withBorder p="md" bg="var(--mantine-color-gray-0)" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={600} size="sm">Текущие данные (HTML):</Text>
              <Button size="xs" color="violet" onClick={logYjsState}>
                Вывести Y.Doc в Console
              </Button>
            </Group>
            <Code block style={{ whiteSpace: 'pre-wrap' }}>
              {editor1Html}
            </Code>
          </Stack>
        </Paper>
      </Stack>
    </Card>
  );
}
