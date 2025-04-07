"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { searchNaverBooks } from "@/api/naver";

interface Book {
  title: string;
  author: string;
  publisher: string;
  image: string;
  link: string;
  description: string;
  pubdate: string;
  discount: string;
  isbn: string; 
}

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // 검색 내역 복원
  useEffect(() => {
    const savedQuery = sessionStorage.getItem("searchQuery");
    const savedBooks = sessionStorage.getItem("searchBooks");
    const savedPage = sessionStorage.getItem("searchPage");
    const savedScroll = sessionStorage.getItem("scrollPosition");

    if (savedQuery) setSearchQuery(savedQuery);
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedPage) setPage(parseInt(savedPage));
    if (savedBooks && savedBooks.length > 0) setHasMore(true);

    // 스크롤 위치 복원
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
      }, 0);
    }
  }, []);

  // 검색 내역 저장
  const saveSearchState = () => {
    sessionStorage.setItem("searchQuery", searchQuery);
    sessionStorage.setItem("searchBooks", JSON.stringify(books));
    sessionStorage.setItem("searchPage", page.toString());
    sessionStorage.setItem("scrollPosition", window.scrollY.toString());
  };

  const handleSearch = async (reset: boolean = false) => {
    if (!searchQuery.trim()) {
      setBooks([]);
      setHasMore(true);
      setPage(1);
      sessionStorage.removeItem("searchQuery");
      sessionStorage.removeItem("searchBooks");
      sessionStorage.removeItem("searchPage");
      sessionStorage.removeItem("scrollPosition");
      return;
    }

    setLoading(true);
    setError(null);

    const currentPage = reset ? 1 : page;
    const result = await searchNaverBooks(searchQuery, 10, (currentPage - 1) * 10 + 1);

    if (result) {
      const newBooks = reset ? result : [...books, ...result];
      setBooks(newBooks);
      setHasMore(result.length === 10);
      setPage(currentPage + 1);

      // 검색 상태 저장
      sessionStorage.setItem("searchQuery", searchQuery);
      sessionStorage.setItem("searchBooks", JSON.stringify(newBooks));
      sessionStorage.setItem("searchPage", (currentPage + 1).toString());
    } else {
      setError("책 검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      setHasMore(false);
    }

    setLoading(false);
  };

  const handleSearchClick = () => {
    setPage(1);
    handleSearch(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleBookClick = (book: Book) => {
    saveSearchState(); // 검색 상태 저장
    const query = new URLSearchParams({
      title: book.title.replace(/<b>/g, "").replace(/<\/b>/g, ""),
      author: book.author,
      publisher: book.publisher,
      image: book.image,
      description: book.description || "책 소개가 없습니다.",
      pubdate: book.pubdate || "발행일 정보 없음",
      discount: book.discount || "0",
      isbn: book.isbn || "ISBN 정보 없음", 
    }).toString();

    router.push(`/register?${query}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          handleSearch();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, page]);

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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="책 제목 검색"
              className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
            />
            <button onClick={handleSearchClick}>
              <Image
                src="/assets/icons/search.svg"
                alt="Search Icon"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        {/* 검색 결과 개수 */}
        <div className="p-4 flex flex-col gap-3 items-start justify-start w-full">
          <p className="text-[#877863] font-['Pretendard'] text-sm leading-[21px]">
            검색결과 {books.length}권
          </p>
        </div>

        {/* 검색 결과 리스트 */}
        {loading && books.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
            <p className="text-[#4A4A4A] font-['Pretendard'] text-base leading-6 text-center">
              검색 중...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
            <Image
              src="/assets/icons/no-results.svg"
              alt="Error"
              width={100}
              height={100}
            />
            <p className="text-[#4A4A4A] font-['Pretendard'] text-base leading-6 text-center">
              {error}
            </p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
            <Image
              src="/assets/icons/no-results.svg"
              alt="No Results"
              width={100}
              height={100}
            />
            <p className="text-[#4A4A4A] font-['Pretendard'] text-base leading-6 text-center">
              검색을 시작해보세요!
            </p>
          </div>
        ) : (
          <>
            {books.map((book, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF] pt-3 px-4 pb-3 flex flex-row gap-4 items-start justify-start w-full"
              >
                <div onClick={() => handleBookClick(book)} className="cursor-pointer">
                  <Image
                    src={book.image}
                    alt={book.title}
                    width={79}
                    height={106}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0 items-start justify-center flex-1 h-[104px]">
                  <p
                    onClick={() => handleBookClick(book)}
                    className="text-[#1C140D] font-['Pretendard'] text-sm font-medium leading-5 h-[60px] line-clamp-3 overflow-hidden text-ellipsis cursor-pointer"
                  >
                    {book.title.replace(/<b>/g, "").replace(/<\/b>/g, "")}
                  </p>
                  <p className="text-[#96704F] font-['Pretendard'] text-sm leading-[21px] h-[21px]">
                    {book.author}
                  </p>
                  <p className="text-[#A7A7A7] font-['Pretendard'] text-sm leading-[21px]">
                    {book.publisher}
                  </p>
                </div>
              </div>
            ))}
            <div ref={loaderRef} className="w-full h-10 flex justify-center items-center">
              {loading && <p className="text-[#4A4A4A] font-['Pretendard'] text-base">로딩 중...</p>}
              {!hasMore && books.length > 0 && (
                <p className="text-[#4A4A4A] font-['Pretendard'] text-base">더 이상 결과가 없습니다.</p>
              )}
            </div>
          </>
        )}

        <div className="bg-[#FFFFFF] w-full h-5" />
        <div className="w-full h-[70px] bg-transparent" />
      </div>

      <NavigationBar />
    </div>
  );
};

export default Search;