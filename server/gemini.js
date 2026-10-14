import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  MOCK_AGENT,
  OPERATOR_PHONE,
  WELCOME_MESSAGE_TEXT,
} from '../src/data/mocks.js';
import { pickMockReply } from './mockReply.js';

const SYSTEM_INSTRUCTION = `Ты — ${MOCK_AGENT.name}, ИИ-консультант интернет-аптеки MedDemo.

Твоя зона ответственности — ТОЛЬКО вопросы о медицинских товарах и лекарствах в каталоге аптеки:
- наличие, артикулы, формы выпуска, состав (общие сведения из инструкции);
- условия заказа, доставки и хранения медтоваров;
- рецептурный / безрецептурный отпуск (без проверки рецепта);
- аналоги и линейки препаратов на уровне каталога.

ЗАПРЕЩЕНО:
- ставить диагнозы, назначать лечение, подбирать дозировки «для человека»;
- отвечать на темы не связанные с товарами медицины и аптекой (личные вопросы, IT, юриспруденция, жалобы не по товару и т.д.).

Если вопрос НЕ про медицинские товары/лекарства каталога — НЕ отвечай по сути. Вежливо перенаправь на живого оператора и ОБЯЗАТЕЛЬНО укажи телефон: ${OPERATOR_PHONE}. Другой контакт не придумывай.

Если вопрос медицинский, но нужна персональная оценка здоровья — кратко дай справочную информацию по товару и рекомендуй врача; при необходимости предложи оператора: ${OPERATOR_PHONE}.

Отвечай на русском, дружелюбно, 2–4 предложения.
Приветствие: «${WELCOME_MESSAGE_TEXT}»`;

const MAX_HISTORY_MESSAGES = 16;
const DEFAULT_MODEL = 'gemini-3.8-flash';

/** Одна быстрая резервная модель перед локальными заготовками. */
const FALLBACK_MODELS = ['gemini-3-flash-preview'];

function getApiKey() {
  return process.env.GEMINI_API_KEY?.trim() || '';
}

function getModelName() {
  return (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();
}

function useMockOnOverload() {
  return process.env.GEMINI_MOCK_ON_OVERLOAD !== 'false';
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOverloadError(err) {
  const status = err?.status;
  const msg = String(err?.message || err);
  return (
    status === 503 ||
    status === 429 ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('overloaded')
  );
}

function isModelUnavailableError(err) {
  const status = err?.status;
  const msg = String(err?.message || err);
  return status === 404 || msg.includes('no longer available') || msg.includes('NOT_FOUND');
}

function isAuthError(err) {
  const status = err?.status;
  const msg = String(err?.message || err);
  return status === 400 || status === 401 || status === 403 || msg.includes('API key');
}

function mapGeminiError(err) {
  const status = err?.status;
  const msg = String(err?.message || err);

  if (isOverloadError(err)) {
    return 'Модель Gemini временно перегружена. Подождите минуту и отправьте сообщение снова.';
  }
  if (isModelUnavailableError(err)) {
    return `Модель «${getModelName()}» недоступна. Укажите в .env GEMINI_MODEL=gemini-3.8-flash и перезапустите npm run dev.`;
  }
  if (isAuthError(err)) {
    return 'Неверный GEMINI_API_KEY. Создайте ключ в Google AI Studio и перезапустите backend.';
  }
  return 'Не удалось получить ответ от Gemini. Попробуйте ещё раз.';
}

/**
 * @param {Array<{ role: string, text: string }>} history
 */
function toGeminiHistory(history) {
  const trimmed = history
    .filter((m) => m?.text && (m.role === 'user' || m.role === 'agent'))
    .slice(-MAX_HISTORY_MESSAGES);

  const geminiHistory = [];
  for (const msg of trimmed) {
    const role = msg.role === 'user' ? 'user' : 'model';
    const last = geminiHistory[geminiHistory.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n${msg.text}`;
      continue;
    }
    geminiHistory.push({
      role,
      parts: [{ text: msg.text }],
    });
  }

  if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
    geminiHistory.shift();
  }

  return geminiHistory;
}

async function generateWithModel(modelName, message, history) {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  const prior = toGeminiHistory(history);
  const chat = model.startChat({ history: prior });
  const result = await chat.sendMessage(message);
  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error('Пустой ответ от модели Gemini.');
  }
  return text;
}

/**
 * @param {string} message
 * @param {Array<{ role: string, text: string }>} history
 */
export async function generateAgentReply(message, history = []) {
  const primary = getModelName();
  const modelChain = [...new Set([primary, ...FALLBACK_MODELS])];
  let lastError;

  for (const modelName of modelChain) {
    const attempts = modelName === primary ? 2 : 1;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        const text = await generateWithModel(modelName, message, history);
        if (modelName !== primary) {
          console.warn(`[gemini] использована резервная модель: ${modelName}`);
        }
        return text;
      } catch (err) {
        lastError = err;

        if (isAuthError(err)) {
          const error = new Error(mapGeminiError(err));
          error.cause = err;
          throw error;
        }

        if (isOverloadError(err) && attempt < attempts - 1) {
          await sleep(500);
          continue;
        }
        break;
      }
    }
  }

  if (useMockOnOverload()) {
    console.warn('[gemini] Gemini недоступен — ответ из локальных заготовок');
    return pickMockReply(message);
  }

  const friendly = mapGeminiError(lastError);
  const error = new Error(friendly);
  error.cause = lastError;
  throw error;
}

export function isGeminiConfigured() {
  return Boolean(getApiKey());
}

export function getConfiguredModelName() {
  return getModelName();
}
