"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import NavigationBar from "@/tsx/NavigationBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { useAuth } from "@/ts/useAuth";
import { useModal } from "@/tsx/ModalContext";
import { supabase } from "@/ts/supabase";
import { useRouter } from "next/navigation";

interface BookProgress {
  book_id: number;
  title: string;
  authors: string;
  cover_url: string;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  rating: number;
  memo: string;
  isShared: boolean;
}

const Record: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { showModal } = useModal();
  const router = useRouter();
  const [bookProgress, setBookProgress] = useState<BookProgress>({
    book_id: 0,
    title: "",
    authors: "",
    cover_url: "",
    startDate: null,
    endDate: null,
    progress: 0,
    rating: 0,
    memo: "",
    isShared: false,
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = Number(urlParams.get("book_id"));
    if (bookId && user) {
      fetchBookData(bookId);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showStartDatePicker || showEndDatePicker || showEmojiPicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStartDatePicker, showEndDatePicker, showEmojiPicker]);

  const fetchBookData = async (bookId: number) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user!.id)
        .single();

      if (userError) throw userError;

      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .select(
          `
          id,
          title,
          author,
          cover_url,
          reading_records!book_id (
            id,
            start_date,
            end_date,
            progress,
            rating,
            memo,
            shared_memos!record_id (
              id,
              is_visible
            )
          )
          `
        )
        .eq("id", bookId)
        .eq("user_id", userData.id)
        .single();

      if (bookError) throw bookError;

      const readingRecord = bookData.reading_records?.length > 0 ? bookData.reading_records[0] : {};
      const sharedMemo = readingRecord.shared_memos || {};

      setBookProgress({
        book_id: bookData.id,
        title: bookData.title || "제목 없음",
        authors: bookData.author || "저자 없음",
        cover_url: bookData.cover_url || "/assets/images/book-cover-1.png",
        startDate: readingRecord.start_date || null,
        endDate: readingRecord.end_date || null,
        progress: readingRecord.progress ?? 0,
        rating: Math.min(Math.max(readingRecord.rating ?? 0, 0), 5),
        memo: readingRecord.memo || "",
        isShared: sharedMemo.is_visible === "y",
      });

      console.log("Fetched book data:", bookData);
    } catch (err) {
      console.error("책 데이터 가져오기 실패:", err);
      showModal("책 데이터를 불러오는 데 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (
      bookProgress.startDate &&
      bookProgress.endDate &&
      new Date(bookProgress.startDate) > new Date(bookProgress.endDate)
    ) {
      showModal("시작일은 종료일보다 늦을 수 없습니다.", "error");
      return;
    }

    // rating 값을 0~5로 제한
    const clampedRating = Math.max(0, Math.min(bookProgress.rating, 5));

    try {
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      const { data: record, error: fetchError } = await supabase
        .from("reading_records")
        .select("id")
        .eq("book_id", bookProgress.book_id)
        .eq("user_id", userData.id)
        .single();

      const recordData = {
        user_id: userData.id,
        book_id: bookProgress.book_id,
        start_date: bookProgress.startDate || null,
        end_date: bookProgress.endDate || null,
        progress: bookProgress.progress,
        rating: bookProgress.rating,
        memo: bookProgress.memo,
        status: bookProgress.progress === 100 ? "completed" : "reading",
      };

      let recordId;
      if (record) {
        const { data, error } = await supabase
          .from("reading_records")
          .update(recordData)
          .eq("id", record.id)
          .select("id")
          .single();
        if (error) throw error;
        recordId = data.id;
      } else {
        const { data, error } = await supabase
          .from("reading_records")
          .insert(recordData)
          .select("id")
          .single();
        if (error) throw error;
        recordId = data.id;
      }

      const { data: existingSharedMemo } = await supabase
        .from("shared_memos")
        .select("id")
        .eq("record_id", recordId)
        .single();

      if (bookProgress.isShared) {
        if (existingSharedMemo) {
          const { error: updateError } = await supabase
            .from("shared_memos")
            .update({ is_visible: "y", shared_at: new Date().toISOString() })
            .eq("record_id", recordId);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("shared_memos")
            .insert({
              record_id: recordId,
              user_id: userData.id,
              is_visible: "y",
              shared_at: new Date().toISOString(),
            });
          if (insertError) throw insertError;
        }
      } else {
        if (existingSharedMemo) {
          const { error: updateError } = await supabase
            .from("shared_memos")
            .update({ is_visible: "n" })
            .eq("record_id", recordId);
          if (updateError) throw updateError;
        }
      }

      showModal("독서 기록이 저장되었습니다!", "success");
      setTimeout(() => router.push(`/bookshelf?updatedBookId=${bookProgress.book_id}`), 1500);
    } catch (err) {
      console.error("저장 실패:", err);
      showModal("저장에 실패했습니다. 다시 시도해주세요.", "error");
    }
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
    setBookProgress({
      ...bookProgress,
      startDate: newStartDate,
    });
    setShowStartDatePicker(false);
  };

  const handleEndDateChange = (date: Date) => {
    const newEndDate = date.toISOString().split("T")[0];
    setBookProgress({
      ...bookProgress,
      endDate: newEndDate,
    });
    setShowEndDatePicker(false);
  };

  const calculateRating = (clientX: number) => {
    if (!ratingRef.current) return;

    const rect = ratingRef.current.getBoundingClientRect();
    const starWidth = rect.width / 5;
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const ratingValue = (position / starWidth) * 5;
    const roundedRating = Math.round(ratingValue);

    // 0~5 범위로 제한
    const clampedRating = Math.max(0, Math.min(roundedRating, 5));
    setBookProgress({ ...bookProgress, rating: clampedRating });
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

  const addEmoji = (emoji: string) => {
    setBookProgress({ ...bookProgress, memo: bookProgress.memo + emoji });
    setShowEmojiPicker(false);
  };

  const renderStars = () => {
    const stars = [];
    const maxStars = 5;

    for (let i = 1; i <= maxStars; i++) {
      const isFull = bookProgress.rating >= i;

      stars.push(
        <div
          key={i}
          className="relative inline-block w-6 h-6"
          style={{ overflow: "hidden" }}
        >
          <Image
            src="/assets/icons/star.svg"
            alt="Star"
            width={24}
            height={24}
            className="absolute top-0 left-0"
          />
          {isFull && (
            <div
              className="absolute top-0 left-0"
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              <Image
                src="/assets/icons/star.svg"
                alt="Filled Star"
                width={24}
                height={24}
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(62%) sepia(68%) saturate(747%) hue-rotate(0deg) brightness(102%) contrast(101%)",
                }}
              />
            </div>
          )}
        </div>
      );
    }
    return stars;
  };

  const today = new Date();

  const emojis = [
    "😊",
    "👍",
    "📚",
    "✨",
    "❤️",
    "🌟",
    "🎉",
    "🌈",
    "🍀",
    "🌸",
    "😍",
    "🙌",
    "📖",
    "✍️",
    "💡",
  ];

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-text-primary text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/unauthenticated");
    return null;
  }

  return (
    <div className="bg-white-bg flex flex-col items-start justify-start min-h-screen font-pretendard">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-auto">
        <div className="bg-white-bg pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <button onClick={() => router.back()}>
            <Image
              src="/assets/icons/back-arrow.svg"
              alt="Back Arrow"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <div className="bg-white-bg rounded-20px flex flex-col gap-4 items-center justify-start w-full p-4 shadow-sm">
            <h2 className="text-text-primary text-center text-[24px] leading-7 font-medium w-[341px] max-w-[90%]">
              {bookProgress.title}
            </h2>
            {bookProgress.cover_url && (
              <Image
                src={bookProgress.cover_url}
                alt="Book Cover"
                width={176}
                height={234}
                className="rounded-xl object-cover shadow-md"
                priority
              />
            )}
            <p className="text-text-secondary text-center text-sm leading-6 font-normal w-[157px]">
              {bookProgress.authors}
            </p>
          </div>
        </div>

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

        <div className="flex flex-row gap-6 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <div className="flex flex-col gap-3 items-start justify-start w-[50%]">
            <h3 className="text-text-primary text-left text-base leading-6 font-medium">
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
              <span className="text-text-primary text-base leading-6 font-normal border-b border-border-color">
                {bookProgress.startDate || "날짜 선택"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-start justify-start w-[50%]">
            <h3 className="text-text-primary text-left text-base leading-6 font-medium">
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
              <span className="text-text-primary text-base leading-6 font-normal border-b border-border-color">
                {bookProgress.endDate || "날짜 선택"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <h3 className="text-text-primary text-left text-base leading-6 font-medium">
            어디까지 읽으셨나요?
          </h3>
          <input
            type="range"
            min="0"
            max="100"
            value={bookProgress.progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-progress-bg rounded-sm appearance-none cursor-pointer"
            style={{
              accentColor: "#eba161",
            }}
          />
          <p className="text-progress-fill text-left text-sm leading-21 font-normal">
            {bookProgress.progress}%
          </p>
        </div>

        <div className="flex flex-row gap-2.5 items-center justify-between w-full min-w-[360px] max-w-[414px] mx-auto px-4 py-3">
          <p className="text-text-primary text-left text-sm leading-21 font-normal w-[70%]">
            당신의 독서 이야기가 누군가에게 새로운 책의 문을 열어줄지 몰라요.
            <br />
            "책꽃이 유저들과 함께 감동을 나눠요"
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bookProgress.isShared}
              onChange={handleShareToggle}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-progress-fill transition-all duration-300 flex items-center">
              <div
                className={`w-6 h-6 bg-white-bg rounded-full shadow-md transform transition-all duration-300 ${
                  bookProgress.isShared ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto px-4 pb-4">
          <div className="relative w-full">
            <textarea
              value={bookProgress.memo}
              onChange={handleMemoChange}
              placeholder="독서 메모를 남겨보세요... (이모티콘도 가능!)"
              className="bg-white-bg rounded-20px border border-border-color p-4 w-full h-36 text-text-primary text-sm leading-21 font-normal resize-none focus:outline-none pr-12"
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute bottom-4 right-4 text-text-primary text-lg"
            >
              😊
            </button>
          </div>
        </div>

        {showEmojiPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white-bg rounded-20px p-4 shadow-lg max-w-[300px] w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-text-primary text-lg font-medium">
                  이모티콘 선택
                </h3>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-text-secondary text-lg hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl hover:bg-progress-bg rounded p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 px-4 pb-3 flex flex-row gap-0 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <button
            onClick={handleSave}
            className="bg-button-bg rounded-20px px-4 py-3 flex flex-row gap-0 items-center justify-center w-full max-w-[358px] h-12"
          >
            <span className="text-white-bg text-center text-base leading-6 font-medium">
              저장
            </span>
          </button>
        </div>

        <div className="bg-white-bg w-full h-[80px]" />

        <NavigationBar currentPath="/record" />

        {showStartDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white-bg rounded-20px p-5 shadow-lg w-full max-w-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-text-primary text-lg font-medium">
                  읽기 시작
                </h3>
                <button
                  onClick={() => setShowStartDatePicker(false)}
                  className="text-text-secondary text-lg hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              <DatePicker
                selected={
                  bookProgress.startDate ? new Date(bookProgress.startDate) : null
                }
                onChange={handleStartDateChange}
                locale={ko}
                inline
                maxDate={today}
                className="w-full"
                calendarClassName="custom-calendar"
              />
            </div>
          </div>
        )}

        {showEndDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white-bg rounded-20px p-5 shadow-lg w-full max-w-[320px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-text-primary text-lg font-medium">
                  읽기 종료
                </h3>
                <button
                  onClick={() => setShowEndDatePicker(false)}
                  className="text-text-secondary text-lg hover:text-text-primary transition-colors"
                >
                  ✕
                </button>
              </div>
              <DatePicker
                selected={bookProgress.endDate ? new Date(bookProgress.endDate) : null}
                onChange={handleEndDateChange}
                locale={ko}
                inline
                minDate={
                  bookProgress.startDate ? new Date(bookProgress.startDate) : undefined
                }
                className="w-full"
                calendarClassName="custom-calendar"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Record;