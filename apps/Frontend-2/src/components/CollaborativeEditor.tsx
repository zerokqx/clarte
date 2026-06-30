import React, { useEffect, useRef, useState } from "react";
import { Box, Text, Group, Badge, Paper, Tooltip, Button, Select, Avatar, Indicator, Modal, Stack, Alert, TextInput, useMantineColorScheme } from "@mantine/core";
import { IconCopy, IconCheck, IconUsers, IconCloudCheck, IconEdit, IconTypography } from "@tabler/icons-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { SerializedAttachment, fileToBase64, compressImage } from "../utils/mediaSerializer";

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

const escapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Converts the contenteditable DOM tree into a plain text representation with ![[media-XXXX]] links
const serializeDOM = (element: HTMLElement): string => {
  const lines: string[] = [];
  
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      
      if (el.classList.contains("inline-media-container")) {
        const img = el.querySelector("img");
        const mediaId = img?.getAttribute("data-media-id");
        if (mediaId) {
          return `\n![[${mediaId}]]\n`;
        }
      }
      
      if (el.nodeName === "BR") {
        return "\n";
      }
      
      const isBlock = ["DIV", "P", "H1", "H2", "H3", "LI"].includes(el.nodeName);
      let content = "";
      for (let i = 0; i < el.childNodes.length; i++) {
        content += processNode(el.childNodes[i]);
      }
      
      if (isBlock) {
        return (content.startsWith("\n") ? "" : "\n") + content + (content.endsWith("\n") ? "" : "\n");
      }
      
      return content;
    }
    
    return "";
  };

  let result = "";
  for (let i = 0; i < element.childNodes.length; i++) {
    result += processNode(element.childNodes[i]);
  }
  
  // Normalize consecutive newlines and trim whitespace
  return result.replace(/\n{3,}/g, "\n\n").trim();
};

// Converts the plain text document with ![[media-XXXX]] links into contenteditable HTML containing inline media containers
const deserializeToHTML = (text: string, attachmentsList: SerializedAttachment[]): string => {
  if (!text) return "<div><br></div>";
  
  const lines = text.split("\n");
  let html = "";
  
  for (const line of lines) {
    const match = line.match(/^!\[\[(media-.*?)\]\]$/);
    if (match) {
      const mediaId = match[1];
      const attachment = attachmentsList.find(a => a.id === mediaId);
      if (attachment) {
        html += `<div class="inline-media-container" contenteditable="false" style="max-width: 550px; margin: 14px 0; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f8f9fa; user-select: none; display: block;">
          <img src="${attachment.data}" data-media-id="${mediaId}" style="max-width: 100%; max-height: 380px; border-radius: 6px; display: block; object-fit: contain;" />
          <div style="font-size: 11px; color: #868e96; margin-top: 6px; font-weight: 500; font-family: sans-serif;">${attachment.name}</div>
        </div>`;
        continue;
      }
    }
    html += `<div>${line ? escapeHTML(line) : "<br>"}</div>`;
  }
  
  return html;
};

// Helper to trace cursor caret character offset within a contenteditable element
const getCaretCharacterOffsetWithin = (element: HTMLElement): number => {
  let caretOffset = 0;
  const doc = element.ownerDocument || document;
  const win = doc.defaultView || window;
  const sel = win.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
};

// Helper to set caret position back in contenteditable based on text offset
const setCaretPosition = (element: HTMLElement, offset: number) => {
  let charIndex = 0;
  const range = document.createRange();
  range.setStart(element, 0);
  range.collapse(true);
  
  const nodeStack: Node[] = [element];
  let node: Node | undefined;
  let found = false;
  
  while ((node = nodeStack.pop()) && !found) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharIndex = charIndex + (node.textContent?.length || 0);
      if (offset >= charIndex && offset <= nextCharIndex) {
        range.setStart(node, offset - charIndex);
        range.collapse(true);
        found = true;
      }
      charIndex = nextCharIndex;
    } else {
      let i = node.childNodes.length;
      while (i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }
  }
  
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

