import { createMessage } from '../data/mocks.js';
import { pickMockReply } from './mockReply.js';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function randomDelay() {
  return 400 + Math.floor(Math.random() * 500);
}

function buildHistoryPayload(history) {
  return history
    .filter((m) => m && (m.role === 'user' || m.role === 'agent') && m.text)
    .map((m) => ({ role: m.role, text: m.text }));
}

async function sendMessageViaApi(text, history) {
  const url = `${API_BASE}/api/chat`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: text,
      history: buildHistoryPayload(history),
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg =
      typeof data.error === 'string'
        ? data.error
        : 'Сервис временно недоступен. Проверьте, что запущен backend (npm run dev).';
    throw new Error(msg);
  }

  if (!data.reply || typeof data.reply !== 'string') {
    throw new Error('Некорректный ответ сервера.');
  }

  return data.reply;
}

/**
 * @param {string} text
 * @param {Array<{ role: string, text: string }>} history
 * @returns {Promise<{ id: string, role: string, text: string, createdAt: string }>}
 */
export async function sendMessage(text, history = []) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    const replyText = pickMockReply(text);
    return createMessage({ role: 'agent', text: replyText });
  }

  const replyText = await sendMessageViaApi(text, history);
  return createMessage({ role: 'agent', text: replyText });
}
