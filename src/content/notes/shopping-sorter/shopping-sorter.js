// Shopping List Aisle Sorter for Drafts
//
// Two modes:
//   1. Run on the Shopping List draft → sort it in place
//   2. Run on any other draft → parse items, append to Shopping List, sort it
//
// Supports comma-separated, bullet-pointed, and newline-separated input.
//
// Stores mappings in an archived draft tagged "aisle-mappings"
// Shopping list lives in a draft tagged "shopping-list"

const STORE_TAG = "aisle-mappings";
const SHOPPING_TAG = "shopping-list";

// --- Draft lookup ---

function getStoreDraft() {
  let results = Draft.query("", "archive", [STORE_TAG]);
  if (results.length > 0) return results[0];
  let d = new Draft();
  d.content = JSON.stringify({ aisleOrder: [], items: {} }, null, 2);
  d.addTag(STORE_TAG);
  d.isArchived = true;
  d.update();
  return d;
}

function getShoppingDraft() {
  let results = Draft.query("", "inbox", [SHOPPING_TAG]);
  if (results.length > 0) return results[0];
  let d = new Draft();
  d.content = "";
  d.addTag(SHOPPING_TAG);
  d.update();
  return d;
}

// --- Load / Save store ---

function loadStore() {
  let d = getStoreDraft();
  try {
    return JSON.parse(d.content);
  } catch (e) {
    app.displayErrorMessage("Aisle mappings draft has corrupt JSON — please fix or delete it");
    context.cancel();
    throw new Error("cancelled");
  }
}

function saveStore(store) {
  let d = getStoreDraft();
  d.content = JSON.stringify(store, null, 2);
  d.update();
}

// --- Normalise item text for matching ---

function normalise(item) {
  return item
    .toLowerCase()
    .replace(/^[-*•]\s*/, "")        // strip bullet markers
    .replace(/^\[[ x]\]\s*/, "")     // strip checkbox markers
    .replace(/^\d+[\.\)\s]*/, "")   // strip leading numbers "1. " "2) "
    .replace(/\s*\(.*?\)\s*/g, " ")  // strip parentheticals
    .replace(/\bx\s*\d+/gi, "")     // strip "x2", "x 3"
    .trim();
}

// --- Clean display text (strip list formatting only) ---

function cleanDisplay(text) {
  return text
    .replace(/^[-*•]\s*/, "")
    .replace(/^\[[ x]\]\s*/, "")
    .replace(/^\d+[\.\)\s]*/, "");
}

// --- Parse items from freeform text ---
// Supports: comma-separated, bullet lists, newline-separated, or a mix

