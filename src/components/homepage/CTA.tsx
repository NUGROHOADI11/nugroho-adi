"use client";

import React from "react";
import { motion } from "framer-motion";

export type CtaDict = {
  cta: {
    badge: string;
    quote: {
      part1: string;
      highlight: string;
      part2: string;
    };
    author: string;
    button: string;
  };
};

interface CTAProps {
  dict: CtaDict;
}

export default function CTA({ dict }: CTAProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 select-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="w-full bg-[#f1f3f4] dark:bg-neutral-900/30 border border-transparent dark:border-neutral-900 rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center text-center relative overflow-hidden"
      >
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-gray-900 dark:text-white max-w-4xl leading-snug sm:leading-tight mb-8">
          {dict.cta.quote.part1}
          <span className="font-serif italic text-emerald-600 dark:text-emerald-400 font-medium">
            {dict.cta.quote.highlight}
          </span>
          {dict.cta.quote.part2}
        </h2>

        <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-neutral-500 type-bold font-bold mb-">
          {dict.cta.author}
        </p>
      </motion.div>
    </section>
  );
}
