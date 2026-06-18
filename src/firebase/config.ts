/**
 * Firebase configuration object.
 * Securely loads from environment variables with fallback to the studio project.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || "AIzaSyBHqspVKqUXZoSrmYpPzlM_McxaQZLcopM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-2379257714-fd84d.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || "studio-2379257714-fd84d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-2379257714-fd84d.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "7481131879",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || "1:7481131879:web:3c892ec7557a0012f2e5c2",
};

/**
 * Validates that the Firebase configuration has the minimum required fields.
 */
export function isFirebaseConfigValid() {
  const config = firebaseConfig;
  return !!(
    config.apiKey && 
    config.apiKey.length > 10 && 
    config.projectId && 
    config.projectId !== "your-project-id"
  );
}
