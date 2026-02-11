# Plan: Tax & Service Charge for Bill Splitter

## Overview

Add tax and service charge support to the bill splitter. Both are proportionally distributed across people based on their share of the item subtotal. Both are editable fields in the UI, placed between the items table and the summary. The summary becomes expandable to show the breakdown per person.

## New State

Add new state variables:

```js
// Persisted to localStorage (following existing pattern)
const [tax, setTax] = useState(loadFromLocalStorage('tax', 0));
const [serviceCharge, setServiceCharge] = useState(loadFromLocalStorage('serviceCharge', 0));
const [serviceChargeMode, setServiceChargeMode] = useState(loadFromLocalStorage('serviceChargeMode', '%')); // '%' or 'fixed'

// Transient UI state (not persisted)
const [expandedSummary, setExpandedSummary] = useState({}); // { personName: true }
```

Add `useEffect` hooks for localStorage persistence for `tax`, `serviceCharge`, and `serviceChargeMode` only. Include all four in `resetData`.

## New Calculation Logic

Add these derived values / helper functions:

```js
// Item subtotal (sum of all item prices, existing billTotal)
const billSubtotal = expandedItems.reduce((sum, item) => sum + item.price, 0);

// Resolved service charge as a fixed amount
const serviceChargeAmount = serviceChargeMode === '%'
  ? billSubtotal * (serviceCharge / 100)
  : serviceCharge;

// Grand total (replaces current billTotal in summary display)
const billTotal = (billSubtotal + tax + serviceChargeAmount).toFixed(2);

// Per-person calculation with tax + service charge
const calculatePersonTotal = (person) => {
  let itemTotal = 0;
  expandedItems.forEach(item => {
    if (personShares[item.uniqueId]?.[person]) {
      itemTotal += item.price * (personShares[item.uniqueId][person] / 100);
    }
  });
  // Proportional share of tax and service charge
  const proportion = billSubtotal > 0 ? itemTotal / billSubtotal : 0;
  const personTax = tax * proportion;
  const personService = serviceChargeAmount * proportion;
  return {
    items: itemTotal,
    tax: personTax,
    service: personService,
    total: itemTotal + personTax + personService,
  };
};
```

Update `allocatedTotal` to use the new `.total` field. Update all call sites of `calculatePersonTotal` to use the object return value (currently called in the summary section and for `allocatedTotal`).

## Claude Prompt Update

Update `claudePromptText` to also extract tax and service charge:

- Add to the prompt: "Also extract any tax/VAT amount and service charge if present on the receipt."
- Update the expected JSON format to include optional fields:
  ```json
  {
    "items": [...],
    "currency": "€",
    "tax": 4.50,
    "serviceCharge": 3.00,
    "serviceChargePercent": 12.5
  }
  ```
- In the JSON parse handler (~line 274), read `data.tax`, `data.serviceCharge`, and `data.serviceChargePercent` and set state accordingly. If `serviceChargePercent` is present, use `%` mode; if `serviceCharge` (fixed) is present, use `fixed` mode.

## UI: Tax & Service Charge Section

Add a new section between the items table (line 366) and currency settings (line 368). Visually similar to the existing collapsed sections:

```
Tax & Service Charge
┌──────────────────────────────────────────────┐
│ Tax              [    0.00 ] €               │
│ Service Charge   [    0    ] [% ▾]           │
└──────────────────────────────────────────────┘
```

- **Tax**: A number input for the total tax amount. Label shows "Tax ({currency})".
- **Service Charge**: A number input plus a toggle/dropdown to switch between `%` and the bill currency symbol. When in `%` mode, show the computed amount as helper text (e.g., "= €3.54").
- Both default to 0. Styled consistently with existing input fields.
- This section is always visible (not collapsible) since it's small.

## UI: Expandable Summary

Modify the "Per Person" summary section (~lines 388-393):

**Default (collapsed) view** — show just the grand total per person:
```
Alice:  €12.34  (£10.75)
```

**Expanded view** — when a person row is clicked, show breakdown below:
```
Alice:  €12.34  (£10.75)  ▾
  Items:    €10.00  (£8.71)
  Tax:       €1.50  (£1.31)
  Service:   €0.84  (£0.73)
```

Implementation:
- Each person row gets an `onClick` that toggles `expandedSummary[person]`
- A small triangle indicator (▸/▾) shows expandability
- The breakdown rows are indented, slightly smaller text, lighter color
- Home currency conversion shown on each line (same condition as now: only when currencies differ and rate ≠ 1)
- Only show tax/service lines when they're non-zero — if both are 0, the row is not expandable (no triangle)

## UI: Bill Total in Summary

Update the "Bill Total" box (~lines 395-399):

Currently shows:
```
Total:     €59.00
Allocated: €59.00
```

Change to show subtotal + extras:
```
Subtotal:  €59.00
Tax:        €4.50
Service:    €3.00
Total:     €66.50
Allocated: €66.50
```

Tax and Service lines only shown when non-zero. The "Allocated" comparison is against the new grand total. Home currency conversions shown as before.

## Default Sample Data Update

Update the default sample data to include non-zero tax to demonstrate the feature:
- `tax: 3.54` (6% of €59)
- `serviceCharge: 0`, `serviceChargeMode: '%'`

This way the feature is visible in the defaults but service charge stays at 0 as a reasonable default.

## localStorage Keys

New keys following existing pattern:
- `billSplitter_tax`
- `billSplitter_serviceCharge`
- `billSplitter_serviceChargeMode`

(`expandedSummary` is transient UI state, not persisted.)

## Changes Summary

All changes are in a single file: `src/pages/tools/bill.astro`

1. **State**: Add 4 new state variables (3 persisted to localStorage, 1 transient) + useEffect persistence hooks
2. **Calculation**: Rewrite `calculatePersonTotal` to return breakdown object; add `billSubtotal`, `serviceChargeAmount`, update `billTotal`
3. **Claude prompt**: Add tax/service extraction instructions + update JSON parse handler
4. **Reset**: Include new state in `resetData`
5. **UI section**: New "Tax & Service Charge" section between items table and currency settings
6. **Summary**: Make per-person rows expandable with breakdown; update bill total box to show subtotal/tax/service/total
7. **Defaults**: Add sample tax to default data
