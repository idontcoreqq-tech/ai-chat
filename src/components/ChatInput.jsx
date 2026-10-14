import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_ROWS = 4;
const LINE_HEIGHT = 22;

export function ChatInput({ onSend, disabled, autoFocus }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      textareaRef.current?.focus();
    }
  }, [autoFocus]);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = LINE_HEIGHT * MAX_ROWS + 16;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  const handleSubmit = useCallback(async () => {
    const ok = await onSend(value);
    if (ok) {
      setValue('');
      requestAnimationFrame(resize);
    }
  }, [onSend, value, resize]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) handleSubmit();
    }
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="chat-input-wrap">
      <textarea
        ref={textareaRef}
        className="chat-input"
        rows={1}
        placeholder="Напишите сообщение…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="Сообщение"
      />
      <button
        type="button"
        className="chat-send"
        onClick={handleSubmit}
        disabled={!canSend}
        aria-label="Отправить"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
