// src/app/signup/page.tsx
import Signup from "./Signup";  
import { supabase } from "@/api/supabase";

const handleGoogleSignIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Google 로그인 오류:', error);
  }
};

export default function Page() {
  return <Signup />;
}