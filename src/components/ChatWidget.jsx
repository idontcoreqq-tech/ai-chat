import { useChat } from '../hooks/useChat.js';
import { useTheme } from '../hooks/useTheme.js';
import '../styles/chat.css';
import { ChatHeader } from './ChatHeader.jsx';
import { ChatInput } from './ChatInput.jsx';
import { ChatLauncher } from './ChatLauncher.jsx';
import { MessageList } from './MessageList.jsx';

export function ChatWidget() {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    isOpen,
    messages,
    isTyping,
    hasUnread,
    launcherClicked,
    openLauncher,
    closeChat,
    sendUserMessage,
  } = useChat();

  return (
    <div className="chat-widget" data-theme={theme}>
      {isOpen ? (
        <div className="chat-panel chat-panel--open" role="dialog" aria-label="Чат с поддержкой">
          <ChatHeader
            onMinimize={closeChat}
            onClose={closeChat}
            onToggleTheme={toggleTheme}
            isDark={isDark}
          />
          <MessageList messages={messages} isTyping={isTyping} isDark={isDark} />
          <ChatInput
            onSend={sendUserMessage}
            disabled={isTyping}
            autoFocus={isOpen}
          />
        </div>
      ) : (
        <ChatLauncher
          onClick={openLauncher}
          hasUnread={hasUnread}
          showRippleHint={!launcherClicked}
        />
      )}
    </div>
  );
}
