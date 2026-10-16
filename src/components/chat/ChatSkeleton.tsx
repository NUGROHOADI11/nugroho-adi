"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface ChatSkeletonProps {
  locale?: string;
  isCompact?: boolean;
}

export default function ChatSkeleton({
  locale = "id",
  isCompact = false,
}: ChatSkeletonProps) {
  const isIndo = locale === "id";

  return (
    <div className={`w-full space-y-3.5 ${isCompact ? "py-1" : "py-1.5"}`}>
      {/* 1. Status Indicator Header */}
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-medium tracking-wide">
          {isIndo
            ? "P'nu sedang merangkai jawaban..."
            : "P'nu is crafting a response..."}
        </span>
      </div>

      {/* 2. Shimmering Paragraph Lines */}
      <div className="space-y-2">
        <div className="h-3 w-11/12 rounded-full bg-gray-200/90 dark:bg-neutral-800 animate-pulse" />
        <div className="h-3 w-4/5 rounded-full bg-gray-200/90 dark:bg-neutral-800 animate-pulse [animation-delay:150ms]" />
        <div className="h-3 w-3/5 rounded-full bg-gray-200/90 dark:bg-neutral-800 animate-pulse [animation-delay:300ms]" />
      </div>

      {/* 3. Bullet points skeleton for fuller feel */}
      {!isCompact && (
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            <div className="h-3 w-3/4 rounded-full bg-gray-200/90 dark:bg-neutral-800 animate-pulse [animation-delay:200ms]" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            <div className="h-3 w-1/2 rounded-full bg-gray-200/90 dark:bg-neutral-800 animate-pulse [animation-delay:350ms]" />
          </div>
        </div>
      )}
    </div>
  );
}
