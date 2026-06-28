/**
 * @file firebase.ts
 * @description Standard Firebase client-side SDK initialization.
 * @purpose Connects to the provisioned Firestore database and Firebase Authentication services.
 * @interaction Loaded globally by components requesting authentication, custom product mutations, and real-time order streams.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  getDocFromServer
} from 'firebase/firestore';

// Import our provisioned web credentials dynamically
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase app singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Validates connection to Firestore to prevent silent failures.
 */
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

/**
 * Purpose: Dynamically provisions the required primary admin user if they do not yet exist.
 * Input: none
 * Return: Promise<void>
 * Why: Guarantees that thekidsnestbd@gmail.com / 712284@@ is always valid and available for operations.
 */
export async function ensureAdminCreated() {
  const adminEmail = 'thekidsnestbd@gmail.com';
  const adminPassword = '712284@@';

  try {
    // Attempt to register this user first
    const credential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = credential.user;
    
    // Set their Firestore user role as "admin"
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: adminEmail,
      role: 'admin',
      displayName: 'TheKidsNest Admin',
      createdAt: new Date().toISOString()
    });
    console.log('Admin user auto-provisioned successfully!');
  } catch (err: any) {
    // If user already exists, we will update or ensure their role in Firestore is admin
    if (err.code === 'auth/email-already-in-use') {
      try {
        // Sign in to discover their UID and force-set their role
        const credential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        const user = credential.user;
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
          await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: adminEmail,
            role: 'admin',
            displayName: 'TheKidsNest Admin',
            createdAt: userDoc.exists() ? (userDoc.data()?.createdAt || new Date().toISOString()) : new Date().toISOString()
          }, { merge: true });
          console.log('Force set existing admin role in Firestore.');
        }
        
        // Log back out so we don't force log-in as admin for guest clients automatically on boot
        await signOut(auth);
      } catch (innerErr) {
        // Quiet fail: admin is already configured or we couldn't sign in right now
      }
    }
  }
}
