import { useStore, todayKey, DAYS } from './store.js';
import { useHashRoute } from './hooks.js';
import { Today } from './screens/Today.jsx';
import { Planner } from './screens/Planner.jsx';
import { DayEditor } from './screens/DayEditor.jsx';
import { Pool } from './screens/Pool.jsx';
import { PoolEditor } from './screens/PoolEditor.jsx';
import { History } from './screens/History.jsx';
import { HistoryDetail } from './screens/HistoryDetail.jsx';
import { Settings } from './screens/Settings.jsx';

export function App() {
  const [state, setState] = useStore();
  const [path, navigate] = useHashRoute();
  const today = todayKey();

  const screen = renderScreen(path, { state, setState, navigate, today });
  const onToday = path === '/' || path === '';

  return (
    <div className="flex flex-col gap-4 text-text">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">Exercise</h1>
          <p className="page-sub">Plan a week of workouts, then tick them off set by set.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(onToday ? '/planner' : '/')}
          className="pixel-button shrink-0"
        >
          {onToday ? 'Plan' : 'Today'}
        </button>
      </header>

      <main>{screen}</main>
    </div>
  );
}

function renderScreen(path, ctx) {
  if (path === '/' || path === '') {
    return <Today {...ctx} />;
  }
  if (path === '/planner') {
    return <Planner {...ctx} />;
  }
  const dayMatch = /^\/planner\/(mon|tue|wed|thu|fri|sat|sun)$/.exec(path);
  if (dayMatch && DAYS.includes(dayMatch[1])) {
    return <DayEditor {...ctx} dayKey={dayMatch[1]} />;
  }
  if (path === '/pool') {
    return <Pool {...ctx} />;
  }
  const poolMatch = /^\/pool\/(.+)$/.exec(path);
  if (poolMatch) {
    return <PoolEditor {...ctx} exerciseId={decodeURIComponent(poolMatch[1])} />;
  }
  if (path === '/history') {
    return <History {...ctx} />;
  }
  const historyMatch = /^\/history\/(.+)$/.exec(path);
  if (historyMatch) {
    return <HistoryDetail {...ctx} entryId={decodeURIComponent(historyMatch[1])} />;
  }
  if (path === '/settings') {
    return <Settings {...ctx} />;
  }
  return (
    <div className="text-center py-12">
      <p className="opacity-70">Not found.</p>
      <button onClick={() => ctx.navigate('/')} className="pixel-button mt-2">
        Back to today
      </button>
    </div>
  );
}
