"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login"); // 2초 후 로그인 페이지로 이동
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[844px] bg-primary-bg">
      {/* 앱 이름 */}
      <h1 className="font-pretendard text-[72px] font-medium text-progress-fill mb-4">
        책꽃이
      </h1>

      {/* 슬로건 */}
      <h2 className="font-pretendard text-[22px] font-medium text-text-primary mb-3">
        책과 함께 피어나는 순간
      </h2>

      {/* 설명 */}
      <p className="font-pretendard text-base text-text-secondary mb-5">
        잠시 후 시작됩니다...
      </p>
    </div>
  );
}