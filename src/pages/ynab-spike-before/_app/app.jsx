import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainView } from './MainView.before.jsx';
import { props } from '../../ynab-spike/_app/fixture.js';

createRoot(document.getElementById('app')).render(<div className="p-4"><MainView {...props} /></div>);
