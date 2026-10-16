"use client";

import React from "react";

export default function ContactSkeleton() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none overflow-hidden animate-pulse">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-gray-100 dark:border-neutral-900/60 pb-8">
        <div className="space-y-3">
          <div className="h-10 sm:h-14 w-64 sm:w-80 rounded-2xl bg-gray-200 dark:bg-neutral-800" />
          <div className="h-4 w-40 rounded-full bg-emerald-500/20" />
        </div>
        <div className="space-y-2 max-w-sm w-full md:text-right">
          <div className="h-3.5 w-full rounded-full bg-gray-200 dark:bg-neutral-800" />
          <div className="h-3.5 w-4/5 rounded-full bg-gray-200 dark:bg-neutral-800 md:ml-auto" />
        </div>
      </div>

      {/* 2. Grid Form & Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Form Card Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#f1f3f4] dark:bg-neutral-900/30 border border-transparent dark:border-neutral-900 p-6 md:p-10 rounded-[2.5rem] flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Name & Email inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="h-12 w-full rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="h-12 w-full rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800" />
              </div>
            </div>

            {/* Classification select */}
            <div className="space-y-2">
              <div className="h-3 w-36 rounded-full bg-gray-300 dark:bg-neutral-700" />
              <div className="h-12 w-full rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800" />
            </div>

            {/* Message textarea */}
            <div className="space-y-2">
              <div className="h-3 w-24 rounded-full bg-gray-300 dark:bg-neutral-700" />
              <div className="h-32 w-full rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800" />
            </div>
          </div>

          {/* Submit button & icon */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-12 w-44 rounded-full bg-gray-300 dark:bg-neutral-800" />
            <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-neutral-800 shrink-0" />
          </div>
        </div>

        {/* Right: Info / Media Card Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 relative rounded-[2.5rem] overflow-hidden min-h-[460px] bg-[#f1f3f4] dark:bg-neutral-900 border border-gray-100 dark:border-neutral-900/60 shadow-sm p-6 flex flex-col justify-between">
          {/* Top pill badge */}
          <div className="flex justify-end">
            <div className="h-8 w-28 rounded-full bg-gray-200 dark:bg-neutral-800" />
          </div>

          {/* Bottom details block */}
          <div className="space-y-4 pt-16">
            {/* Email block */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-emerald-500/30 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-16 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="h-4 w-48 rounded-full bg-gray-300 dark:bg-neutral-700" />
              </div>
            </div>

            {/* Location & Availability grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <div className="space-y-1.5">
                <div className="h-2.5 w-16 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="h-3.5 w-24 rounded-full bg-gray-200 dark:bg-neutral-800" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-20 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="h-3.5 w-24 rounded-full bg-gray-200 dark:bg-neutral-800" />
              </div>
            </div>

            {/* Social pills */}
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex gap-2">
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-neutral-800" />
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
