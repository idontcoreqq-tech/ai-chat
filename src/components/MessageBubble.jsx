import { MOCK_AGENT } from '../data/mocks.js';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`chat-message chat-message--${isUser ? 'user' : 'agent'}`}
    >
      {!isUser && (
        <div className="chat-message__avatar" aria-hidden="true">
          {MOCK_AGENT.initials}
        </div>
      )}
      <div className="chat-message__body">
        <div className={`chat-bubble chat-bubble--${isUser ? 'user' : 'agent'}`}>
          {message.text}
        </div>
        <time className="chat-message__time" dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
