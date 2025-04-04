"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";

interface Book {
  id: number;
  cover: string;
  progress: number;
  rating: number; // 별점 (1~5)
}

const BookShelf: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 더미 데이터
  const dummyBooks: Book[] = [
    { id: 1, cover: "/assets/images/book-cover-1.png", progress: 100, rating: 5 },
    { id: 2, cover: "/assets/images/book-cover-2.png", progress: 100, rating: 5 },
    { id: 3, cover: "/assets/images/book-cover-3.png", progress: 100, rating: 5 },
    { id: 4, cover: "/assets/images/book-cover-4.png", progress: 100, rating: 5 },
    { id: 5, cover: "/assets/images/book-cover-5.png", progress: 100, rating: 5 },
    { id: 6, cover: "/assets/images/book-cover-6.png", progress: 100, rating: 5 },
    { id: 7, cover: "/assets/images/book-cover-7.png", progress: 100, rating: 5 },
    { id: 8, cover: "/assets/images/book-cover-8.png", progress: 100, rating: 5 },
    { id: 9, cover: "/assets/images/book-cover-9.png", progress: 100, rating: 5 },
  ];

  const filteredBooks = dummyBooks.filter((book) =>
    book.rating.toString().includes(searchQuery.toLowerCase())
  );

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Image
          key={i}
          src={i <= rating ? "/assets/icons/star-filled.svg" : "/assets/icons/star-empty.svg"}
          alt={i <= rating ? "Filled Star" : "Empty Star"}
          width={16}
          height={16}
        />
      );
    }
    return stars;
  };

  // 진행률 바 스타일 계산 함수
  const calculateProgressBarStyle = (progress: number) => {
    return {
      width: `${progress}%`,
      backgroundColor: "#EBA161",
    };
  };

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-lg font-bold">
            책꽂이
          </h1>
        </div>

        {/* 검색 입력 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full">
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E8DECF] p-[15px] flex flex-row gap-2 items-center w-full max-w-[358px] h-14">
            <Image
              src="/assets/icons/search.svg"
              alt="Search Icon"
              width={24}
              height={24}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이메일"
              className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
            />
          </div>
        </div>

        {/* 검색 결과 개수 */}
        <div className="p-4 flex flex-col gap-3 items-start justify-start w-full">
          <p className="text-[#877863] font-['Pretendard'] text-sm leading-[21px]">
            검색결과 {filteredBooks.length}권
          </p>
        </div>

        {/* 검색 결과 리스트 */}
        <div className="px-4 flex flex-row flex-wrap gap-4 items-start justify-between w-full min-w-[360px] max-w-[414px] mx-auto">
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
              <Image
                src="/assets/icons/no-results.svg"
                alt="No Results"
                width={100}
                height={100}
              />
              <p className="text-[#4A4A4A] font-['Pretendard'] text-base leading-6 text-center">
                {searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : "검색을 시작해보세요!"}
              </p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex flex-col gap-1 items-start justify-start w-[calc(33.333%-8px)] h-[192px]"
              >
                <div className="w-full aspect-[124/144] relative">
                  <Image
                    src={book.cover}
                    alt={`Book Cover ${book.id}`}
                    fill
                    className="rounded-xl object-cover"
                    style={{
                      background: "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
                    }}
                  />
                </div>
                <div className="flex flex-row gap-1 items-center justify-start w-full">
                  <div className="h-2 w-[65px] bg-gray-200 rounded">
                    <div
                      className="h-full rounded"
                      style={calculateProgressBarStyle(book.progress)}
                    />
                  </div>
                  <p className="text-[#96704F] font-['Pretendard'] text-xs leading-[18px]">
                    {book.progress}%
                  </p>
                </div>
                <div className="flex flex-row gap-1 items-center justify-start w-full">
                  {renderStars(book.rating)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 하단 여백 */}
        <div className="bg-[#FFFFFF] w-full h-5" />
      </div>

      {/* 하단 네비게이션 */}
      <NavigationBar currentPath="/book-shelf" />
    </div>
  );
};

export default BookShelf;