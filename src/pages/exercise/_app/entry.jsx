import { createRoot } from 'react-dom/client';
import { App } from './app.jsx';

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
