"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import NavigationBar from "@/tsx/NavigationBar";
import { useAuth } from "@/ts/useAuth";
import { supabase } from "@/ts/supabase";
import { useModal } from "@/tsx/ModalContext";
import { useRouter, useSearchParams } from "next/navigation";

interface Book {
  id: number;
  cover_url: string;
  progress: number;
  rating: number;
  created_at?: string;
  title?: string;
}

const BookShelf: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showModal } = useModal();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [shakeMode, setShakeMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [updatedBookId, setUpdatedBookId] = useState<number | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<"latest" | "title" | "rating" | "progress">(
    (typeof window !== "undefined" && (localStorage.getItem("sortCriteria") as "latest" | "title" | "rating" | "progress")) || "latest"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (typeof window !== "undefined" && (localStorage.getItem("sortOrder") as "asc" | "desc")) || "desc"
  );

  useEffect(() => {
    const bookId = Number(searchParams.get("updatedBookId"));
    if (bookId) {
      setUpdatedBookId(bookId);
      setTimeout(() => setUpdatedBookId(null), 2000);
    }

    const fetchBooks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("auth_id", user.id)
          .single();

        if (userError || !userData) {
          showModal("사용자 정보를 찾을 수 없습니다.", "error");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("books")
          .select(
            `
            id,
            cover_url,
            created_at,
            title,
            reading_records (
              rating,
              progress
            )
          `
          )
          .eq("user_id", userData.id);

        if (error) throw error;

        const formattedBooks: Book[] = data.map((book: any) => {
          const readingRecord = book.reading_records.length > 0 ? book.reading_records[0] : {};
          return {
            id: book.id,
            cover_url: book.cover_url || "/assets/images/book-cover-0.png",
            progress: readingRecord.progress ?? 0,
            rating: readingRecord.rating ?? 0,
            created_at: book.created_at,
            title: book.title || `Book ${book.id}`,
          };
        });

        setBooks(sortBooks(formattedBooks, sortCriteria, sortOrder));
      } catch (err) {
        console.error("책 불러오기 실패:", err);
        showModal("책을 불러오는 데 실패했습니다.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user, showModal, searchParams, sortCriteria, sortOrder]);

  const sortBooks = (booksToSort: Book[], criteria: "latest" | "title" | "rating" | "progress", order: "asc" | "desc") => {
    const sorted = [...booksToSort];
    sorted.sort((a, b) => {
      if (criteria === "title") {
        return order === "asc"
          ? a.title!.localeCompare(b.title!)
          : b.title!.localeCompare(a.title!);
      } else if (criteria === "latest") {
        return order === "asc"
          ? new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
          : new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
      } else if (criteria === "rating") {
        return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
      } else if (criteria === "progress") {
        return order === "asc" ? a.progress - b.progress : b.progress - a.progress;
      }
      return 0;
    });
    return sorted;
  };

  const handleSortChange = (criteria: "latest" | "title" | "rating" | "progress", order: "asc" | "desc") => {
    setSortCriteria(criteria);
    setSortOrder(order);
    setBooks(sortBooks(books, criteria, order));
    localStorage.setItem("sortCriteria", criteria);
    localStorage.setItem("sortOrder", order);
    setSortOpen(false);
  };

  const filteredBooks = books.filter((book) => {
    if (sortCriteria === "title") {
      return book.title?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (sortCriteria === "latest") {
      return book.created_at?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (sortCriteria === "rating") {
      return book.rating.toString().includes(searchQuery.toLowerCase());
    } else if (sortCriteria === "progress") {
      return book.progress.toString().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getPlaceholder = () => {
    switch (sortCriteria) {
      case "title":
        return "제목으로 검색";
      case "latest":
        return "최신순으로 검색";
      case "rating":
        return "별점으로 검색 (1-5)";
      case "progress":
        return "진행률로 검색 (0-100)";
      default:
        return "최신순으로 검색";
    }
  };

  const renderStars = (book: Book) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starValue = i;
      const isHalf = book.rating >= starValue - 0.5 && book.rating < starValue;
      const isFull = book.rating >= starValue;

      stars.push(
        <div key={i} className="relative text-[16px] w-[16px] h-[16px]">
          <span className="text-[#D3D3D3] absolute inset-0">★</span>
          {isHalf || isFull ? (
            <span
              className="text-[#EBA161] absolute inset-0 overflow-hidden"
              style={{ width: isHalf ? "50%" : "100%" }}
            >
              ★
            </span>
          ) : null}
        </div>
      );
    }
    return stars;
  };

  const calculateProgressBarStyle = (progress: number) => {
    return {
      width: `${progress}%`,
      backgroundColor: "#EBA161",
    };
  };

  const handleBookClick = (bookId: number) => {
    if (!shakeMode) {
      router.push(`/record?book_id=${bookId}`);
    }
  };

  const handleLongPressStart = (bookId: number) => {
    const timer = setTimeout(() => {
      setShakeMode(true);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!user) return;

    try {
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", bookId)
        .eq("user_id", userData.id);

      if (error) throw error;

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      showModal("책이 삭제되었습니다!", "success");
    } catch (err) {
      console.error("책 삭제 실패:", err);
      showModal("책 삭제에 실패했습니다.", "error");
    }
  };

  const handleContainerClick = () => {
    if (shakeMode) {
      setShakeMode(false);
    }
  };

  const handleSearchClick = () => {
    router.push("/search");
  };

  if (authLoading || loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        <h1>로그인이 필요합니다</h1>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 bg-[#ebba61] text-white px-4 py-2 rounded"
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-hidden">
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[50px]">
          {/* <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-lg font-bold">
            책꽂이
          </h1> */}
        </div>

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
              placeholder={getPlaceholder()}
              className="text-[#A1824A] font-['Pretendard'] text-base leading-6 w-full outline-none"
            />
          </div>
        </div>

        <div className="p-4 flex flex-row items-center justify-between w-full">
          <p className="text-[#877863] font-['Pretendard'] text-sm leading-[21px]">
            검색결과 {filteredBooks.length}권
          </p>
          <button onClick={() => setSortOpen(true)}>
            <Image
              src="/assets/icons/sort.svg"
              alt="Sort Icon"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div
          className="px-4 flex flex-row flex-wrap gap-4 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto"
          onClick={handleContainerClick}
        >
          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full h-[400px] gap-4">
              <p className="text-[#4A4A4A] font-['Pretendard'] text-base leading-6 text-center">
              {searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : (
                <>
                  책장이 비어 있어요.<br/>
                  '책 추가' 버튼으로 책을 등록해보세요!
                </>
              )}
              </p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className={`flex flex-col gap-1 items-start justify-start w-[calc(33.333%-10.666px)] h-[192px] ${
                  shakeMode ? "animate-shake" : ""
                } ${book.id === updatedBookId ? "animate-pulse" : ""}`}
              >
                <div
                  className="w-full aspect-[124/144] relative cursor-pointer"
                  onMouseDown={() => handleLongPressStart(book.id)}
                  onMouseUp={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(book.id)}
                  onTouchEnd={handleLongPressEnd}
                  onClick={() => handleBookClick(book.id)}
                >
                  <Image
                    src={book.cover_url}
                    alt={`Book Cover ${book.id}`}
                    fill
                    sizes="(max-width: 414px) 33vw, 124px"
                    priority={book.id === updatedBookId}
                    className="rounded-xl object-cover"
                    style={{
                      background: "linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%)",
                    }}
                  />
                  {shakeMode && (
                    <button
                      className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBook(book.id);
                      }}
                    >
                      ✕
                    </button>
                  )}
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
                  {renderStars(book)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-[#FFFFFF] w-full h-5" />

        <button
          onClick={handleSearchClick}
          className="fixed bottom-20 right-4 w-10 h-10 bg-[#EBBA61] rounded-full flex items-center justify-center shadow-lg z-50"
        >
          <Image
            src="/assets/icons/add-book.svg"
            alt="추가 아이콘"
            width={24}
            height={24}
            className="invert"
          />
        </button>

        {sortOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end">
            <div
              className="bg-white w-full max-w-[414px] rounded-t-xl p-4 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[#4A4A4A] font-['Pretendard'] text-lg font-bold mb-4">
                정렬 기준
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between items-center">
                  <button
                    className={`w-full text-left py-2 ${sortCriteria === "latest" ? "text-[#EBBA61]" : "text-[#4A4A4A]"}`}
                    onClick={() => handleSortChange("latest", sortOrder)}
                  >
                    최신순
                  </button>
                  {sortCriteria === "latest" && (
                    <button onClick={() => handleSortChange("latest", sortOrder === "asc" ? "desc" : "asc")}>
                      <Image
                        src={sortOrder === "asc" ? "/assets/icons/sort-asc.svg" : "/assets/icons/sort-desc.svg"}
                        alt="Sort Order"
                        width={20}
                        height={20}
                      />
                    </button>
                  )}
                </div>
                <div className="flex flex-row justify-between items-center">
                  <button
                    className={`w-full text-left py-2 ${sortCriteria === "title" ? "text-[#EBBA61]" : "text-[#4A4A4A]"}`}
                    onClick={() => handleSortChange("title", sortOrder)}
                  >
                    제목순
                  </button>
                  {sortCriteria === "title" && (
                    <button onClick={() => handleSortChange("title", sortOrder === "asc" ? "desc" : "asc")}>
                      <Image
                        src={sortOrder === "asc" ? "/assets/icons/sort-asc.svg" : "/assets/icons/sort-desc.svg"}
                        alt="Sort Order"
                        width={20}
                        height={20}
                      />
                    </button>
                  )}
                </div>
                <div className="flex flex-row justify-between items-center">
                  <button
                    className={`w-full text-left py-2 ${sortCriteria === "rating" ? "text-[#EBBA61]" : "text-[#4A4A4A]"}`}
                    onClick={() => handleSortChange("rating", sortOrder)}
                  >
                    별점순
                  </button>
                  {sortCriteria === "rating" && (
                    <button onClick={() => handleSortChange("rating", sortOrder === "asc" ? "desc" : "asc")}>
                      <Image
                        src={sortOrder === "asc" ? "/assets/icons/sort-asc.svg" : "/assets/icons/sort-desc.svg"}
                        alt="Sort Order"
                        width={20}
                        height={20}
                      />
                    </button>
                  )}
                </div>
                <div className="flex flex-row justify-between items-center">
                  <button
                    className={`w-full text-left py-2 ${sortCriteria === "progress" ? "text-[#EBBA61]" : "text-[#4A4A4A]"}`}
                    onClick={() => handleSortChange("progress", sortOrder)}
                  >
                    진행률
                  </button>
                  {sortCriteria === "progress" && (
                    <button onClick={() => handleSortChange("progress", sortOrder === "asc" ? "desc" : "asc")}>
                      <Image
                        src={sortOrder === "asc" ? "/assets/icons/sort-asc.svg" : "/assets/icons/sort-desc.svg"}
                        alt="Sort Order"
                        width={20}
                        height={20}
                      />
                    </button>
                  )}
                </div>
              </div>
              <button
                className="w-full mt-4 bg-[#EBBA61] text-white py-2 rounded-lg"
                onClick={() => setSortOpen(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      <NavigationBar currentPath="/bookshelf" />
    </div>
  );
};

export default BookShelf;