"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/ts/supabase";
import Link from "next/link";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-reset-password`,
      });

      if (error) {
        setError(`오류: ${error.message}`);
        return;
      }

      setMessage("비밀번호 재설정 링크가 이메일로 전송되었습니다.\n확인해주세요.");
    } catch (err) {
      setError("예기치 않은 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className="bg-[#FFFFFF] flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-[#4A4A4A] text-2xl font-['Pretendard'] font-bold mb-4">
        비밀번호 재설정
      </h1>
      <p className="text-[#4A4A4A] text-base font-['Pretendard'] mb-6 whitespace-pre-line">
        비밀번호 재설정 링크를 보내드립니다{`\n`}
        링크를 통해 새 비밀번호를 설정할 수 있어요{`\n`}
        가입하신 계정의 이메일 주소를 입력해주세요
      </p>
      <form onSubmit={handleResetPassword} className="w-full max-w-[480px]">
        <div className="mb-4">
          <label className="text-[#4A4A4A] font-['Pretendard'] text-base mb-2 block">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            className="w-full h-12 border border-[#E8DECF] rounded-xl p-4 text-[#A1824A] font-['Pretendard'] outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-[#A9CBA4] text-sm mb-4 whitespace-pre-line">{message}</p>}
        <button
          type="submit"
          className="w-full h-12 bg-[#EBBA61] rounded-xl text-white font-['Pretendard'] font-bold"
        >
          재설정 링크 보내기
        </button>
      </form>
      <Link href="/login" className="mt-4 text-[#A1824A] font-['Pretendard'] text-sm">
        로그인으로 돌아가기
      </Link>
    </main>
  );
};

export default ForgotPassword;