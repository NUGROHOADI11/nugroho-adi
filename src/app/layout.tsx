import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import { headers } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Preloader from "@/components/layout/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nugroho Adi",
    default: "Nugroho Adi - Software & Cloud/AI Engineer",
  },
  description:
    "Welcome to my digital space. Software Engineer and Cloud/AI Specialist passionate about scalable, high-performance web and cloud architectures.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const activeLocale = headerList.get("x-locale") || "en";

  return (
    <html
      lang={activeLocale}
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-dm-sans flex flex-col bg-white dark:bg-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#059669"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #10b981,0 0 5px #059669"
          />
          <Preloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
