export interface SerializedAttachment {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 URL
  size: number;
}

const MEDIA_SEPARATOR = '\n\n__CLARTE_MEDIA_ATTACHMENTS__:\n';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const compressImage = (file: File, maxWidth = 800, maxHeight = 800): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') {
      // Don't compress non-images or GIFs (to keep animation)
      resolve(file);
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.75 // 75% quality for good size/compression balance
      );
    };
    img.onerror = (err) => reject(err);
  });
};

export const parseDescription = (rawDescription = ''): { cleanDescription: string; attachments: SerializedAttachment[] } => {
  if (!rawDescription) {
    return { cleanDescription: '', attachments: [] };
  }

  const parts = rawDescription.split(MEDIA_SEPARATOR);
  if (parts.length < 2) {
    return { cleanDescription: rawDescription, attachments: [] };
  }

  const cleanDescription = parts[0];
  try {
    const attachments = JSON.parse(parts[1]);
    return { cleanDescription, attachments };
  } catch (err) {
    console.error('Failed to parse attachments JSON:', err);
    return { cleanDescription: rawDescription, attachments: [] };
  }
};

export const buildDescription = (cleanDescription: string, attachments: SerializedAttachment[]): string => {
  const desc = cleanDescription.trim();
  if (attachments.length === 0) {
    return desc;
  }
  return `${desc}${MEDIA_SEPARATOR}${JSON.stringify(attachments)}`;
};
