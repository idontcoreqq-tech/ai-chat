import { LauncherAvatarIcon } from './LauncherAvatarIcon.jsx';

export function ChatLauncher({ onClick, hasUnread, showRippleHint }) {
  return (
    <div className="chat-launcher-wrap">
      {showRippleHint && (
        <>
          <span className="chat-launcher__ripple" aria-hidden="true" />
          <span className="chat-launcher__ripple chat-launcher__ripple--delay" aria-hidden="true" />
        </>
      )}
      <button
        type="button"
        className="chat-launcher"
        onClick={onClick}
        aria-label="Открыть чат"
        aria-expanded={false}
      >
        <LauncherAvatarIcon className="chat-launcher__avatar" />
        {hasUnread && (
          <span className="chat-launcher__badge" aria-label="Новое сообщение">
            1
          </span>
        )}
      </button>
    </div>
  );
}
