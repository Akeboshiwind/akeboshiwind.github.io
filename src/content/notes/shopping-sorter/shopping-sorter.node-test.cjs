const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

const SCRIPT_SRC = fs.readFileSync(
  path.join(__dirname, "shopping-sorter.js"),
  "utf-8"
);

/**
 * Internal: Build a mock Drafts context and run the script.
 * Use runOnShoppingDraft() or runFromOtherDraft() instead.
 */
function _run({ draftContent, shoppingContent, isOnShoppingDraft, storedJson = null, promptResponses = [] }) {
  let savedJson = null;
  let promptQueue = [...promptResponses];
  let messages = { info: [], success: [], warning: [], error: [] };
  let promptsShown = [];

  const SHOPPING_UUID = "shopping-uuid";
  const OTHER_UUID = "other-uuid";

  const mockDraft = {
    content: draftContent,
    uuid: isOnShoppingDraft ? SHOPPING_UUID : OTHER_UUID,
    isArchived: false,
    update() {},
  };

  const mockShoppingDraft = isOnShoppingDraft ? mockDraft : {
    content: shoppingContent,
    uuid: SHOPPING_UUID,
    update() {},
  };

  // Each `new Prompt()` pops the next response from the queue
  function MockPrompt() {
    this.title = "";
    this.message = "";
    this.buttonPressed = null;
    this.fieldValues = {};
    this._fields = {};
    this._buttons = [];

    this.addSelect = (key, label, options, selected, multi) => {
      this._fields[key] = { type: "select", options, selected };
      this.fieldValues[key] = selected;
    };
    this.addTextField = (key, label, defaultVal) => {
      this._fields[key] = { type: "text", defaultVal };
      this.fieldValues[key] = defaultVal;
    };
    this.addPicker = (key, label, columns, selectedRows) => {
      this._fields[key] = { type: "picker", columns, selectedRows };
      this.fieldValues[key] = selectedRows;
    };
    this.addButton = (label) => {
      this._buttons.push(label);
    };

    this.show = () => {
      let response = promptQueue.shift();
      if (!response) {
        throw new Error(
          `Unexpected prompt "${this.title}": no response queued. ` +
          `Buttons: [${this._buttons.join(", ")}]`
        );
      }
      if (response.cancel) {
        promptsShown.push({ title: this.title, message: this.message, cancelled: true });
        return false;
      }
      if (!response.button) {
        throw new Error(
          `Prompt "${this.title}" got a test response with no button. ` +
          `Available buttons: [${this._buttons.join(", ")}]`
        );
      }
      if (!this._buttons.includes(response.button)) {
        throw new Error(
          `Prompt "${this.title}" has no button "${response.button}". ` +
          `Available buttons: [${this._buttons.join(", ")}]`
        );
      }
      promptsShown.push({ title: this.title, message: this.message, ...response });
      this.buttonPressed = response.button;
      if (response.fields) {
        for (let [k, v] of Object.entries(response.fields)) {
          this.fieldValues[k] = v;
        }
      }
      return true;
    };
  }

  // Store draft mock
  let storeDraftContent = storedJson !== null
    ? JSON.stringify(storedJson)
    : JSON.stringify({ aisleOrder: [], items: {} });
  let storeDraftExists = storedJson !== null;

  let storeDraft = {
    content: storeDraftContent,
    addTag() {},
    isArchived: false,
    update() { savedJson = JSON.parse(this.content); },
  };

  let createdDrafts = [];

  function MockDraft() {
    this.content = "";
    this.uuid = "new-draft-" + createdDrafts.length;
    this.isArchived = false;
    this.addTag = () => {};
    this.update = () => {};
    createdDrafts.push(this);
  }
  MockDraft.query = (text, filter, tags) => {
    if (tags && tags[0] === "aisle-mappings") {
      return storeDraftExists ? [storeDraft] : [];
    }
    if (tags && tags[0] === "shopping-list") {
      return [mockShoppingDraft];
    }
    return [];
  };

  let cancelled = false;

  const vmContext = vm.createContext({
    Draft: MockDraft,
    Prompt: MockPrompt,
    draft: mockDraft,
    app: {
      displayInfoMessage: (msg) => messages.info.push(msg),
      displaySuccessMessage: (msg) => messages.success.push(msg),
      displayWarningMessage: (msg) => messages.warning.push(msg),
      displayErrorMessage: (msg) => messages.error.push(msg),
    },
    context: { cancel: () => { cancelled = true; } },
  });

  try {
    vm.runInContext(SCRIPT_SRC, vmContext);
  } catch (e) {
    if (!cancelled) throw e;
  }

  return {
    draft: mockDraft,
    shoppingDraft: mockShoppingDraft,
    savedJson,
    messages,
    prompts: promptsShown,
    cancelled,
  };
}