// Helper to insert an HTML block directly at the current selection caret
const insertHtmlAtCaret = (html: string) => {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    
    const el = document.createElement("div");
    el.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: Node | null;
    let lastNode: Node | null = null;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);
    
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.setEndAfter(lastNode);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ noteId, noteTitle, currentUser }) => {
  const { colorScheme } = useMantineColorScheme();
  const [activeUsers, setActiveUsers] = useState<{ name: string; color: string; isTyping: boolean }[]>([]);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [attachments, setAttachments] = useState<SerializedAttachment[]>([]);
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem("clarte_editor_font") || "Inter";
  });

  const editorRef = useRef<HTMLDivElement | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const isLocalChange = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shareLink = `${window.location.origin}/shared-note/${noteId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachmentsChange = (newAttachments: SerializedAttachment[]) => {
    const ydoc = ydocRef.current;
    if (!ydoc) return;
    const yattachments = ydoc.getArray<SerializedAttachment>("attachments");
    ydoc.transact(() => {
      yattachments.delete(0, yattachments.length);
      if (newAttachments.length > 0) {
        yattachments.push(newAttachments);
      }
    });
    setAttachments(newAttachments);
  };

  useEffect(() => {
    setSyncing(true);
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${window.location.host}/yjs`;
    const roomName = `clarte-note-v1-${noteId}`;
    
    const provider = new WebsocketProvider(
      wsUrl,
      roomName,
      ydoc
    );
    providerRef.current = provider;

    const ytext = ydoc.getText("content");
    const yattachments = ydoc.getArray<SerializedAttachment>("attachments");

    const initialName = currentUser?.login || "Гость";
    provider.awareness.setLocalStateField("user", {
      name: initialName,
      color: getUserColor(initialName),
      isTyping: false,
    });

    const handleYjsUpdate = () => {
      const element = editorRef.current;
      if (!element) return;

      const currentDOM = serializeDOM(element);
      const newYjsValue = ytext.toString();

      if (currentDOM !== newYjsValue) {
        if (!isLocalChange.current) {
          const offset = getCaretCharacterOffsetWithin(element);
          element.innerHTML = deserializeToHTML(newYjsValue, yattachments.toArray());
          setCaretPosition(element, offset);
        }
      }
      setSyncing(false);
    };

    ytext.observe(handleYjsUpdate);

    const handleAttachmentsUpdate = () => {
      const currentList = yattachments.toArray();
      setAttachments(currentList);
      
      // Update DOM to render newly arrived/deleted media
      const element = editorRef.current;
      if (element && !isLocalChange.current) {
        const offset = getCaretCharacterOffsetWithin(element);
        element.innerHTML = deserializeToHTML(ytext.toString(), currentList);
        setCaretPosition(element, offset);
      }
    };
    yattachments.observe(handleAttachmentsUpdate);
    setAttachments(yattachments.toArray());

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

    if (editorRef.current) {
      editorRef.current.innerHTML = deserializeToHTML(ytext.toString(), yattachments.toArray());
    }

    return () => {
      ytext.unobserve(handleYjsUpdate);
      yattachments.unobserve(handleAttachmentsUpdate);
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

  const handleLocalInput = () => {
    const ydoc = ydocRef.current;
    const provider = providerRef.current;
    const element = editorRef.current;
    if (!ydoc || !provider || !element) return;

    const ytext = ydoc.getText("content");
    const currentVal = serializeDOM(element);
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

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          try {
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], `Вставка-${Date.now()}.jpg`, { type: "image/jpeg" });
            
            if (compressedFile.size > 1.5 * 1024 * 1024) {
              alert("Размер вставляемого изображения превышает лимит 1.5 МБ.");
              return;
            }

            const base64Data = await fileToBase64(compressedFile);
            const newAttachment: SerializedAttachment = {
              id: `media-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
              name: compressedFile.name,
              type: compressedFile.type,
              size: compressedFile.size,
              data: base64Data,
            };

            const updatedAttachments = [...attachments, newAttachment];
            handleAttachmentsChange(updatedAttachments);

            // Insert HTML image block directly at the current selection caret
            const imgHtml = `<div class="inline-media-container" contenteditable="false" style="max-width: 500px; margin: 12px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f8f9fa; user-select: none; display: block;">
              <img src="${newAttachment.data}" data-media-id="${newAttachment.id}" style="max-width: 100%; max-height: 350px; border-radius: 6px; display: block; object-fit: contain;" />
              <div style="font-size: 10px; color: #868e96; margin-top: 6px; font-weight: 500; font-family: sans-serif;">${newAttachment.name}</div>
            </div>`;
            
            insertHtmlAtCaret(imgHtml);
            handleLocalInput();
          } catch (err) {
            console.error("Failed to process pasted image:", err);
          }
        }
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        e.preventDefault();
        
        // Relocate cursor caret to the drop location coords
        const range = document.caretRangeFromPoint
          ? document.caretRangeFromPoint(e.clientX, e.clientY)
          : null;
        
        if (range) {
          const sel = window.getSelection();
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }

        try {
          let fileToProcess = file;
          if (file.type.startsWith("image/")) {
            const compressedBlob = await compressImage(file);
            fileToProcess = new File([compressedBlob], file.name, { type: file.type });
          }

          if (fileToProcess.size > 1.5 * 1024 * 1024) {
            alert("Файл слишком большой! Максимальный размер — 1.5 МБ.");
            return;
          }

          const base64Data = await fileToBase64(fileToProcess);
          const newAttachment: SerializedAttachment = {
            id: `media-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
            name: fileToProcess.name,
            type: fileToProcess.type,
            size: fileToProcess.size,
            data: base64Data,
          };

          const updatedAttachments = [...attachments, newAttachment];
          handleAttachmentsChange(updatedAttachments);

          // Render proper interactive player tag
          let mediaTag = "";
          if (fileToProcess.type.startsWith("image/")) {
            mediaTag = `<img src="${newAttachment.data}" data-media-id="${newAttachment.id}" style="max-width: 100%; max-height: 350px; border-radius: 6px; display: block; object-fit: contain;" />`;
          } else if (fileToProcess.type.startsWith("video/")) {
            mediaTag = `<video src="${newAttachment.data}" controls style="width: 100%; max-height: 350px; border-radius: 6px; display: block;" />`;
          } else if (fileToProcess.type.startsWith("audio/")) {
            mediaTag = `<audio src="${newAttachment.data}" controls style="width: 100%; display: block;" />`;
          }

          const imgHtml = `<div class="inline-media-container" contenteditable="false" style="max-width: 500px; margin: 12px 0; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f8f9fa; user-select: none; display: block;">
            ${mediaTag}
            <div style="font-size: 10px; color: #868e96; margin-top: 6px; font-weight: 500; font-family: sans-serif;">${newAttachment.name}</div>
          </div>`;
          
          insertHtmlAtCaret(imgHtml);
          handleLocalInput();
        } catch (err) {
          console.error("Drop processing failed:", err);
        }
      }
    }
  };

  return (
    <Box
      className="collaborative-editor-container"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
      onPaste={handlePaste}
    >
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
            <Select
              size="xs"
              value={fontFamily}
              onChange={(val) => {
                if (val) {
                  setFontFamily(val);
                  localStorage.setItem("clarte_editor_font", val);
                }
              }}
              data={[
                { value: "Inter", label: "Inter (Без засечек)" },
                { value: "Montserrat", label: "Montserrat" },
                { value: "Merriweather", label: "Merriweather (Книжный)" },
                { value: "Playfair Display", label: "Playfair Display" },
                { value: "Fira Code", label: "Fira Code (Моноширинный)" },
              ]}
              leftSection={<IconTypography size={14} />}
              style={{ width: 150 }}
              radius="md"
            />

            <Badge
              variant="light"
              color={syncing ? "orange" : "green"}
              leftSection={syncing ? null : <IconCloudCheck size={12} />}
            >
              {syncing ? "Синхронизация..." : "Синхронизировано"}
            </Badge>

            <Tooltip label="Поделиться заметкой с другом">
              <Button
                size="xs"
                variant="outline"
                color="indigo"
                leftSection={<IconCopy size={14} />}
                onClick={handleCopyLink}
                radius="md"
              >
                Поделиться
              </Button>
            </Tooltip>
          </Group>
        </Group>

        {activeUsers.length > 0 && (
          <Group gap="xs" mt="sm" justify="flex-start" align="center" style={{ borderTop: "1px solid #f1f3f5", paddingTop: "8px" }}>
            <Text size="xs" color="dimmed" fw={500}>Соавторы в сети:</Text>
            <Avatar.Group>
              {activeUsers.map((user, idx) => {
                const initials = user.name.substring(0, 2).toUpperCase();
                return (
                  <Tooltip key={idx} label={user.name}>
                    <Box style={{ cursor: "pointer" }}>
                      <Indicator
                        color="violet"
                        disabled={!user.isTyping}
                        processing
                        size={10}
                        offset={2}
                      >
                        <Avatar
                          radius="xl"
                          size="sm"
                          styles={{
                            placeholder: {
                              color: user.color,
                              backgroundColor: `${user.color}15`,
                              fontWeight: 700,
                              fontSize: '10px',
                              border: `2px solid ${user.color}`
                            }
                          }}
                        >
                          {initials}
                        </Avatar>
                      </Indicator>
                    </Box>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
            {activeUsers.some((u) => u.isTyping) && (
              <Text size="xs" color="indigo" italic style={{ animation: "pulse 1.5s infinite", display: "flex", alignItems: "center", gap: "4px" }}>
                <IconEdit size={12} /> Кто-то печатает...
              </Text>
            )}
          </Group>
        )}
      </Paper>

      {/* Obsidian-Style contenteditable Editor Container */}
      <Box style={{ flex: 1, position: "relative", minHeight: "400px", display: "flex", flexDirection: "column" }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleLocalInput}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          placeholder="Начните писать заметку здесь... Вы можете перетаскивать сюда (Drag & Drop) или вставлять из буфера обмена (Ctrl + V) изображения и файлы"
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            minHeight: "400px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            fontSize: "15px",
            fontFamily: fontFamily,
            outline: "none",
            lineHeight: "1.6",
            background: "#ffffff",
            color: "#1a1a2e",
            overflowY: "auto",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
            whiteSpace: "pre-wrap"
          }}
        />
      </Box>

      <Modal
        opened={shareModalOpened}
        onClose={() => setShareModalOpened(false)}
        title="Поделиться заметкой с другом"
        centered
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            Отправьте эту ссылку вашему соавтору для совместного редактирования в реальном времени. Все изменения сохраняются в общей базе данных.
          </Text>

          <Box>
            <Text size="xs" fw={700} mb={5}>Ссылка для подключения:</Text>
            <Group gap="xs">
              <TextInput
                value={shareLink}
                readOnly
                size="sm"
                style={{ flex: 1 }}
                radius="md"
              />
              <Button
                size="sm"
                color={copiedLink ? "green" : "indigo"}
                onClick={async () => {
                  await navigator.clipboard.writeText(shareLink);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                radius="md"
              >
                {copiedLink ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </Button>
            </Group>
          </Box>

          <Box>
            <Text size="xs" fw={700} mb={5}>ID комнаты (для ручного ввода):</Text>
            <Group gap="xs">
              <TextInput
                value={noteId}
                readOnly
                size="sm"
                style={{ flex: 1 }}
                radius="md"
              />
              <Button
                size="sm"
                variant="light"
                color={copiedId ? "green" : "indigo"}
                onClick={async () => {
                  await navigator.clipboard.writeText(noteId);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                radius="md"
              >
                {copiedId ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </Button>
            </Group>
          </Box>

          <Alert color="blue" radius="md" style={{ fontSize: '13px' }}>
            Синхронизация происходит через ваш персональный сервер WebSocket-шлюза на порту 5006. Все данные сохраняются в MongoDB.
          </Alert>
        </Stack>
      </Modal>
    </Box>
  );
};
