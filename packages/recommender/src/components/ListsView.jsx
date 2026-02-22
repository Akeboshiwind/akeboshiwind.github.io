import React from 'react';
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

export const ListsView = ({ lists, onSelectList, onCreateList, onChangeApiKey }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recommender</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onChangeApiKey}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1 rounded"
              title="Change API key"
            >
              API Key
            </button>
            <button
              onClick={onCreateList}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + New List
            </button>
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
