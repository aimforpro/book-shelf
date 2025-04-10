import Link from "next/link";

export default function Unauthenticated() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[844px] bg-primary-bg">
      {/* 아이콘 또는 이미지 (선택 사항) */}
      <h1 className="font-pretendard text-[72px] font-medium text-progress-fill mb-4">
        🔒
      </h1>

      {/* 제목 */}
      <h2 className="font-pretendard text-[22px] font-medium text-text-primary mb-3">
        로그인이 필요합니다
      </h2>

      {/* 설명 */}
      <p className="font-pretendard text-base text-text-secondary mb-5">
        이 페이지를 보려면 로그인해 주세요.
      </p>

      {/* 버튼 */}
      <Link href="/login">
        <button className="font-pretendard text-lg font-normal text-white bg-button-bg py-3 px-5 rounded-20px hover:bg-progress-fill transition-colors">
          로그인 페이지로 이동
        </button>
      </Link>
    </div>
  );
}