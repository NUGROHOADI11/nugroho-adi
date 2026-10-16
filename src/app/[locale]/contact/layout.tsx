import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Kontak" : "Contact",
    description: isId
      ? "Hubungi Nugroho Adi untuk wawancara kerja, proyek rekayasa perangkat lunak, atau kolaborasi."
      : "Get in touch with Nugroho Adi for hiring, software engineering projects, or technical collaboration.",
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
