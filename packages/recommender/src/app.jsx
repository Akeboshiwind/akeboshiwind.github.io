import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from './hooks.js';
import { generateRecommendations } from './api.js';
import { generateId, getPendingCount } from './utils.js';
import { ApiKeyView } from './components/ApiKeyView.jsx';
import { ListsView } from './components/ListsView.jsx';
import { CreateListModal } from './components/CreateListModal.jsx';
import { RecommendationsView } from './components/RecommendationsView.jsx';
import { FeedbackModal } from './components/FeedbackModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';
import { HistoryModal } from './components/HistoryModal.jsx';
import './app.css';

const App = () => {
  const [apiKey, setApiKey] = useLocalStorage('recommender_apiKey', '');
  const [lists, setLists] = useLocalStorage('recommender_lists', []);

  // Navigation
  const [view, setView] = useState('lists'); // 'lists' | 'recommendations'
  const [activeListId, setActiveListId] = useState(null);

  // Modals
  const [showCreateList, setShowCreateList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState(null); // { recId, reaction }

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  const activeList = lists.find(l => l.id === activeListId) || null;
  const pendingCount = activeList ? getPendingCount(activeList) : -1;

  const runGenerate = useCallback(
    async list => {
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
            return {
              ...l,
              recommendations: [
                ...l.recommendations,
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

  const handleReact = (recId, reaction) => {
    setPendingFeedback({ recId, reaction });
  };

  const handleFeedbackSubmit = feedback => {
    if (!pendingFeedback || !activeListId) return;
    const { recId, reaction } = pendingFeedback;

    setLists(prev =>
      prev.map(list => {
        if (list.id !== activeListId) return list;
        return {
          ...list,
          recommendations: list.recommendations.map(r => {
            if (r.id !== recId) return r;
            return { ...r, status: reaction, feedback, reviewedAt: Date.now() };
          }),
        };
      }),
    );

    setPendingFeedback(null);
    // Auto-generation is triggered by the pendingCount → 0 useEffect
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
        />
      )}

      {view === 'recommendations' && activeList && (
        <RecommendationsView
          list={activeList}
          onReact={handleReact}
          onBack={() => {
            setView('lists');
            setGenerateError(null);
          }}
          onOpenSettings={() => setShowSettings(true)}
          isGenerating={isGenerating}
          generateError={generateError}
          onRetryGenerate={() => {
            setGenerateError(null);
            runGenerate(activeList);
          }}
        />
      )}

      {/* Modals */}
      {showCreateList && (
        <CreateListModal
          onCreate={handleCreateList}
          onClose={() => setShowCreateList(false)}
        />
      )}

      {pendingFeedback && activeList && (
        <FeedbackModal
          recommendation={
            activeList.recommendations.find(r => r.id === pendingFeedback.recId)?.text || ''
          }
          reaction={pendingFeedback.reaction}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setPendingFeedback(null)}
        />
      )}

      {showSettings && activeList && (
        <SettingsModal
          list={activeList}
          onSave={handleSaveSettings}
          onViewHistory={() => {
            setShowSettings(false);
            setShowHistory(true);
          }}
          onDelete={handleDeleteList}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showHistory && activeList && (
        <HistoryModal list={activeList} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
