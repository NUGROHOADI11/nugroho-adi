"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbBriefcase,
  TbUsers,
  TbSchool,
  TbCalendar,
  TbMapPin,
  TbCheck,
  TbX,
  TbSparkles,
  TbChevronDown,
  TbChevronUp,
} from "react-icons/tb";

export type ExperienceItemDict = {
  title: string;
  subtitle: string;
  location: string;
  dateString: string;
  bullets: string[];
};

export type ExperienceDict = {
  experience: {
    header: {
      subtitle?: string;
      title: string;
    };
    filters?: {
      all: string;
      work: string;
      leadership: string;
      education: string;
    };
    legend?: {
      work: string;
      leadership: string;
      education: string;
    };
    status?: {
      active: string;
      completed: string;
      clickToInspect: string;
      close: string;
    };
    columns: string[];
    items: Record<string, ExperienceItemDict>;
  };
};

interface ExperienceTimelineProps {
  dict: ExperienceDict;
  apiExperiences?: any[] | null;
}

export type TimelineCategory = "all" | "work" | "leadership" | "education";

export type TimelineLayoutConfig = {
  id: string;
  startColumn: number;
  span: number;
  row: number;
  variant: "gray" | "green" | "dark";
  order?: number;
};

export type HydratedTimelineItem = TimelineLayoutConfig &
  ExperienceItemDict & {
    category: "work" | "leadership" | "education";
    isActive: boolean;
    order: number;
  };

export const experienceBaseLayout: TimelineLayoutConfig[] = [
  { id: "university", startColumn: 1, span: 22, row: 1, variant: "gray", order: 1 },
  { id: "bangkit", startColumn: 11, span: 2, row: 2, variant: "gray", order: 2 },
  { id: "telkomMsib", startColumn: 15, span: 2, row: 2, variant: "green", order: 3 },
  { id: "venturo", startColumn: 17, span: 2, row: 2, variant: "green", order: 4 },
  { id: "americanCorner", startColumn: 19, span: 3, row: 2, variant: "green", order: 5 },
  { id: "telkomDci", startColumn: 22, span: 3, row: 2, variant: "green", order: 6 },
  { id: "devhandal", startColumn: 17, span: 2, row: 3, variant: "gray", order: 7 },
  { id: "digistarWeb", startColumn: 19, span: 6, row: 3, variant: "green", order: 8 },
  { id: "kimiaFarma", startColumn: 19, span: 6, row: 4, variant: "green", order: 9 },
  { id: "digitalNetwork", startColumn: 17, span: 4, row: 5, variant: "dark", order: 10 },
  { id: "internalVice", startColumn: 21, span: 4, row: 5, variant: "dark", order: 11 },
];

const categoryFromVariant = (
  variant: "gray" | "green" | "dark",
): "work" | "leadership" | "education" => {
  if (variant === "green") return "work";
  if (variant === "dark") return "leadership";
  return "education";
};

const variantStyles = {
  gray: "bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-neutral-700/60 shadow-xs",
  green:
    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-medium shadow-xs",
  dark: "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border border-neutral-800 dark:border-neutral-200 font-medium shadow-sm",
};

const categoryLabels = {
  work: "Professional Experience",
  leadership: "Leadership Role",
  education: "Education & Program",
};

