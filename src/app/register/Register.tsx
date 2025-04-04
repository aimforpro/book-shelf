"use client";

import React from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";

interface BookInfo {
  title: string;
  authors: string;
  description: string;
  publisher: string;
  pages: number;
  publicationDate: string;
  price: number;
}

const Register: React.FC = () => {
  // 더미 데이터
  const bookInfo: BookInfo = {
    title: "그시절우리가 좋아했던 소녀 메이킹",
    authors: "조영명, 김재원, 김세랑",
    description:
      "올바른 맞춤법과 외래어 표기법을 알려주고, 케케묵은 표현이나 낮선 외래어를 다듬어 쓸 수 있는 순화어를 제안한다. 또한 일상적으로 잘못 발음하는 말이 트린 표기로 이어지는 사례들도 짚는다.ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ",
    publisher: "박연희",
    pages: 296,
    publicationDate: "2025-01-13",
    price: 18000,
  };

  const handleRegister = () => {
    // 등록 버튼 클릭 시 동작 (예: API 호출)
    console.log("등록 버튼 클릭됨:", bookInfo);
  };

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-auto">
        {/* 헤더 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-lg font-bold">
            등록
          </h1>
        </div>

        {/* 책 정보 섹션 */}
        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <div className="bg-[#F9F9F9] rounded-lg flex flex-col gap-4 items-center justify-start w-full p-4 shadow-sm">
            <h2 className="text-[#4A4A4A] text-center font-['Pretendard'] text-[24px] leading-7 font-semibold w-[341px] max-w-[90%]">
              {bookInfo.title}
            </h2>
            <Image
              src="/assets/images/book-cover-0.png"
              alt="Book Cover"
              width={176}
              height={234}
              className="rounded-xl object-cover shadow-md"
            />
            <p className="text-[#666666] text-center font-['Pretendard'] text-[15px] leading-6 font-light w-[157px]">
              {bookInfo.authors}
            </p>
          </div>
        </div>

        {/* 소개 및 정보 섹션 */}
        <div className="bg-[#FFFFFF] pt-[15px] px-4 pb-[15px] flex flex-col gap-6 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto min-h-[517px]">
          {/* 소개 */}
          <div className="flex flex-col gap-3 items-start justify-start w-full">
            <h3 className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-[30px] font-semibold">
              소개
            </h3>
            <p className="text-[#5A5A5A] text-justify font-['Pretendard'] text-[15px] leading-[26px] font-normal">
              {bookInfo.description}
            </p>
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-4 items-start justify-start w-full">
            <h3 className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-[30px] font-semibold">
              정보
            </h3>
            <div className="flex flex-col gap-3 items-start justify-start w-full">
              {/* 도서명 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  도서명
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  신뢰와 호감을 높이는 언어생활을 위한
                </span>
              </div>
              {/* 저자 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  저자
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.authors.split(", ")[0]}
                </span>
              </div>
              {/* 출판사 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  출판사
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.publisher}
                </span>
              </div>
              {/* 페이지 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  페이지
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.pages}쪽
                </span>
              </div>
              {/* 발행일 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  발행일
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.publicationDate}
                </span>
              </div>
              {/* 가격 */}
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  가격
                </span>
                <span className="text-[#EBA161] font-['Pretendard'] text-sm leading-[24px] font-semibold flex-1">
                  {bookInfo.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="pt-3 px-4 pb-3 flex flex-row gap-0 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <button
            onClick={handleRegister}
            className="bg-[#EBA161] rounded-xl px-4 py-3 flex flex-row gap-0 items-center justify-center w-full max-w-[358px] h-12"
          >
            <span className="text-[#FFFFFF] text-center font-['Pretendard'] text-base leading-6 font-bold">
              등록
            </span>
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="bg-[#FFFFFF] w-full h-[80px]" />
      </div>

      {/* 하단 네비게이션 */}
      <NavigationBar currentPath="/register" />
    </div>
  );
};

export default Register;