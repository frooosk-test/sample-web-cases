// Consolidate versioning to 11.0.0 for all modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Valid Config from provided context
const firebaseConfig = {
    apiKey: "AIzaSyBfy_q5kA-tD8Qds9MpISnG5hmByZlGzPM",
    authDomain: "summify-c84e5.firebaseapp.com",
    projectId: "summify-c84e5",
    storageBucket: "summify-c84e5.firebasestorage.app",
    messagingSenderId: "573523827915",
    appId: "1:573523827915:web:77e75bd21c3555d657cf4e",
    measurementId: "G-MNS86L91PP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Analytics is optional for Auth but must match version
const analytics = getAnalytics(app);

// DOM Elements
const signInBtn = document.getElementById('google-signin-btn');
const logoutBtn = document.getElementById('logout-btn');
const statusMsg = document.getElementById('status-msg');
const userProfile = document.getElementById('user-profile');
const authActions = document.getElementById('auth-actions');

// --- Auth Functions ---
const handleSignIn = async () => {
    statusMsg.innerText = "Connecting to Google...";
    try {
        // Use Popup for desktop web as requested
        const result = await signInWithPopup(auth, provider);
        console.log("Success:", result.user.displayName);
    } catch (error) {
        // Robust Error Handling for common Firebase Auth issues
        if (error.code === 'auth/popup-blocked') {
            statusMsg.innerText = "Error: Please allow popups for this site.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            statusMsg.innerText = "Sign-in cancelled.";
        } else {
            statusMsg.innerText = `Error: ${error.message}`;
        }
        console.error("Auth Error:", error.code, error.message);
    }
};

const handleSignOut = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign out failed", error);
    }
};

// --- State Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        userProfile.classList.remove('hidden');
        authActions.classList.add('hidden');
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-email').innerText = user.email;
        document.getElementById('user-photo').src = user.photoURL;
        statusMsg.innerText = "";
    } else {
        userProfile.classList.add('hidden');
        authActions.classList.remove('hidden');
    }
});

// Event Listeners
signInBtn.addEventListener('click', handleSignIn);
logoutBtn.addEventListener('click', handleSignOut);