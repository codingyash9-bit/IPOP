import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {getFirebaseAdmin} from '@/firebase/admin';

// Get the project ID from the initialized Firebase Admin SDK.
// This ensures Genkit uses the same authenticated project as Firestore.
const {projectId} = getFirebaseAdmin();

export const ai = genkit({
  plugins: [
    googleAI({
      // Explicitly passing the projectId stabilizes authentication.
      projectId: projectId,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
