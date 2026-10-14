import { MOCK_AGENT } from '../data/mocks.js';

export function ChatHeader({ onMinimize, onClose, onToggleTheme, isDark }) {
  return (
    <header className="chat-header">
      <div className="chat-header__info">
        <div className="chat-header__avatar" aria-hidden="true">
          {MOCK_AGENT.initials}
        </div>
        <div className="chat-header__text">
          <span className="chat-header__name">{MOCK_AGENT.name}</span>
          <span className="chat-header__status">
            <span className="chat-header__status-dot" aria-hidden="true" />
            {MOCK_AGENT.statusLabel}
          </span>
        </div>
      </div>
      <div className="chat-header__actions">
        <button
          type="button"
          className="chat-header__btn"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 14.5A8.5 8.5 0 1110.5 4a6.5 6.5 0 0010.5 10.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="chat-header__btn"
          onClick={onMinimize}
          aria-label="Свернуть чат"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="chat-header__btn"
          onClick={onClose}
          aria-label="Закрыть чат"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
