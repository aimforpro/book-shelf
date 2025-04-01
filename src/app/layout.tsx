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
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Plus_Jakarta_Sans'] antialiased">
        {children}
      </body>
    </html>
  );
}