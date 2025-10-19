
import { defineFlow, runFlow } from '@genkit-ai/flow';
import { geminiPro } from '@genkit-ai/google-genai';
import * as z from 'zod';

// Define the input schema for the flow
const MenuSuggestionInput = z.object({
  country: z.string(),
});

// Define the flow
export const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: MenuSuggestionInput,
    outputSchema: z.string(),
  },
  async (input) => {
    const { country } = input;

    const prompt = `Suggest a typical dish from ${country}. Just the name of the dish.`;

    const llmResponse = await geminiPro.generate({
      prompt: prompt,
      config: { temperature: 1 },
    });

    return llmResponse.text();
  }
);

// Example of how to run the flow
async function runExample() {
  const result = await runFlow(menuSuggestionFlow, { country: 'Japan' });
  console.log('Suggestion for Japan:', result);
}

// Uncomment to run the example when this file is executed directly
// runExample();
