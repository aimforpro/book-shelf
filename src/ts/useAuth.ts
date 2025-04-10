"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/ts/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      if (typeof window === "undefined") return;

      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;

          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          setUser(userData.user);

          router.replace(window.location.pathname, undefined, { shallow: true });
        } else {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          if (sessionData.session) setUser(sessionData.session.user);
        }
      } catch (err) {
        console.error("handleAuth 예외:", err);
      } finally {
        setLoading(false);
      }
    };

    handleAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/login");
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [router]);

  // 계정 삭제 함수 추가
  const deleteUser = async () => {
    try {
      if (!user?.id) throw new Error("No user ID available");
  
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
  
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }
  
      await supabase.auth.signOut();
      document.cookie = "sb-access-token=; Max-Age=0; path=/;";
      router.push("/login");
    } catch (error) {
      console.error("계정 삭제 실패:", error);
      throw error;
    } 
  };

  return { user, loading, deleteUser };
};