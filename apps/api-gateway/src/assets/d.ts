import { distance } from 'fastest-levenshtein';

interface NoteComparison {
  oldLength: number;
  newLength: number;
  editDistance: number;
  similarityCode: number;
  similarityPercent: string;
}

export function compareNotes(oldText: string, newText: string): NoteComparison {
  const editDistance = distance(oldText, newText);
  const maxLength = Math.max(oldText.length, newText.length);

  if (maxLength === 0) {
    return { oldLength: 0, newLength: 0, editDistance: 0, similarityCode: 1, similarityPercent: '100%' };
  }

  const similarityCode = (maxLength - editDistance) / maxLength;
  const similarityPercent = `${(similarityCode * 100).toFixed(1)}%`;

  return {
    oldLength: oldText.length,
    newLength: newText.length,
    editDistance,
    similarityCode,
    similarityPercent,
  };
}

// ==========================================
// БОЛЬШИЕ ДАННЫЕ (РЕАЛИСТИЧНЫЙ ТЕКСТ ЗАМЕТКИ)
// ==========================================

// Исходная заметка — План разработки мессенджера
const noteOriginal = `
# План разработки модуля Мессенджера

## 1. Архитектура бэкенда
- Настроить WebSocket соединение через пакет socket.io.
- Реализовать Shared Worker на фронтенде для менеджмента одного коннекта на несколько вкладок браузера.
- Использовать Redis Pub/Sub для горизонтального масштабирования инстансов ноды.

## 2. База Данных (MongoDB)
- Создать коллекцию \`messages\` со следующими полями:
  - id: ObjectId
  - chatIds: Array<String>
  - senderId: String
  - content: String (текст сообщения)
  - createdAt: Date
- Настроить индексы по полю \`chatId\` и \`createdAt\` для быстрой пагинации сообщений.

## 3. Клиентская часть (React + TS)
- Реализовать стейт-менеджер Zustand для хранения истории текущего активного чата.
- Оптимизировать рендер списка через виртуализацию (библиотека TanStack Virtual).
- Добавить IndexedDB (Dexie.js) для локального кэширования сообщений.
`;

// Сценарий 1: Юзер исправил опечатки и поменял пару слов (Мелкий патч)
const noteWithMinorFixes = `
# План разработки модуля Мессенджера

## 1. Архитектура бэкенда
- Настроить WebSocket соединение через пакет socket.io.
- Реализовать Shared Worker на фронтенде для менеджмента одного коннекта на несколько вкладок браузера.
- Использовать Redis Pub/Sub для горизонтального масштабирования инстансов Node.js.

## 2. База Данных (MongoDB Atlas)
- Создать коллекцию \`messages\` со следующими полями:
  - _id: ObjectId
  - chatId: String
  - senderId: String
  - text: String (текст сообщения)
  - createdAt: Date
- Настроить составной индекс по полям \`chatId\` и \`createdAt\` для быстрой пагинации сообщений.

## 3. Фронтенд (React + TypeScript)
- Реализовать стейт-менеджер Zustand для хранения истории текущего активного чата.
- Оптимизировать рендер списка через виртуализацию (библиотека TanStack Virtual).
- Добавить IndexedDB (Dexie.js) для локального кэширования сообщений.
`;

// Сценарий 2: Юзер полностью переписал архитектуру бэкенда и добавил AI (Большой рефакторинг)
const noteWithMajorChanges = `
# План разработки модуля Мессенджера

## 1. Бэкенд и Протокол данных
- Вместо вебсокетов решили использовать gRPC-web для стриминга сообщений, так как это снизит оверхед по памяти.
- Отказались от Shared Worker, пишем кастомную обертку на лонг-пуллинге для мобилок.
- Заменим Redis на RabbitMQ, потому что нужна строгая гарантия доставки сообщений (ACK/NACK).

## 2. База Данных (MongoDB)
- Коллекция сообщений остается прежней, но добавляем векторные эмбеддинги для ИИ поиска по истории.
- Индексы оставляем.

## 3. Клиентская часть (React + TS)
- Вместо Zustand берем простой React Context, проект небольшой, стейт-менеджер избыточен.
- Интегрируем ИИ-ассистента (Gemini API) для авто-саммари длинных переписок прямо в чате.
`;


// ==========================================
// ТЕСТИРОВАНИЕ
// ==========================================

console.log("=== ТЕСТ 1: МЕЛКИЕ ПРАВКИ (Опечатки, ренейминг типов) ===");
const test1 = compareNotes(noteOriginal, noteWithMinorFixes);
console.log(test1);

console.log("\n=== ТЕСТ 2: БОЛЬШИЕ ИЗМЕНЕНИЯ (Смена архитектуры) ===");
const test2 = compareNotes(noteOriginal, noteWithMajorChanges);
console.log(test2);
