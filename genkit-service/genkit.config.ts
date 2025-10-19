
import { configureGenkit } from '@genkit-ai/core';
import { googleGenai } from '@genkit-ai/google-genai';

export default configureGenkit({
  plugins: [
    googleGenai(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
