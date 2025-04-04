"use client";

import React, { useState } from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  cover: string;
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 더미 데이터
  const dummyBooks: Book[] = [
    {
      id: 1,
      title: "볼수록 아름다운 우리 그림",
      author: "이소영",
      publisher: "미술문화",
      cover: "/assets/images/book-cover-1.png",
    },
    {
      id: 2,
      title: "볼수록 아름다운 우리 그림 2",
      author: "이소영",
      publisher: "미술문화",
      cover: "/assets/images/book-cover-2.png",
    },
    {
      id: 3,
      title: "볼수록 아름다운 우리 그림 3",
      author: "이소영",
      publisher: "미술문화",
      cover: "/assets/images/book-cover-3.png",
    },
    {
      id: 4,
      title: "볼수록 아름다운 우리 그림 4",
      author: "이소영",
      publisher: "미술문화",
      cover: "/assets/images/book-cover-4.png",
    },
    {
      id: 5,
      title: "볼수록 아름다운 우리 그림 5",
      author: "이소영",
      publisher: "미술문화",
      cover: "/assets/images/book-cover-5.png",
    },
  ];

  const filteredBooks = dummyBooks.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-hidden">
        {/* 헤더 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-lg font-bold">
            책 검색
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
              placeholder="책 제목 검색"
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
              className="bg-[#FFFFFF] pt-3 px-4 pb-3 flex flex-row gap-4 items-start justify-start w-full"
            >
              <Image
                src={book.cover}
                alt={book.title}
                width={79}
                height={106}
                className="rounded-xl object-cover"
              />
              <div className="flex flex-col gap-0 items-start justify-center flex-1 h-[104px]">
                <p className="text-[#1C140D] font-['Pretendard'] text-base font-medium leading-6 h-[67px] line-clamp-3">
                  {book.title}
                </p>
                <p className="text-[#96704F] font-['Pretendard'] text-sm leading-[21px] h-[21px]">
                  {book.author}
                </p>
                <p className="text-[#A7A7A7] font-['Pretendard'] text-sm leading-[21px]">
                  {book.publisher}
                </p>
              </div>
            </div>
          ))
        )}

        {/* 하단 여백 */}
        <div className="bg-[#FFFFFF] w-full h-5" />
      </div>

      {/* 하단 네비게이션 */}
      <NavigationBar />
    </div>
  );
};

export default Search;