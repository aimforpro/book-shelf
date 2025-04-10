"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import NavigationBar from "@/components/layout/NavigationBar";
import { useAuth } from "@/hooks/useAuth"; // useAuth 훅 임포트
import { supabase } from "@/api/supabase"; // Supabase 클라이언트 임포트
import { useModal } from "@/context/ModalContext"; // useModal 훅 임포트

interface BookInfo {
  title: string;
  authors: string;
  description: string;
  publisher: string;
  isbn: string;
  publicationDate: string;
  price: number;
  image: string;
}

const Register: React.FC = () => {
  const { user, loading: authLoading } = useAuth(); // 유저 세션 정보 가져오기
  const { showModal } = useModal(); // 모달 호출 훅
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);

  useEffect(() => {
    const title = searchParams.get("title") || "";
    const authors = searchParams.get("author") || "";
    const publisher = searchParams.get("publisher") || "";
    const image = searchParams.get("image") || "/assets/images/book-cover-0.png";
    const description = searchParams.get("description") || "책 소개가 없습니다.";
    const pubdate = searchParams.get("pubdate") || "발행일 정보 없음";
    const discount = searchParams.get("discount") || "0";
    const isbn = searchParams.get("isbn") || "ISBN 정보 없음";

    const formattedPubdate =
      pubdate.length === 8
        ? `${pubdate.slice(0, 4)}-${pubdate.slice(4, 6)}-${pubdate.slice(6, 8)}`
        : pubdate;

    const bookData: BookInfo = {
      title,
      authors,
      description,
      publisher,
      isbn,
      publicationDate: formattedPubdate,
      price: parseInt(discount) || 0,
      image,
    };

    setBookInfo(bookData);
  }, [searchParams]);

  const handleRegister = async () => {
    if (!bookInfo || !user) return;
  
    try {
      // users 테이블에서 auth_id로 user_id(BIGINT) 조회
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id) // user.id는 UUID
        .single();
  
      if (userError || !userData) throw new Error("사용자 정보를 찾을 수 없습니다.");
  
      const bookData = {
        user_id: userData.id, // BIGINT 값 사용
        title: bookInfo.title,
        author: bookInfo.authors,
        description: bookInfo.description,
        publisher: bookInfo.publisher,
        isbn: bookInfo.isbn,
        pubdate: bookInfo.publicationDate,
        discount: bookInfo.price.toString(),
        cover_url: bookInfo.image,
        created_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
      };
  
      const { error } = await supabase.from("books").insert(bookData);
      if (error) throw error;
  
      showModal("책이 성공적으로 등록되었습니다!", "success");
      setTimeout(() => router.push("/bookshelf"), 1500);
    } catch (err) {
      console.error("책 등록 오류:", err);
      showModal("책 등록에 실패했습니다. 다시 시도해주세요.", "error"); // 실패 모달
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (authLoading) return <div className="text-center mt-10">로딩 중...</div>;

  if (!user) {
    router.push("/unauthenticated");
    return null; 
  }

  if (!bookInfo) {
    return <div>책 정보가 없습니다.</div>;
  }

  return (
    <div className="bg-[#FFFFFF] flex flex-col items-start justify-start min-h-screen">
      <div className="flex flex-col gap-0 items-start justify-start w-full min-h-screen relative overflow-auto">
        {/* 헤더 */}
        <div className="bg-[#FFFFFF] pt-4 px-4 pb-2 flex flex-row items-center justify-between w-full h-[72px]">
          <button onClick={handleBack} className="flex items-center">
            <Image
              src="/assets/icons/back-arrow.svg"
              alt="Back"
              width={24}
              height={24}
            />
          </button>
          {/* <h1 className="text-[#4A4A4A] text-left font-['Pretendard'] text-lg font-bold">
            등록
          </h1>
          <div className="text-[#1C140D] font-['Pretendard'] text-sm">
            {user.email}님
          </div> */}
        </div>

        {/* 책 정보 섹션 */}
        <div className="flex flex-col gap-3 items-start justify-start w-full min-w-[360px] max-w-[414px] mx-auto">
          <div className="bg-[#F9F9F9] rounded-lg flex flex-col gap-4 items-center justify-start w-full p-4 shadow-sm">
            <h2 className="text-[#4A4A4A] text-center font-['Pretendard'] text-[20px] leading-6 font-semibold w-[341px] max-w-[90%]">
              {bookInfo.title}
            </h2>
            <Image
              src={bookInfo.image}
              alt={bookInfo.title}
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
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  도서명
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.title}
                </span>
              </div>
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  저자
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.authors.split(", ")[0]}
                </span>
              </div>
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  출판사
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.publisher}
                </span>
              </div>
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  ISBN
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.isbn}
                </span>
              </div>
              <div className="flex flex-row items-center justify-start w-full bg-[#F9F9F9] rounded-lg p-3 shadow-sm">
                <span className="text-[#4A4A4A] font-['Pretendard'] text-sm leading-[24px] font-medium w-20">
                  발행일
                </span>
                <span className="text-[#666666] font-['Pretendard'] text-sm leading-[24px] font-normal flex-1">
                  {bookInfo.publicationDate}
                </span>
              </div>
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

      <NavigationBar currentPath="/register" />
    </div>
  );
};

export default Register;