/**
 * Run the script as if the current draft IS the shopping list.
 * @param {object} opts
 * @param {string} opts.draftContent - shopping list content
 * @param {object|null} opts.storedJson - aisle-mappings content
 * @param {Array} opts.promptResponses - prompt response queue
 */
function runOnShoppingDraft({ draftContent, storedJson, promptResponses }) {
  return _run({ draftContent, shoppingContent: draftContent, isOnShoppingDraft: true, storedJson, promptResponses });
}

/**
 * Run the script on a non-shopping draft, appending items to the shopping list.
 * @param {object} opts
 * @param {string} opts.draftContent - content of the current (non-shopping) draft
 * @param {string} opts.shoppingContent - existing shopping list content
 * @param {object|null} opts.storedJson - aisle-mappings content
 * @param {Array} opts.promptResponses - prompt response queue
 */
function runFromOtherDraft({ draftContent, shoppingContent, storedJson, promptResponses }) {
  return _run({ draftContent, shoppingContent, isOnShoppingDraft: false, storedJson, promptResponses });
}

// --- Helpers ---

/** Parse the sorted output back into { aisle: [items] } */
function parseOutput(content) {
  let result = {};
  let currentAisle = null;
  for (let line of content.split("\n")) {
    if (line.startsWith("## ")) {
      currentAisle = line.slice(3);
      result[currentAisle] = [];
    } else if (currentAisle && line.trim()) {
      // Strip the "- [ ] " checkbox prefix to get clean item text
      let item = line.replace(/^- \[ \] /, "");
      result[currentAisle].push(item);
    }
  }
  return result;
}

/** Get just the aisle names in order from the output */
function aisleNames(content) {
  return content
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3));
}

/**
 * Extract the normalise function from the script for direct unit testing.
 */
function getNormalise() {
  function StubDraft() {
    this.content = "";
    this.uuid = "stub";
    this.isArchived = false;
    this.addTag = () => {};
    this.update = () => {};
  }
  StubDraft.query = (text, filter, tags) => {
    if (tags && tags[0] === "aisle-mappings") {
      return [{ content: JSON.stringify({ aisleOrder: [], items: {} }), update() {} }];
    }
    if (tags && tags[0] === "shopping-list") {
      return [{ content: "", uuid: "stub", update() {} }];
    }
    return [];
  };

  const context = vm.createContext({
    Draft: StubDraft,
    Prompt: function () {
      this.fieldValues = {};
      this._buttons = [];
      this.addSelect = () => {};
      this.addTextField = (k, _, d) => (this.fieldValues[k] = d);
      this.addPicker = () => {};
      this.addButton = () => {};
      this.show = () => false;
    },
    draft: { content: "", uuid: "stub", update() {} },
    app: { displayInfoMessage: () => {}, displaySuccessMessage: () => {} },
    console: { log: () => {} },
  });
  vm.runInContext(SCRIPT_SRC + "\nthis._normalise = normalise;", context);
  return context._normalise;
}

// =============================================================================
// Tests
// =============================================================================

