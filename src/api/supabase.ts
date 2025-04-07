import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수 확인
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "환경 변수 NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다."
  );
}

// 디버깅용 로그 (운영 환경에서는 제거 가능)
console.log("Supabase 연결 설정:", {
  url: supabaseUrl,
  anon_key: supabaseAnonKey.substring(0, 10) + "...",
});

// Supabase 클라이언트 초기화
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 세션 유지 비활성화 (필요에 따라 조정)
  },
});