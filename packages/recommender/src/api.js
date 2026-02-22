import { getPhase } from './utils.js';

const SYSTEM_PROMPT_BASE = `You are a helpful recommendation agent.
You thrive on giving people relevant recommendations that they fully enjoy.
The user will give you a description of the kind of recommendations they are looking for.
They will also give you a list of things they've already seen so you can avoid repetition and branch out.
Your goal is to provide a list of 3-5 new recommendations. You NEVER repeat anything already seen or previously recommended.`;

const PHASE_INSTRUCTIONS = {
  exploring: `Early recommendations (first 1-2 rounds):
- Provide a mix: 2-3 "safe bets" that clearly match their description
- Include 1-2 "exploration" options that test the boundaries of their interests
- Use varied approaches to discover what resonates`,

  refining: `Transitioning recommendations (rounds 3-5):
- Look at what they've seen and branch into adjacent territory
- Balance familiar ground with a couple of targeted experiments`,

  honing: `Later recommendations (after 5+ rounds):
- They've seen a lot — look for less obvious gems in the space
- Occasionally explore adjacent interests they may not have considered`,
};

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

Already seen: Dune, Three Body Problem, Klara and the Sun, Wayfarers series

❌ Later rounds - repeating already seen:
- Dune Messiah
- Three Body Problem sequel

✅ Later rounds - all new, branching out:
- Blindsight
- Ancillary Justice
- The Fifth Season
- Hyperion`;

function buildSystemPrompt(phase) {
  const phaseInstructions = PHASE_INSTRUCTIONS[phase] || PHASE_INSTRUCTIONS.honing;
  return [SYSTEM_PROMPT_BASE, phaseInstructions, EXAMPLES].join('\n\n');
}

function buildUserMessage(list) {
  const seen = list.recommendations.filter(r => r.status === 'seen');
  const pending = list.recommendations.filter(r => r.status === 'pending');

  const seenText =
    seen.length > 0
      ? seen.map(r => `- ${r.text}${r.note ? ` — "${r.note}"` : ''}`).join('\n')
      : 'None yet.';

  const pendingText =
    pending.length > 0
      ? pending.map(r => `- ${r.text}`).join('\n')
      : 'None.';

  return `User description: "${list.description}"

Already seen (notes provide context for future recommendations):
${seenText}

Already suggested but not yet reviewed (DO NOT repeat these either):
${pendingText}`;
}

export function buildFullPrompt(list) {
  const phase = getPhase(list);
  return {
    system: buildSystemPrompt(phase),
    user: buildUserMessage(list),
  };
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
