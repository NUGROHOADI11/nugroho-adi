import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Tentang Saya" : "About",
    description: isId
      ? "Latar belakang, filosofi rekayasa, dan perjalanan karir Nugroho Adi."
      : "Background, engineering philosophy, and career journey of Nugroho Adi.",
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
