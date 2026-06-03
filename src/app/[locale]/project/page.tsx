"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbCode,
  TbCloud,
  TbBrandReact,
  TbBrandFlutter,
  TbDeviceMobile,
} from "react-icons/tb";
import type en from "@/i18n/en.json";

interface PageProps {
  params: Promise<{ locale: string }>;
}

type ProjectCategory = "web" | "mobile" | "cloud";
type FilterType = "all" | ProjectCategory;

const baseProjects: Array<{
  id: keyof typeof en.projects.items;
  category: ProjectCategory;
  tags: string[];
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "portfolio",
    category: "web",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "i18n Systems"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbBrandReact,
  },
  {
    id: "digistar",
    category: "web",
    tags: ["React.js", "Vite", "Tailwind CSS", "UI Components"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbBrandReact,
  },
  {
    id: "kampungKemasan",
    category: "web",
    tags: ["React.js", "Tailwind CSS", "Component Architecture"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbCode,
  },
  {
    id: "spse",
    category: "web",
    tags: ["Java", "Go Lang", "Enterprise APIs", "Microservices"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbCode,
  },
  {
    id: "voiceTask",
    category: "mobile",
    tags: ["Flutter", "Dart", "GetX State", "Sentry APM"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbBrandFlutter,
  },
  {
    id: "tasikmaduKu",
    category: "mobile",
    tags: ["Flutter", "Dart", "Cross-Platform", "Location Service"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbDeviceMobile,
  },
  {
    id: "gcpMigration",
    category: "cloud",
    tags: ["Google Cloud (GCP)", "Kubernetes / GKE", "Pub/Sub", "CI/CD Matrix"],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbCloud,
  },
  {
    id: "bangkit",
    category: "cloud",
    tags: [
      "Cloud Deployment",
      "Scalable Systems",
      "Capstone Project",
      "System Security",
    ],
    link: "https://github.com/NUGROHOADI11/",
    icon: TbCloud,
  },
];

export default function Project({ params }: PageProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [dict, setDict] = useState<typeof en | null>(null);

  useEffect(() => {
    (async () => {
      const { getDictionary, isValidLocale } =
        await import("@/i18n/dictionaries");
      const { locale } = await params;
      const validLocale = isValidLocale(locale) ? locale : "en";
      const dictionary = await getDictionary(validLocale as "en" | "id");
      setDict(dictionary);
    })();
  }, [params]);

  if (!dict) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hydratedProjects = baseProjects.map((project) => ({
    ...project,
    title: dict.projects.items[project.id].title,
    categoryLabel: dict.projects.items[project.id].categoryLabel,
    description: dict.projects.items[project.id].description,
    organization: dict.projects.items[project.id].organization,
  }));

  const filteredProjects = hydratedProjects.filter(
    (p) => filter === "all" || p.category === filter,
  );

  const isAllTab = filter === "all";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-2">
            {dict.projects.header.subtitle}
          </h2>
          <p className="text-3xl font-normal text-gray-900 dark:text-white tracking-tight">
            {dict.projects.header.title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-[#f1f3f4] dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-transparent dark:border-neutral-800/40 shrink-0">
          {(["all", "web", "mobile", "cloud"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all relative ${
                filter === type
                  ? "bg-white dark:bg-neutral-950 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {dict.projects.filters[type]}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className={`grid grid-cols-1 gap-5 items-stretch transition-all duration-500 ${
          isAllTab
            ? "sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 110, damping: 17 }}
                className={`bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-4xl flex flex-col justify-between group shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden w-full ${
                  isAllTab ? "p-5 md:p-6" : "p-6 md:p-8"
                }`}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest block truncate">
                          {project.categoryLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5 truncate">
                          {project.organization}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3
                    className={`font-medium text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 ${
                      isAllTab ? "text-base" : "text-lg md:text-xl"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={`text-gray-600 dark:text-gray-400 leading-relaxed ${
                      isAllTab ? "text-xs line-clamp-4" : "text-xs md:text-sm"
                    }`}
                  >
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-6 pt-3 border-t border-gray-50 dark:border-neutral-900/60 w-full">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-50/80 dark:bg-neutral-900/40 text-[10px] font-medium px-2 py-0.5 rounded-md text-gray-500 dark:text-gray-400 border border-gray-100/50 dark:border-neutral-800/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
