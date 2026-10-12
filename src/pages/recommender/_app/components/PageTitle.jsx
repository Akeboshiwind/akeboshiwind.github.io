import React from 'react';

export const PageTitle = ({ action }) => (
  <div className="flex items-start justify-between gap-3 mt-4 mb-8">
    <div className="min-w-0">
      <h1 className="page-title mb-2">Recommender</h1>
      <p className="page-sub mt-0">AI-powered recommendation lists that learn from your feedback.</p>
    </div>
    {action}
  </div>
);
