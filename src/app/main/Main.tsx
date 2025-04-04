"use client";

import React from "react";
import Image from "next/image";
import NavigationBar from "@/components/layout/NavigationBar";

const Main: React.FC = () => {
  // DB에서 가져올 이미지 URL을 위한 변수 (임시로 book-cover-4.png 사용)
  const bookImage = "/assets/images/book-cover-4.png";

  // DB에서 가져올 평점 (임시로 4.5점 설정)
  const ratingFromDB = 4.5;

  // 별 평점 컴포넌트
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

    return <div className="flex flex-row gap-1">{renderStars()}</div>;
  };

  return (
    <div className="bg-[#ffffff] flex flex-col gap-0 items-start justify-start min-h-screen">
      <div className="bg-[#fafaf7] flex flex-col gap-0 items-start justify-start w-full max-w-[390px] min-h-screen mx-auto relative overflow-auto">
        {/* 헤더 */}
        <div className="bg-[#fafaf7] pt-4 pr-4 pb-2 pl-4 flex flex-row items-center justify-between w-full h-[72px]">
          <div className="flex flex-row gap-0 items-center justify-start w-12 h-12">
            <div className="w-6 h-6 relative overflow-hidden">
              <Image
                src="/assets/icons/back-arrow.svg"
                alt="Back Arrow"
                width={24}
                height={24}
                className="absolute left-0 top-0"
              />
            </div>
          </div>
        </div>

        {/* Bestsellers 섹션 */}
        <div className="pt-5 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start w-full">
          <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-[22px] leading-7 font-bold">
            Bestsellers
          </div>
        </div>
        <div className="flex flex-row gap-0 items-start justify-start w-full">
          <div className="p-4 flex flex-row gap-3 items-start justify-start w-full">
            <div className="flex flex-col gap-4 items-start justify-start flex-1 min-w-[120px]">
              <Image
                src={bookImage}
                alt="Bestseller Book 1"
                width={120}
                height={160}
                className="w-full h-[160px] object-cover"
              />
              <div className="flex flex-col gap-0 items-start justify-start w-full">
                <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-base leading-6 font-medium">
                  이어령의 말
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start justify-start flex-1 min-w-[120px]">
              <Image
                src={bookImage}
                alt="Bestseller Book 2"
                width={120}
                height={160}
                className="w-full h-[160px] object-cover"
              />
              <div className="flex flex-col gap-0 items-start justify-start w-full">
                <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-base leading-6 font-medium">
                  린치핀
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start justify-start flex-1 min-w-[120px]">
              <Image
                src={bookImage}
                alt="Bestseller Book 3"
                width={120}
                height={160}
                className="w-full h-[160px] object-cover"
              />
              <div className="flex flex-col gap-0 items-start justify-start w-full">
                <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-base leading-6 font-medium">
                  Whispers of Wisdom
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Notes 섹션 */}
        <div className="pt-5 pr-4 pb-3 pl-4 flex flex-col gap-0 items-start justify-start w-full h-[60px]">
          <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-[22px] leading-7 font-bold">
            Community Notes
          </div>
        </div>
        <div className="bg-[#fafaf7] pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-start justify-start w-full">
          <Image
            src={bookImage}
            alt="Community Book 1"
            width={79}
            height={106}
            className="w-[79px] h-[106px] object-cover"
          />
          <div className="flex flex-col gap-2 items-start justify-center flex-1">
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-base leading-6 font-medium">
                Aether's Fall
              </div>
            </div>
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <div className="text-[#96704f] text-left font-['Pretendard',_sans-serif] text-sm leading-[21px] font-normal line-clamp-3">
                The ending left me speechless. Such a masterpiece!
                The ending left me speechless. Such a
              </div>
            </div>
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <StarRating rating={ratingFromDB} />
            </div>
          </div>
        </div>
        <div className="bg-[#fafaf7] pt-3 pr-4 pb-3 pl-4 flex flex-row gap-4 items-start justify-start w-full">
          <Image
            src={bookImage}
            alt="Community Book 2"
            width={79}
            height={106}
            className="w-[79px] h-[106px] object-cover"
          />
          <div className="flex flex-col gap-2 items-start justify-center flex-1">
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <div className="text-[#1c140d] text-left font-['Pretendard',_sans-serif] text-base leading-6 font-medium">
                Aether's Fall
              </div>
            </div>
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <div className="text-[#96704f] text-left font-['Pretendard',_sans-serif] text-sm leading-[21px] font-normal line-clamp-3">
                The ending left me speechless. Such a masterpiece!
                The ending left me speechless. Such a
              </div>
            </div>
            <div className="flex flex-col gap-0 items-start justify-start w-full">
              <StarRating rating={ratingFromDB} />
            </div>
          </div>
        </div>

        {/* 하단 여백 (NavigationBar 높이 고려) */}
        <div className="w-full h-[75px] bg-transparent" /> {/* NavigationBar 높이(75px) */}
      </div>

      {/* 플로팅 버튼 (고정 위치) */}
      <div className="fixed bottom-20 right-5 z-10">
        <div className="bg-[#ebba61] rounded-[20px] pr-2 pl-2 flex flex-row gap-2 items-center justify-center h-10 max-w-[480px]">
          <div className="flex flex-col gap-0 items-center justify-start w-6">
            <div className="w-6 h-6 relative overflow-hidden">
              <Image
                src="/assets/icons/floating.svg"
                alt="Floating Button Icon"
                width={24}
                height={24}
                className="absolute left-0 top-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div>
        <NavigationBar />
      </div>
    </div>
  );
};

export default Main;