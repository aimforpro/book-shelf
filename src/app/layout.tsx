import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "책꽂이",
  description: "책꽂이 - 나만의 독서 기록을 관리하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 CDN 추가 */}
        <link
          href="https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-pretendard">{children}</body>
    </html>
  );
}