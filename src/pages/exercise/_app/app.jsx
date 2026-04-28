import { ThemeToggle } from '../../../components/ThemeToggle.jsx';
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

export function App({ historyUrl }) {
  const [state, setState] = useStore();
  const [path, navigate] = useHashRoute();
  const today = todayKey();

  const screen = renderScreen(path, { state, setState, navigate, today });

  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
      <nav className="flex items-center gap-3 text-sm text-gray-400 px-4 py-3">
        <a href="../" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Home</a>
        {historyUrl && (
          <a href={historyUrl} target="_blank" rel="noopener" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">history</a>
        )}
        {path !== '/' && (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Today
          </button>
        )}
        {path === '/' && (
          <button
            type="button"
            onClick={() => navigate('/planner')}
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Plan
          </button>
        )}
        <ThemeToggle className="ml-auto" />
      </nav>

      <main className="flex-1 px-4 pb-32 max-w-xl mx-auto w-full">
        {screen}
      </main>
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
      <p className="text-gray-500 dark:text-gray-400">Not found.</p>
      <button onClick={() => ctx.navigate('/')} className="mt-2 text-sm underline">
        Back to today
      </button>
    </div>
  );
}
