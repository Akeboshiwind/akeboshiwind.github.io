import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const field = 'bg-transparent border border-border px-2 py-1 text-heading outline-none focus:border-accent';
const amount = 'font-pixel text-pixel-md tabular-nums';
const button = 'label px-3 py-1.5 border cursor-pointer whitespace-nowrap';
const primaryButton = `${button} border-accent bg-accent text-bg hover:bg-transparent hover:text-accent`;
const dangerButton = `${button} border-red-600 text-red-600 hover:bg-red-600 hover:text-bg dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400`;
const errorText = 'text-red-600 dark:text-red-400';
const chip = 'label px-2 py-1 border min-h-[36px] sm:min-h-0';
const chipOn = 'border-accent bg-accent text-bg cursor-pointer';
const chipOff = 'border-border text-text hover:border-accent hover:text-accent cursor-pointer';

const Section = ({ title, action, children }) => (
  <section className="mb-10">
    <h2 className="label flex items-center gap-3 text-heading mb-3">
      <span className="shrink-0">{title}</span>
      <span data-dither="fade-x" className="flex-1 h-[6px]" aria-hidden="true" />
      {action}
    </h2>
    {children}
  </section>
);

const Disclosure = ({ open, onClick }) => (
  <button onClick={onClick} aria-expanded={open} className="label text-link hover:text-accent cursor-pointer shrink-0">
    {open ? '▼ Hide' : '▶ Show'}
  </button>
);

