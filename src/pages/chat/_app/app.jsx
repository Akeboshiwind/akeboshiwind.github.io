import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';

const PREFIX = 'chat_';

export function App({ historyUrl }) {
  const [messages, setMessages] = useLocalStorage('messages', [], { prefix: PREFIX });
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
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
    <div className="flex flex-col h-dvh text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex items-center gap-3 text-sm text-gray-400">
          <a href="../" className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            ← Home
          </a>
          {historyUrl && (
            <a href={historyUrl} target="_blank" rel="noopener" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              history
            </a>
          )}
        </nav>
        <h1 className="text-base font-semibold">Chat</h1>
        <button
          onClick={clear}
          disabled={messages.length === 0}
          className="text-sm text-gray-400 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
            No messages yet. Say hello.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 max-w-2xl mx-auto">
            {messages.map(m => (
              <li key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-500 text-white px-4 py-2 whitespace-pre-wrap break-words">
                  {m.text}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(); }}
        className="flex items-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
      >
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none rounded-2xl px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="px-4 py-2 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
