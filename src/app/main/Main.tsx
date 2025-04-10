"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { supabase } from "@/api/supabase";

const Main: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [animate, setAnimate] = useState(false);

  const welcomeMessage = "책과 함께하는 멋진 여정을 시작해보세요!"; // 나중에 변경 가능

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) =>
      `${date.getMonth() + 1}.${date.getDate()}`;
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        const starValue = i * 0.5;
        const isHalf = rating >= starValue - 0.5 && rating < starValue;
        const isFull = rating >= starValue;

        stars.push(
          <div key={i} className="relative text-[14px] w-[14px] h-[14px]">
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

    return <div className="flex flex-row gap-1">{renderStars()}</div>;
  };

  const fetchBestsellers = async () => {
    setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from("bestseller")
        .select("rank, title, author, publisher, publish_date, price, image_url")
        .order("rank", { ascending: true });

      if (error) throw error;
      if (data) {
        const formattedBooks = data.map((book) => ({
          title: book.title,
          image: book.image_url || "/assets/images/book-cover-4.png",
          author: book.author,
          publisher: book.publisher,
          publish_date: book.publish_date,
          price: book.price,
          rank: book.rank,
        }));
        setBestsellers(formattedBooks);
      } else {
        const response = await fetch("/api/crawl-bestsellers");
        const result = await response.json();
        if (result.books) setBestsellers(result.books);
      }
    } catch (error) {
      console.error("베스트셀러 가져오기 실패:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchSharedNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("shared_memos")
        .select(
          `
          id,
          is_visible,
          reading_records!record_id (
            memo,
            rating,
            book_id,
            books!book_id (
              title,
              cover_url
            )
          )
        `
        )
        .eq("is_visible", "y")
        .limit(2);

      if (error) throw error;
      setSharedNotes(data || []);
    } catch (error) {
      console.error("공유노트 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchBestsellers(), fetchSharedNotes()]).then(() => {
      setAnimate(true);
    });
  }, []);

  const handleFloatingClick = () => {
    router.push("/search");
  };

  const handleBestsellersClick = () => {
    router.push("/bestsellers");
  };

  const onStop = () => setAnimate(false);
  const onRun = () => setAnimate(true);

  if (authLoading) return <div className="text-center mt-10">로딩 중...</div>;

  if (!user) {
    router.push("/unauthenticated");
    return null; // 리다이렉션 후 렌더링 중단
  }

  return (
    <div className="bg-[#ffffff] flex flex-col gap-0 items-start justify-start min-h-screen">
      <div className="bg-[#ffffff] flex flex-col gap-0 items-start justify-start w-full max-w-[390px] min-h-screen mx-auto relative overflow-auto">
        <div className="bg-[#ffffff] pt-4 pr-4 pb-2 pl-4 flex flex-row items-center justify-between w-full h-[72px] relative">
          {/* <div className="flex flex-row gap-0 items-start justify-start w-12 h-12">
            <div className="w-6 h-6 relative overflow-hidden">
              <Image
                src="/assets/icons/back-arrow.svg"
                alt="뒤로 가기"
                width={24}
                height={24}
                className="absolute left-0 top-0"
              />
            </div>
          </div> */}
          {/* <div className="text-[#1c140d] font-['Pretendard'] text-sm">
            {user?.email}님, 환영합니다!
          </div> */}

          {/* 환영 메시지 (계속 유지) */}
          <div className="absolute top-0 left-0 w-full bg-[#EBBA61] text-white text-center font-['Pretendard'] text-sm py-2">
            {welcomeMessage}
          </div>
        </div>

        <div className="pt-5 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              <div className="text-[#1c140d] text-left font-['Pretendard'] text-[22px] leading-7 font-bold">
                베스트셀러
              </div>
              <div className="text-[#A7A7A7] text-left font-['Pretendard'] text-sm leading-[21px]">
                {getWeekDates()}
              </div>
            </div>
            {/*
            <button
              onClick={handleBestsellersClick}
              className="bg-[#EBBA61] text-white text-xs font-['Pretendard'] px-3 py-1 rounded hover:bg-[#e0a852] transition-colors"
            >
              지금 베스트셀러 보러 가기
            </button>
            */}
          </div>
        </div>
        <div className="flex flex-row gap-0 items-start justify-start w-full overflow-hidden">
          {fetchLoading ? (
            <div className="text-center w-full py-4">로딩 중...</div>
          ) : bestsellers.length === 0 ? (
            <div className="text-center w-full py-4">베스트셀러 데이터가 없습니다.</div>
          ) : (
            <div
              className="slide-wrapper"
              onMouseEnter={onStop}
              onMouseLeave={onRun}
            >
              <div className={`slide original ${animate ? "" : "stop"}`}>
                {bestsellers.map((book, index) => (
                  <div
                    key={`original-${index}`}
                    className="flex flex-col gap-2 items-start justify-start min-w-[120px] p-4"
                  >
                    <Image
                      src={book.image || "/assets/images/book-cover-4.png"}
                      alt={book.title || "책 표지"}
                      width={120}
                      height={160}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex flex-col gap-0 items-start justify-start w-full">
                      <div className="text-[#1c140d] text-left font-['Pretendard'] text-sm leading-5 font-medium line-clamp-2 overflow-hidden text-ellipsis min-h-[40px]">
                        {book.title}
                      </div>
                      <div className="text-[#A7A7A7] text-left font-['Pretendard'] text-xs leading-4 mt-1">
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`slide clone ${animate ? "" : "stop"}`}>
                {bestsellers.map((book, index) => (
                  <div
                    key={`clone-${index}`}
                    className="flex flex-col gap-2 items-start justify-start min-w-[120px] p-4"
                  >
                    <Image
                      src={book.image || "/assets/images/book-cover-4.png"}
                      alt={book.title || "책 표지"}
                      width={120}
                      height={160}
                      style={{ objectFit: "cover" }}
                    />
                    <div className="flex flex-col gap-0 items-start justify-start w-full">
                      <div className="text-[#1c140d] text-left font-['Pretendard'] text-sm leading-5 font-medium line-clamp-2 overflow-hidden text-ellipsis min-h-[40px]">
                        {book.title}
                      </div>
                      <div className="text-[#A7A7A7] text-left font-['Pretendard'] text-xs leading-4 mt-1">
                        {book.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-5 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start w-full h-[60px]">
          <div className="text-[#1c140d] text-left font-['Pretendard'] text-[22px] leading-7 font-bold">
            공유노트
          </div>
        </div>
        {fetchLoading ? (
          <div className="text-center w-full py-4">로딩 중...</div>
        ) : sharedNotes.length === 0 ? (
          <div className="text-center w-full py-4">공유된 노트가 없습니다.</div>
        ) : (
          sharedNotes.map((note, index) => (
            <div
              key={index}
              className="bg-[#ffffff] pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-start justify-start w-full"
            >
              <Image
                src={
                  note.reading_records?.books?.cover_url ||
                  "/assets/images/book-cover-4.png"
                }
                alt={note.reading_records?.books?.title || "책 표지"}
                width={79}
                height={106}
                style={{ objectFit: "cover" }}
              />
              <div className="flex flex-col gap-2 items-start justify-center flex-1">
                <div className="flex flex-col gap-0 items-start justify-start w-full">
                  <div className="text-[#1c140d] text-left font-['Pretendard'] text-base leading-6 font-medium">
                    {note.reading_records?.books?.title || "제목 없음"}
                  </div>
                </div>
                <div className="flex flex-col gap-0 items-start justify-start w-full">
                  <div className="text-[#96704f] text-left font-['Pretendard'] text-sm leading-[21px] font-normal line-clamp-3">
                    {note.reading_records?.memo || "메모 없음"}
                  </div>
                </div>
                <div className="flex flex-col gap-0 items-start justify-start w-full">
                  <StarRating rating={note.reading_records?.rating || 0} />
                </div>
              </div>
            </div>
          ))
        )}

        <div className="w-full h-[75px] bg-transparent" />
      </div>

      <button
        onClick={handleFloatingClick}
        className="fixed bottom-20 right-4 w-10 h-10 bg-[#EBBA61] rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <Image
          src="/assets/icons/search.svg"
          alt="검색 아이콘"
          width={24}
          height={24}
          className="invert"
        />
      </button>

      <div>
        <NavigationBar />
      </div>

      <style jsx>{`
        .slide-wrapper {
          display: flex;
          flex-wrap: nowrap;
          width: 100%;
          overflow: hidden;
        }
        .slide {
          display: flex;
          flex-wrap: nowrap;
          transition: transform 0.3s ease-out;
        }
        .slide.original {
          animation: 1000s linear infinite infiniteAnimation1;
        }
        .slide.clone {
          animation: 1000s linear infinite infiniteAnimation2;
        }
        .slide.stop {
          animation-play-state: paused;
        }
        @keyframes infiniteAnimation1 {
          0% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-100%);
          }
          50.1% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes infiniteAnimation2 {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-200%);
          }
        }
      `}</style>
    </div>
  );
};

export default Main;