describe("normalise (unit)", () => {
  const normalise = getNormalise();

  it("lowercases input", () => {
    assert.equal(normalise("MILK"), "milk");
    assert.equal(normalise("Oat Milk"), "oat milk");
  });

  it("strips bullet markers: - * •", () => {
    assert.equal(normalise("- milk"), "milk");
    assert.equal(normalise("* milk"), "milk");
    assert.equal(normalise("• milk"), "milk");
  });

  it("strips numbered prefixes: 1. 2) 3", () => {
    assert.equal(normalise("1. milk"), "milk");
    assert.equal(normalise("2) milk"), "milk");
    assert.equal(normalise("3 milk"), "milk");
  });

  it("strips quantity markers: x2, X3", () => {
    assert.equal(normalise("milk x2"), "milk");
    assert.equal(normalise("milk X3"), "milk");
  });

  it("strips parentheticals", () => {
    assert.equal(normalise("Oat Milk (Oatly)"), "oat milk");
  });

  it("handles combined prefixes and suffixes", () => {
    assert.equal(normalise("- 1. Oat Milk (Oatly) x2"), "oat milk");
  });

  it("strips checkbox markers", () => {
    assert.equal(normalise("- [ ] milk"), "milk");
    assert.equal(normalise("- [x] milk"), "milk");
  });

  it("trims whitespace", () => {
    assert.equal(normalise("  milk  "), "milk");
  });

  it("returns empty string for empty input", () => {
    assert.equal(normalise(""), "");
    assert.equal(normalise("   "), "");
  });
});

describe("loadStore", () => {
  it("returns empty store when no file exists", () => {
    const { draft } = runOnShoppingDraft({
      draftContent: "milk",
      promptResponses: [{ button: "Skip" }],
    });
    assert.ok(draft.content.includes("milk"));
  });

  it("shows error and cancels on corrupt JSON", () => {
    let errorMessages = [];
    let cancelled = false;

    function CorruptDraft() {
      this.content = "";
      this.uuid = "new";
      this.isArchived = false;
      this.addTag = () => {};
      this.update = () => {};
    }
    CorruptDraft.query = (text, filter, tags) => {
      if (tags && tags[0] === "aisle-mappings") return [{ content: "{corrupt!", update() {} }];
      if (tags && tags[0] === "shopping-list") return [{ content: "milk", uuid: "shop", update() {} }];
      return [];
    };

    const ctx = vm.createContext({
      Draft: CorruptDraft,
      Prompt: function () {},
      draft: { content: "milk", uuid: "shop", update() {} },
      app: {
        displayInfoMessage: () => {},
        displaySuccessMessage: () => {},
        displayErrorMessage: (msg) => { errorMessages.push(msg); },
      },
      context: { cancel: () => { cancelled = true; } },
    });
    assert.throws(() => vm.runInContext(SCRIPT_SRC, ctx), /cancelled/);
    assert.ok(errorMessages[0].includes("corrupt"));
    assert.ok(cancelled, "should cancel the action");
  });
});

