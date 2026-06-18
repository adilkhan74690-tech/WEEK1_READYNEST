'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes Firebase services on the client side.
 * Returns null if the configuration is invalid to prevent SDK crashes.
 */
export function initializeFirebase() {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    const auth = getAuth(app);

    return { firebaseApp: app, firestore: db, auth };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
}
