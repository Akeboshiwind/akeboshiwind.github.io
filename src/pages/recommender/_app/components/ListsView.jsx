import React from 'react';
import { getPhase, getPhaseLabel, getPendingCount, getReviewedCount } from '../utils.js';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';
import settingsSvg from 'pixelarticons/svg/sliders.svg?raw';
import clipboardSvg from 'pixelarticons/svg/clipboard-note.svg?raw';
import { PageTitle } from './PageTitle.jsx';
import { Menu } from '../../../../components/pixel/Menu.jsx';

const ListCard = ({ list, onClick }) => {
  const phase = getPhase(list);
  const pending = getPendingCount(list);
  const reviewed = getReviewedCount(list);

  return (
    <li>
      <button
        onClick={onClick}
        className="pixel-panel group w-full text-left p-3 sm:p-4 cursor-pointer hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-heading font-semibold truncate group-hover:text-accent">{list.name}</h3>
            <p className="text-sm opacity-80 mt-0.5 line-clamp-2">{list.description}</p>
          </div>
          <span className="pixel-chip shrink-0">{getPhaseLabel(phase)}</span>
        </div>
        <div className="label opacity-70 mt-3 flex items-center gap-3">
          {pending > 0 && (
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-2 h-2 bg-accent" />
              {pending} pending
            </span>
          )}
          {reviewed > 0 && <span>{reviewed} reviewed</span>}
          {pending === 0 && reviewed === 0 && <span>No recommendations yet</span>}
        </div>
      </button>
    </li>
  );
};

export const ListsView = ({ lists, onSelectList, onCreateList, onChangeApiKey, onOpenImportExport }) => (
  <div className="text-text">
    <PageTitle
      action={
        <Menu
          label="Settings"
          icon={settingsSvg}
          triggerClassName="h-9"
          items={[{ label: 'API Key', onSelect: onChangeApiKey }, { label: 'Import / Export', onSelect: onOpenImportExport }]}
        />
      }
    />

    {lists.length === 0 ? (
      <div className="pixel-panel flex flex-col items-center text-center px-4 py-12">
        <Icon svg={clipboardSvg} className="w-10 h-10 text-accent mb-4" />
        <h2 className="font-pixel text-pixel-md text-heading mb-2">No lists yet</h2>
        <p className="text-sm opacity-80 mb-6">
          Create a list to start getting personalised recommendations.
        </p>
        <button onClick={onCreateList} className="pixel-button py-2 px-4" data-variant="primary">
          Create your first list
        </button>
      </div>
    ) : (
      <section>
        <SectionLabel
          className="mb-3"
          action={
            <button onClick={onCreateList} className="pixel-button" data-variant="primary">
              + New List
            </button>
          }
        >
          Lists
        </SectionLabel>
        <ul className="flex flex-col gap-3">
          {lists.map(list => (
            <ListCard key={list.id} list={list} onClick={() => onSelectList(list.id)} />
          ))}
        </ul>
      </section>
    )}
  </div>
);
