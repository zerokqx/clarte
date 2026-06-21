import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Group, Badge, Paper, Tooltip, Button } from "@mantine/core";
import { IconCopy, IconCheck, IconUsers, IconCloudCheck, IconEdit } from "@tabler/icons-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface CollaborativeEditorProps {
  noteId: string;
  noteTitle: string;
  currentUser: { login: string; avatarUrl?: string } | null;
}

const colors = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
];

const getUserColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const findDiffStart = (a: string, b: string): number => {
  let i = 0;
  const minLen = Math.min(a.length, b.length);
  while (i < minLen && a[i] === b[i]) {
    i++;
  }
  return i;
};

const adjustCursor = (oldText: string, newText: string, cursor: number): number => {
  if (oldText === newText) return cursor;
  const diffStart = findDiffStart(oldText, newText);
  if (cursor > diffStart) {
    const offset = newText.length - oldText.length;
    return Math.max(0, cursor + offset);
  }
  return cursor;
};

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ noteId, noteTitle, currentUser }) => {
  const [activeUsers, setActiveUsers] = useState<{ name: string; color: string; isTyping: boolean }[]>([]);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(true);
  
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isLocalChange = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shareLink = `${window.location.origin}/?note=${noteId}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setSyncing(true);
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const roomName = `clarte-note-v1-${noteId}`;
    const provider = new WebsocketProvider(
      "wss://demos.yjs.dev",
      roomName,
      ydoc
    );
    providerRef.current = provider;

    const ytext = ydoc.getText("content");

    const initialName = currentUser?.login || "Гость";
    provider.awareness.setLocalStateField("user", {
      name: initialName,
      color: getUserColor(initialName),
      isTyping: false,
    });

    const handleYjsUpdate = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const currentTextareaValue = textarea.value;
      const newYjsValue = ytext.toString();

      if (currentTextareaValue !== newYjsValue) {
        if (!isLocalChange.current) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          textarea.value = newYjsValue;

          const newStart = adjustCursor(currentTextareaValue, newYjsValue, start);
          const newEnd = adjustCursor(currentTextareaValue, newYjsValue, end);
          textarea.setSelectionRange(newStart, newEnd);
        } else {
          textarea.value = newYjsValue;
        }
      }
      setSyncing(false);
    };

    ytext.observe(handleYjsUpdate);

    const handleAwarenessChange = () => {
      const states = provider.awareness.getStates();
      const users: any[] = [];
      states.forEach((state: any) => {
        if (state.user) {
          users.push(state.user);
        }
      });
      setActiveUsers(users);
    };

    provider.awareness.on("change", handleAwarenessChange);
    handleAwarenessChange();

    if (textareaRef.current) {
      textareaRef.current.value = ytext.toString();
    }

    return () => {
      ytext.unobserve(handleYjsUpdate);
      provider.awareness.off("change", handleAwarenessChange);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      provider.destroy();
      ydoc.destroy();
    };
  }, [noteId]);

  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) return;

    const currentName = currentUser?.login || "Гость";
    const localState = provider.awareness.getLocalState();
    
    if (!localState?.user || localState.user.name !== currentName) {
      provider.awareness.setLocalStateField("user", {
        name: currentName,
        color: getUserColor(currentName),
        isTyping: false,
      });
    }
  }, [currentUser]);

  const handleLocalInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const ydoc = ydocRef.current;
    const provider = providerRef.current;
    if (!ydoc || !provider) return;

    const ytext = ydoc.getText("content");
    const textarea = e.currentTarget;
    const currentVal = textarea.value;
    const oldVal = ytext.toString();

    if (currentVal === oldVal) return;

    const localState = provider.awareness.getLocalState();
    if (localState?.user && !localState.user.isTyping) {
      provider.awareness.setLocalStateField("user", {
        ...localState.user,
        isTyping: true,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const state = provider.awareness.getLocalState();
      if (state?.user && state.user.isTyping) {
        provider.awareness.setLocalStateField("user", {
          ...state.user,
          isTyping: false,
        });
      }
    }, 1500);

    isLocalChange.current = true;

    const diffStart = findDiffStart(oldVal, currentVal);
    
    let suffixLen = 0;
    const maxSuffix = Math.min(oldVal.length - diffStart, currentVal.length - diffStart);
    while (
      suffixLen < maxSuffix &&
      oldVal[oldVal.length - 1 - suffixLen] === currentVal[currentVal.length - 1 - suffixLen]
    ) {
      suffixLen++;
    }

    const deleteLen = oldVal.length - diffStart - suffixLen;
    const insertText = currentVal.slice(diffStart, currentVal.length - suffixLen);

    ydoc.transact(() => {
      if (deleteLen > 0) {
        ytext.delete(diffStart, deleteLen);
      }
      if (insertText.length > 0) {
        ytext.insert(diffStart, insertText);
      }
    });

    isLocalChange.current = false;
  };

  return (
    <Box className="collaborative-editor-container" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Paper p="sm" withBorder mb="md" radius="md" style={{ background: "#ffffff" }}>
        <Group justify="space-between">
          <Box>
            <Text size="sm" fw={700} style={{ color: "#1a1a2e" }}>
              {noteTitle}
            </Text>
            <Text size="xs" color="dimmed">
              ID комнаты: {noteId}
            </Text>
          </Box>
          
          <Group gap="xs">
            <Badge
              variant="light"
              color={syncing ? "orange" : "green"}
              leftSection={syncing ? null : <IconCloudCheck size={12} />}
            >
              {syncing ? "Синхронизация..." : "Синхронизировано"}
            </Badge>

            <Tooltip label={copied ? "Скопировано!" : "Скопировать ссылку для совместной работы"}>
              <Button
                size="xs"
                variant="outline"
                color={copied ? "green" : "indigo"}
                leftSection={copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                onClick={copyShareLink}
              >
                Поделиться
              </Button>
            </Tooltip>
          </Group>
        </Group>

        <Group gap="xs" mt="xs" pt="xs" style={{ borderTop: "1px solid #f1f3f5" }}>
          <Text size="xs" color="dimmed" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconUsers size={12} /> Сейчас редактируют:
          </Text>
          <Group gap={6}>
            {activeUsers.map((user, idx) => (
              <Badge
                key={idx}
                variant="filled"
                style={{
                  backgroundColor: user.color,
                  color: "#ffffff",
                  fontSize: "11px",
                  padding: "4px 8px",
                  height: "22px",
                  textTransform: "none",
                }}
              >
                <Group gap={4} wrap="nowrap">
                  <span>{user.name}</span>
                  {user.isTyping && (
                    <IconEdit size={10} style={{ animation: "pulse 1s infinite" }} />
                  )}
                  {user.isTyping && (
                    <span style={{ fontSize: "9px", fontStyle: "italic", opacity: 0.9 }}>
                      (пишет...)
                    </span>
                  )}
                </Group>
              </Badge>
            ))}
          </Group>
        </Group>
      </Paper>

      <Box style={{ flex: 1, position: "relative" }}>
        <textarea
          ref={textareaRef}
          onInput={handleLocalInput}
          placeholder="Начните писать заметку здесь вместе со своим другом..."
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "15px",
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
            lineHeight: "1.6",
            background: "#ffffff",
            color: "#1a1a2e",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
          }}
        />
      </Box>
    </Box>
  );
};
