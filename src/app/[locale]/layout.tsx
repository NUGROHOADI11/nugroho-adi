import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AiChatWidget from "@/components/chat/AiChatWidget";
import { getDictionary, isValidLocale, type Locale } from "@/i18n/dictionaries";
import { api } from "@/lib/api";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const validLocale: Locale = isValidLocale(locale) ? locale : "en";

  const [dictionary, profile] = await Promise.all([
    getDictionary(validLocale),
    api.getProfile(validLocale),
  ]);

  return (
    <>
      <Navbar
        locale={validLocale}
        dictionary={dictionary}
        brand={profile?.brand}
      />
      <main className="flex-1 w-full bg-white dark:bg-black">{children}</main>
      <Footer
        locale={validLocale}
        dictionary={dictionary}
        profile={profile}
      />
      <AiChatWidget locale={validLocale} />
    </>
  );
}
