import type { Metadata } from "next";
import "../styles/global.css";
import ClientLayout from "./ClientLayout"; // 클라이언트 레이아웃 임포트

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
        <link
          href="https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-pretendard">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}