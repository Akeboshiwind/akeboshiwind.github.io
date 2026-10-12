import React from 'react';

export const PageHeader = ({ action }) => (
  <div className="flex justify-between items-start gap-4">
    <div>
      <h1 className="page-title mt-4 mb-2">YNAB Reimbursement Report</h1>
      <p className="page-sub m-0">Who owes whom for a month of shared spending.</p>
    </div>
    {action}
  </div>
);
