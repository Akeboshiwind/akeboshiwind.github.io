import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import sendIcon from 'pixelarticons/svg/send.svg?raw';
import trashIcon from 'pixelarticons/svg/trash.svg?raw';

const PREFIX = 'chat_';

export function App() {
  const [messages, setMessages] = useLocalStorage('messages', [], { prefix: PREFIX });
  const [draft, setDraft] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) window.scrollTo?.(0, document.documentElement.scrollHeight);
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now() + '_' + Math.random().toString(36).slice(2), text, at: Date.now() }]);
    setDraft('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clear = () => setMessages([]);

  return (
    <div className="flex flex-col flex-1">
      <h1 className="page-title mt-4 mb-2">Chat</h1>
      <p className="page-sub mt-0 mb-8">Type in the box at the bottom and watch messages stack above.</p>

      <SectionLabel
        className="mb-3"
        action={
          <button onClick={clear} disabled={messages.length === 0} className="pixel-button inline-flex items-center gap-1" data-variant="danger">
            <Icon svg={trashIcon} className="w-3 h-3" />
            Clear
          </button>
        }
      >
        Messages
      </SectionLabel>

      <div className="flex-1 py-2">
        {messages.length === 0 ? (
          <p className="label text-center mt-8 opacity-70">
            No messages yet. Say hello.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {messages.map(m => (
              <li key={m.id} className="flex justify-end">
                <div className="max-w-[80%] bg-accent text-bg px-3 py-2 whitespace-pre-wrap break-words">
                  {m.text}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="sticky bottom-0 flex items-stretch gap-2 -mx-4 px-4 py-3 bg-bg border-t-2 border-border"
      >
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          aria-label="Message"
          rows={1}
          className="pixel-field flex-1 min-w-0 resize-none max-h-40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="pixel-button inline-flex items-center gap-1"
          data-variant="primary"
        >
          <Icon svg={sendIcon} className="w-3 h-3" />
          Send
        </button>
      </form>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