describe("normalise (integration)", () => {
  it("bullet-prefixed items match stored keys without prompting", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { prompts, draft } = runOnShoppingDraft({ draftContent: "- milk\n* milk\n• milk", storedJson: store });
    assert.equal(prompts.length, 0, "should not prompt — all items should match");
    assert.equal(parseOutput(draft.content)["Dairy"].length, 3);
  });

  it("numbered-prefix items match stored keys without prompting", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { prompts, draft } = runOnShoppingDraft({ draftContent: "1. milk\n2) milk\n3 milk", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(parseOutput(draft.content)["Dairy"].length, 3);
  });

  it("quantity-suffixed items match stored keys without prompting", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { prompts, draft } = runOnShoppingDraft({ draftContent: "milk x2\nmilk X3", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(parseOutput(draft.content)["Dairy"].length, 2);
  });

  it("parenthetical items match stored keys without prompting", () => {
    const store = { aisleOrder: ["Dairy"], items: { "oat milk": "Dairy" } };
    const { prompts, draft } = runOnShoppingDraft({ draftContent: "Oat Milk (Oatly)", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(parseOutput(draft.content)["Dairy"].length, 1);
  });
});

describe("display text cleanup", () => {
  it("strips bullet markers from output", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "- milk\n* milk\n• milk", storedJson: store });
    assert.ok(parseOutput(draft.content)["Dairy"].every(item => item === "milk"));
  });

  it("strips numbered prefixes from output", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "1. milk\n2) milk\n3 milk", storedJson: store });
    assert.ok(parseOutput(draft.content)["Dairy"].every(item => item === "milk"));
  });

  it("preserves case in output", () => {
    const store = { aisleOrder: ["Dairy"], items: { "oat milk": "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "Oat Milk", storedJson: store });
    assert.equal(parseOutput(draft.content)["Dairy"][0], "Oat Milk");
  });

  it("preserves quantities in output", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "Milk x2", storedJson: store });
    assert.ok(draft.content.includes("Milk x2"));
  });

  it("preserves parentheticals in output", () => {
    const store = { aisleOrder: ["Dairy"], items: { "oat milk": "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "Oat Milk (Oatly)", storedJson: store });
    assert.ok(draft.content.includes("Oat Milk (Oatly)"));
  });

  it("strips bullets but preserves everything else combined", () => {
    const store = { aisleOrder: ["Dairy"], items: { "oat milk": "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "- Oat Milk (Oatly) x2", storedJson: store });
    assert.equal(parseOutput(draft.content)["Dairy"][0], "Oat Milk (Oatly) x2");
  });
});

describe("sorting", () => {
  it("sorts items alphabetically within an aisle by normalised key", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", butter: "Dairy", cheese: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "milk\ncheese\nbutter", storedJson: store });
    assert.deepEqual(parseOutput(draft.content)["Dairy"], ["butter", "cheese", "milk"]);
  });

  it("follows custom aisle order, not alphabetical", () => {
    const store = {
      aisleOrder: ["Frozen", "Bakery", "Dairy"],
      items: { milk: "Dairy", bread: "Bakery", "ice cream": "Frozen" },
    };
    const { draft } = runOnShoppingDraft({ draftContent: "milk\nbread\nice cream", storedJson: store });
    assert.deepEqual(aisleNames(draft.content), ["Frozen", "Bakery", "Dairy"]);
  });

  it("puts unsorted items at the end", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({
      draftContent: "milk\nmystery item",
      storedJson: store,
      promptResponses: [{ button: "Skip" }],
    });
    const order = aisleNames(draft.content);
    assert.equal(order[0], "Dairy");
    assert.equal(order[order.length - 1], "❓ Unsorted");
  });

  it("omits aisles with no items in this list", () => {
    const store = {
      aisleOrder: ["Fruit & Veg", "Bakery", "Dairy", "Frozen"],
      items: { milk: "Dairy", bread: "Bakery" },
    };
    const { draft } = runOnShoppingDraft({ draftContent: "milk\nbread", storedJson: store });
    assert.deepEqual(aisleNames(draft.content), ["Bakery", "Dairy"]);
  });
});

describe("aisle headers from previous sort", () => {
  it("strips existing ## headers before re-sorting", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy", bread: "Bakery" } };
    const { draft } = runOnShoppingDraft({ draftContent: "## Dairy\nmilk\n## Bakery\nbread", storedJson: store });
    const parsed = parseOutput(draft.content);
    assert.equal(parsed["Dairy"].length, 1);
    assert.equal(parsed["Bakery"].length, 1);
  });
});

