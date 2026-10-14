import { useCallback, useEffect, useRef, useState } from 'react';
import { createMessage, createWelcomeMessage } from '../data/mocks.js';
import { sendMessage } from '../services/chatApi.js';

const MESSAGES_KEY = 'chat-messages-v1';
const WELCOME_SEEN_KEY = 'chat-welcome-shown-v1';
const LAUNCHER_CLICKED_KEY = 'chat-launcher-clicked-v1';

function loadLauncherClicked() {
  try {
    return localStorage.getItem(LAUNCHER_CLICKED_KEY) === '1';
  } catch {
    return false;
  }
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  return [];
}

function saveMessages(messages) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch {
    /* ignore */
  }
}

export function useChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadMessages());
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    const msgs = loadMessages();
    if (msgs.length > 0) return false;
    try {
      return localStorage.getItem(WELCOME_SEEN_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const welcomeInjected = useRef(messages.length > 0);
  const [launcherClicked, setLauncherClicked] = useState(() => loadLauncherClicked());

  const openChat = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    if (!welcomeInjected.current) {
      welcomeInjected.current = true;
      const welcome = createWelcomeMessage();
      setMessages((prev) => {
        const next = prev.length ? prev : [welcome];
        saveMessages(next);
        return next;
      });
      try {
        localStorage.setItem(WELCOME_SEEN_KEY, '1');
      } catch {
        /* ignore */
      }
    }
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const markLauncherClicked = useCallback(() => {
    if (launcherClicked) return;
    setLauncherClicked(true);
    try {
      localStorage.setItem(LAUNCHER_CLICKED_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [launcherClicked]);

  const openLauncher = useCallback(() => {
    markLauncherClicked();
    setIsOpen((open) => {
      if (open) return open;
      setHasUnread(false);
      if (!welcomeInjected.current) {
        welcomeInjected.current = true;
        const welcome = createWelcomeMessage();
        setMessages((prev) => {
          const next = prev.length ? prev : [welcome];
          saveMessages(next);
          return next;
        });
        try {
          localStorage.setItem(WELCOME_SEEN_KEY, '1');
        } catch {
          /* ignore */
        }
      }
      return true;
    });
  }, [markLauncherClicked]);

  const toggleChat = useCallback(() => {
    setIsOpen((open) => {
      if (!open) {
        setHasUnread(false);
        if (!welcomeInjected.current) {
          welcomeInjected.current = true;
          const welcome = createWelcomeMessage();
          setMessages((prev) => {
            const next = prev.length ? prev : [welcome];
            saveMessages(next);
            return next;
          });
          try {
            localStorage.setItem(WELCOME_SEEN_KEY, '1');
          } catch {
            /* ignore */
          }
        }
        return true;
      }
      return false;
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) welcomeInjected.current = true;
  }, [messages.length]);

  const sendUserMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return false;

    const userMsg = createMessage({ role: 'user', text: trimmed });
    setMessages((prev) => {
      const next = [...prev, userMsg];
      saveMessages(next);
      return next;
    });

    setIsTyping(true);
    try {
      const history = [...messages, userMsg];
      const reply = await sendMessage(trimmed, history);
      setMessages((prev) => {
        const next = [...prev, reply];
        saveMessages(next);
        return next;
      });
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Неизвестная ошибка';
      const fallback = createMessage({
        role: 'agent',
        text: `Не удалось отправить сообщение: ${detail}`,
      });
      setMessages((prev) => {
        const next = [...prev, fallback];
        saveMessages(next);
        return next;
      });
    } finally {
      setIsTyping(false);
    }
    return true;
  }, [isTyping, messages]);

  return {
    isOpen,
    messages,
    isTyping,
    hasUnread,
    launcherClicked,
    openChat,
    closeChat,
    toggleChat,
    openLauncher,
    sendUserMessage,
  };
}
