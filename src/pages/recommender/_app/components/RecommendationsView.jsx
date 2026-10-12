import React from 'react';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';
import moreSvg from 'pixelarticons/svg/more-vertical.svg?raw';
import noteSvg from 'pixelarticons/svg/note.svg?raw';
import checkSvg from 'pixelarticons/svg/check-double.svg?raw';
import hourglassSvg from 'pixelarticons/svg/hourglass.svg?raw';
import { Popover } from './Popover.jsx';

const RecommendationCard = ({ rec, onSeen }) => (
  <li>
    <button
      onClick={() => onSeen(rec.id)}
      className="pixel-panel group w-full flex items-center gap-3 p-3 sm:p-4 text-left cursor-pointer hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="flex-1 min-w-0 text-heading font-medium">{rec.text}</span>
      <span className="label shrink-0 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 group-hover:text-accent">
        <Icon svg={noteSvg} className="w-4 h-4" />
        <span className="hidden sm:inline">Mark as seen</span>
      </span>
    </button>
  </li>
);

const Waiting = ({ children }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Icon svg={hourglassSvg} className="w-10 h-10 text-accent mb-4 animate-pulse" />
    <p className="label">{children}</p>
  </div>
);

export const RecommendationsView = ({
  list,
  onSeen,
  onBack,
  onOpenSettings,
  onOpenHistory,
  isGenerating,
  generateError,
  onRetryGenerate,
  onRegenerate,
}) => {
  const pending = list.recommendations.filter(r => r.status === 'pending');
  const reviewed = list.recommendations.filter(r => r.status !== 'pending');
  const isExhausted = pending.length === 0 && !isGenerating;

  return (
    <div className="text-text">
      <div className="flex items-center justify-between gap-3 mt-4 mb-6">
        <button onClick={onBack} className="pixel-button">
          ← Back
        </button>
        <Popover
          label="Menu"
          icon={moreSvg}
          items={[['Settings', onOpenSettings], ['History', onOpenHistory]]}
        />
      </div>

      <h1 className="page-title mb-2 break-words">{list.name}</h1>
      <p className="page-sub mt-0 mb-8 min-h-[1lh]">
        {reviewed.length > 0 && `${reviewed.length} seen so far`}
      </p>

      {isGenerating && (
        <Waiting>
          {reviewed.length === 0
            ? 'Generating your first recommendations...'
            : 'Generating new recommendations...'}
        </Waiting>
      )}

      {!isGenerating && generateError && (
        <div role="alert" className="pixel-panel border-danger p-4 mb-4">
          <p className="label text-danger mb-1">Failed to generate recommendations</p>
          <p className="text-sm text-danger mb-3 break-words">{generateError}</p>
          <button onClick={onRetryGenerate} className="pixel-button" data-variant="danger">
            Try again
          </button>
        </div>
      )}

      {isExhausted && !generateError && reviewed.length > 0 && pending.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Icon svg={checkSvg} className="w-10 h-10 text-ok mb-4" />
          <p className="font-pixel text-pixel-md text-heading mb-1">All reviewed!</p>
          <p className="text-sm opacity-80 mb-6">New recommendations will be generated shortly.</p>
        </div>
      )}

      {!isGenerating && pending.length > 0 && (
        <section>
          <SectionLabel className="mb-3">Up next</SectionLabel>
          <ul className="flex flex-col gap-3">
            {pending.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} onSeen={onSeen} />
            ))}
          </ul>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="pixel-button w-full py-2 mt-4"
          >
            Regenerate
          </button>
        </section>
      )}

      {!isGenerating && !generateError && pending.length === 0 && reviewed.length === 0 && (
        <Waiting>Generating recommendations...</Waiting>
      )}
    </div>
  );
};
