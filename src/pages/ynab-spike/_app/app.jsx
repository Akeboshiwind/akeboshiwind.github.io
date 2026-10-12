import React from 'react';
import { createRoot } from 'react-dom/client';
import { MainView } from '../../ynab-reimbursement/_app/components/MainView.jsx';
import { props } from './fixture.js';

createRoot(document.getElementById('app')).render(<MainView {...props} />);
