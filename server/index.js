import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateAgentReply,
  getConfiguredModelName,
  isGeminiConfigured,
} from './gemini.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    gemini: isGeminiConfigured(),
    model: getConfiguredModelName(),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!isGeminiConfigured()) {
      res.status(503).json({
        error: 'Сервер не настроен: укажите GEMINI_API_KEY в .env',
      });
      return;
    }

    const { message, history } = req.body ?? {};
    const text = typeof message === 'string' ? message.trim() : '';

    if (!text) {
      res.status(400).json({ error: 'Поле message обязательно.' });
      return;
    }

    if (text.length > 4000) {
      res.status(400).json({ error: 'Сообщение слишком длинное (макс. 4000 символов).' });
      return;
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const reply = await generateAgentReply(text, safeHistory);
    res.json({ reply });
  } catch (err) {
    console.error('[api/chat]', err?.cause || err);
    const message =
      err instanceof Error && err.message
        ? err.message
        : 'Не удалось получить ответ от ассистента. Попробуйте ещё раз.';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  if (!isGeminiConfigured()) {
    console.warn('GEMINI_API_KEY не задан — чат через API недоступен.');
  }
});
