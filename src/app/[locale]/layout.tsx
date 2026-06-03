import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getDictionary, isValidLocale, type Locale } from "@/i18n/dictionaries";

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
  const dictionary = await getDictionary(validLocale);

  return (
    <>
      <Navbar locale={validLocale} dictionary={dictionary} />
      <main className="flex-1 w-full bg-white dark:bg-black">{children}</main>
      <Footer locale={validLocale} dictionary={dictionary} />
    </>
  );
}