describe("prompt interactions", () => {
  it("assigns item to existing aisle via select", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy" } };
    const { draft, savedJson } = runOnShoppingDraft({
      draftContent: "milk\nbread",
      storedJson: store,
      promptResponses: [{ button: "Save", fields: { existing: ["Bakery"], custom: "" } }],
    });
    assert.equal(savedJson.items["bread"], "Bakery");
    assert.deepEqual(aisleNames(draft.content), ["Dairy", "Bakery"]);
  });

  it("creates a new aisle and asks for position", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { savedJson } = runOnShoppingDraft({
      draftContent: "milk\nbleach",
      storedJson: store,
      promptResponses: [
        { button: "Save", fields: { existing: [], custom: "Cleaning" } },
        { button: "OK", fields: { pos: [1] } },
      ],
    });
    assert.equal(savedJson.items["bleach"], "Cleaning");
    assert.deepEqual(savedJson.aisleOrder, ["Dairy", "Cleaning"]);
  });

  it("inserts new aisle before an existing one", () => {
    const store = { aisleOrder: ["Dairy", "Frozen"], items: { milk: "Dairy", "ice cream": "Frozen" } };
    const { savedJson } = runOnShoppingDraft({
      draftContent: "milk\nice cream\nbread",
      storedJson: store,
      promptResponses: [
        { button: "Save", fields: { existing: [], custom: "Bakery" } },
        { button: "OK", fields: { pos: [1] } },
      ],
    });
    assert.deepEqual(savedJson.aisleOrder, ["Dairy", "Bakery", "Frozen"]);
  });

  it("skips items when user presses Skip", () => {
    const store = { aisleOrder: [], items: {} };
    const { draft, savedJson } = runOnShoppingDraft({
      draftContent: "mystery",
      storedJson: store,
      promptResponses: [{ button: "Skip" }],
    });
    assert.equal(savedJson.items["mystery"], undefined);
    assert.ok(draft.content.includes("❓ Unsorted"));
  });

  it("throws on unexpected prompt (no response queued)", () => {
    const store = { aisleOrder: [], items: {} };
    assert.throws(
      () => runOnShoppingDraft({ draftContent: "mystery", storedJson: store }),
      /Unexpected prompt/
    );
  });

  it("does not save when all items are already known", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { savedJson, prompts } = runOnShoppingDraft({ draftContent: "milk", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(savedJson, null);
  });

  it("cancels the whole script when aisle prompt is cancelled", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { cancelled, draft, savedJson } = runOnShoppingDraft({
      draftContent: "milk\nmystery",
      storedJson: store,
      promptResponses: [{ cancel: true }],
    });
    assert.ok(cancelled, "script should be cancelled");
    // Draft should not have been modified
    assert.equal(draft.content, "milk\nmystery");
    assert.equal(savedJson, null);
  });

  it("cancels on second item without saving the first", () => {
    const store = { aisleOrder: ["Dairy"], items: {} };
    const { cancelled, savedJson } = runOnShoppingDraft({
      draftContent: "apples\nbananas",
      storedJson: store,
      promptResponses: [
        { button: "Save", fields: { existing: [], custom: "Fruit" } },
        { button: "OK", fields: { pos: [1] } },
        { cancel: true },
      ],
    });
    assert.ok(cancelled, "script should be cancelled");
    assert.equal(savedJson, null, "nothing should be saved on cancel");
  });

  it("cancels when position prompt is cancelled", () => {
    const store = { aisleOrder: ["Dairy"], items: {} };
    const { cancelled, savedJson } = runOnShoppingDraft({
      draftContent: "bleach",
      storedJson: store,
      promptResponses: [
        { button: "Save", fields: { existing: [], custom: "Cleaning" } },
        { cancel: true },
      ],
    });
    assert.ok(cancelled, "script should be cancelled");
    assert.equal(savedJson, null);
  });

  it("does not archive source draft when cancelled from other draft", () => {
    const store = { aisleOrder: [], items: {} };
    const { cancelled, draft } = runFromOtherDraft({
      draftContent: "mystery",
      shoppingContent: "milk",
      storedJson: store,
      promptResponses: [{ cancel: true }],
    });
    assert.ok(cancelled);
    assert.equal(draft.isArchived, false, "source draft should not be archived on cancel");
  });
});