function parseItems(text) {
  let lines = text.split("\n").filter(l => l.trim().length > 0);
  // Strip aisle headers from previous sorts
  lines = lines.filter(l => !/^## /.test(l.trim()));
  // Remove checked-off items
  lines = lines.filter(l => !/^-\s*\[x\]/i.test(l.trim()));

  let rawItems = [];
  for (let line of lines) {
    // If a line contains commas, split it into separate items
    if (line.includes(",")) {
      for (let part of line.split(",")) {
        if (part.trim().length > 0) rawItems.push(part.trim());
      }
    } else {
      rawItems.push(line.trim());
    }
  }

  return rawItems
    .map(raw => ({ display: cleanDisplay(raw), key: normalise(raw) }))
    .filter(i => i.key.length > 0);
}

// --- Cancel the script ---

function cancelScript() {
  context.cancel();
  throw new Error("cancelled");
}

// --- Prompt to position a new aisle in the walk order ---

function askAislePosition(aisleName, aisleOrder) {
  if (aisleOrder.length === 0) return 0;

  let p = new Prompt();
  p.title = "Place aisle in walk order";
  p.message = `Where does "${aisleName}" come in your store walk?`;

  let options = [];
  for (let i = 0; i < aisleOrder.length; i++) {
    options.push(`Before "${aisleOrder[i]}"`);
  }
  options.push(`After "${aisleOrder[aisleOrder.length - 1]}" (end)`);

  p.addPicker("pos", "", [options], [aisleOrder.length]);
  p.addButton("OK");

  if (!p.show()) cancelScript();
  return p.fieldValues["pos"][0];
}

// --- Prompt user for aisle assignment ---

function askAisle(item, store) {
  let p = new Prompt();
  p.title = "Unknown item";
  p.message = `Which aisle for "${item}"?`;

  if (store.aisleOrder.length > 0) {
    p.addSelect("existing", "Pick existing aisle", store.aisleOrder, [], false);
  }

  p.addTextField("custom", "Or type new aisle", "");
  p.addButton("Save");
  p.addButton("Skip");

  if (!p.show()) cancelScript();
  if (p.buttonPressed === "Skip") return null;

  let custom = p.fieldValues["custom"].trim();
  if (custom) {
    if (!store.aisleOrder.includes(custom)) {
      let pos = askAislePosition(custom, store.aisleOrder);
      store.aisleOrder.splice(pos, 0, custom);
    }
    return custom;
  }

  let selected = p.fieldValues["existing"];
  if (selected && selected.length > 0) return selected[0];

  return null;
}

// --- Sort items and return formatted output ---

function sortItems(items, store) {
  const UNASSIGNED = "❓ Unsorted";

  // Resolve unknown items
  let unknowns = items.filter(i => !store.items[i.key]);
  if (unknowns.length > 0) {
    let countMsg = `${unknowns.length} new item${unknowns.length > 1 ? "s" : ""} to classify`;
    app.displayInfoMessage(countMsg);

    for (let item of unknowns) {
      let aisle = askAisle(item.display, store);
      if (aisle) {
        store.items[item.key] = aisle;
      }
    }

    saveStore(store);
  }

  // Group by aisle
  let grouped = {};
  for (let item of items) {
    let aisle = store.items[item.key] || UNASSIGNED;
    if (!grouped[aisle]) grouped[aisle] = [];
    grouped[aisle].push([item.key, item.display]);
  }

  // Custom aisle order; unknowns after, unsorted last
  let knownOrder = store.aisleOrder.filter(a => grouped[a]);
  let unknownAisles = Object.keys(grouped).filter(
    a => a !== UNASSIGNED && !store.aisleOrder.includes(a)
  );
  let aisleSequence = [...knownOrder, ...unknownAisles.sort()];
  if (grouped[UNASSIGNED]) aisleSequence.push(UNASSIGNED);

  // Build sorted output
  let output = [];
  for (let aisle of aisleSequence) {
    output.push(`## ${aisle}`);
    grouped[aisle]
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: "base" }))
      .forEach(([, display]) => output.push(`- [ ] ${display}`));
    output.push("");
  }

  return { text: output.join("\n"), itemCount: items.length, aisleCount: aisleSequence.length };
}

// --- Main ---

let store = loadStore();
let shoppingDraft = getShoppingDraft();
let isShoppingDraft = draft.uuid === shoppingDraft.uuid;

if (isShoppingDraft) {
  // Mode 1: Run on the shopping list — sort in place
  let items = parseItems(draft.content);
  let result = sortItems(items, store);
  draft.content = result.text;
  draft.update();
  app.displaySuccessMessage(`Sorted ${result.itemCount} items into ${result.aisleCount} aisles`);
} else {
  // Mode 2: Run on another draft — parse, append to shopping list, sort
  let newItems = parseItems(draft.content);
  if (newItems.length === 0) {
    app.displayWarningMessage("No items found to add");
  } else {
    // Append new display text to shopping list
    let existing = shoppingDraft.content.trim();
    let appendText = newItems.map(i => i.display).join("\n");
    shoppingDraft.content = existing.length > 0
      ? existing + "\n" + appendText
      : appendText;

    // Re-parse and sort the full shopping list
    let allItems = parseItems(shoppingDraft.content);
    let result = sortItems(allItems, store);
    shoppingDraft.content = result.text;
    shoppingDraft.update();
    draft.isArchived = true;
    draft.update();
    app.displaySuccessMessage(`Added ${newItems.length} items — ${result.itemCount} total in ${result.aisleCount} aisles`);
  }
}
