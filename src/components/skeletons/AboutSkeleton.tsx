"use client";

import React from "react";

export default function AboutSkeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none overflow-hidden animate-pulse">
      {/* 1. Header */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-6 mb-16">
        <div className="space-y-3 max-w-2xl w-full">
          <div className="h-10 sm:h-14 w-3/4 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
          <div className="h-10 sm:h-14 w-1/2 rounded-2xl bg-emerald-500/20" />
        </div>
        <div className="h-4 w-28 rounded-full bg-gray-200 dark:bg-neutral-800" />
      </div>

      {/* 2. Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Left: Large Photo Card */}
        <div className="lg:col-span-8 relative rounded-[3rem] bg-[#f1f3f4] dark:bg-neutral-900 min-h-80 md:min-h-100 flex items-center justify-center p-6 md:p-12 overflow-hidden border border-gray-100 dark:border-neutral-800/60">
          <div className="w-[85%] h-[80%] rounded-[10rem] md:rounded-[20rem] bg-gray-200/80 dark:bg-neutral-800/80" />
          {/* Floating badge skeleton */}
          <div className="absolute left-6 top-8 w-48 h-16 rounded-2xl bg-white/80 dark:bg-neutral-950/80 p-3 hidden sm:block border border-gray-100 dark:border-neutral-800" />
          {/* Circular button skeleton */}
          <div className="absolute right-6 bottom-8 md:right-12 w-16 h-16 rounded-full bg-gray-300 dark:bg-neutral-800" />
        </div>

        {/* Right: Bio Summary Card */}
        <div className="lg:col-span-4 p-8 bg-[#f1f3f4] dark:bg-neutral-900 rounded-[3rem] flex flex-col justify-between border border-gray-100 dark:border-neutral-800/60 min-h-[360px]">
          <div className="space-y-4">
            <div className="h-3 w-20 rounded-full bg-emerald-500/30" />
            <div className="h-6 w-3/4 rounded-xl bg-gray-200 dark:bg-neutral-800" />
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full rounded-full bg-gray-200/90 dark:bg-neutral-800" />
              <div className="h-3.5 w-11/12 rounded-full bg-gray-200/90 dark:bg-neutral-800" />
              <div className="h-3.5 w-4/5 rounded-full bg-gray-200/90 dark:bg-neutral-800" />
              <div className="h-3.5 w-3/4 rounded-full bg-gray-200/90 dark:bg-neutral-800" />
            </div>
          </div>
          <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center">
            <div className="h-3 w-24 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="h-3 w-16 rounded-full bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>

      {/* 3. Bottom Grid: Toolkit & Lifestyle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Toolkit skeleton */}
        <div className="md:col-span-5 bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-[2.5rem] p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div className="h-3 w-28 rounded-full bg-gray-200 dark:bg-neutral-800" />
            <div className="w-5 h-5 rounded-md bg-emerald-500/20" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <div
                key={s}
                className="h-7 w-20 rounded-xl bg-gray-100 dark:bg-neutral-900"
              />
            ))}
          </div>
        </div>

        {/* Right: Lifestyle skeleton */}
        <div className="md:col-span-7 bg-[#f1f3f4] dark:bg-neutral-900 rounded-[2.5rem] p-6 space-y-5 border border-gray-100 dark:border-neutral-800/60">
          <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-neutral-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((b) => (
              <div
                key={b}
                className="h-16 rounded-2xl bg-white dark:bg-neutral-950/60 border border-gray-100 dark:border-neutral-800"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
