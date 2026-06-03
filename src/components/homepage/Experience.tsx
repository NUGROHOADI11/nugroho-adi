"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      title: string;
    };
    columns: string[];
    items: {
      university: ExperienceItemDict;
      venturo: ExperienceItemDict;
      telkomMsib: ExperienceItemDict;
      digistarWeb: ExperienceItemDict;
      telkomDci: ExperienceItemDict;
      digitalNetwork: ExperienceItemDict;
      americanCorner: ExperienceItemDict;
      internalVice: ExperienceItemDict;
      bangkit: ExperienceItemDict;
      devhandal: ExperienceItemDict;
    };
  };
};

interface ExperienceTimelineProps {
  dict: ExperienceDict;
}

export type TimelineLayoutConfig = {
  id: keyof ExperienceDict["experience"]["items"];
  startColumn: number;
  span: number;
  row: number;
  variant: "gray" | "green" | "dark";
};

export type HydratedTimelineItem = TimelineLayoutConfig & ExperienceItemDict;

export const experienceBaseLayout: TimelineLayoutConfig[] = [
  { id: "university", startColumn: 1, span: 22, row: 1, variant: "gray" },
  { id: "venturo", startColumn: 16, span: 3, row: 2, variant: "green" },
  { id: "telkomMsib", startColumn: 13, span: 3, row: 2, variant: "green" },
  { id: "digistarWeb", startColumn: 19, span: 6, row: 3, variant: "green" },
  { id: "telkomDci", startColumn: 22, span: 3, row: 2, variant: "green" },
  { id: "digitalNetwork", startColumn: 17, span: 4, row: 4, variant: "dark" },
  { id: "americanCorner", startColumn: 19, span: 3, row: 2, variant: "green" },
  { id: "internalVice", startColumn: 21, span: 4, row: 4, variant: "dark" },
  { id: "bangkit", startColumn: 8, span: 3, row: 2, variant: "gray" },
  { id: "devhandal", startColumn: 17, span: 4, row: 5, variant: "gray" },
];

const variantStyles = {
  gray: "bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-neutral-700/50",
  green:
    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 font-medium",
  dark: "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-950 border border-transparent font-medium shadow-sm",
};

const ActiveVariantBadges = {
  gray: "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200",
  green: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-neutral-950",
  dark: "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900",
};

export default function ExperienceTimeline({ dict }: ExperienceTimelineProps) {
  const totalGridTracks = 24;
  const [activeItem, setActiveItem] = useState<HydratedTimelineItem | null>(
    null,
  );

  const hydratedItems: HydratedTimelineItem[] = experienceBaseLayout.map(
    (config) => ({
      ...config,
      title: dict.experience.items[config.id].title,
      subtitle: dict.experience.items[config.id].subtitle,
      location: dict.experience.items[config.id].location,
      dateString: dict.experience.items[config.id].dateString,
      bullets: dict.experience.items[config.id].bullets,
    }),
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none relative">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-normal text-gray-900 dark:text-white tracking-tight">
          {dict.experience.header.title}
        </h2>
      </div>

      <div className="hidden lg:block relative w-full bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-4xl p-8 shadow-sm">
        <div
          className="absolute inset-0 grid pointer-events-none p-8"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalGridTracks }).map((_, idx) => (
            <div
              key={idx}
              className="border-l border-dashed border-gray-100/70 dark:border-neutral-900/70 h-full first:border-l-0"
            />
          ))}
        </div>

        <div
          className="relative grid gap-y-4 min-h-120 items-center"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {hydratedItems.map((item, idx) => {
            const isHovered = activeItem?.id === item.id;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onMouseEnter={() => setActiveItem(item)}
                onMouseLeave={() => setActiveItem(null)}
                className={`py-3 px-4 mx-1 rounded-full text-xs flex flex-col items-center justify-center text-center transition-all cursor-crosshair ${
                  isHovered
                    ? "ring-2 ring-emerald-500 scale-[1.02] shadow-md z-30 opacity-100"
                    : "opacity-70 hover:opacity-100 z-10"
                } ${variantStyles[item.variant]}`}
                style={{
                  gridColumnStart: item.startColumn,
                  gridColumnEnd: `span ${item.span}`,
                  gridRowStart: item.row,
                }}
              >
                <span className="truncate max-w-full block font-semibold">
                  {item.title}
                </span>
                <span className="text-[10px] opacity-70 block truncate max-w-full font-normal">
                  {item.subtitle}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div
          className="grid text-[11px] text-gray-400 dark:text-neutral-500 mt-6 pt-4 border-t border-gray-100 dark:border-neutral-900 relative"
          style={{
            gridTemplateColumns: `repeat(${totalGridTracks}, minmax(0, 1fr))`,
          }}
        >
          {dict.experience.columns.map((label, idx) => (
            <div
              key={idx}
              className="font-medium tracking-wider text-left pl-1 relative group"
              style={{
                gridColumnStart: idx * 4 + 1,
                gridColumnEnd: "span 4",
              }}
            >
              <div className="absolute -top-4 left-0 w-px h-2.5 bg-gray-300 dark:bg-neutral-700" />

              <span className="block pt-1 text-gray-400 dark:text-neutral-500 hover:text-emerald-500 transition-colors duration-200">
                {label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-neutral-800 z-40"
            >
              <div className="border-b border-gray-100 dark:border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {activeItem.title}
                  </h3>
                  <span
                    className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      ActiveVariantBadges[activeItem.variant]
                    }`}
                  >
                    {activeItem.subtitle}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 mt-1.5 text-[11px] font-medium">
                  <span className="text-gray-400 dark:text-neutral-500">
                    {activeItem.location}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {activeItem.dateString}
                  </span>
                </div>
              </div>

              <ul className="flex flex-col gap-2.5">
                {activeItem.bullets.map((bullet, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    <span className="text-emerald-500 dark:text-emerald-400 mt-1 shrink-0 select-none">
                      ✦
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lg:hidden flex flex-col gap-3">
        {hydratedItems
          .sort((a, b) => a.startColumn - b.startColumn || a.row - b.row)
          .map((item, idx) => (
            <button
              key={`mob-${idx}`}
              onClick={() => setActiveItem(item)}
              className="w-full text-left p-4 rounded-2xl text-sm font-medium bg-gray-50 dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-900/60 flex justify-between items-center active:scale-[0.99] transition-transform"
            >
              <div>
                <span className="text-[10px] uppercase opacity-60 tracking-wider block mb-0.5">
                  {item.dateString}
                </span>
                <span className="block font-bold text-gray-900 dark:text-white">
                  {item.title}
                </span>
                <span className="text-xs opacity-70 block font-normal text-gray-500 dark:text-gray-400">
                  {item.subtitle}
                </span>
              </div>
              <span className="text-lg opacity-40 pr-1">→</span>
            </button>
          ))}

        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItem(null)}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-neutral-900 w-full max-w-sm rounded-2xl p-5 shadow-xl z-10 border border-gray-100 dark:border-neutral-800"
              >
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-3 right-3 text-gray-400 text-sm font-bold p-1"
                >
                  ✕
                </button>
                <h3 className="text-base font-bold pr-4 text-gray-900 dark:text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  {activeItem.dateString}
                </p>
                <ul className="flex flex-col gap-2 mt-3 border-t border-gray-100 dark:border-neutral-800 pt-3">
                  {activeItem.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-emerald-500 mt-0.5">✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
