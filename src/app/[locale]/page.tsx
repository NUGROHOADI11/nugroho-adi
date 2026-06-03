import { getDictionary, isValidLocale, type Locale } from "@/i18n/dictionaries";
import Hero from "@/components/homepage/Hero";
import InfiniteText from "@/components/layout/InfiniteText";
import ExperienceTimeline from "@/components/homepage/Experience";
import Achievement from "@/components/homepage/Achievement";
import CTA from "@/components/homepage/CTA";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  const validLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = await getDictionary(validLocale);

  return (
    <main className="flex-1 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      <Hero dict={dict} validLocale={validLocale} />
      <InfiniteText />
      <ExperienceTimeline dict={dict} />
      <Achievement dict={dict} />
      <CTA dict={dict} />
    </main>
  );
}
