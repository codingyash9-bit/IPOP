
// IMPORTANT: This is a placeholder for a one-time database seeding script.
// In a real application, you would run a script like this from a secure server environment
// to populate your initial database.

import { collection, writeBatch, Firestore, doc } from 'firebase/firestore';
import { ipos } from './ipo-data'; // Corrected to use the full IPO data source

/**
 * Seeds the Firestore database with the initial set of IPO data.
 * @param {Firestore} db The Firestore database instance from the client.
 */
export async function seedDatabase(db: Firestore) {
  const iposCollectionRef = collection(db, 'ipos');
  const batch = writeBatch(db);

  console.log('Starting to seed database from client...');

  ipos.forEach((ipo) => {
    // For client-side, we explicitly create a document reference with the desired ID
    const docRef = doc(iposCollectionRef, ipo.id);
    batch.set(docRef, ipo);
  });

  try {
    await batch.commit();
    console.log(`Successfully seeded ${ipos.length} IPOs.`);
    return { success: true, message: `Successfully seeded ${ipos.length} IPOs.` };
  } catch (error) {
    console.error('Error seeding database from client:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to seed database: ${errorMessage}` };
  }
}
