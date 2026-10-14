import {
  MOCK_FALLBACK_REPLIES,
  MOCK_KEYWORD_REPLIES,
  getOperatorRedirectMessage,
  isMedicalProductTopic,
} from '../data/mocks.js';

export function pickMockReply(userText) {
  if (!isMedicalProductTopic(userText)) {
    return getOperatorRedirectMessage();
  }

  const lower = userText.toLowerCase().trim();
  for (const rule of MOCK_KEYWORD_REPLIES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.text;
    }
  }
  const idx = Math.floor(Math.random() * MOCK_FALLBACK_REPLIES.length);
  return MOCK_FALLBACK_REPLIES[idx];
}
