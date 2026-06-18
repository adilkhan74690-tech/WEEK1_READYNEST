'use client';

import React, { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './init';
import { FirebaseProvider } from './provider';
import { isFirebaseConfigValid } from './config';
import { FirebaseConfigError } from '@/components/firebase-config-error';

/**
 * A specialized provider that initializes Firebase on the client side.
 * It performs a configuration check before attempting initialization
 * to prevent SDK errors (like invalid API key) from crashing the app.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const isValid = useMemo(() => isFirebaseConfigValid(), []);

  const firebase = useMemo(() => {
    if (!isValid) return null;
    return initializeFirebase();
  }, [isValid]);

  // If configuration is invalid or initialization failed, show the setup UI
  if (!isValid || !firebase) {
    return <FirebaseConfigError />;
  }

  return (
    <FirebaseProvider 
      firebaseApp={firebase.firebaseApp} 
      firestore={firebase.firestore} 
      auth={firebase.auth}
    >
      {children}
    </FirebaseProvider>
  );
}
