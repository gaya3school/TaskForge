// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
     Auth,
     User,
     onAuthStateChanged,
     signInWithEmailAndPassword,
     createUserWithEmailAndPassword,
     signOut,
     GoogleAuthProvider, // <-- 1. Import
     signInWithPopup      // <-- 2. Import
} from 'firebase/auth';
import { auth, db } from '@/firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'; // <-- 3. Import getDoc

interface AuthContextType {
     user: User | null;
     loading: boolean;
     login: (email: string, pass: string) => Promise<void>;
     signup: (email: string, pass: string) => Promise<void>;
     logout: () => void;
     signInWithGoogle: () => Promise<void>; // <-- 4. Add new function to type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
               setUser(user);
               setLoading(false);
          });
          return () => unsubscribe();
     }, []);

     const login = async (email: string, pass: string) => {
          await signInWithEmailAndPassword(auth, email, pass);
          navigate('/');
     };

     const signup = async (email: string, pass: string) => {
          try {
               const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
               const user = userCredential.user;

               // Create the user profile document in /users
               const userDocRef = doc(db, 'users', user.uid);
               await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    createdAt: serverTimestamp()
               });

               navigate('/'); // Redirect to home on success
          } catch (error) {
               console.error("Error during sign up or profile creation:", error);
               throw error;
          }
     };

     // --- 5. Add the Google Sign-In Logic ---
     const signInWithGoogle = async () => {
          const provider = new GoogleAuthProvider();
          try {
               const result = await signInWithPopup(auth, provider);
               const user = result.user;

               // Check if user already exists in /users collection
               const userDocRef = doc(db, 'users', user.uid);
               const docSnap = await getDoc(userDocRef);

               // If not, create a new user document
               if (!docSnap.exists()) {
                    await setDoc(userDocRef, {
                         uid: user.uid,
                         email: user.email,
                         displayName: user.displayName || null, // You can also store their name
                         createdAt: serverTimestamp()
                    });
               }

               navigate('/'); // Redirect to home on success
          } catch (error) {
               console.error("Error during Google sign in:", error);
               throw error; // Re-throw for the Login page to handle
          }
     };
     // --- End of new logic ---


     const logout = () => {
          signOut(auth);
          navigate('/login');
     };

     // 6. Add signInWithGoogle to the value
     const value = { user, loading, login, signup, logout, signInWithGoogle };

     if (loading) {
          return <div>Loading...</div>; // Or a real loading spinner
     }

     return (
          <AuthContext.Provider value={value}>
               {children}
          </AuthContext.Provider>
     );
}

export function useAuth() {
     const context = useContext(AuthContext);
     if (context === undefined) {
          throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
}