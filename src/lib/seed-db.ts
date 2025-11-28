// IMPORTANT: This is a placeholder for a one-time database seeding script.
// In a real application, you would run a script like this from a secure server environment
// to populate your initial database.
//
// To use this in development:
// 1. You could create a temporary page or a server action that calls `seedDatabase`.
// 2. Ensure you are authenticated with sufficient permissions before running.
// 3. REMOVE or disable the script for production builds.

import { collection, writeBatch, Firestore } from 'firebase/firestore';
import { initialIpos } from './initial-ipo-data'; // We'll create this file next

/**
 * Seeds the Firestore database with the initial set of IPO data.
 * @param {Firestore} db The Firestore database instance.
 */
export async function seedDatabase(db: Firestore) {
  const iposCollection = collection(db, 'ipos');
  const batch = writeBatch(db);

  console.log('Starting to seed database...');

  initialIpos.forEach((ipo) => {
    // Firestore can generate the ID if you use addDoc, but since our mock data has IDs, we'll use them.
    const docRef = collection(iposCollection, ipo.id);
    batch.set(docRef, ipo);
  });

  try {
    await batch.commit();
    console.log(`Successfully seeded ${initialIpos.length} IPOs.`);
    return { success: true, message: `Seeded ${initialIpos.length} IPOs.` };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.' };
  }
}
