import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import reloadIcon from 'pixelarticons/svg/reload.svg?raw';
import slidersIcon from 'pixelarticons/svg/sliders.svg?raw';
import sunIcon from 'pixelarticons/svg/sun.svg?raw';
import partyIcon from 'pixelarticons/svg/party-popper.svg?raw';
import closeIcon from 'pixelarticons/svg/close.svg?raw';
import { Icon } from '../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { RATINGS, formatInterval, formatTimeToDue, getStats, getUpcomingCards, countLearning } from './srs.js';
import { loadProgress, saveProgress, loadSettings, saveSettings, clampMaxLearningCards, MIN_LEARNING_CARDS, MAX_LEARNING_CARDS } from './storage.js';
import { start, flip, rate, undo, refresh, reset } from './session.js';

// Departure Mono has no Devanagari glyphs; the page's <head> loads this font.
const devanagari = "font-['Noto_Sans_Devanagari',sans-serif] font-semibold";

const RATING_BORDER = ['border-danger', 'border-warn', 'border-ok', 'border-accent'];
const STATE_BORDER = { new: 'border-accent', learning: 'border-warn', review: 'border-ok' };

const Answer = ({ card }) => (
  <>
    <div lang="hi" className={`${devanagari} text-[clamp(2.5rem,10vw,4rem)] leading-none text-heading`}>{card.char}</div>
    <div className="font-pixel text-pixel-lg text-accent">{card.roman}</div>
    <div>{card.hint}</div>
  </>
);

