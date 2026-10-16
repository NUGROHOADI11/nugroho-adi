import { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === "id";
  return {
    title: isId ? "Proyek & Portofolio" : "Projects & Portfolio",
    description: isId
      ? "Kumpulan proyek enterprise, microservices cloud, dan aplikasi mobile yang pernah dikembangkan oleh Nugroho Adi."
      : "Selected enterprise software, cloud microservices, and mobile applications developed by Nugroho Adi.",
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
