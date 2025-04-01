// src/app/signup/Signup.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const router = useRouter();

  // 비밀번호 강도 계산 함수
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      return { level: "", color: "", width: "w-0" }; // 비밀번호 없으면 인디케이터 채우지 않음
    }

    let strength = 0;

    // 길이 점수
    if (password.length >= 12) strength += 2;
    else if (password.length >= 9) strength += 1.5;
    else if (password.length >= 6) strength += 1;

    // 문자 종류 점수
    if (/[a-z]/.test(password)) strength += 0.5; // 소문자
    if (/[A-Z]/.test(password)) strength += 0.5; // 대문자
    if (/[0-9]/.test(password)) strength += 0.5; // 숫자
    if (/[^a-zA-Z0-9]/.test(password)) strength += 0.5; // 특수문자

    // 강도 레벨 결정
    if (strength < 2) return { level: "약함", color: "text-red-500", width: "w-1/4" };
    if (strength < 3) return { level: "보통", color: "text-yellow-500", width: "w-2/4" };
    return { level: "양호", color: "text-[#3b82f6]", width: "w-full" };
  };

  const passwordStrength = calculatePasswordStrength(password || "");

  const validateForm = () => {
    let isValid = true;

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 형식이 아닙니다.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // 비밀번호 유효성 검사
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 유효성 검사
    if (!confirmPassword) {
      setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSignup = () => {
    if (!validateForm()) {
      return;
    }

    // 회원가입 로직 (예: Supabase 또는 API 호출)
    // 성공 시 리다이렉트
    router.push("/login");
  };

  return (
    <main className="bg-[#ffffff] flex flex-col items-start justify-between min-h-[844px] overflow-hidden">
      <div className="flex flex-col gap-0 items-start justify-start self-stretch">
        {/* 뒤로가기 버튼 */}
        <div className="bg-[#ffffff] pt-4 pr-4 pb-2 pl-4 flex flex-row items-center justify-between self-stretch">
          <Link href="/">
            <div className="w-12 h-12 flex items-center justify-start">
              <Image
                src="/assets/icons/back-arrow.svg"
                alt="Back Arrow"
                width={24}
                height={24}
              />
            </div>
          </Link>
        </div>

        {/* 타이틀 */}
        <div className="pt-6 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start self-stretch">
          <h1 className="text-[#1c170d] text-left font-['PlusJakartaSans-Bold'] text-[32px] leading-10 font-bold self-stretch">
            책꽃이 시작하기
          </h1>
        </div>

        {/* 설명 텍스트 */}
        <div className="pt-1 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start self-stretch">
          <p className="text-[#1c170d] text-left font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal self-stretch">
            간단한 회원가입으로 책꽃이의 모든 기능을 사용해보세요.
          </p>
        </div>

        {/* 이메일 입력 */}
        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-end justify-start flex-wrap w-full max-w-[480px] mx-auto">
          <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
            <div className="pb-2">
              <label className="text-[#1c170d] text-left font-['PlusJakartaSans-Medium'] text-base leading-6 font-medium self-stretch">
                이메일
              </label>
            </div>
            <div className="bg-[#ffffff] rounded-xl border border-[#e8decf] p-[15px] flex flex-row gap-0 items-center justify-start self-stretch h-14">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="이메일을 입력해주세요"
                className="text-[#a1824a] font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal w-full outline-none"
              />
            </div>
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-end justify-start flex-wrap w-full max-w-[480px] mx-auto">
          <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
            <div className="pb-2">
              <label className="text-[#1c170d] text-left font-['PlusJakartaSans-Medium'] text-base leading-6 font-medium self-stretch">
                비밀번호
              </label>
            </div>
            <div className="rounded-xl flex flex-row gap-0 items-start justify-start self-stretch flex-1">
              <div className="bg-[#ffffff] rounded-tl-xl rounded-bl-xl border border-[#e8decf] border-r-0 pt-[15px] pr-2 pb-[15px] pl-[15px] flex flex-row gap-0 items-center justify-start flex-1 h-14">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="안전한 비밀번호를 입력해주세요"
                  className="text-[#a1824a] font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal w-full outline-none"
                />
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="bg-[#ffffff] rounded-tr-xl rounded-br-xl border border-[#e8decf] border-l-0 pr-[15px] flex items-center justify-center h-14"
              >
                <Image
                  src={showPassword ? "/assets/icons/eye-on.svg" : "/assets/icons/eye-off.svg"}
                  alt={showPassword ? "Hide Password" : "Show Password"}
                  width={24}
                  height={24}
                />
              </button>
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>
        </div>

        {/* 비밀번호 보안 강도 인디케이터 */}
        <div className="pt-1 pr-4 pb-3 pl-4 flex flex-col gap-1 items-start justify-start self-stretch">
          <div className="w-full max-w-[480px] h-2 bg-gray-200 rounded">
            <div
              className={`h-full rounded ${passwordStrength.width} ${
                passwordStrength.level === "약함"
                  ? "bg-red-500"
                  : passwordStrength.level === "보통"
                  ? "bg-yellow-500"
                  : "bg-[#3b82f6]"
              }`}
            />
          </div>
          <div className="flex flex-row justify-between items-center self-stretch">
            <div className="flex flex-row gap-1 items-center">
              <p className="text-[#a1824a] text-sm leading-[21px] font-['PlusJakartaSans-Regular'] font-normal">
                비밀번호 보안 강도:
              </p>
              {passwordStrength.level && (
                <p className={`text-sm leading-[21px] font-['PlusJakartaSans-Regular'] font-normal ${passwordStrength.color}`}>
                  {passwordStrength.level}
                </p>
              )}
            </div>
            <p className="text-[#a1824a] text-sm leading-[21px] font-['PlusJakartaSans-Regular'] font-normal">
              6자 이상 권장
            </p>
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-end justify-start flex-wrap w-full max-w-[480px] mx-auto">
          <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
            <div className="pb-2">
              <label className="text-[#1c170d] text-left font-['PlusJakartaSans-Medium'] text-base leading-6 font-medium self-stretch">
                비밀번호 확인
              </label>
            </div>
            <div className="rounded-xl flex flex-row gap-0 items-start justify-start self-stretch flex-1">
              <div className="bg-[#ffffff] rounded-tl-xl rounded-bl-xl border border-[#e8decf] border-r-0 pt-[15px] pr-2 pb-[15px] pl-[15px] flex flex-row gap-0 items-center justify-start flex-1 h-14">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError("");
                  }}
                  placeholder="비밀번호를 한 번 더 입력해주세요"
                  className="text-[#a1824a] font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal w-full outline-none"
                />
              </div>
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="bg-[#ffffff] rounded-tr-xl rounded-br-xl border border-[#e8decf] border-l-0 pr-[15px] flex items-center justify-center h-14"
              >
                <Image
                  src={showConfirmPassword ? "/assets/icons/eye-on.svg" : "/assets/icons/eye-off.svg"}
                  alt={showConfirmPassword ? "Hide Password" : "Show Password"}
                  width={24}
                  height={24}
                />
              </button>
            </div>
            {confirmPasswordError && (
              <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>
            )}
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-0 items-start justify-start w-full max-w-[480px] mx-auto">
          <button
            onClick={handleSignup}
            className="bg-[#ebba61] rounded-xl px-4 flex flex-row gap-0 items-center justify-center w-full h-12 min-w-[84px] max-w-[480px]"
          >
            <div className="text-[#ffffff] text-center font-['PlusJakartaSans-Bold'] text-base leading-6 font-bold">
              회원가입
            </div>
          </button>
        </div>
      </div>

      {/* 이용약관 동의 문구 */}
      <div className="flex flex-col gap-0 items-start justify-start self-stretch">
        <div className="pt-1 pr-4 pb-3 pl-4 flex flex-col gap-0 items-center justify-start self-stretch">
          <p className="text-[#a1824a] text-center font-['PlusJakartaSans-Regular'] text-sm leading-[21px] font-normal self-stretch">
            회원가입 시 이용약관에 동의하게 됩니다.
          </p>
        </div>
        <div className="bg-[#ffffff] h-5 self-stretch" />
      </div>
    </main>
  );
}