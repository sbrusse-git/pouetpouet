import type { Metadata } from "next";
import { Cormorant_Garamond, Sora } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pouet Pouet | Remorque foodtruck barbecue pour vos événements",
  description:
    "Pouet Pouet, la remorque foodtruck barbecue et street food qui débarque sur vos événements privés et professionnels. Ambiance chaleureuse, cuisine minute et service sur mesure.",
  openGraph: {
    title: "Pouet Pouet | Foodtruck remorque barbecue",
    description:
      "Une remorque toute équipée, quatre passionnés et une vraie ambiance street food barbecue pour vos lunchs, anniversaires adultes et événements B2B.",
    locale: "fr_BE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
