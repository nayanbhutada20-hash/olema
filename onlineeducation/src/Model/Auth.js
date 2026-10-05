
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,updateProfile,signOut,signInWithPopup } from "firebase/auth";
import { sendPasswordResetEmail,createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCLWU_LMNHpbgLihXlRVBb0vDw0pgs6X6I",
    authDomain: "onlinelearning-36cf3.firebaseapp.com",
    projectId: "onlinelearning-36cf3",
    storageBucket: "onlinelearning-36cf3.firebasestorage.app",
    messagingSenderId: "900141674855",
    appId: "1:900141674855:web:b5ddbf8d2a795dc37fffc2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


export async function SignIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            status: "success",
            data: userCredential.user,
        };
    } catch (error) {
        // Firebase provides detailed error messages
        return {
            status: "fail",
            data: {
                code: error.code,
                message: error.message,
            },
        };
    }
}

export async function SignInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        console.log("Google User:", user.displayName);
        console.log("Email:", user.email);
        console.log("UID:", user.uid);
        return {
            status:"success",
            data:user
        }
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        return {
            status:"fail",
            data:error
        }
    }
}

export async function SignUp(name,email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Get current user info
        const user = userCredential.user;
        // 🔹 Update the user's display name
        await updateProfile(user, {
            displayName: name
        });

        return {
            status:"success",
            data:user
        }
    } catch (error) {
        return {
            status:"fail",
            data:error
        }
    }
}

export async function ForgotPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");
    } catch (error) {
        alert(error.message);
    }
}

export async function LogOut() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
}