describe("multiple unknown items", () => {
  it("prompts for each unknown item in order", () => {
    const store = { aisleOrder: ["Dairy"], items: {} };
    const { savedJson } = runOnShoppingDraft({
      draftContent: "apples\nbananas\ncarrots",
      storedJson: store,
      promptResponses: [
        { button: "Save", fields: { existing: [], custom: "Fruit & Veg" } },
        { button: "OK", fields: { pos: [1] } },
        { button: "Save", fields: { existing: ["Fruit & Veg"], custom: "" } },
        { button: "Save", fields: { existing: ["Fruit & Veg"], custom: "" } },
      ],
    });
    assert.equal(savedJson.items["apples"], "Fruit & Veg");
    assert.equal(savedJson.items["bananas"], "Fruit & Veg");
    assert.equal(savedJson.items["carrots"], "Fruit & Veg");
  });
});

describe("empty / edge cases", () => {
  it("handles empty shopping draft", () => {
    const store = { aisleOrder: [], items: {} };
    const { draft, messages } = runOnShoppingDraft({ draftContent: "", storedJson: store });
    assert.equal(draft.content, "");
    assert.equal(messages.success.length, 1);
  });

  it("handles blank lines and whitespace-only lines", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "  \n\nmilk\n   \n", storedJson: store });
    assert.equal(parseOutput(draft.content)["Dairy"].length, 1);
  });

  it("is case-insensitive for matching", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft, prompts } = runOnShoppingDraft({ draftContent: "MILK\nMilk\nmilk", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(parseOutput(draft.content)["Dairy"].length, 3);
  });

  it("does not archive the shopping draft when sorting in place", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "milk", storedJson: store });
    assert.equal(draft.isArchived, false);
  });
});

describe("info messages", () => {
  it("reports correct count of new items", () => {
    const store = { aisleOrder: [], items: { milk: "Dairy" } };
    const { messages } = runOnShoppingDraft({
      draftContent: "milk\napples\nbread",
      storedJson: store,
      promptResponses: [{ button: "Skip" }, { button: "Skip" }],
    });
    assert.equal(messages.info[0], "2 new items to classify");
  });

  it("uses singular for 1 new item", () => {
    const store = { aisleOrder: [], items: {} };
    const { messages } = runOnShoppingDraft({
      draftContent: "apples",
      storedJson: store,
      promptResponses: [{ button: "Skip" }],
    });
    assert.equal(messages.info[0], "1 new item to classify");
  });
});

// =============================================================================
// Mode 2: Run on another draft → append to shopping list
// =============================================================================

describe("append from other draft", () => {
  it("appends items to empty shopping list and sorts", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy", bread: "Bakery" } };
    const { shoppingDraft, draft } = runFromOtherDraft({
      draftContent: "milk\nbread",
      shoppingContent: "",
      storedJson: store,
    });
    const parsed = parseOutput(shoppingDraft.content);
    assert.equal(parsed["Dairy"].length, 1);
    assert.equal(parsed["Bakery"].length, 1);
    // Original draft is unchanged but archived
    assert.equal(draft.content, "milk\nbread");
    assert.ok(draft.isArchived, "source draft should be archived");
  });

  it("appends items to existing shopping list", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy", bread: "Bakery", eggs: "Dairy" } };
    const { shoppingDraft, draft } = runFromOtherDraft({
      draftContent: "bread",
      shoppingContent: "## Dairy\nmilk\neggs\n",
      storedJson: store,
    });
    const parsed = parseOutput(shoppingDraft.content);
    assert.equal(parsed["Dairy"].length, 2);
    assert.equal(parsed["Bakery"].length, 1);
    assert.ok(draft.isArchived, "source draft should be archived");
  });

  it("does not archive source draft when it has no items", () => {
    const store = { aisleOrder: [], items: {} };
    const { draft } = runFromOtherDraft({
      draftContent: "",
      shoppingContent: "milk",
      storedJson: store,
    });
    assert.equal(draft.isArchived, false, "empty source draft should not be archived");
  });

  it("shows warning for empty other draft", () => {
    const store = { aisleOrder: [], items: {} };
    const { messages } = runFromOtherDraft({
      draftContent: "",
      shoppingContent: "milk",
      storedJson: store,
    });
    assert.equal(messages.warning[0], "No items found to add");
  });

  it("shows correct success message with counts", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", bread: "Dairy" } };
    const { messages } = runFromOtherDraft({
      draftContent: "bread",
      shoppingContent: "milk",
      storedJson: store,
    });
    assert.ok(messages.success[0].includes("Added 1 items"));
    assert.ok(messages.success[0].includes("2 total"));
  });
});

