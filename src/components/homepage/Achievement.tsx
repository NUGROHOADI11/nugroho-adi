"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FiAward,
  FiUsers,
  FiLayers,
  FiCloud,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";

type AchievementItemDict = {
  metric: string;
  label: string;
  description: string;
};

export type AchievementDict = {
  achievements: {
    header: {
      subtitle: string;
      title: string;
    };
    items: {
      digihack: AchievementItemDict;
      alibaba: AchievementItemDict;
      aws: AchievementItemDict;
      msib: AchievementItemDict;
      digistar: AchievementItemDict;
      americanCorner: AchievementItemDict;
    };
  };
};

interface AchievementProps {
  dict: AchievementDict;
}

const baseAchievements: Array<{
  id: keyof AchievementDict["achievements"]["items"];
  icon: React.ComponentType<{ className?: string }>;
  highlightColor: string;
}> = [
  {
    id: "digihack",
    icon: FiAward,
    highlightColor:
      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/30",
  },
  {
    id: "alibaba",
    icon: FiCloud,
    highlightColor:
      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/30",
  },
  {
    id: "aws",
    icon: FiCheckCircle,
    highlightColor:
      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/30",
  },
  {
    id: "msib",
    icon: FiZap,
    highlightColor:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30",
  },
  {
    id: "digistar",
    icon: FiLayers,
    highlightColor:
      "text-neutral-900 dark:text-neutral-100 bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800",
  },
  {
    id: "americanCorner",
    icon: FiUsers,
    highlightColor:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 },
  },
};

export default function Achievement({ dict }: AchievementProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 select-none">
      <div className="mb-14 text-center lg:text-left">
        <h2 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-2">
          {dict.achievements.header.subtitle}
        </h2>
        <p className="text-3xl font-normal text-gray-900 dark:text-white tracking-tight">
          {dict.achievements.header.title}
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {baseAchievements.map((item, idx) => {
          const IconComponent = item.icon;

          const localizedItem = dict.achievements.items[item.id];

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-4xl p-6 md:p-7 flex flex-col justify-between hover:shadow-md transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="flex justify-between items-start gap-4 mb-5">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase block mb-1 truncate">
                    {localizedItem.label}
                  </span>
                  <span className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight block">
                    {localizedItem.metric}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-2xl border transition-transform duration-500 group-hover:scale-105 shrink-0 ${item.highlightColor}`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {localizedItem.description}
              </p>

              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
