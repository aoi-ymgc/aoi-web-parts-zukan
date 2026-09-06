import type { Metadata } from "next";
import "./globals.css";

const publicUrl = "https://aoi-web-parts-zukan.aoiroymgc.workers.dev/";
const title = "Webパーツ図鑑｜見て、触って、名前を知る";
const description =
  "名前が分からなくても探せる、初心者向けのInteractive Webパーツ図鑑。";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title,
  description,
  alternates: {
    canonical: publicUrl,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: publicUrl,
    locale: "ja_JP",
    images: [
      {
        url: "/ogp.png",
        width: 1200,
        height: 630,
        alt: "Webパーツ図鑑の画面イメージ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/ogp.png"],
  },
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
