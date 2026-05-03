import { initializeApp } from "[https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js](https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js)";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "[https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js](https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js)";

// REPLACE WITH YOUR ACTUAL CONFIG FROM FIREBASE CONSOLE
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
const analytics = getAnalytics(app);

// DOM Elements
const signInBtn = document.getElementById('google-signin-btn');
const logoutBtn = document.getElementById('logout-btn');
const statusMsg = document.getElementById('status-msg');
const userProfile = document.getElementById('user-profile');
const authActions = document.getElementById('auth-actions');

// --- Auth Functions ---

const handleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // Successful sign-in
        console.log("User signed in:", result.user);
    } catch (error) {
        statusMsg.innerText = `Error: ${error.message}`;
        console.error("Auth Error:", error);
    }
};

const handleSignOut = () => signOut(auth);

// --- Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userProfile.classList.remove('hidden');
        authActions.classList.add('hidden');
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-email').innerText = user.email;
        document.getElementById('user-photo').src = user.photoURL;
    } else {
        // User is signed out
        userProfile.classList.add('hidden');
        authActions.classList.remove('hidden');
    }
});

// Event Listeners
signInBtn.addEventListener('click', handleSignIn);
logoutBtn.addEventListener('click', handleSignOut);