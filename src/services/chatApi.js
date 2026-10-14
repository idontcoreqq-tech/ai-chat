import {
  MOCK_FALLBACK_REPLIES,
  MOCK_KEYWORD_REPLIES,
  createMessage,
} from '../data/mocks.js';

export const USE_MOCK = true;

function randomDelay() {
  return 400 + Math.floor(Math.random() * 500);
}

function pickMockReply(userText) {
  const lower = userText.toLowerCase().trim();
  for (const rule of MOCK_KEYWORD_REPLIES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.text;
    }
  }
  const idx = Math.floor(Math.random() * MOCK_FALLBACK_REPLIES.length);
  return MOCK_FALLBACK_REPLIES[idx];
}

/**
 * @param {string} text
 * @param {Array<{ role: string, text: string }>} _history
 * @returns {Promise<{ id: string, role: string, text: string, createdAt: string }>}
 */
export async function sendMessage(text, _history = []) {
  if (!USE_MOCK) {
    throw new Error('Реальный API ещё не подключён. Установите USE_MOCK или реализуйте fetch.');
  }

  await new Promise((resolve) => setTimeout(resolve, randomDelay()));

  const replyText = pickMockReply(text);
  return createMessage({ role: 'agent', text: replyText });
}
