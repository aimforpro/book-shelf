"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface BookProgress {
  title: string;
  authors: string;
  startDate: string;
  endDate: string;
  progress: number;
  rating: number;
  memo: string;
  isShared: boolean;
}

const Record: React.FC = () => {
  const [bookProgress, setBookProgress] = useState<BookProgress>({
    title: "그시절우리가 좋아했던 소녀 메이킹",
    authors: "조영명, 김재원, 김세랑",
    startDate: "2025-01-02",
    endDate: "2025-01-02",
    progress: 0,
    rating: 0,
    memo: "",
    isShared: false,
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);

  // 모달이 열렸을 때 본문 스크롤 비활성화
  useEffect(() => {
    if (showStartDatePicker || showEndDatePicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // 컴포넌트 언마운트 시 원상복구
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStartDatePicker, showEndDatePicker]);

  const handleSave = () => {
    console.log("저장 버튼 클릭됨:", bookProgress);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookProgress({ ...bookProgress, progress: Number(e.target.value) });
  };

  const handleMemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBookProgress({ ...bookProgress, memo: e.target.value });
  };

  const handleShareToggle = () => {
    setBookProgress({ ...bookProgress, isShared: !bookProgress.isShared });
  };

  const handleStartDateChange = (date: Date) => {
    const newStartDate = date.toISOString().split("T")[0];
    if (new Date(newStartDate) > new Date(bookProgress.endDate)) {
      setBookProgress({
        ...bookProgress,
        startDate: newStartDate,
        endDate: newStartDate,
      });
    } else {
      setBookProgress({
        ...bookProgress,
        startDate: newStartDate,
      });
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date: Date) => {
    setBookProgress({
      ...bookProgress,
      endDate: date.toISOString().split("T")[0],
    });
    setShowEndDatePicker(false);
  };

  const calculateRating = (clientX: number) => {
    if (!ratingRef.current) return;

    const rect = ratingRef.current.getBoundingClientRect();
    const starWidth = rect.width / 5;
    const position = clientX - rect.left;
    const ratingValue = Math.min(Math.max((position / starWidth) * 0.5, 0), 5);
    const roundedRating = Math.round(ratingValue * 2) / 2;

    setBookProgress({ ...bookProgress, rating: roundedRating });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    calculateRating(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      calculateRating(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    calculateRating(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      calculateRating(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starValue = i * 0.5;
      const isHalf = bookProgress.rating >= starValue - 0.5 && bookProgress.rating < starValue;
      const isFull = bookProgress.rating >= starValue;

      stars.push(
        <div key={i} className="relative text-[24px] w-[24px] h-[24px]">
          <span className="text-[#D3D3D3] absolute inset-0">★</span>
          {isHalf || isFull ? (
            <span
              className="text-[#EBA161] absolute inset-0 overflow-hidden"
              style={{
                width: isHalf ? "50%" : "100%",
              }}
            >
              ★
            </span>
          ) : null}
        </div>
      );
    }
    return stars;
  };

  const today = new Date("2025-04-04");

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-auto">
        {/* 헤더 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <button onClick={() => console.log("뒤로 가기")}>
            <Image
              src="/assets/icons/back-arrow.svg"
              alt="Back Arrow"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 책 정보 섹션 */}
        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <div className="bg-[#F9F9F9] rounded-lg flex flex-col gap-4 items-center justify-start w-full p-4 shadow-sm">
            <h2 className="text-[#4A4A4A] text-center font-['Pretendard'] text-[24px] leading-7 font-semibold w-[341px] max-w-[90%]">
              {bookProgress.title}
            </h2>
            <Image
              src="/assets/images/book-cover-1.png"
              alt="Book Cover"
              width={176}
              height={234}
              className="rounded-xl object-cover shadow-md"
            />
            <p className="text-[#666666] text-center font-['Pretendard'] text-[15px] leading-6 font-light w-[157px]">
              {bookProgress.authors}
            </p>
          </div>
        </div>

        {/* 평점 섹션 */}
        <div
          className="flex flex-row gap-1 items-center justify-center w-full min-w-[360px] max-w-[414px] mx-auto pt-2 pb-2 select-none"
          ref={ratingRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderStars()}
        </div>

        {/* 읽기 시작/종료 섹션 */}
        <div className="flex flex-row gap-6 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 items-start justify-start w-[50%]">
            <h3 className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-[24px] font-semibold">
              읽기 시작
            </h3>
            <div
              className="flex flex-row gap-2 items-center justify-start w-full cursor-pointer"
              onClick={() => setShowStartDatePicker(true)}
            >
              <Image
                src="/assets/icons/calendar.svg"
                alt="Calendar Icon"
                width={24}
                height={24}
              />
              <span className="text-[#5A5A5A] font-['Pretendard'] text-base leading-6 font-medium border-b border-[#757575]">
                {bookProgress.startDate}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start justify-start w-[50%]">
            <h3 className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-[24px] font-semibold">
              읽기 종료
            </h3>
            <div
              className="flex flex-row gap-2 items-center justify-start w-full cursor-pointer"
              onClick={() => setShowEndDatePicker(true)}
            >
              <Image
                src="/assets/icons/calendar.svg"
                alt="Calendar Icon"
                width={24}
                height={24}
              />
              <span className="text-[#5A5A5A] font-['Pretendard'] text-base leading-6 font-medium border-b border-[#757575]">
                {bookProgress.endDate}
              </span>
            </div>
          </div>
        </div>

        {/* 진행률 섹션 */}
        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <h3 className="text-[#4A4A4A] text-left font-['Pretendard'] text-base leading-[24px] font-semibold">
            어디까지 읽으셨나요?
          </h3>
          <input
            type="range"
            min="0"
            max="100"
            value={bookProgress.progress}
            onChange={handleProgressChange}
            className="w-full h-2.5 bg-[#EBA161] bg-opacity-15 rounded-sm appearance-none cursor-pointer"
            style={{
              accentColor: "#EBA161",
            }}
          />
          <p className="text-[#EBA161] text-left font-['Pretendard'] text-sm leading-[21px] font-normal">
            {bookProgress.progress}%
          </p>
        </div>

        {/* 공유 메시지 및 토글 */}
        <div className="flex flex-row gap-2.5 items-center justify-between w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <p className="text-[#5A5A5A] text-left font-['Pretendard'] text-sm leading-[21px] font-normal w-[70%]">
            당신의 독서 이야기가 누군가에게 새로운 책의 문을 열어줄지 몰라요.
            <br />
            “책꽃이 유저들과 함께 감동을 나눠요”
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bookProgress.isShared}
              onChange={handleShareToggle}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#EBA161] transition-all duration-300 flex items-center">
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                  bookProgress.isShared ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>

        {/* 메모 섹션 */}
        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 pb-4">
          <textarea
            value={bookProgress.memo}
            onChange={handleMemoChange}
            placeholder="독서 메모를 남겨보세요..."
            className="bg-[#FFFFFF] rounded-xl border border-[#E5E0DB] p-4 w-full h-36 text-[#5A5A5A] font-['Pretendard'] text-sm leading-[21px] font-normal resize-none focus:outline-none"
          />
        </div>

        {/* 저장 버튼 */}
        <div className="pt-3 px-4 pb-3 flex flex-row gap-0 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <button
            onClick={handleSave}
            className="bg-[#EBA161] rounded-xl px-4 py-3 flex flex-row gap-0 items-center justify-center w-full max-w-[358px] h-12"
          >
            <span className="text-[#FFFFFF] text-center font-['Pretendard'] text-base leading-6 font-bold">
              저장
            </span>
          </button>
        </div>

        {/* 하단 여백 (NavigationBar 높이 고려) */}
        <div className="bg-[#FFFFFF] w-full h-[140px]" /> {/* NavigationBar 높이(60px) + 여백(80px) */}
      </div>

      {/* 하단 네비게이션 */}
      <NavigationBar currentPath="/record" />

      {/* 시작 날짜 달력 모달 */}
      {showStartDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#4A4A4A] font-['Pretendard'] text-lg font-semibold">
                날짜 선택
              </h3>
              <button
                onClick={() => setShowStartDatePicker(false)}
                className="text-[#5A5A5A] font-['Pretendard'] text-lg"
              >
                ✕
              </button>
            </div>
            <DatePicker
              selected={new Date(bookProgress.startDate)}
              onChange={handleStartDateChange}
              locale={ko}
              inline
              maxDate={today}
              className="text-[#5A5A5A] font-['Pretendard']"
            />
          </div>
        </div>
      )}

      {/* 종료 날짜 달력 모달 */}
      {showEndDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#4A4A4A] font-['Pretendard'] text-lg font-semibold">
                날짜 선택
              </h3>
              <button
                onClick={() => setShowEndDatePicker(false)}
                className="text-[#5A5A5A] font-['Pretendard'] text-lg"
              >
                ✕
              </button>
            </div>
            <DatePicker
              selected={new Date(bookProgress.endDate)}
              onChange={handleEndDateChange}
              locale={ko}
              inline
              minDate={new Date(bookProgress.startDate)}
              className="text-[#5A5A5A] font-['Pretendard']"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Record;