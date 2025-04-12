import type { Metadata } from "next";
import "../styles/global.css";
import ClientLayout from "./ClientLayout";
import Script from "next/script"; // Script 컴포넌트 임포트

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/logo/192x192.png" />
        <meta name="theme-color" content="#ebba61" />
      </head>
      <body className="font-pretendard">
        <ClientLayout>{children}</ClientLayout>
        <Script src="/register-sw.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}