import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Focus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseError } from 'firebase/app';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// --- 1. A simple Google Icon SVG ---
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
          <title>Google</title>
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.0-1.05 1.05-2.48 2.04-4.33 2.04-3.83 0-6.9-3.02-6.9-6.75s3.07-6.75 6.9-6.75c2.2 0 3.5.94 4.3 1.75l2.4-2.3C18.1.9 15.48 0 12.48 0 5.8 0 0 5.6 0 12.25S5.8 24.5 12.48 24.5c6.9 0 12.04-4.8 12.04-12.04 0-.85-.08-1.7-.2-2.52H12.48z" />
     </svg>
);
// --- End of Icon ---

type AuthView = 'login' | 'signup';

export default function Login() {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [view, setView] = useState<AuthView>('login');
     const [error, setError] = useState<string | null>(null);
     const { login, signup, signInWithGoogle } = useAuth(); // <-- 2. Get signInWithGoogle

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError(null); // Clear previous errors

          if (!email || !password) {
               setError("Please enter both email and password.");
               return;
          }

          try {
               if (view === 'login') {
                    await login(email, password);
               } else {
                    await signup(email, password);
               }
               // On success, the AuthContext will redirect to '/'
          } catch (err) {
               // Handle Firebase errors
               if (err instanceof FirebaseError) {
                    switch (err.code) {
                         case 'auth/user-not-found':
                         case 'auth/wrong-password':
                              setError('Invalid email or password.');
                              break;
                         case 'auth/email-already-in-use':
                              setError('An account already exists with this email.');
                              break;
                         case 'auth/weak-password':
                              setError('Password must be at least 6 characters long.');
                              break;
                         default:
                              setError('An unexpected error occurred. Please try again.');
                    }
               } else {
                    setError('An unexpected error occurred. Please try again.');
               }
          }
     };

     // --- 3. Create a separate handler for Google Sign-In ---
     const handleGoogleSignIn = async () => {
          setError(null); // Clear errors
          try {
               await signInWithGoogle();
               // Redirect is handled by AuthContext
          } catch (err) {
               setError('Failed to sign in with Google. Please try again.');
          }
     };

     return (
          <div className="flex min-h-screen w-full items-center justify-center bg-background dotted-grid p-4">
               <Card className="w-full max-w-sm shadow-elegant">
                    <CardHeader className="text-center">
                         <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                   <Focus className="h-5 w-5 text-white" />
                              </div>
                              <h1 className="text-3xl font-bold text-foreground">TaskForge</h1>
                         </div>
                         <CardTitle className="text-2xl">
                              {view === 'login' ? 'Welcome Back' : 'Create an Account'}
                         </CardTitle>
                         <CardDescription>
                              {view === 'login'
                                   ? 'Sign in to access your tasks.'
                                   : 'Sign up to start organizing.'}
                         </CardDescription>
                    </CardHeader>

                    {/* 4. We adjust padding here for the new layout */}
                    <form onSubmit={handleSubmit} className="px-6">
                         <CardContent className="space-y-4 p-0">
                              {error && (
                                   <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Login Failed</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                   </Alert>
                              )}
                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                   />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="password">Password</Label>
                                   <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                   />
                              </div>
                              <Button type="submit" className="w-full bg-gradient-primary text-white hover:opacity-90">
                                   {view === 'login' ? 'Sign In' : 'Sign Up'}
                              </Button>
                         </CardContent>
                    </form>

                    {/* --- 5. ADD DIVIDER AND GOOGLE BUTTON --- */}
                    <div className="relative my-4 px-6">
                         <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                         </div>
                         <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-card px-2 text-muted-foreground">
                                   Or continue with
                              </span>
                         </div>
                    </div>

                    <CardFooter className="flex flex-col gap-4 px-6">
                         <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              onClick={handleGoogleSignIn}
                         >
                              <GoogleIcon className="mr-2 h-4 w-4 fill-current" />
                              Continue with Google
                         </Button>

                         <Button
                              type="button"
                              variant="link"
                              className="w-full"
                              onClick={() => {
                                   setView(view === 'login' ? 'signup' : 'login');
                                   setError(null);
                              }}
                         >
                              {view === 'login'
                                   ? 'Need an account? Sign Up'
                                   : 'Already have an account? Sign In'}
                         </Button>
                    </CardFooter>
                    {/* --- END OF CHANGES --- */}

               </Card>
          </div>
     );
}