export default function ExperienceTimeline({
  dict,
  apiExperiences,
}: ExperienceTimelineProps) {
  const totalGridTracks = 24;
  const [selectedFilter, setSelectedFilter] = useState<TimelineCategory>("all");
  const [selectedItem, setSelectedItem] = useState<HydratedTimelineItem | null>(null);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);

  const checkIsActive = (dateString: string) =>
    dateString.toLowerCase().includes("present") ||
    dateString.toLowerCase().includes("sekarang");

  const hydratedItems: HydratedTimelineItem[] =
    apiExperiences && apiExperiences.length > 0
      ? apiExperiences.map((exp, idx) => {
          const variant = (exp.variant || "green") as "gray" | "green" | "dark";
          return {
            id: exp.slug,
            startColumn: exp.startColumn,
            span: exp.span,
            row: exp.row,
            order: exp.order ?? idx + 1,
            variant,
            category: categoryFromVariant(variant),
            title: exp.title,
            subtitle: exp.subtitle,
            location: exp.location,
            dateString: exp.dateString,
            bullets: exp.bullets || [],
            isActive: checkIsActive(exp.dateString || ""),
          };
        })
      : experienceBaseLayout.map((config, idx) => {
          const localized = dict.experience.items[config.id] || {
            title: config.id,
            subtitle: "",
            location: "",
            dateString: "",
            bullets: [],
          };
          return {
            ...config,
            order: config.order ?? idx + 1,
            category: categoryFromVariant(config.variant),
            title: localized.title,
            subtitle: localized.subtitle,
            location: localized.location,
            dateString: localized.dateString,
            bullets: localized.bullets,
            isActive: checkIsActive(localized.dateString || ""),
          };
        });

  const counts = {
    all: hydratedItems.length,
    work: hydratedItems.filter((i) => i.category === "work").length,
    leadership: hydratedItems.filter((i) => i.category === "leadership").length,
    education: hydratedItems.filter((i) => i.category === "education").length,
  };

  const activeInspectorItem = selectedItem;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 select-none relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block mb-2">
            {dict.experience.header?.subtitle || "CAREER ROADMAP"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-gray-900 dark:text-white tracking-tight">
            {dict.experience.header.title}
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-100/80 dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-gray-200/50 dark:border-neutral-800/60 self-start md:self-auto shrink-0">
          {(
            [
              {
                id: "all",
                label: dict.experience.filters?.all || "All",
                icon: null,
                dot: null as string | null,
              },
              {
                id: "work",
                label: dict.experience.filters?.work || "Work",
                icon: TbBriefcase,
                dot: "bg-emerald-500",
              },
              {
                id: "leadership",
                label: dict.experience.filters?.leadership || "Leadership",
                icon: TbUsers,
                dot: "bg-neutral-900 dark:bg-white",
              },
              {
                id: "education",
                label: dict.experience.filters?.education || "Education",
                icon: TbSchool,
                dot: "bg-blue-500",
              },
            ]
          ).map((tab) => {
            const isCurrent = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as TimelineCategory)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isCurrent
                    ? "bg-white dark:bg-neutral-950 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tab.dot ? (
                  <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
                ) : null}
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 font-mono">
                  {counts[tab.id as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop 24-Column Gantt Timeline */}
      <div className="hidden lg:block relative w-full bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-4xl p-8 shadow-xs overflow-hidden">
        {/* Subtle grid track guide lines */}
        <div
          className="absolute inset-0 grid pointer-events-none p-8"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalGridTracks }).map((_, idx) => (
            <div
              key={idx}
              className={`border-l h-full first:border-l-0 ${
                idx % 4 === 0
                  ? "border-gray-200/80 dark:border-neutral-800/80"
                  : "border-dashed border-gray-100/60 dark:border-neutral-900/60"
              }`}
            />
          ))}
        </div>

        {/* Milestone Tracks Grid (5 Rows) */}
        <div
          className="relative grid gap-y-3.5 min-h-125 items-center py-2"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {hydratedItems.map((item, idx) => {
            const isMatch =
              selectedFilter === "all" || item.category === selectedFilter;
            const isSelected = selectedItem?.id === item.id;

            return (
              <motion.button
                key={item.id || idx}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                  opacity: isMatch ? (isSelected ? 1 : 0.92) : 0.22,
                  scale: isSelected ? 1.02 : 1,
                  filter: isMatch ? "none" : "grayscale(80%)",
                }}
                whileHover={
                  isMatch
                    ? {
                        scale: 1.025,
                        opacity: 1,
                      }
                    : {}
                }
                transition={{ duration: 0.25 }}
                onClick={() =>
                  setSelectedItem(isSelected ? null : item)
                }
                className={`py-3 px-3.5 mx-1 rounded-2xl text-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden group ${
                  variantStyles[item.variant]
                } ${
                  isSelected
                    ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/15 z-30"
                    : "z-10 hover:shadow-md"
                }`}
                style={{
                  gridColumnStart: item.startColumn,
                  gridColumnEnd: `span ${item.span}`,
                  gridRowStart: item.row,
                }}
                title={`${item.title} — ${item.subtitle} (${item.dateString})`}
              >
                {/* Active live indicator */}
                {item.isActive && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}

                <div className="flex items-center gap-1.5 max-w-full">
                  <span className="truncate max-w-full block font-bold text-xs tracking-tight">
                    {item.title}
                  </span>
                </div>

                <span className="text-[10px] opacity-75 block truncate max-w-full font-medium mt-0.5">
                  {item.subtitle}
                </span>

                {/* Selected indicator check badge */}
                {isSelected && (
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-tl-lg p-0.5 text-[10px]">
                    <TbCheck />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Timeline Year & Quarter Axis */}
        <div
          className="grid text-[11px] text-gray-400 dark:text-neutral-500 mt-6 pt-5 border-t border-gray-100 dark:border-neutral-900 relative"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {dict.experience.columns.map((label, idx) => (
            <div
              key={idx}
              className="font-semibold tracking-wider text-left pl-1 relative group"
              style={{
                gridColumnStart: idx * 4 + 1,
                gridColumnEnd: "span 4",
              }}
            >
              <div className="absolute -top-5 left-0 w-px h-3 bg-emerald-500/60 dark:bg-emerald-400/60" />
              <span className="block pt-1 text-gray-700 dark:text-neutral-300 font-mono">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Inspector Panel (Desktop) */}
      <div className="hidden lg:block mt-6">
        <AnimatePresence mode="wait">
          {activeInspectorItem ? (
            <motion.div
              key={activeInspectorItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-neutral-950 border border-gray-200/80 dark:border-neutral-900 rounded-3xl p-7 shadow-lg relative overflow-hidden"
            >
              {/* Header & Meta */}
              <div className="flex justify-between items-start gap-4 pb-5 border-b border-gray-100 dark:border-neutral-900">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${
                        activeInspectorItem.category === "work"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                          : activeInspectorItem.category === "leadership"
                          ? "bg-neutral-900 dark:bg-neutral-800 text-white"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {categoryLabels[activeInspectorItem.category]}
                    </span>

                    {activeInspectorItem.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-900/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {dict.experience.status?.active || "Active / Ongoing"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-neutral-900 px-2.5 py-1 rounded-full">
                        {dict.experience.status?.completed || "Completed"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {activeInspectorItem.title}
                  </h3>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {activeInspectorItem.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center justify-end gap-1.5 font-medium">
                      <TbCalendar className="h-4 w-4 text-emerald-500" />
                      <span>{activeInspectorItem.dateString}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <TbMapPin className="h-3.5 w-3.5" />
                      <span>{activeInspectorItem.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                    title={dict.experience.status?.close || "Close Details"}
                  >
                    <TbX className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Responsibilities & Impact */}
              <div className="mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <TbSparkles className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-neutral-400">
                    Key Contributions & Impact
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeInspectorItem.bullets.map((bullet, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-900 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✓
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-4 px-6 bg-gray-50 dark:bg-neutral-900/30 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl text-center text-xs text-gray-400 dark:text-neutral-500 flex items-center justify-center gap-2"
            >
              <span>💡</span>
              <span>
                {dict.experience.status?.clickToInspect ||
                  "Click any milestone bar above to inspect detailed responsibilities and key deliverables."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Vertical Stepper View (< lg) */}
      <div className="lg:hidden flex flex-col gap-4">
        <p className="text-xs text-gray-400 dark:text-neutral-500 text-center mb-2">
          {dict.experience.status?.clickToInspect ||
            "Tap any milestone to view responsibilities & achievements"}
        </p>

        <div className="relative pl-6 border-l-2 border-emerald-500/20 dark:border-emerald-500/10 space-y-4">
          {hydratedItems
            .filter(
              (item) =>
                selectedFilter === "all" || item.category === selectedFilter,
            )
            .sort((a, b) => b.order - a.order || b.startColumn - a.startColumn)
            .map((item) => {
              const isExpanded = expandedMobileId === item.id;

              return (
                <div key={`mob-${item.id}`} className="relative">
                  {/* Timeline node marker */}
                  <span
                    className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 border-white dark:border-black transition-colors ${
                      item.isActive
                        ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                        : item.category === "leadership"
                        ? "bg-neutral-800 dark:bg-neutral-200"
                        : "bg-gray-400 dark:bg-neutral-600"
                    }`}
                  />

                  {/* Card item */}
                  <div
                    onClick={() =>
                      setExpandedMobileId(isExpanded ? null : item.id)
                    }
                    className="p-4 rounded-3xl bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            {item.dateString}
                          </span>
                          {item.isActive && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.subtitle}
                        </p>
                      </div>

                      <button
                        className="p-1.5 rounded-xl bg-gray-100 dark:bg-neutral-900 text-gray-500 shrink-0"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? (
                          <TbChevronUp className="h-4 w-4" />
                        ) : (
                          <TbChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1">
                      <TbMapPin className="h-3 w-3 shrink-0" />
                      <span>{item.location}</span>
                    </div>

                    {/* Expandable bullets */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-900 space-y-2 overflow-hidden"
                        >
                          {item.bullets.map((b, i) => (
                            <div
                              key={i}
                              className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2 leading-relaxed"
                            >
                              <span className="text-emerald-500 mt-0.5 shrink-0">
                                ✦
                              </span>
                              <span>{b}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