// =============================================================================
// Parsing formats
// =============================================================================

describe("comma-separated parsing", () => {
  it("splits comma-separated items on a single line", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy", bread: "Bakery", eggs: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "milk, bread, eggs", storedJson: store });
    const parsed = parseOutput(draft.content);
    assert.equal(parsed["Dairy"].length, 2); // milk + eggs
    assert.equal(parsed["Bakery"].length, 1); // bread
  });

  it("handles mixed comma and newline input", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", butter: "Dairy", cheese: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "milk, butter\ncheese", storedJson: store });
    assert.equal(parseOutput(draft.content)["Dairy"].length, 3);
  });

  it("ignores empty segments from trailing commas", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft, prompts } = runOnShoppingDraft({ draftContent: "milk,,,", storedJson: store });
    assert.equal(prompts.length, 0);
    assert.equal(parseOutput(draft.content)["Dairy"].length, 1);
  });

  it("parses comma-separated input from other draft and appends", () => {
    const store = { aisleOrder: ["Dairy", "Bakery"], items: { milk: "Dairy", bread: "Bakery" } };
    const { shoppingDraft } = runFromOtherDraft({
      draftContent: "milk, bread",
      shoppingContent: "",
      storedJson: store,
    });
    const parsed = parseOutput(shoppingDraft.content);
    assert.equal(parsed["Dairy"].length, 1);
    assert.equal(parsed["Bakery"].length, 1);
  });
});

// =============================================================================
// Checkbox format
// =============================================================================

describe("checkbox output format", () => {
  it("outputs items with - [ ] prefix", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({ draftContent: "milk", storedJson: store });
    assert.ok(draft.content.includes("- [ ] milk"));
  });

  it("re-sorts existing checkbox items correctly", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", butter: "Dairy" } };
    const { draft } = runOnShoppingDraft({
      draftContent: "## Dairy\n- [ ] butter\n- [ ] milk",
      storedJson: store,
    });
    const parsed = parseOutput(draft.content);
    assert.deepEqual(parsed["Dairy"], ["butter", "milk"]);
  });
});

describe("checked item removal", () => {
  it("removes checked-off items from the list", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", butter: "Dairy" } };
    const { draft } = runOnShoppingDraft({
      draftContent: "## Dairy\n- [x] milk\n- [ ] butter",
      storedJson: store,
    });
    const parsed = parseOutput(draft.content);
    assert.equal(parsed["Dairy"].length, 1);
    assert.equal(parsed["Dairy"][0], "butter");
  });

  it("removes all items if all are checked", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { draft } = runOnShoppingDraft({
      draftContent: "- [x] milk",
      storedJson: store,
    });
    assert.equal(draft.content, "");
  });

  it("handles uppercase X in checkbox", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy", butter: "Dairy" } };
    const { draft } = runOnShoppingDraft({
      draftContent: "- [X] milk\n- [ ] butter",
      storedJson: store,
    });
    const parsed = parseOutput(draft.content);
    assert.equal(parsed["Dairy"].length, 1);
    assert.equal(parsed["Dairy"][0], "butter");
  });

  it("does not prompt for checked items that are unknown", () => {
    const store = { aisleOrder: ["Dairy"], items: { milk: "Dairy" } };
    const { prompts } = runOnShoppingDraft({
      draftContent: "- [x] mystery\nmilk",
      storedJson: store,
    });
    assert.equal(prompts.length, 0);
  });
});
