"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";

const MyPage: React.FC = () => {
  // 배경색 상태 관리 (기본값: 시스템 색상 #fafaf7)
  const [backgroundColor, setBackgroundColor] = useState<string>("#fafaf7");

  // 배경색 변경 핸들러
  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <div className="flex flex-col gap-2.5 items-start justify-start min-h-screen" style={{ backgroundColor }}>
      <div className="flex flex-col gap-0 items-start justify-start w-full max-w-[393px] min-h-screen mx-auto relative overflow-auto" style={{ backgroundColor }}>
        {/* 헤더 */}
        <div className="bg-[#ffffff] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px] shadow-sm">
          <div className="text-[#4A4A4A] text-center font-['PlusJakartaSans-Bold',_sans-serif] text-xl leading-7 font-bold">
            마이페이지
          </div>
        </div>

        {/* 배경 변경 섹션 */}
        <div className="pt-8 px-4 pb-8 flex flex-col gap-4 items-center justify-center w-full">
          <h3 className="text-[#4A4A4A] text-left font-['Epilogue-Bold',_sans-serif] text-lg leading-6 font-bold">
            배경 설정
          </h3>
          <div className="flex flex-row gap-3 items-center justify-center">
            <button
              onClick={() => handleBackgroundChange("#ffffff")}
              className={`bg-[#ffffff] border-2 rounded-full w-10 h-10 transition-all duration-200 ${
                backgroundColor === "#ffffff" ? "border-[#EBA161] scale-110" : "border-[#cfcfcf]"
              }`}
              title="흰색"
            />
            <button
              onClick={() => handleBackgroundChange("#000000")}
              className={`bg-[#000000] border-2 rounded-full w-10 h-10 transition-all duration-200 ${
                backgroundColor === "#000000" ? "border-[#EBA161] scale-110" : "border-[#cfcfcf]"
              }`}
              title="검정"
            />
            <button
              onClick={() => handleBackgroundChange("#fafaf7")}
              className={`bg-[#fafaf7] border-2 rounded-full w-10 h-10 transition-all duration-200 ${
                backgroundColor === "#fafaf7" ? "border-[#EBA161] scale-110" : "border-[#cfcfcf]"
              }`}
              title="시스템"
            />
          </div>
        </div>

        {/* 계정 관리 및 기타 섹션 */}
        <div className="bg-[#ffffff] pt-4 px-4 pb-4 flex flex-col gap-6 items-start justify-center w-full">
          {/* 계정 관리 */}
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <h3 className="text-[#4A4A4A] text-left font-['Epilogue-Bold',_sans-serif] text-lg leading-6 font-bold">
              계정관리
            </h3>
            <div className="flex flex-row gap-3 items-center justify-start w-full py-2">
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium flex-1">
                프로필
              </div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {/* 앱 정보 */}
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <h3 className="text-[#4A4A4A] text-left font-['Epilogue-Bold',_sans-serif] text-lg leading-6 font-bold">
              앱정보
            </h3>
            <div className="flex flex-row gap-3 items-center justify-start w-full py-2">
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium flex-1">
                버전정보
              </div>
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Regular',_sans-serif] text-base leading-6 font-normal">
                1.0
              </div>
            </div>
            <div className="flex flex-row gap-3 items-center justify-start w-full py-2">
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium flex-1">
                이용약관
              </div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
            <div className="flex flex-row gap-3 items-center justify-start w-full py-2">
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium flex-1">
                개인정보처리방침
              </div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {/* 도움말 및 지원 */}
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <h3 className="text-[#4A4A4A] text-left font-['Epilogue-Bold',_sans-serif] text-lg leading-6 font-bold">
              도움말 및 지원
            </h3>
            <div className="flex flex-row gap-3 items-center justify-start w-full py-2 border-b border-[#E5E0DB]">
              <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium flex-1">
                고객지원 문의
              </div>
              <Image
                src="/assets/icons/keyboard-arrow-right.svg"
                alt="Arrow Right"
                width={24}
                height={24}
                className="shrink-0"
              />
            </div>
          </div>

          {/* 로그아웃 */}
          <div className="flex flex-row gap-3 items-center justify-start w-full py-4">
            <Image
              src="/assets/icons/logout.svg"
              alt="Log Out"
              width={24}
              height={24}
              className="shrink-0"
            />
            <div className="text-[#5A5A5A] text-left font-['Epilogue-Medium',_sans-serif] text-base leading-6 font-medium">
              로그아웃
            </div>
          </div>
        </div>

        {/* 로그아웃 아래 여백 */}
        <div className="w-full h-[50px] bg-transparent" /> {/* 여백 50px로 조정 */}
      </div>

      {/* 하단 네비게이션 */}
      <div>
        <NavigationBar />
      </div>
    </div>
  );
};

export default MyPage;