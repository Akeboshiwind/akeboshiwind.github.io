import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { generateRecommendations } from './api.js';
import { generateId, getPendingCount } from './utils.js';
import { ApiKeyView } from './components/ApiKeyView.jsx';
import { ListsView } from './components/ListsView.jsx';
import { CreateListModal } from './components/CreateListModal.jsx';
import { RecommendationsView } from './components/RecommendationsView.jsx';
import { SeenModal } from './components/SeenModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { HistoryModal } from './components/HistoryModal.jsx';
import { ImportExportModal } from './components/ImportExportModal.jsx';

const App = () => {
  const [apiKey, setApiKey] = useLocalStorage('anthropic_apiKey', '');
  const [lists, setLists] = useLocalStorage('recommender_lists', []);

  // Navigation
  const [view, setView] = useState('lists'); // 'lists' | 'recommendations'
  const [activeListId, setActiveListId] = useState(null);

  // Modals
  const [showCreateList, setShowCreateList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [pendingSeen, setPendingSeen] = useState(null); // recId

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  const activeList = lists.find(l => l.id === activeListId) || null;
  const pendingCount = activeList ? getPendingCount(activeList) : -1;

  const runGenerate = useCallback(
    async (list, replace = false) => {
      if (!list || isGenerating) return;
      setIsGenerating(true);
      setGenerateError(null);

      try {
        const newTexts = await generateRecommendations(apiKey, list);
        const existingRounds = list.recommendations.map(r => r.round);
        const nextRound = existingRounds.length > 0 ? Math.max(...existingRounds) + 1 : 1;

        setLists(prev =>
          prev.map(l => {
            if (l.id !== list.id) return l;
            const kept = replace
              ? l.recommendations.filter(r => r.status !== 'pending')
              : l.recommendations;
            return {
              ...l,
              recommendations: [
                ...kept,
                ...newTexts.map(text => ({
                  id: generateId(),
                  text,
                  status: 'pending',
                  feedback: '',
                  round: nextRound,
                  generatedAt: Date.now(),
                  reviewedAt: null,
                })),
              ],
            };
          }),
        );
      } catch (err) {
        setGenerateError(err.message);
      } finally {
        setIsGenerating(false);
      }
    },
    [apiKey, isGenerating, setLists],
  );

  // Auto-generate when no pending recommendations
  useEffect(() => {
    if (view !== 'recommendations' || !activeList) return;
    if (pendingCount !== 0) return;
    if (isGenerating || generateError) return;
    runGenerate(activeList);
  }, [view, activeListId, pendingCount, isGenerating, generateError]); // runGenerate omitted intentionally

  const handleSelectList = listId => {
    setActiveListId(listId);
    setGenerateError(null);
    setView('recommendations');
  };

  const handleCreateList = ({ name, description }) => {
    const newList = {
      id: generateId(),
      name,
      description,
      createdAt: Date.now(),
      recommendations: [],
    };
    setLists(prev => [newList, ...prev]);
    setShowCreateList(false);
    // Navigate to the new list (triggers generation via useEffect)
    setActiveListId(newList.id);
    setGenerateError(null);
    setView('recommendations');
  };

  const handleSeen = recId => {
    setPendingSeen(recId);
  };

  const handleConfirmSeen = note => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.map(r => {
            if (r.id !== pendingSeen) return r;
            return { ...r, status: 'seen', note: note || '', reviewedAt: Date.now() };
          }),
        };
      }),
    );
    setPendingSeen(null);
  };

  const handleAddCustom = (text, note) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: [
            ...list.recommendations,
            { id: generateId(), text, status: 'seen', note, round: null, generatedAt: null, reviewedAt: Date.now() },
          ],
        };
      }),
    );
  };

  const handleUpdateNote = (recId, note) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.map(r =>
            r.id === recId ? { ...r, note } : r,
          ),
        };
      }),
    );
  };

  const handleUpdateName = (recId, text) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.map(r =>
            r.id === recId ? { ...r, text } : r,
          ),
        };
      }),
    );
  };

  const handleDeleteRecommendation = recId => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.filter(r => r.id !== recId),
        };
      }),
    );
  };

  const handleReviewFromHistory = (recId, note) => {
    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.map(r => {
            if (r.id !== recId) return r;
            return { ...r, status: 'seen', note: note || '', reviewedAt: Date.now() };
          }),
        };
      }),
    );
  };

  const handleSaveSettings = updates => {
    setLists(prev => prev.map(l => (l.id === activeListId ? { ...l, ...updates } : l)));
    setShowSettings(false);
  };

  const handleDeleteList = () => {
    setLists(prev => prev.filter(l => l.id !== activeListId));
    setShowSettings(false);
    setActiveListId(null);
    setView('lists');
  };

  const handleImport = data => {
    setLists(data);
  };

  // Show API key screen if no key set
  if (!apiKey) {
    return <ApiKeyView onSave={setApiKey} />;
  }

  return (
    <>
      {view === 'lists' && (
        <ListsView
          lists={lists}
          onSelectList={handleSelectList}
          onCreateList={() => setShowCreateList(true)}
          onChangeApiKey={() => setApiKey('')}
          onOpenImportExport={() => setShowImportExport(true)}
        />
      )}

      {view === 'recommendations' && activeList && (
        <RecommendationsView
          list={activeList}
          onSeen={handleSeen}
          onBack={() => {
            setView('lists');
            setGenerateError(null);
          }}
          onOpenSettings={() => setShowSettings(true)}
          onOpenHistory={() => setShowHistory(true)}
          isGenerating={isGenerating}
          generateError={generateError}
          onRetryGenerate={() => {
            setGenerateError(null);
            runGenerate(activeList);
          }}
          onRegenerate={() => {
            setGenerateError(null);
            runGenerate(activeList, true);
          }}
        />
      )}

      {/* Modals */}
      {pendingSeen && activeList && (
        <SeenModal
          recommendation={activeList.recommendations.find(r => r.id === pendingSeen)?.text || ''}
          onSubmit={handleConfirmSeen}
          onClose={() => setPendingSeen(null)}
        />
      )}

      {showCreateList && (
        <CreateListModal
          onCreate={handleCreateList}
          onClose={() => setShowCreateList(false)}
        />
      )}

      {showSettings && activeList && (
        <SettingsModal
          list={activeList}
          onSave={handleSaveSettings}
          onDelete={handleDeleteList}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showHistory && activeList && (
        <HistoryModal
          list={activeList}
          onClose={() => setShowHistory(false)}
          onUpdateNote={handleUpdateNote}
          onUpdateName={handleUpdateName}
          onDelete={handleDeleteRecommendation}
          onReview={handleReviewFromHistory}
          onAddCustom={handleAddCustom}
        />
      )}

      {showImportExport && (
        <ImportExportModal
          lists={lists}
          onImport={handleImport}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
