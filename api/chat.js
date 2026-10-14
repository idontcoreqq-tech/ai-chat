import { generateAgentReply, isGeminiConfigured } from '../server/gemini.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    if (!isGeminiConfigured()) {
      res.status(503).json({
        error: 'Сервер не настроен: укажите GEMINI_API_KEY в Vercel Environment Variables.',
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
    res.status(200).json({ reply });
  } catch (err) {
    console.error('[api/chat]', err?.cause || err);
    const msg =
      err instanceof Error && err.message
        ? err.message
        : 'Не удалось получить ответ от ассистента. Попробуйте ещё раз.';
    res.status(500).json({ error: msg });
  }
}
