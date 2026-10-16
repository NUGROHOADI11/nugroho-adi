"use client";

import React from "react";

export default function ProjectSkeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 select-none animate-pulse">
      {/* 1. Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-3">
          <div className="h-3 w-32 rounded-full bg-emerald-500/20" />
          <div className="h-8 w-64 sm:w-80 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
        </div>

        {/* Filter pills skeleton */}
        <div className="flex flex-wrap gap-2 bg-[#f1f3f4] dark:bg-neutral-900/60 p-1.5 rounded-2xl border border-gray-100 dark:border-neutral-800/40 shrink-0">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-xl bg-gray-200 dark:bg-neutral-800"
            />
          ))}
        </div>
      </div>

      {/* 2. Grid of Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-900 rounded-4xl p-5 md:p-6 flex flex-col justify-between h-[360px] shadow-xs"
          >
            <div className="space-y-4">
              {/* Card top icon & category label */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-neutral-900" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-16 rounded-full bg-gray-200 dark:bg-neutral-800" />
                    <div className="h-3 w-24 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-900" />
              </div>

              {/* Title & Description lines */}
              <div className="space-y-2 pt-2">
                <div className="h-5 w-4/5 rounded-lg bg-gray-200 dark:bg-neutral-800" />
                <div className="space-y-1.5 pt-1">
                  <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-neutral-900" />
                  <div className="h-3 w-11/12 rounded-full bg-gray-100 dark:bg-neutral-900" />
                  <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-neutral-900" />
                </div>
              </div>
            </div>

            {/* Bottom tags pills */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 dark:border-neutral-900">
              <div className="h-5 w-16 rounded-md bg-gray-100 dark:bg-neutral-900" />
              <div className="h-5 w-20 rounded-md bg-gray-100 dark:bg-neutral-900" />
              <div className="h-5 w-14 rounded-md bg-gray-100 dark:bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