const Flashcard = ({ card, flipped, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={flipped ? `${card.char} ${card.roman}` : `${card.char}, tap to reveal`}
    className="pixel-panel w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:border-accent text-center"
  >
    {flipped ? <Answer card={card} /> : (
      <>
        <div lang="hi" className={`${devanagari} text-[clamp(4rem,15vw,7rem)] leading-none text-heading`}>{card.char}</div>
        <div className="label opacity-70">tap to reveal</div>
      </>
    )}
  </button>
);

const EmptyState = ({ cards, settings }) => {
  const unusedNew = cards.filter((c) => c.state === 'new').length;
  const learning = countLearning(cards);
  const atLearningLimit = unusedNew > 0 && learning >= settings.maxLearningCards;
  return (
    <div className="pixel-panel flex flex-col items-center text-center gap-3 px-6 py-10">
      <Icon svg={atLearningLimit ? sunIcon : partyIcon} className="w-12 h-12 text-accent" />
      <h2 className="font-pixel text-pixel-md text-heading">{atLearningLimit ? 'Focus on learning!' : 'All caught up!'}</h2>
      <p className="opacity-70">
        {atLearningLimit
          ? `You have ${learning} cards in learning. Review them before adding more!`
          : 'No more cards to review right now.'}
      </p>
      <ul aria-label="Upcoming" className="flex flex-col items-center gap-1 mt-4">
        {getUpcomingCards(cards).map((card, i) => (
          <li key={card.char} className="flex items-baseline gap-3" style={{ opacity: 1 - i * 0.09 }}>
            <span lang="hi" className={`${devanagari} text-xl`}>{card.char}</span>
            <span className="pixel-num opacity-70">{formatTimeToDue(card)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Stat = ({ value, label, className }) => (
  <div className="pixel-panel p-3 text-center">
    <div className={`font-pixel text-pixel-lg ${className}`}>{value}</div>
    <div className="label opacity-70">{label}</div>
  </div>
);

const MaxLearningField = ({ value, onCommit }) => {
  const ref = useRef(null);
  // A native change listener, not React's onChange: the limit is committed on blur, Enter or a spinner step, not per keystroke.
  useEffect(() => {
    const input = ref.current;
    const commit = () => {
      const clamped = clampMaxLearningCards(input.value);
      input.value = clamped;
      onCommit(clamped);
    };
    input.addEventListener('change', commit);
    return () => input.removeEventListener('change', commit);
  }, [onCommit]);
  return (
    <input
      ref={ref}
      id="max-learning"
      type="number"
      min={MIN_LEARNING_CARDS}
      max={MAX_LEARNING_CARDS}
      defaultValue={value}
      className="pixel-field w-20 text-center pixel-num"
    />
  );
};

const Settings = ({ cards, settings, onSettings, onReset }) => {
  const [preview, setPreview] = useState(null);
  const stats = getStats(cards);
  return (
    <section aria-label="Statistics & Settings" className="flex flex-col gap-6">
      <div>
        <SectionLabel className="mb-3">Settings</SectionLabel>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="max-learning">Max learning cards</label>
          <MaxLearningField value={settings.maxLearningCards} onCommit={onSettings} />
        </div>
        <p className="label opacity-70 mt-2">{stats.learning} / {settings.maxLearningCards} learning cards</p>
      </div>

      <div>
        <SectionLabel className="mb-3">Progress</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <Stat value={stats.new} label="New" className="text-accent" />
          <Stat value={stats.learning} label="Learning" className="text-warn" />
          <Stat value={stats.mastered} label="Mastered" className="text-ok" />
        </div>
      </div>

      <div>
        <SectionLabel className="mb-3">All Letters</SectionLabel>
        {preview && (
          <div role="region" aria-label="Letter preview" className="pixel-panel relative flex flex-col items-center gap-3 p-6 mb-3 text-center">
            <button type="button" onClick={() => setPreview(null)} aria-label="Close preview" className="absolute top-2 right-2 p-1 hover:text-accent cursor-pointer">
              <Icon svg={closeIcon} className="w-4 h-4" />
            </button>
            <Answer card={preview} />
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2">
          {cards.map((card) => (
            <button
              key={card.char}
              type="button"
              lang="hi"
              aria-pressed={preview?.char === card.char}
              onClick={() => setPreview(preview?.char === card.char ? null : card)}
              className={`${devanagari} aspect-square flex items-center justify-center text-2xl border-2 ${STATE_BORDER[card.state]} cursor-pointer hover:bg-code-bg aria-pressed:bg-code-bg`}
            >
              {card.char}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="pixel-button w-full py-2" data-variant="danger" onClick={onReset}>Reset All Progress</button>
    </section>
  );
};

export function App() {
  const [initial] = useState(() => {
    const settings = loadSettings();
    return { settings, session: start(loadProgress(), settings) };
  });
  const [settings, setSettings] = useState(initial.settings);
  const [session, setSession] = useState(initial.session);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { cards, current, flipped, ratingsVisible, undoVisible } = session;
  const stats = getStats(cards);
  const progress = (stats.review / cards.length) * 100;

  const commit = (next) => {
    if (next.cards !== session.cards) saveProgress(next.cards);
    setSession(next);
  };

  const handleRate = (rating) => commit(rate(session, rating, settings));
  const handleUndo = () => commit(undo(session, settings));
  const handleFlip = () => setSession(flip(session));

  const handleSettings = (maxLearningCards) => {
    setSettings((prev) => {
      const next = { ...prev, maxLearningCards };
      saveSettings(next);
      return next;
    });
  };

  const handleReset = () => {
    if (confirm('Reset all progress? This cannot be undone.')) commit(reset(session, settings));
  };

  useEffect(() => {
    const onKey = (e) => {
      if (settingsOpen) return;
      if (e.code === 'Space' && !flipped) {
        e.preventDefault();
        handleFlip();
      } else if (flipped && ['1', '2', '3', '4'].includes(e.key)) {
        handleRate(Number(e.key) - 1);
      }
      if ((e.key === 'u' || e.code === 'Backspace') && session.lastAction) {
        e.preventDefault();
        handleUndo();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="page-title mb-1">Hindi Letters SRS</h1>
        <p className="page-sub">Learn the Devanagari letters with spaced repetition. Space reveals, 1–4 grades, U goes back.</p>
      </header>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="label flex gap-4" aria-label="Today">
          <span><span className="text-accent">{stats.new}</span> new</span>
          <span><span className="text-warn">{stats.learning}</span> learning</span>
          <span><span className="text-ok">{stats.due}</span> due</span>
        </p>
        <div className="flex gap-2">
          <button type="button" className="pixel-button flex items-center gap-2" onClick={() => commit(refresh(session, settings))}>
            <Icon svg={reloadIcon} className="w-4 h-4" /> Refresh
          </button>
          <button type="button" className="pixel-chip flex items-center gap-2" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((o) => !o)}>
            <Icon svg={slidersIcon} className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      <progress aria-label="Cards in review" value={progress} max={100} className="pixel-progress" />

      {settingsOpen ? (
        <Settings
          cards={cards}
          settings={settings}
          onSettings={handleSettings}
          onReset={handleReset}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-full max-w-[380px]">
            {current
              ? <Flashcard card={current} flipped={flipped} onClick={handleFlip} />
              : <EmptyState cards={cards} settings={settings} />}
          </div>

          <div
            aria-hidden={!ratingsVisible}
            inert={!ratingsVisible}
            className={`grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[380px] ${ratingsVisible ? '' : 'invisible'}`}
          >
            {current && RATINGS.map(({ rating, label }) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRate(rating)}
                className={`pixel-button ${RATING_BORDER[rating]} flex flex-col items-center gap-1 py-3`}
              >
                <span>{label}</span>
                <span className="pixel-num opacity-70">{rating === 0 ? '<1m' : formatInterval(current, rating)}</span>
              </button>
            ))}
          </div>

          <div aria-hidden={!undoVisible} inert={!undoVisible} className={undoVisible ? '' : 'invisible'}>
            <button type="button" className="pixel-button" onClick={handleUndo}>← Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
