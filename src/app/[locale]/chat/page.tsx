import { Metadata } from "next";
import { getDictionary, isValidLocale, type Locale } from "@/i18n/dictionaries";
import { api } from "@/lib/api";
import FullscreenChat from "@/components/chat/FullscreenChat";

interface ChatPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "P'nu - Asisten AI" : "P'nu - AI Assistant",
    description: isId
      ? "Tanya jawab langsung bersama P'nu, asisten AI resmi Nugroho Adi."
      : "Chat directly with P'nu, Nugroho Adi's official AI assistant.",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { locale } = await params;
  const validLocale: Locale = isValidLocale(locale) ? locale : "id";

  const [dict, profile] = await Promise.all([
    getDictionary(validLocale),
    api.getProfile(validLocale),
  ]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-black text-neutral-900 dark:text-white pt-6 sm:pt-10 pb-12 px-3 sm:px-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <FullscreenChat
          locale={validLocale}
          profileName={profile?.name || "Nugroho Adi"}
          profileRole={profile?.role || "Software & AI/Cloud Engineer"}
        />
      </div>
    </div>
  );
}
