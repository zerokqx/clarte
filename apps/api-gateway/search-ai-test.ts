const { OpenAI } = require('openai');

const client = new OpenAI({
  baseURL: 'http://localhost:1234/v1',
  apiKey: 'lm-studio',
});

// Критически важный префикс для mxbai при поиске
const RETRIEVAL_PROMPT = 'Represent this sentence for searching relevant passages: ';

async function main() {
  try {
    console.log('🧠 Тест на "тупых" детских заметках...\n');

    const notes = [
      "купить молоко ну то которое не кислое а нормальное",
      "мама сказала вынести мусор но я забыл опять блин",
      "урок математики это просто пиздец ничего не понял",
      "рецепт блинов: мука яйца молоко сахар всё перемешать и жарить",
      "завтра контрольная по истории надо учить даты аааа",
      "почему кот опять спит на клавиатуре бесит",
      "идея для подарка сестре: может быть набор косметики или сертификат",
      "ошибка 500 на сайте когда деплоил ночью не спал вообще",
      "как сделать так чтобы комп не лагал в играх???",
      "список дел на выходные: убраться постирать посмотреть фильм",
      "борщ варить долго сначала мясо потом свекла потом капуста",
      "не забыть записаться к стоматологу зуб болит уже неделю",
      "пароль от вайфая: SuperSecret123! никому не говорить",
      "код для кнопки входа: <button onclick='login()'>Войти</button>",
      "сколько калорий в бургере? наверное много лучше не есть",
      "напоминание: поздравить бабушку с днём рождения 15 марта",
      "git commit -m 'fix: исправил баг с авторизацией наконец-то'",
      "хочу собаку но мама говорит что будет грязно и вонять",
      "формула площади круга: Пи эр квадрат вот и всё",
      "заказать пиццу пепперони большую и колу литр",
      "почему люди такие злые в интернете не понимаю",
      "расписание автобусов: 7:00 8:30 10:00 12:00 14:30",
      "как завязать галстук видео на ютубе смотрел три раза всё равно не получается",
      "сделать домашку по английскому translate the sentences",
      "лампочка в коридоре перегорела надо купить новую E27",
    ];

    console.log(`📝 Загружено ${notes.length} хаотичных заметок`);
    
    // Генерируем векторы для всех заметок одним запросом (batch)
    const notesResponse = await client.embeddings.create({
      model: 'mxbai-embed-large-v1',
      input: notes,
      encoding_format: 'float',
    });

    const noteEmbeddings = notesResponse.data.map((d) => d.embedding);
    console.log(`✅ Векторизация завершена (dim: ${noteEmbeddings[0].length})\n`);

    // Запрос тоже максимально "человеческий" и запутанный
    const userQuery = "пи";
    
    console.log(`🔍 Запрос: "${userQuery}"\n`);
    
    const queryResponse = await client.embeddings.create({
      model: 'mxbai-embed-large-v1',
      input: `${RETRIEVAL_PROMPT}${userQuery}`,
      encoding_format: 'float',
    });

    const queryEmbedding = queryResponse.data[0].embedding;

    // Функция косинусного сходства
    function cosineSimilarity(a, b) {
      let dotProduct = 0, normA = 0, normB = 0;
      for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Сортировка и вывод топ-5
    console.log('🏆 Топ-5 результатов:');
    const results = notes
      .map((note, index) => ({
        text: note,
        score: cosineSimilarity(queryEmbedding, noteEmbeddings[index]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    results.forEach((r, i) => {
      const bar = '█'.repeat(Math.round(r.score * 20));
      console.log(`${i + 1}. [${r.score.toFixed(4)}] ${bar}`);
      console.log(`    "${r.text}"\n`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

main();
