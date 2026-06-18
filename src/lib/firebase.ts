
/**
 * DEPRECATED: This file is kept for backward compatibility during migration.
 * Use the centralized Firebase implementation from '@/firebase' instead.
 */
import { initializeFirebase } from "@/firebase";

const { auth, firestore: db, storage } = initializeFirebase();

export { auth, db, storage };
