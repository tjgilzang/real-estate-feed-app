import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "예스부동산 추천 피드",
  description:
    "지역/가격/스타일을 반영한 추천 알고리즘과 상세 이유를 제공하는 부동산 피드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
