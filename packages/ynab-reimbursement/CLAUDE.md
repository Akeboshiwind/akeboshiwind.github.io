# YNAB Reimbursement Report

Tool for calculating reimbursements between two people sharing a YNAB budget.

## Commands

```bash
bb dev         # Dev server with watch mode
bb build       # Build for local testing
bb build:ci    # Build with base path for deployment
bb test        # Run tests
bb clean       # Clean build artifacts
```

## Structure

```
src/
  app.jsx          # Main React application
  app.css          # Tailwind CSS entry
  index.html       # HTML shell
  ynab.js          # YNAB API wrapper
  calculations.js  # Reimbursement calculation logic
  calculations.test.js  # Unit tests
```

## Deployment

After building with `bb build:ci`, copy `target/public/*` to `static/tools/ynab-reimbursement/`.

## Tech Stack

- React 18
- Tailwind CSS 4
- Bun (bundler + test runner)
- Babashka (task runner)
