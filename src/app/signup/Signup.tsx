"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/ts/supabase";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const router = useRouter();

  // 비밀번호 강도 계산 함수
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      return { level: "", color: "", width: "w-0" };
    }

    let strength = 0;
    if (password.length >= 12) strength += 2;
    else if (password.length >= 9) strength += 1.5;
    else if (password.length >= 6) strength += 1;

    if (/[a-z]/.test(password)) strength += 0.5;
    if (/[A-Z]/.test(password)) strength += 0.5;
    if (/[0-9]/.test(password)) strength += 0.5;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 0.5;

    if (strength < 2) return { level: "약함", color: "text-red-500", width: "w-1/4" };
    if (strength < 3) return { level: "보통", color: "text-yellow-500", width: "w-2/4" };
    return { level: "양호", color: "text-[#A9CBA4]", width: "w-full" };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateForm = (): boolean => {
    let isValid = true;

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

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("비밀번호는 최소 6자 이상이어야 합니다.");
      isValid = false;
    } else {
      setPasswordError("");
    }

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0], // 기본 이름 설정
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes("User already registered")) {
          setModalMessage("이미 등록된 이메일입니다. 다른 이메일을 사용하거나 로그인 페이지로 이동하세요.");
        } else {
          setModalMessage(`회원가입 실패: ${error.message}`);
        }
        setIsModalOpen(true);
        return;
      }

      // 회원가입 성공 시 (이메일 인증 비활성화 상태에서는 세션이 바로 생성됨)
      if (data.session) {
        setModalMessage("회원가입 및 로그인이 완료되었습니다.");
        setIsModalOpen(true);
        setTimeout(() => {
          router.push('/main'); // main 페이지로 이동
        }, 1000); // 모달을 잠깐 보여주고 이동
      } else {
        console.error("세션이 생성되지 않았습니다. Supabase 설정을 확인하세요.");
        setModalMessage("회원가입은 완료되었으나 로그인에 실패했습니다. 다시 시도해주세요.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setModalMessage("예기치 않은 오류가 발생했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error; 
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setModalMessage("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  return (
    <main className="bg-[#FFFFFF] flex flex-col items-start justify-between min-h-screen overflow-hidden">
      <form onSubmit={handleSignup} className="w-full">
        <div className="flex flex-col gap-0 items-start justify-start w-full">
          {/* 뒤로가기 버튼 */}
          <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full">
            <Link href="/login">
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
          <div className="pt-6 px-4 pb-3 flex flex-col gap-0 items-start justify-start w-full">
            <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-[32px] leading-10 font-bold w-full">
              책꽂이 시작하기
            </h1>
          </div>

          {/* 설명 텍스트 */}
          <div className="pt-1 px-4 pb-3 flex flex-col gap-0 items-start justify-start w-full">
            <p className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-6 w-full">
              간단한 회원가입으로 책꽂이의 모든 기능을 사용해보세요.
            </p>
          </div>

          {/* 이메일 입력 */}
          <div className="pt-3 px-4 pb-3 flex flex-row gap-4 items-end justify-start w-full max-w-[480px] mx-auto">
            <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
              <label className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-6 font-medium pb-2">
                이메일
              </label>
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DECF] p-[15px] flex flex-row gap-0 items-center justify-start w-full h-14">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="이메일을 입력해주세요"
                  className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
                />
              </div>
              {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="pt-3 px-4 pb-3 flex flex-row gap-4 items-end justify-start w-full max-w-[480px] mx-auto">
            <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
              <label className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-6 font-medium pb-2">
                비밀번호
              </label>
              <div className="rounded-xl flex flex-row gap-0 items-start justify-start w-full">
                <div className="bg-[#FFFFFF] rounded-tl-xl rounded-bl-xl border border-[#E8DECF] border-r-0 p-[15px] flex flex-row gap-0 items-center justify-start flex-1 h-14">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="안전한 비밀번호를 입력해주세요"
                    className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="bg-[#FFFFFF] rounded-tr-xl rounded-br-xl border border-[#E8DECF] border-l-0 pr-[15px] flex items-center justify-center h-14"
                >
                  <Image
                    src={showPassword ? "/assets/icons/eye-on.svg" : "/assets/icons/eye-off.svg"}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
              {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
            </div>
          </div>

          {/* 비밀번호 강도 인디케이터 */}
          <div className="pt-1 px-4 pb-3 flex flex-col gap-1 items-start justify-start w-full max-w-[480px] mx-auto">
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-full rounded ${passwordStrength.width} ${
                  passwordStrength.level === "약함"
                    ? "bg-red-500"
                    : passwordStrength.level === "보통"
                    ? "bg-yellow-500"
                    : "bg-[#A9CBA4]"
                }`}
              />
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-row gap-1 items-center">
                <p className="text-[#A1824A] font-['Pretendard'] text-sm leading-[21px]">
                  비밀번호 보안 강도:
                </p>
                {passwordStrength.level && (
                  <p className={`font-['Pretendard'] text-sm leading-[21px] ${passwordStrength.color}`}>
                    {passwordStrength.level}
                  </p>
                )}
              </div>
              <p className="text-[#A1824A] font-['Pretendard'] text-sm leading-[21px]">
                6자 이상 권장
              </p>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="pt-3 px-4 pb-3 flex flex-row gap-4 items-end justify-start w-full max-w-[480px] mx-auto">
            <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
              <label className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-6 font-medium pb-2">
                비밀번호 확인
              </label>
              <div className="rounded-xl flex flex-row gap-0 items-start justify-start w-full">
                <div className="bg-[#FFFFFF] rounded-tl-xl rounded-bl-xl border border-[#E8DECF] border-r-0 p-[15px] flex flex-row gap-0 items-center justify-start flex-1 h-14">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError("");
                    }}
                    placeholder="비밀번호를 한 번 더 입력해주세요"
                    className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  className="bg-[#FFFFFF] rounded-tr-xl rounded-br-xl border border-[#E8DECF] border-l-0 pr-[15px] flex items-center justify-center h-14"
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
          <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-0 items-start md:items-center justify-start md:justify-center flex-wrap w-full max-w-[480px] mx-auto">
            <button
              type="submit"
              className="bg-[#ebba61] rounded-xl px-4 flex flex-row gap-0 items-center justify-center w-full h-12 min-w-[160px] max-w-[480px]"
            >
              <div className="text-[#ffffff] text-center font-['PlusJakartaSans-Bold'] text-base leading-6 font-bold">
                회원가입
              </div>
            </button>
          </div>
        </div>

        {/* 이용약관 동의 문구 */}
        <div className="flex flex-col gap-0 items-start justify-start w-full">
          <div className="pt-1 px-4 pb-3 flex flex-col gap-0 items-center justify-start w-full">
            <p className="text-[#A1824A] text-center font-['Pretendard'] text-sm leading-[21px]">
              회원가입 시 이용약관에 동의하게 됩니다.
            </p>
          </div>
          <div className="bg-[#FFFFFF] h-5 w-full" />
        </div>
      </form>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-[350px] flex flex-col gap-4">
            <h3 className="text-[#1C2526] text-lg font-['Pretendard'] font-semibold">알림</h3>
            <p className="text-[#1C2526] text-base font-['Pretendard'] font-normal">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="bg-[#EBBA61] text-white text-base font-['Pretendard'] font-medium px-4 py-2 rounded-lg hover:bg-[#e0a852] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Signup;