import { MOCK_AGENT } from '../data/mocks.js';

export function TypingIndicator() {
  return (
    <div className="chat-message chat-message--agent" aria-live="polite">
      <div className="chat-message__avatar" aria-hidden="true">
        {MOCK_AGENT.initials}
      </div>
      <div className="chat-typing">
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
        <span className="chat-typing__dot" />
        <span className="chat-typing__label">печатает…</span>
      </div>
    </div>
  );
}
