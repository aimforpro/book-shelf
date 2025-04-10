// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[844px] bg-primary-bg">
      {/* 404 텍스트 */}
      <h1 className="font-pretendard text-[72px] font-medium text-progress-fill mb-4">
        404
      </h1>

      {/* 제목 */}
      <h2 className="font-pretendard text-22px font-medium text-text-primary mb-3">
        Oops! 길을 잃으셨군요
      </h2>

      {/* 설명 */}
      <p className="font-pretendard text-base text-text-secondary mb-5">
        찾으시는 페이지를 발견하지 못했습니다.
      </p>

      {/* 버튼 */}
      <Link href="/login">
        <button className="font-pretendard text-lg font-normal text-white bg-button-bg py-3 px-5 rounded-20px hover:bg-progress-fill transition-colors">
          로그인으로 돌아가기
        </button>
      </Link>
    </div>
  );
}