import React, { useState, useRef, useEffect } from 'react';
import {
  Group,
  Button,
  ActionIcon,
  Text,
  Paper,
  SimpleGrid,
  Image,
  Modal,
  Stack,
  Loader,
  Box,
} from '@mantine/core';
import {
  IconMicrophone,
  IconSquare,
  IconPlus,
  IconTrash,
  IconFileText,
} from '@tabler/icons-react';
import { SerializedAttachment, fileToBase64, compressImage } from '../utils/mediaSerializer';

interface MediaAttachmentListProps {
  attachments: SerializedAttachment[];
  onAttachmentsChange: (newAttachments: SerializedAttachment[]) => void;
  readOnly?: boolean;
}

export const MediaAttachmentList: React.FC<MediaAttachmentListProps> = ({
  attachments = [],
  onAttachmentsChange,
  readOnly = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [previewMedia, setPreviewMedia] = useState<SerializedAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordTime(0);
    }
  }, [isRecording]);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const voiceFile = new File([audioBlob], `Голос-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        await handleAddFile(voiceFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      alert('Не удалось получить доступ к микрофону.');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Process and add a file
  const handleAddFile = async (file: File) => {
    setIsUploading(true);
    try {
      // Compress images to save space
      let fileToProcess = file;
      if (file.type.startsWith('image/')) {
        const compressedBlob = await compressImage(file);
        fileToProcess = new File([compressedBlob], file.name, { type: file.type });
      }

      // Max size limit: 1.5MB to prevent storage bloat
      if (fileToProcess.size > 1.5 * 1024 * 1024) {
        alert('Файл слишком большой! Максимальный размер вложений — 1.5 МБ.');
        setIsUploading(false);
        return;
      }

      const base64Data = await fileToBase64(fileToProcess);
      const newAttachment: SerializedAttachment = {
        id: `media-${Math.random().toString(36).substring(2, 9)}-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: fileToProcess.size,
        data: base64Data,
      };

      onAttachmentsChange([...attachments, newAttachment]);
    } catch (err) {
      console.error('Failed to process file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelectorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleAddFile(files[0]);
    }
  };

  const deleteAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter((item) => item.id !== id));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Stack gap="xs" mt="xs">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelectorChange}
        accept="image/*,video/*,audio/*"
      />

      {!readOnly && (
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            color="indigo"
            leftSection={<IconPlus size={14} />}
            onClick={() => fileInputRef.current?.click()}
            loading={isUploading}
          >
            Файл (фото/видео/аудио)
          </Button>

          {isRecording ? (
            <Button
              size="xs"
              variant="filled"
              color="red"
              leftSection={<IconSquare size={14} style={{ fill: '#fff' }} />}
              onClick={stopRecording}
              style={{ animation: 'pulse 1.2s infinite' }}
            >
              Запись ({formatTime(recordTime)})
            </Button>
          ) : (
            <Button
              size="xs"
              variant="light"
              color="red"
              leftSection={<IconMicrophone size={14} />}
              onClick={startRecording}
            >
              Записать голос
            </Button>
          )}

          {isUploading && (
            <Group gap={6}>
              <Loader size="xs" color="indigo" />
              <Text size="xs" color="dimmed">Сжатие и кодирование...</Text>
            </Group>
          )}
        </Group>
      )}

      {attachments.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs" mt="xs">
          {attachments.map((item) => {
            const isImage = item.type.startsWith('image/');
            const isVideo = item.type.startsWith('video/');
            const isAudio = item.type.startsWith('audio/');

            return (
              <Paper
                key={item.id}
                p="xs"
                withBorder
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  borderRadius: '8px',
                  background: '#f8f9fa',
                  overflow: 'hidden',
                }}
              >
                {!readOnly && (
                  <ActionIcon
                    size="xs"
                    color="red"
                    variant="subtle"
                    onClick={() => deleteAttachment(item.id)}
                    style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                )}

                <Box
                  onClick={() => setPreviewMedia(item)}
                  style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e9ecef',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {isImage && (
                    <Image
                      src={item.data}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {isVideo && (
                    <video
                      src={item.data}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted
                    />
                  )}
                  {isAudio && (
                    <IconMicrophone
                      size={28}
                      stroke={1.5}
                      style={{ color: '#4f46e5', animation: isRecording ? 'pulse 1s infinite' : 'none' }}
                    />
                  )}
                  {!isImage && !isVideo && !isAudio && (
                    <IconFileText size={28} stroke={1.5} color="gray" />
                  )}
                </Box>

                <div style={{ paddingRight: '16px' }}>
                  <Text
                    size="11px"
                    fw={500}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text size="9px" color="dimmed">
                    {formatSize(item.size)}
                  </Text>
                </div>
              </Paper>
            );
          })}
        </SimpleGrid>
      )}

      {/* Lightbox / Player Modal */}
      <Modal
        opened={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        title={previewMedia?.name}
        centered
        size="lg"
        radius="md"
      >
        {previewMedia && (
          <Stack align="center" gap="md" py="xs">
            {previewMedia.type.startsWith('image/') && (
              <Image
                src={previewMedia.data}
                alt={previewMedia.name}
                radius="md"
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            )}
            {previewMedia.type.startsWith('video/') && (
              <video
                src={previewMedia.data}
                controls
                autoPlay
                style={{ width: '100%', borderRadius: '8px', maxHeight: '70vh' }}
              />
            )}
            {previewMedia.type.startsWith('audio/') && (
              <Box p="xl" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <audio
                  src={previewMedia.data}
                  controls
                  autoPlay
                  style={{ width: '100%' }}
                />
              </Box>
            )}
            <Text size="xs" color="dimmed">
              Тип: {previewMedia.type} | Размер: {formatSize(previewMedia.size)}
            </Text>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};
