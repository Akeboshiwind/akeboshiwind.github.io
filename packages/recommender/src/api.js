import { getPhase } from './utils.js';

const SYSTEM_PROMPT_BASE = `You are a helpful recommendation agent.
You thrive on giving people relevant recommendations that they fully enjoy.
You are delighted at both positive and negative feedback because by using both you can come up with ideas that fit the user's wants exactly.
The user will give you a description of the kind of recommendations they are looking for.
They will also optionally give you some initial things they've tried with their feedback to help you start out. As time goes on, the feedback becomes more relevant than the description, and the later feedback becomes most relevant.
Your goal is to provide a list of 3-5 new recommendations. You NEVER give a recommendation that has already been given feedback on or previously recommended. Each recommendation is influenced by both the description and the previous feedback.`;

const PHASE_INSTRUCTIONS = {
  exploring: `Early recommendations (first 1-2 rounds):
- Provide a mix: 2-3 "safe bets" that clearly match their description to build trust
- Include 1-2 "exploration" options that test the boundaries of their interests
- Use varied approaches to understand their preferences better`,

  refining: `Transitioning recommendations (rounds 3-5):
- Start focusing more on the patterns emerging from their feedback
- Balance proven winners with a couple of targeted experiments
- Use their positive feedback to guide similar recommendations`,

  honing: `Later recommendations (after 5+ rounds):
- Focus primarily on what you've learned they enjoy
- Include only occasional "exploration" options to test if interests have evolved
- Prioritize recommendations that build on positive feedback patterns`,
};

const FEEDBACK_SECTION = `Feedback interpretation:
- Positive feedback = similar style/genre/approach is wanted
- Negative feedback = avoid that specific style/genre/approach
- Mixed feedback = pay attention to what specifically they liked/disliked
- Strong reactions (love/hate) are more valuable than mild reactions`;

const EXAMPLES = `Examples:

User description: "I want sci-fi books with complex characters and interesting technology"

❌ Early recommendations - too safe:
- Dune
- Foundation
- Neuromancer

✅ Early recommendations - good mix:
- Dune (safe bet - classic sci-fi)
- Klara and the Sun (exploration - literary sci-fi)
- Becky Chambers' Wayfarers series (exploration - cozy sci-fi)
- Liu Cixin's Three Body Problem (safe bet - hard sci-fi)

User feedback: "Loved Dune and Three Body Problem! Klara was too slow. Wayfarers too optimistic."

❌ Bad response with explanations:
- Hyperion (because it has complex characters like Dune)
- Red Mars (since you liked hard sci-fi elements)
- Foundation (classic like the ones you enjoyed)

✅ Good response - clean list building on feedback:
- Hyperion
- Red Mars
- Altered Carbon
- The Expanse series

❌ Later rounds - repeating previous recommendations:
- Dune Messiah
- Three Body Problem sequel
- Foundation

✅ Later rounds - all new, learning from patterns:
- Blindsight
- Ancillary Justice
- The Fifth Season`;

function buildSystemPrompt(phase) {
  const phaseInstructions = PHASE_INSTRUCTIONS[phase] || PHASE_INSTRUCTIONS.honing;
  return [SYSTEM_PROMPT_BASE, phaseInstructions, FEEDBACK_SECTION, EXAMPLES].join('\n\n');
}

function buildUserMessage(list) {
  const reviewed = list.recommendations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => (a.reviewedAt || 0) - (b.reviewedAt || 0));

  const allRecommended = list.recommendations.map(r => r.text);

  const historyText =
    reviewed.length > 0
      ? reviewed
          .map(
            r =>
              `- ${r.text}: ${r.status === 'liked' ? '👍 Liked' : '👎 Disliked'}${r.feedback ? ` — "${r.feedback}"` : ''}`,
          )
          .join('\n')
      : 'No feedback yet — these are the first recommendations.';

  const previousList =
    allRecommended.length > 0
      ? allRecommended.map(t => `- ${t}`).join('\n')
      : 'None yet.';

  return `User description: "${list.description}"

Previously recommended (DO NOT repeat any of these):
${previousList}

Feedback history (most recent feedback is most relevant):
${historyText}`;
}

export async function generateRecommendations(apiKey, list) {
  const phase = getPhase(list);
  const systemPrompt = buildSystemPrompt(phase);
  const userMessage = buildUserMessage(list);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      tools: [
        {
          name: 'provide_recommendations',
          description:
            'Provide a list of 3-5 new recommendations based on the user\'s preferences and feedback history.',
          input_schema: {
            type: 'object',
            properties: {
              recommendations: {
                type: 'array',
                items: { type: 'string' },
                minItems: 3,
                maxItems: 5,
                description:
                  'List of 3-5 recommendation strings. Each is just the name/title — no explanations or parenthetical notes.',
              },
            },
            required: ['recommendations'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'provide_recommendations' },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const toolUse = data.content.find(
    c => c.type === 'tool_use' && c.name === 'provide_recommendations',
  );

  if (!toolUse || !Array.isArray(toolUse.input?.recommendations)) {
    throw new Error('Unexpected API response format');
  }

  return toolUse.input.recommendations;
}
