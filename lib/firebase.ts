import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider for better UX
// DO NOT set client_id here - Firebase uses its own Web Client ID 
// (configured in Firebase Console > Authentication > Sign-in method > Google)
// Setting a custom client_id causes redirect_uri_mismatch errors
googleProvider.setCustomParameters({
  prompt: "select_account", // Always show account picker for better UX
});

// Add scopes if needed (email and profile are included by default)
googleProvider.addScope("email");
googleProvider.addScope("profile");

export { app, auth, googleProvider };