const Component = () => {
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const savedData = localStorage.getItem(`billSplitter_${key}`);
      if (key === 'currency' || key === 'homeCurrency') return savedData || defaultValue;
      if (key === 'exchangeRate') return savedData ? parseFloat(savedData) : defaultValue;
      return savedData ? JSON.parse(savedData) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const defaultItems = [
    { name: 'Salade César', price: 12.00, quantity: 1, translation: 'Caesar Salad' },
    { name: 'Café', price: 5.00, quantity: 2, translation: 'Coffee' },
    { name: 'Hamburger', price: 16.00, quantity: 1, translation: 'Hamburger' },
    { name: 'Pâtes', price: 14.00, quantity: 1, translation: 'Pasta' },
    { name: 'Eau Pétillante', price: 4.00, quantity: 1, translation: 'Sparkling Water' },
    { name: 'Pain à l\'Ail', price: 8.00, quantity: 1, translation: 'Garlic Bread' },
  ].map((item, index) => ({ ...item, id: index + 1 }));

  const defaultPeople = ['Alice', 'Bob', 'Charlie'];

  // Default assignments: Alice (salad, coffee), Bob (burger, coffee), Charlie (pasta, water), shared (garlic bread)
  const defaultAssignments = {
    '1-0': ['Alice'],           // Caesar Salad
    '2-0': ['Alice'],           // Coffee 1
    '2-1': ['Bob'],             // Coffee 2
    '3-0': ['Bob'],             // Burger
    '4-0': ['Charlie'],         // Pasta
    '5-0': ['Charlie'],         // Sparkling Water
    '6-0': ['Alice', 'Bob', 'Charlie'], // Garlic Bread (shared)
  };

  const defaultShares = {
    '1-0': { 'Alice': 100 },
    '2-0': { 'Alice': 100 },
    '2-1': { 'Bob': 100 },
    '3-0': { 'Bob': 100 },
    '4-0': { 'Charlie': 100 },
    '5-0': { 'Charlie': 100 },
    '6-0': { 'Alice': 33.33, 'Bob': 33.33, 'Charlie': 33.34 },
  };

  const [people, setPeople] = useState(loadFromLocalStorage('people', defaultPeople));
  const [personShares, setPersonShares] = useState(loadFromLocalStorage('personShares', defaultShares));
  const [itemAssignments, setItemAssignments] = useState(loadFromLocalStorage('itemAssignments', defaultAssignments));
  const [items, setItems] = useState(loadFromLocalStorage('items', defaultItems));
  const [expandedRows, setExpandedRows] = useState(loadFromLocalStorage('expandedRows', {}));
  const [processingError, setProcessingError] = useState(null);
  const [currency, setCurrency] = useState(loadFromLocalStorage('currency', '$'));
  const [homeCurrency, setHomeCurrency] = useState(loadFromLocalStorage('homeCurrency', '$'));
  const [exchangeRate, setExchangeRate] = useState(loadFromLocalStorage('exchangeRate', 1));
  const [showCurrencySettings, setShowCurrencySettings] = useState(loadFromLocalStorage('showCurrencySettings', false));
  const [showPeopleSettings, setShowPeopleSettings] = useState(loadFromLocalStorage('showPeopleSettings', false));
  const [tax, setTax] = useState(loadFromLocalStorage('tax', 0));
  const [serviceCharge, setServiceCharge] = useState(loadFromLocalStorage('serviceCharge', 0));
  const [serviceChargeMode, setServiceChargeMode] = useState(loadFromLocalStorage('serviceChargeMode', '%'));
  const [expandedSummary, setExpandedSummary] = useState({});
  const [showTaxSettings, setShowTaxSettings] = useState(false);

  const claudePromptText = `This is an image of a receipt. Extract all the items with their name, price, quantity, and an English translation of the item name. Also identify the currency used in the receipt (£, $, €, etc.). If the receipt shows a tax/VAT amount or a service charge, extract those too.

Format the output as a JSON object with these fields:
1. "items": An array of items, each with name (as it appears on the receipt), price (as a unit price, not the line total — e.g. if the receipt shows 2 x 2.80€, the price is 2.80, not 5.60), quantity (as a number), and translation (English translation of the item name)
2. "currency": The currency symbol used in the receipt (£, $, €, etc.)
3. "tax": (optional) The total tax/VAT amount as a number, if shown on the receipt
4. "serviceCharge": (optional) The service charge as a fixed amount, if shown on the receipt
5. "serviceChargePercent": (optional) The service charge as a percentage, if shown on the receipt (prefer this over serviceCharge if both are available)

If this is not a receipt, simply respond with: "Not a receipt"

Here's an example of the expected format with sample data:
{
  "items": ${JSON.stringify(defaultItems.map(({id, ...item}) => item))},
  "currency": "€",
  "tax": 3.54
}`;

  useEffect(() => { localStorage.setItem('billSplitter_people', JSON.stringify(people)); }, [people]);
  useEffect(() => { localStorage.setItem('billSplitter_personShares', JSON.stringify(personShares)); }, [personShares]);
  useEffect(() => {
    localStorage.setItem('billSplitter_itemAssignments', JSON.stringify(itemAssignments));
    setExpandedRows(prev => {
      const newState = { ...prev };
      let hasChanges = false;
      Object.keys(newState).forEach(itemId => {
        if (!canItemBeSplit(itemId)) { delete newState[itemId]; hasChanges = true; }
      });
      return hasChanges ? newState : prev;
    });
  }, [itemAssignments]);
  useEffect(() => { localStorage.setItem('billSplitter_items', JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem('billSplitter_expandedRows', JSON.stringify(expandedRows)); }, [expandedRows]);
  useEffect(() => { localStorage.setItem('billSplitter_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('billSplitter_homeCurrency', homeCurrency); }, [homeCurrency]);
  useEffect(() => { localStorage.setItem('billSplitter_exchangeRate', exchangeRate.toString()); }, [exchangeRate]);
  useEffect(() => { localStorage.setItem('billSplitter_showCurrencySettings', JSON.stringify(showCurrencySettings)); }, [showCurrencySettings]);
  useEffect(() => { localStorage.setItem('billSplitter_showPeopleSettings', JSON.stringify(showPeopleSettings)); }, [showPeopleSettings]);
  useEffect(() => { localStorage.setItem('billSplitter_tax', JSON.stringify(tax)); }, [tax]);
  useEffect(() => { localStorage.setItem('billSplitter_serviceCharge', JSON.stringify(serviceCharge)); }, [serviceCharge]);
  useEffect(() => { localStorage.setItem('billSplitter_serviceChargeMode', JSON.stringify(serviceChargeMode)); }, [serviceChargeMode]);


  const expandedItems = items.flatMap(item =>
    Array(item.quantity).fill().map((_, i) => ({
      ...item, uniqueId: `${item.id}-${i}`, originalQuantity: item.quantity, quantity: 1
    }))
  );

  const createEqualSplit = (people) => {
    const sharePerPerson = Math.floor((100 / people.length) * 100) / 100;
    const shares = {};
    people.forEach(p => { shares[p] = 0; });
    let totalAllocated = 0;
    people.forEach((person, index) => {
      if (index === people.length - 1) { shares[person] = 100 - totalAllocated; }
      else { shares[person] = sharePerPerson; totalAllocated += sharePerPerson; }
    });
    return shares;
  };

  const updateSharesFromAssignments = (assignments) => {
    const newShares = {};
    Object.entries(assignments).forEach(([itemUniqueId, assignedPeople]) => {
      if (assignedPeople.length > 0) newShares[itemUniqueId] = createEqualSplit(assignedPeople);
    });
    setPersonShares(newShares);
  };

  const toggleAllPeople = (itemUniqueId) => {
    setItemAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssignees = newAssignments[itemUniqueId] || [];
      if (currentAssignees.length === people.length) {
        delete newAssignments[itemUniqueId];
      } else {
        newAssignments[itemUniqueId] = [...people];
      }
      updateSharesFromAssignments(newAssignments);
      return newAssignments;
    });
  };

  const togglePersonAssignment = (itemUniqueId, person) => {
    setItemAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssignees = newAssignments[itemUniqueId] || [];
      if (currentAssignees.includes(person)) {
        newAssignments[itemUniqueId] = currentAssignees.filter(p => p !== person);
        if (newAssignments[itemUniqueId].length === 0) delete newAssignments[itemUniqueId];
      } else {
        newAssignments[itemUniqueId] = [...currentAssignees, person];
      }
      updateSharesFromAssignments(newAssignments);
      return newAssignments;
    });
  };

  const handleShareChange = (itemUniqueId, person, share) => {
    const shareValue = parseInt(share, 10) || 0;
    setPersonShares(prev => {
      const updated = { ...prev };
      if (!updated[itemUniqueId]) updated[itemUniqueId] = {};
      updated[itemUniqueId][person] = shareValue;
      return updated;
    });
  };

  const getTotalPercentForItem = (itemUniqueId) => {
    if (!personShares[itemUniqueId]) return 0;
    const total = Object.values(personShares[itemUniqueId]).reduce((sum, share) => sum + share, 0);
    if (Math.abs(total - 100) < 0.1) return 100;
    return Math.round(total * 100) / 100;
  };

  const convertToHomeCurrency = (amount) => {
    if (currency === homeCurrency || exchangeRate === 1) return amount;
    return amount * exchangeRate;
  };

  const billSubtotal = expandedItems.reduce((sum, item) => sum + item.price, 0);
  const serviceChargeAmount = serviceChargeMode === '%'
    ? billSubtotal * (serviceCharge / 100)
    : serviceCharge;

  const calculatePersonTotal = (person) => {
    let itemTotal = 0;
    expandedItems.forEach(item => {
      if (personShares[item.uniqueId] && personShares[item.uniqueId][person]) {
        itemTotal += (item.price * (personShares[item.uniqueId][person] / 100));
      }
    });
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

  const updateItemName = (id, newName) => setItems(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  const updateItemPrice = (id, newPrice) => setItems(prev => prev.map(item => item.id === id ? { ...item, price: parseFloat(newPrice) || 0 } : item));

  const billTotal = (billSubtotal + tax + serviceChargeAmount).toFixed(2);
  const allocatedTotal = people.reduce((sum, person) => sum + calculatePersonTotal(person).total, 0).toFixed(2);
  const canItemBeSplit = (itemUniqueId) => (itemAssignments[itemUniqueId]?.length ?? 0) >= 2;

  const toggleExpandedRow = (itemUniqueId) => {
    if (!canItemBeSplit(itemUniqueId)) return;
    setExpandedRows(prev => {
      const newState = { ...prev };
      if (newState[itemUniqueId]) delete newState[itemUniqueId];
      else newState[itemUniqueId] = true;
      return newState;
    });
  };

  const resetData = () => {
    ['people','personShares','itemAssignments','items','expandedRows','currency','homeCurrency','exchangeRate','showCurrencySettings','showPeopleSettings','tax','serviceCharge','serviceChargeMode']
      .forEach(k => localStorage.removeItem(`billSplitter_${k}`));
    setPeople(defaultPeople); setPersonShares(defaultShares); setItemAssignments(defaultAssignments); setItems(defaultItems);
    setExpandedRows({}); setProcessingError(null); setCurrency('$'); setHomeCurrency('$');
    setExchangeRate(1); setShowCurrencySettings(false); setShowPeopleSettings(false);
    setTax(0); setServiceCharge(0); setServiceChargeMode('%'); setExpandedSummary({});
  };

  const showHome = currency !== homeCurrency && exchangeRate !== 1;
  const money = (amount) => `${currency}${amount.toFixed(2)}`;
  const home = (amount) => showHome && <span className="text-text opacity-60 ml-1">({homeCurrency}{convertToHomeCurrency(amount).toFixed(2)})</span>;
  const allocationMatches = parseFloat(allocatedTotal) === parseFloat(billTotal);

  return (
    <div className="text-text">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-8 text-sm">
        <div>
          <ol className="list-decimal marker:text-accent marker:font-pixel pl-5 space-y-1">
            <li>Scan a receipt or use the default items</li>
            <li>Claude will detect the currency from your receipt</li>
            <li>Edit item names and prices as needed</li>
            <li>Adjust currency settings if needed</li>
            <li>Click on person buttons to assign people to items</li>
            <li>When 2+ people are assigned, click <strong className="text-heading">Split</strong></li>
            <li>Adjust percentages to customize the split</li>
          </ol>
          <p className="label opacity-60 mt-3">All changes are automatically saved.</p>
        </div>
        <button onClick={resetData} className={`${dangerButton} self-start shrink-0`}>Reset data</button>
      </div>

      <Section title="Scan receipt with Claude" action={<button onClick={() => navigator.clipboard.writeText(claudePromptText)} className={primaryButton}>Copy prompt</button>}>
        <p className="mb-2 text-sm">Visit <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-link underline">claude.ai</a>, upload your receipt image, and paste the prompt below:</p>
        <div className="bg-code-bg text-code-text p-3 font-pixel text-pixel whitespace-pre-wrap max-h-24 overflow-y-auto">{claudePromptText}</div>
      </Section>

      <Section title="Enter Claude response">
        <textarea className={`${field} w-full font-pixel text-pixel block`} rows="1" placeholder='{"items": [...], "currency": "£"}'
          onChange={(e) => {
            try {
              const data = JSON.parse(e.target.value.trim());
              if (data.items && Array.isArray(data.items)) {
                setItems(data.items.map((item, i) => ({ id: i + 1, name: item.name || 'Unnamed', price: parseFloat(item.price) || 0, quantity: parseInt(item.quantity) || 1, translation: item.translation || '' })));
                if (data.currency) setCurrency(data.currency);
                setTax(parseFloat(data.tax) || 0);
                if (data.serviceChargePercent != null) { setServiceCharge(parseFloat(data.serviceChargePercent) || 0); setServiceChargeMode('%'); }
                else if (data.serviceCharge != null) { setServiceCharge(parseFloat(data.serviceCharge) || 0); setServiceChargeMode('fixed'); }
                else { setServiceCharge(0); }
                setPersonShares({}); setItemAssignments({}); setExpandedRows({}); setProcessingError(null);
              } else setProcessingError('Invalid format');
            } catch { setProcessingError('Invalid JSON'); }
          }} />
        {processingError && <p className={`label mt-2 ${errorText}`}>Error: {processingError}</p>}
      </Section>

      <Section title="People" action={<Disclosure open={showPeopleSettings} onClick={() => setShowPeopleSettings(!showPeopleSettings)} />}>
        {!showPeopleSettings && <div className="flex flex-wrap gap-1">{people.map((p,i) => <span key={i} className={`${chip} border-border`}>{p}</span>)}</div>}
        {showPeopleSettings && (
          <div>
            <div className="flex flex-wrap gap-1 mb-3">
              {people.map((person, i) => (
                <span key={i} className={`${chip} border-border inline-flex items-center gap-2`}>
                  {person}
                  <button onClick={() => { setPeople(people.filter((_,idx) => idx !== i)); }} className={`${errorText} hover:opacity-70`} aria-label={`Remove ${person}`}>×</button>
                </span>
              ))}
            </div>
            <div className="flex items-stretch gap-2">
              <input type="text" placeholder="Add person" className={`${field} flex-grow`}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim() && !people.includes(e.target.value.trim())) { setPeople([...people, e.target.value.trim()]); e.target.value = ''; }}} />
              <button onClick={(e) => { const input = e.target.previousSibling; if (input.value.trim() && !people.includes(input.value.trim())) { setPeople([...people, input.value.trim()]); input.value = ''; }}} className={primaryButton}>Add</button>
            </div>
          </div>
        )}
      </Section>

      <Section title="Assign items">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="label text-heading pixel-line"><th className="p-1 sm:p-2 font-normal text-left">Item</th><th className="p-1 sm:p-2 font-normal text-right">Price ({currency})</th><th className="p-1 sm:p-2 font-normal text-left">Assigned to</th><th className="p-1 sm:p-2 font-normal w-16"><span className="sr-only">Split</span></th></tr></thead>
            <tbody>
              {expandedItems.map((item) => {
                const totalPercent = getTotalPercentForItem(item.uniqueId);
                const isComplete = totalPercent === 100;
                const isOver = totalPercent > 100;
                const assignees = itemAssignments[item.uniqueId] || [];
                const isFirst = item.uniqueId.endsWith('-0');
                const orig = items.find(i => i.id === item.id);
                const marker = isOver ? 'text-red-600 dark:text-red-400' : isComplete ? 'text-accent' : 'text-transparent';
                return (
                  <React.Fragment key={item.uniqueId}>
                    <tr className="pixel-line align-top">
                      <td className="p-1 sm:p-2">
                        <div className="flex items-start gap-1.5">
                          <span className={`${marker} font-pixel text-pixel leading-[30px]`} aria-hidden="true">■</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              {isFirst ? <input type="text" value={orig.name} onChange={(e) => updateItemName(orig.id, e.target.value)} className={`${field} w-full`} /> : <span className="leading-[30px] text-heading">{item.name}</span>}
                              {item.originalQuantity > 1 && <span className="ml-1 whitespace-nowrap font-pixel text-pixel opacity-70">{parseInt(item.uniqueId.split('-')[1]) + 1}/{item.originalQuantity}</span>}
                            </div>
                            {item.translation && <div className="label opacity-60 mt-0.5 normal-case tracking-normal">{item.translation}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="p-1 sm:p-2 text-right">
                        {isFirst ? <input type="number" min="0" step="0.01" value={orig.price} onChange={(e) => updateItemPrice(orig.id, e.target.value)} className={`${field} ${amount} w-20 text-right`} /> : <span className={`${amount} block leading-[30px]`}>{item.price.toFixed(2)}</span>}
                      </td>
                      <td className="p-1 sm:p-2">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1"><button onClick={() => toggleAllPeople(item.uniqueId)} className={`${chip} ${assignees.length === people.length ? chipOn : chipOff}`}>All</button>{people.map(p => <button key={p} onClick={() => togglePersonAssignment(item.uniqueId, p)} className={`${chip} ${assignees.includes(p) ? chipOn : chipOff}`}>{p}</button>)}</div>
                      </td>
                      <td className="p-1 sm:p-2 text-center">
                        <button onClick={() => toggleExpandedRow(item.uniqueId)} disabled={!canItemBeSplit(item.uniqueId)} className={`${chip} ${expandedRows[item.uniqueId] ? chipOn : canItemBeSplit(item.uniqueId) ? chipOff : 'border-border opacity-30 cursor-not-allowed'}`}>{expandedRows[item.uniqueId] ? 'Hide' : 'Split'}</button>
                      </td>
                    </tr>
                    {expandedRows[item.uniqueId] && canItemBeSplit(item.uniqueId) && (
                      <tr className="pixel-line">
                        <td colSpan="4" className="p-2 sm:p-4 bg-code-bg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>{assignees.map(p => <div key={p} className="flex items-center mb-2"><span className="mr-2 w-24 truncate">{p}</span><input type="number" min="0" max="100" value={personShares[item.uniqueId]?.[p] || 0} onChange={(e) => handleShareChange(item.uniqueId, p, e.target.value)} className={`${field} ${amount} w-20 text-right`} /><span className="ml-1 font-pixel">%</span></div>)}</div>
                            <div className="flex flex-col items-start gap-2">
                              <div className={`font-pixel text-pixel-lg ${isComplete ? 'text-accent' : isOver ? errorText : 'opacity-70'}`}>Total {totalPercent}%</div>
                              <button onClick={() => { const ns = { ...personShares }; ns[item.uniqueId] = createEqualSplit(assignees); setPersonShares(ns); }} className={primaryButton}>Equal split</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Tax & service charge" action={<Disclosure open={showTaxSettings} onClick={() => setShowTaxSettings(!showTaxSettings)} />}>
        {!showTaxSettings && <p className="label"><span>Tax {money(tax)}</span><span className="ml-4">Service {serviceChargeMode === '%' ? `${serviceCharge}%` : money(serviceCharge)}{serviceChargeMode === '%' && serviceCharge > 0 ? ` (${money(serviceChargeAmount)})` : ''}</span></p>}
        {showTaxSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1">Tax ({currency})</label>
              <input type="number" min="0" step="0.01" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} className={`${field} ${amount} w-32`} />
            </div>
            <div>
              <label className="label block mb-1">Service charge</label>
              <div className="flex items-stretch gap-2">
                <input type="number" min="0" step="0.01" value={serviceCharge} onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)} className={`${field} ${amount} w-32`} />
                <select value={serviceChargeMode} onChange={(e) => setServiceChargeMode(e.target.value)} className={`${field} ${amount}`}>
                  <option value="%">%</option>
                  <option value="fixed">{currency}</option>
                </select>
              </div>
              {serviceChargeMode === '%' && serviceCharge > 0 && <p className="label opacity-60 mt-1">= {money(serviceChargeAmount)}</p>}
            </div>
          </div>
        )}
      </Section>

      <Section title="Currency" action={<Disclosure open={showCurrencySettings} onClick={() => setShowCurrencySettings(!showCurrencySettings)} />}>
        {!showCurrencySettings && <p className="label"><span>Bill currency {currency}</span>{showHome && <span> → home {homeCurrency} (rate {exchangeRate})</span>}</p>}
        {showCurrencySettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label block mb-1">Bill currency</label><select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`${field} ${amount}`}><option value="£">£ GBP</option><option value="€">€ EUR</option><option value="$">$ USD</option><option value="¥">¥ JPY</option></select></div>
            <div><label className="label block mb-1">Home currency</label><select value={homeCurrency} onChange={(e) => setHomeCurrency(e.target.value)} className={`${field} ${amount}`}><option value="£">£ GBP</option><option value="€">€ EUR</option><option value="$">$ USD</option><option value="¥">¥ JPY</option></select></div>
            <div><label className="label block mb-1">Bill total in home currency ({homeCurrency})</label><input type="number" min="0" step="0.01" value={parseFloat((parseFloat(billTotal) * exchangeRate).toFixed(2))} onChange={(e) => { const homeAmount = parseFloat(e.target.value); const total = parseFloat(billTotal); if (total > 0 && homeAmount >= 0) setExchangeRate(parseFloat((homeAmount / total).toFixed(6))); }} className={`${field} ${amount} w-32`} /></div>
            <div><label className="label block mb-1">Exchange rate</label><input type="number" min="0" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)} className={`${field} ${amount} w-32`} /></div>
          </div>
        )}
      </Section>

      <Section title="Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="label text-heading mb-1">Per person</h3>
            {people.map((p,i) => {
              const breakdown = calculatePersonTotal(p);
              const hasExtras = tax > 0 || serviceChargeAmount > 0;
              const isExpanded = expandedSummary[p];
              return <div key={i}>
                <div className={`flex justify-between items-baseline py-1.5 pixel-line ${hasExtras ? 'cursor-pointer' : ''}`} onClick={() => hasExtras && setExpandedSummary(prev => ({ ...prev, [p]: !prev[p] }))}>
                  <span className="flex items-center gap-1.5 text-heading">{hasExtras && <span className="text-accent text-[0.7em]">{isExpanded ? '▼' : '▶'}</span>}{p}</span>
                  <span className={`${amount} text-heading`}>{money(breakdown.total)}{home(breakdown.total)}</span>
                </div>
                {isExpanded && <div className={`pl-4 py-1 space-y-0.5 ${amount} opacity-70`}>
                  <div className="flex justify-between"><span>Items</span><span>{money(breakdown.items)}{home(breakdown.items)}</span></div>
                  {tax > 0 && <div className="flex justify-between"><span>Tax</span><span>{money(breakdown.tax)}{home(breakdown.tax)}</span></div>}
                  {serviceChargeAmount > 0 && <div className="flex justify-between"><span>Service</span><span>{money(breakdown.service)}{home(breakdown.service)}</span></div>}
                </div>}
              </div>;
            })}
          </div>
          <div>
            <h3 className="label text-heading mb-1">Bill total</h3>
            <div className="flex justify-between items-baseline py-1.5 pixel-line"><span>Subtotal</span><span className={amount}>{money(billSubtotal)}{home(billSubtotal)}</span></div>
            {tax > 0 && <div className="flex justify-between items-baseline py-1.5 pixel-line"><span>Tax</span><span className={amount}>{money(tax)}{home(tax)}</span></div>}
            {serviceChargeAmount > 0 && <div className="flex justify-between items-baseline py-1.5 pixel-line"><span>Service</span><span className={amount}>{money(serviceChargeAmount)}{home(serviceChargeAmount)}</span></div>}
            <div className="flex justify-between items-baseline py-1.5 text-heading"><span className="label">Total</span><span className="font-pixel text-pixel-lg">{currency}{billTotal}{home(parseFloat(billTotal))}</span></div>
            <hr className="my-1" />
            <div className={`flex justify-between items-baseline py-1.5 ${allocationMatches ? 'text-accent' : errorText}`}><span className="label">Allocated</span><span className={amount}>{currency}{allocatedTotal}{home(parseFloat(allocatedTotal))}</span></div>
          </div>
        </div>
      </Section>
    </div>
  );
};

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<Component />);
