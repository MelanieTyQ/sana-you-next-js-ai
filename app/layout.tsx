import type { Metadata } from "next";
import { Lora, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lifefort Wellness Assessment | Independent USANA Brand Partner",
  description:
    "Take the free Lifefort Wellness Assessment — 5 trackers covering Fatigue, Energy, Immunity, Gut Health, and Stress & Sleep. Get personalized USANA supplement suggestions.",
  robots: "index, follow",
  openGraph: {
    title: "Lifefort Free Wellness Assessment",
    description: "5 personalized trackers. Instant results. 100% free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lora.variable} ${atkinson.variable}`}>
      <body>{children}</body>
    </html>
  );
}
