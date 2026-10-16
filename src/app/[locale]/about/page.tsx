"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  TbArrowUpRight,
  TbCompass,
  TbCoffee,
  TbMountain,
  TbCode,
  TbCloud,
  TbUsers,
  TbDeviceGamepad2,
} from "react-icons/tb";
import type en from "@/i18n/en.json";
import profileImg from "../../../../public/assets/images/about.webp";
import AboutSkeleton from "@/components/skeletons/AboutSkeleton";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const techStack = [
  { name: "Flutter", cat: "Mobile" },
  { name: "GetX", cat: "Mobile" },
  { name: "Next.js", cat: "Web" },
  { name: "React.js", cat: "Web" },
  { name: "Dart", cat: "Language" },
  { name: "Sentry", cat: "DevOps" },
  { name: "AWS", cat: "Cloud" },
  { name: "Alibaba Cloud", cat: "Cloud" },
  { name: "GCP", cat: "Cloud" },
  { name: "Gemini", cat: "AI" },
  { name: "AlloyDB", cat: "Database" },
  { name: "Java", cat: "Language" },
  { name: "Python", cat: "Language" },
  { name: "Photoshop", cat: "Design" },
  { name: "Figma", cat: "Design" },
];

export default function About({ params }: PageProps) {
  const [dict, setDict] = useState<typeof en | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [skills, setSkills] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const { getDictionary, isValidLocale } =
        await import("@/i18n/dictionaries");
      const { api } = await import("@/lib/api");
      const { locale } = await params;
      const validLocale = isValidLocale(locale) ? locale : "en";

      const [dictionary, prof, sk] = await Promise.all([
        getDictionary(validLocale as "en" | "id"),
        api.getProfile(validLocale),
        api.getSkills(),
      ]);

      setDict(dictionary);
      setProfile(prof);
      setSkills(sk);
    })();
  }, [params]);

  if (!dict) {
    return <AboutSkeleton />;
  }

  const skillsToRender =
    skills && skills.length > 0
      ? skills.map((s) => ({ name: s.name, cat: s.category }))
      : techStack;

  const lifestyleBadges = [
    { label: dict.about.lifestyle.badges.hiking, icon: TbMountain },
    { label: dict.about.lifestyle.badges.coffee, icon: TbCoffee },
    { label: dict.about.lifestyle.badges.exploration, icon: TbCompass },
    { label: dict.about.lifestyle.badges.gaming, icon: TbDeviceGamepad2 },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none overflow-hidden">
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-6 mb-16">
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-none max-w-2xl text-gray-900 dark:text-white">
          {profile?.hero?.title1 || dict.about.hero.title1}
          <br />
          <span className="font-serif italic text-emerald-600 dark:text-emerald-400">
            {profile?.hero?.titleHighlight || dict.about.hero.titleHighlight}
          </span>{" "}
          {profile?.hero?.title2 || dict.about.hero.title2}
        </h1>
        <p className="text-xs tracking-widest text-gray-400 dark:text-neutral-500 uppercase font-bold pt-3 lg:text-right">
          {dict.about.hero.portfolio}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        <div className="lg:col-span-8 relative rounded-[3rem] overflow-hidden min-h-80 md:min-h-100 flex items-center justify-center p-6 md:p-12 group">
          <div className="absolute w-[90%] h-[85%] rounded-[10rem] md:rounded-[20rem] overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50">
            <Image
              src={profileImg}
              alt="Nugroho Adi Profile Background"
              className="w-full h-full object-cover brightness-95 transition-transform duration-1000 group-hover:scale-105"
              fill
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute left-4 top-8 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 max-w-64 pointer-events-none hidden sm:block z-10"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {profile?.status?.label || dict.about.status.label}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-normal">
              {profile?.status?.text || dict.about.status.text}
            </p>
          </motion.div>

          <Link
            href={profile?.social?.linkedin || "https://www.linkedin.com/in/nugrohoadi11/"}
            target="_blank"
            className="absolute right-6 bottom-8 md:right-12 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 px-5 py-5 rounded-full shadow-xl hover:scale-105 transition active:scale-95 z-10 flex flex-col items-center justify-center group/btn"
          >
            <TbArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            <span className="text-[10px] uppercase tracking-wider font-bold mt-1">
              {dict.about.connect}
            </span>
          </Link>
        </div>

        <div className="lg:col-span-4 p-8 bg-[#f1f3f4] dark:bg-neutral-900 rounded-[3rem] flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-4">
              {dict.about.main.label}
            </span>
            <h2 className="text-xl font-normal text-gray-900 dark:text-white tracking-tight leading-snug mb-4">
              {profile?.about?.title || dict.about.main.title}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {profile?.about?.description || dict.about.main.description}
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 mt-6 flex justify-between items-center text-xs text-gray-500">
            <span>{profile?.location || dict.about.main.location}</span>
            <span>{profile?.est || dict.about.main.est}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem] p-6 flex flex-col justify-between relative overflow-hidden group shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
                {dict.about.toolkit.title}
              </span>
              <TbCode className="text-emerald-600 dark:text-emerald-400 h-5 w-5" />
            </div>

            <div className="flex flex-wrap gap-2">
              {skillsToRender.map((tech, i) => (
                <span
                  key={i}
                  className="bg-gray-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-xl text-xs font-medium border border-gray-100 dark:border-neutral-800/60"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-8">
            {dict.about.toolkit.description}
          </p>
        </div>

        <div className="md:col-span-4 bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block">
                {profile?.leadership?.title || dict.about.leadership.title}
              </span>
              <TbUsers className="text-blue-600 dark:text-blue-400 h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {profile?.leadership?.role || dict.about.leadership.role}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {profile?.leadership?.description || dict.about.leadership.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-50 dark:border-neutral-900 text-[11px] text-gray-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
            {profile?.leadership?.org || dict.about.leadership.org}
          </div>
        </div>

        <div className="md:col-span-3 bg-[#e2f4c5] dark:bg-emerald-950/30 rounded-[2.5rem] p-6 flex flex-col justify-between border border-transparent dark:border-emerald-900/20">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[11px] font-bold tracking-wider text-[#4d662b] dark:text-emerald-300 uppercase block">
                {profile?.lifestyle?.title || dict.about.lifestyle.title}
              </span>
              <TbCloud className="text-[#4d662b] dark:text-emerald-400 h-5 w-5" />
            </div>
            <p className="text-xs text-[#4d662b] dark:text-emerald-300/90 font-medium leading-relaxed mb-6">
              {profile?.lifestyle?.description || dict.about.lifestyle.description}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {lifestyleBadges.map((badge, idx) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={idx}
                  className="w-full bg-white/70 dark:bg-neutral-900/40 backdrop-blur-sm border border-[#4d662b]/10 dark:border-emerald-500/10 px-4 py-2.5 rounded-full flex items-center gap-3 text-[#1b3b22] dark:text-emerald-200 text-xs font-semibold"
                >
                  <BadgeIcon className="h-4 w-4 shrink-0" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
