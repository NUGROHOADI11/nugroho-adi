import { getDictionary, isValidLocale, type Locale } from "@/i18n/dictionaries";
import { api } from "@/lib/api";
import FullscreenChat from "@/components/chat/FullscreenChat";

interface ChatPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { locale } = await params;
  const validLocale: Locale = isValidLocale(locale) ? locale : "id";

  const [dict, profile] = await Promise.all([
    getDictionary(validLocale),
    api.getProfile(validLocale),
  ]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-16 px-4 sm:px-6">
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
