# Recommender

AI-powered recommendation lists with feedback-driven learning. Uses the Anthropic Claude API to generate personalised recommendations that improve with your feedback.

## Commands

```bash
bun install       # Install dependencies
bb build          # Build for local dev
bb build:ci       # Build for production (with base-path)
bb dev            # Dev mode with watch + serve
bb serve          # Serve built files
bb clean          # Clean build artifacts
```

## Structure

```
src/
  index.html          # HTML template
  app.jsx             # Main entry point and app state
  app.css             # Tailwind CSS
  hooks.js            # useLocalStorage hook
  api.js              # Anthropic API integration
  utils.js            # Phase calculation, ID generation
  components/
    ApiKeyView.jsx     # API key entry screen
    ListsView.jsx      # Main list of recommendation lists
    CreateListModal.jsx # Create a new list
    RecommendationsView.jsx # Show/interact with recommendations
    FeedbackModal.jsx  # Like/dislike reason entry
    SettingsModal.jsx  # Edit list, view phase
    HistoryModal.jsx   # Full recommendation history
build/              # Compiled JS (generated)
target/public/      # Final build output
```

## Tech Stack

- React 18 - UI
- Tailwind CSS 4 - Styling
- Bun - Bundler
- Babashka - Task runner
- Anthropic Claude API - Recommendation generation
