import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webパーツ図鑑｜見て、触って、名前を知る",
  description:
    "名前が分からなくても探せる、初心者向けのInteractive Webパーツ図鑑。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
