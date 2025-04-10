"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/api/supabase";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true); // 기본 체크
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showAgreePopup, setShowAgreePopup] = useState(false);
  const router = useRouter();

  // 기기 감지
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/android/i.test(userAgent)) {
      setIsAndroid(true);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setIsIOS(true);
    }
  }, []);

  // 팝업 5초 후 자동 닫기
  useEffect(() => {
    if (showAgreePopup) {
      const timer = setTimeout(() => setShowAgreePopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAgreePopup]);

  const validateForm = () => {
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

    return isValid;
  };

  const upsertUser = async (authId: string, email: string) => {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        { auth_id: authId, email, nickname: email.split("@")[0] }, // 기본 닉네임 설정
        { onConflict: "auth_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("사용자 데이터 upsert 오류:", error);
      throw new Error("사용자 데이터 저장 실패: " + error.message);
    }
    return data;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    if (!agree) {
      setShowAgreePopup(true);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("로그인 실패: " + error.message);
    } else {
      const authId = data.user?.id;
      if (authId) {
        await upsertUser(authId, email);
      }
      router.push("/records");
    }
  };

  const handleGoogleLogin = async () => {
    if (!agree) {
      setShowAgreePopup(true);
      return;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/main` },
    });
    if (error) {
      alert("구글 로그인 실패: " + error.message);
    } else if (data.url) {
      window.location.href = data.url; // OAuth 리다이렉트
    }
  };

  const handleAppleLogin = async () => {
    if (!agree) {
      setShowAgreePopup(true);
      return;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/main` },
    });
    if (error) {
      alert("애플 로그인 실패: " + error.message);
    } else if (data.url) {
      window.location.href = data.url; // OAuth 리다이렉트
    }
  };

  return (
    <main className="bg-[#ffffff] flex flex-col items-start md:items-center justify-between min-h-[844px] overflow-hidden">
      <div className="flex flex-col gap-0 items-start md:items-center justify-start self-stretch">
        <div className="bg-[#ffffff] flex flex-row gap-0 items-start md:items-center justify-start md:justify-center self-stretch">
          <Image
            src="/assets/images/login-hero.png"
            alt="Login Hero"
            width={480}
            height={320}
            className="w-full object-cover max-w-[480px]"
          />
        </div>

        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-end justify-start md:justify-center flex-wrap w-full max-w-[480px]">
          <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
            <div className="pb-2">
              <div className="text-[#1c170d] text-left font-['PlusJakartaSans-Medium'] text-base leading-6 font-medium">
                이메일
              </div>
            </div>
            <div className="bg-[#ffffff] rounded-xl border border-[#e8decf] p-[15px] flex flex-row gap-0 items-center justify-start self-stretch h-14">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="이메일"
                className="text-[#a1824a] font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal w-full outline-none"
              />
            </div>
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>
        </div>

        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-end justify-start md:justify-center flex-wrap w-full max-w-[480px]">
          <div className="flex flex-col gap-0 items-start justify-start flex-1 min-w-[160px]">
            <div className="pb-2">
              <div className="text-[#1c170d] text-left font-['PlusJakartaSans-Medium'] text-base leading-6 font-medium">
                비밀번호
              </div>
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
                  placeholder="비밀번호"
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

        <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-0 items-start md:items-center justify-start md:justify-center flex-wrap w-full max-w-[480px]">
          <button
            onClick={handleLogin}
            className="bg-[#ebba61] rounded-xl px-4 flex flex-row gap-0 items-center justify-center w-full h-12 min-w-[160px] max-w-[480px]"
          >
            <div className="text-[#ffffff] text-center font-['PlusJakartaSans-Bold'] text-base leading-6 font-bold">
              로그인
            </div>
          </button>
        </div>

        <div className="pt-1 pr-4 pb-3 pl-4 flex flex-row gap-2 items-center justify-between w-full max-w-[480px]">
          <Link
            href="/forgot-password"
            className="text-[#a1824a] text-left font-['PlusJakartaSans-Regular'] text-sm leading-[21px] font-normal"
          >
            비밀번호를 잊으셨나요?
          </Link>
          <Link
            href="/signup"
            className="text-[#a1824a] text-right font-['PlusJakartaSans-Bold'] text-sm leading-[21px] font-bold"
          >
            회원가입
          </Link>
        </div>

        <div className="pt-1 pr-4 pb-3 pl-4 flex flex-row gap-2 items-center justify-center w-full max-w-[480px]">
          <div className="flex-1 h-px bg-[#a1824a]"></div>
          <div className="text-[#a1824a] text-center font-['PlusJakartaSans-Regular'] text-sm leading-[21px] font-normal">
            또는
          </div>
          <div className="flex-1 h-px bg-[#a1824a]"></div>
        </div>

        {isAndroid && (
          <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-0 items-start md:items-center justify-start md:justify-center flex-wrap w-full max-w-[480px]">
            <button
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-gray-50 rounded-lg px-5 flex flex-row gap-3 items-center justify-center w-full h-12 min-w-[160px] max-w-[480px] border border-gray-300 shadow-sm"
            >
              <Image
                src="/google.png"
                alt="Google 로고"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
              <span className="text-[#3c4043] font-['Roboto'] text-[14px] font-medium">
                Google 계정으로 로그인
              </span>
            </button>
          </div>
        )}

        {isIOS && (
          <div className="pt-3 pr-4 pb-3 pl-4 flex flex-row gap-0 items-start md:items-center justify-start md:justify-center flex-wrap w-full max-w-[480px]">
            <button
              onClick={handleAppleLogin}
              className="bg-black hover:bg-gray-900 rounded-lg px-5 flex flex-row gap-3 items-center justify-center w-full h-12 min-w-[160px] max-w-[480px] border border-transparent shadow-sm"
            >
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.0001 10.1683C16.9683 8.62392 18.1575 7.56447 18.2165 7.52275C17.4484 6.40588 16.2409 6.23645 15.8042 6.21559C14.7445 6.10129 13.7266 6.84645 13.1882 6.84645C12.6397 6.84645 11.8191 6.23129 10.9243 6.25216C9.75809 6.27302 8.67778 6.91904 8.09677 7.93588C6.89445 9.99904 7.79445 13.0374 8.94938 14.6374C9.52006 15.4182 10.1933 16.2924 11.0933 16.2615C11.9724 16.2253 12.2917 15.7182 13.3514 15.7182C14.401 15.7182 14.6995 16.2615 15.6203 16.2407C16.5722 16.2253 17.1584 15.4494 17.7136 14.6582C18.3622 13.7582 18.6299 12.8788 18.6403 12.8374C18.6195 12.8269 17.0365 12.2061 17.0001 10.1683Z"
                  fill="white"
                />
                <path
                  d="M15.4091 5.21967C15.8821 4.63866 16.2048 3.82384 16.1115 3C15.4195 3.02604 14.5768 3.44217 14.083 4.00734C13.6413 4.50901 13.2563 5.34467 13.3703 6.14384C14.1488 6.21125 14.9153 5.79512 15.4091 5.21967Z"
                  fill="white"
                />
              </svg>
              <span className="text-white font-['SF Pro Display'] text-[14px] font-medium">
                Apple 계정으로 로그인
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0 items-start md:items-center justify-start self-stretch">
        <div className="px-4">
          <div className="pt-3 pb-3 flex flex-row gap-3 items-start md:items-center justify-start md:justify-center flex-wrap w-full max-w-[480px]">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="rounded border-2 border-[#e8decf] w-5 h-5 accent-[#ebba61]"
            />
            <div className="flex-1 min-w-[200px]">
              <div className="text-[#1c170d] text-left md:text-center font-['PlusJakartaSans-Regular'] text-base leading-6 font-normal">
                <Link href="/terms-of-service" className="underline">
                  서비스이용약관
                </Link>{" "}
                및{" "}
                <Link href="/privacy-policy" className="underline">
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] h-5 self-stretch" />
      </div>

      {showAgreePopup && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center py-3 z-50">
          <p className="font-['PlusJakartaSans-Regular'] text-sm">
            약관에 동의해주세요
          </p>
        </div>
      )}
    </main>
  );
}