import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env
dotenv.config({ path: resolve(process.cwd(), '.env') });
// Also load .env.local if needed
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { projects } from '../src/data/projects';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log('Seeding projects...');
  const batch = writeBatch(db);
  
  projects.forEach((project) => {
    // Generate a unique auto-ID by creating an empty doc reference
    const docRef = doc(collection(db, 'projects'));
    console.log(`Adding ${project.title} (${docRef.id})`);
    
    // We don't save the hardcoded numeric ID from local data
    const { id, ...dataToSave } = project;
    batch.set(docRef, {
      ...dataToSave,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  try {
    await batch.commit();
    console.log('Successfully seeded all projects to Firestore!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
}

seed();
