"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/ts/supabase";
import Link from "next/link";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(`오류: ${error.message}`);
        return;
      }

      setMessage("비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("예기치 않은 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className="bg-[#FFFFFF] flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-[#4A4A4A] text-2xl font-['Pretendard'] font-bold mb-4">
        새 비밀번호 설정
      </h1>
      <p className="text-[#4A4A4A] text-base font-['Pretendard'] mb-6">
        새로운 비밀번호를 입력해주세요.
      </p>
      <form onSubmit={handleUpdatePassword} className="w-full max-w-[480px]">
        <div className="mb-4">
          <label className="text-[#4A4A4A] font-['Pretendard'] text-base mb-2 block">
            새 비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요"
            className="w-full h-12 border border-[#E8DECF] rounded-xl p-4 text-[#A1824A] font-['Pretendard'] outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-[#4A4A4A] font-['Pretendard'] text-base mb-2 block">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            className="w-full h-12 border border-[#E8DECF] rounded-xl p-4 text-[#A1824A] font-['Pretendard'] outline-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-[#A9CBA4] text-sm mb-4">{message}</p>}
        <button
          type="submit"
          className="w-full h-12 bg-[#EBBA61] rounded-xl text-white font-['Pretendard'] font-bold"
        >
          비밀번호 변경
        </button>
      </form>
      <Link href="/login" className="mt-4 text-[#A1824A] font-['Pretendard'] text-sm">
        로그인으로 돌아가기
      </Link>
    </main>
  );
};

export default ResetPassword;