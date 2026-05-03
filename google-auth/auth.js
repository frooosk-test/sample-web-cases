import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification // Added for confirmation logic
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBfy_q5kA-tD8Qds9MpISnG5hmByZlGzPM",
    authDomain: "summify-c84e5.firebaseapp.com",
    projectId: "summify-c84e5",
    storageBucket: "summify-c84e5.firebasestorage.app",
    messagingSenderId: "573523827915",
    appId: "1:573523827915:web:77e75bd21c3555d657cf4e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const emailSignInBtn = document.getElementById('email-signin-btn');
const googleSignInBtn = document.getElementById('google-signin-btn');
const statusMsg = document.getElementById('status-msg');
const userProfile = document.getElementById('user-profile');
const authActions = document.getElementById('auth-actions');

/**
 * Sends a verification/confirmation email to the current user.
 */
const sendConfirmationEmail = async (user) => {
    try {
        await sendEmailVerification(user);
        statusMsg.style.color = "green";
        statusMsg.innerText = "Confirmation email sent! Please check your inbox.";
    } catch (error) {
        console.error("Verification error:", error.code);
        statusMsg.style.color = "red";
        statusMsg.innerText = "Could not send confirmation email. Try again later.";
    }
};

const handleEmailAuth = async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || password.length < 6) {
        statusMsg.innerText = "Valid email and 6+ character password required.";
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // If sign in is successful, we check verification status in the observer
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                // Trigger confirmation email immediately upon registration
                await sendConfirmationEmail(userCredential.user);
            } catch (regError) {
                statusMsg.innerText = `Registration failed: ${regError.message}`;
            }
        } else {
            statusMsg.innerText = `Error: ${error.message}`;
        }
    }
};

// --- State Observer ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        userProfile.classList.remove('hidden');
        authActions.classList.add('hidden');
        
        document.getElementById('user-name').innerText = user.displayName || "User";
        document.getElementById('user-email').innerText = user.email;
        document.getElementById('user-photo').src = user.photoURL || 'https://via.placeholder.com/80';

        // Confirmation Logic: If email isn't verified, remind them
        if (!user.emailVerified) {
            statusMsg.style.color = "orange";
            statusMsg.innerHTML = `Email not confirmed. <a href="#" id="resend-email" style="text-decoration:underline">Resend?</a>`;
            
            document.getElementById('resend-email')?.addEventListener('click', (e) => {
                e.preventDefault();
                sendConfirmationEmail(user);
            });
        }
    } else {
        userProfile.classList.add('hidden');
        authActions.classList.remove('hidden');
        statusMsg.innerText = "";
    }
});

emailSignInBtn.addEventListener('click', handleEmailAuth);
googleSignInBtn.addEventListener('click', () => signInWithPopup(auth, googleProvider));
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));