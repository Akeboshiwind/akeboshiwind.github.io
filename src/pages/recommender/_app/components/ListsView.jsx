import React, { useState, useRef, useEffect } from 'react';
import { getPhase, getPhaseLabel, getPendingCount, getReviewedCount } from '../utils.js';

const PHASE_COLORS = {
  exploring: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  refining: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  honing: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

const ListCard = ({ list, onClick }) => {
  const phase = getPhase(list);
  const pending = getPendingCount(list);
  const reviewed = getReviewedCount(list);

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {list.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
            {list.description}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${PHASE_COLORS[phase]}`}
          >
            {getPhaseLabel(phase)}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
        {pending > 0 && (
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            {pending} pending
          </span>
        )}
        {reviewed > 0 && (
          <span>{reviewed} reviewed</span>
        )}
        {pending === 0 && reviewed === 0 && (
          <span>No recommendations yet</span>
        )}
      </div>
    </button>
  );
};

const SettingsMenu = ({ onChangeApiKey, onOpenImportExport }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const choose = fn => { setOpen(false); fn(); };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-10">
          <button
            onClick={() => choose(onChangeApiKey)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            API Key
          </button>
          <button
            onClick={() => choose(onOpenImportExport)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Import / Export
          </button>
        </div>
      )}
    </div>
  );
};

export const ListsView = ({ lists, onSelectList, onCreateList, onChangeApiKey, onOpenImportExport, historyUrl }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-3 text-sm text-gray-400 mb-4">
          <a
            href="../"
            className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Home
          </a>
          {historyUrl && (
            <a
              href={historyUrl}
              target="_blank"
              rel="noopener"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              history
            </a>
          )}
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recommender</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateList}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + New List
            </button>
            <SettingsMenu onChangeApiKey={onChangeApiKey} onOpenImportExport={onOpenImportExport} />
          </div>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No lists yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Create a list to start getting personalised recommendations.
            </p>
            <button
              onClick={onCreateList}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Create your first list
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map(list => (
              <ListCard key={list.id} list={list} onClick={() => onSelectList(list.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
