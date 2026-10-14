import { lazy, Suspense, useEffect, useRef } from 'react';

const ChatBackground3D = lazy(() =>
  import('./ChatBackground3D.jsx').then((m) => ({ default: m.ChatBackground3D })),
);
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';

export function MessageList({ messages, isTyping, isDark }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-messages">
      <div className="chat-messages__bg" aria-hidden="true">
        <p className="chat-messages__generation">ГЕНЕРАЦИЯ</p>
        <Suspense fallback={null}>
          <ChatBackground3D isDark={isDark} />
        </Suspense>
      </div>
      <div
        className="chat-messages__scroll"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} className="chat-messages__anchor" />
      </div>
    </div>
  );
}
