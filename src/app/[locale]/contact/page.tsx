"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useForm, ValidationError } from "@formspree/react";
import {
  TbArrowUpRight,
  TbMail,
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandInstagram,
} from "react-icons/tb";
import Image from "next/image";
import type en from "@/i18n/en.json";
import contactHeroImg from "../../../../public/assets/images/contact.webp";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 16 },
  },
};

export default function Contact({ params }: PageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [dict, setDict] = useState<typeof en | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const [state, handleFormspreeSubmit] = useForm(process.env.NEXT_PUBLIC_FORMSFREE_PROJECT_ID || "contactForm");

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

  useEffect(() => {
    if (state.succeeded) {
      formRef.current?.reset();

      const showTimer = setTimeout(() => {
        setSubmitted(true);

        const timer = setTimeout(() => {
          setSubmitted(false);
        }, 5000);

        return () => clearTimeout(timer);
      }, 0);

      return () => clearTimeout(showTimer);
    }
  }, [state.succeeded]);

  if (!dict) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 select-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-gray-100 dark:border-neutral-900/60 pb-8"
      >
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-gray-900 dark:text-white leading-none">
          {dict.contact.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed md:text-right">
          {dict.contact.intro ||
            "Tell us when and where you'd like to go and we'll confirm availability within 24 hours."}
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
      >
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 xl:col-span-8 bg-[#f1f3f4] dark:bg-neutral-900/30 border border-transparent dark:border-neutral-900 p-6 md:p-10 rounded-[2.5rem] flex flex-col justify-between"
        >
          <form
            onSubmit={handleFormspreeSubmit}
            ref={formRef}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2"
                >
                  {dict.contact.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm"
                  placeholder={dict.contact.form.namePlaceholder}
                />
                <ValidationError
                  prefix="Name"
                  field="name"
                  errors={state.errors}
                  className="text-xs text-red-500 mt-1 block font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2"
                >
                  {dict.contact.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm"
                  placeholder={dict.contact.form.emailPlaceholder}
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-xs text-red-500 mt-1 block font-medium"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2"
              >
                {dict.contact.form.projectClassification}
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
              >
                <option value="fullstack">
                  {dict.contact.form.projectOptions.fullstack}
                </option>
                <option value="mobile">
                  {dict.contact.form.projectOptions.mobile}
                </option>
                <option value="cloud">
                  {dict.contact.form.projectOptions.cloud}
                </option>
                <option value="event">
                  {dict.contact.form.projectOptions.event}
                </option>
                <option value="other">
                  {dict.contact.form.projectOptions.other}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-2"
              >
                {dict.contact.form.message}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200/60 dark:border-neutral-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 resize-none shadow-sm"
                placeholder={dict.contact.form.messagePlaceholder}
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-xs text-red-500 mt-1 block font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={state.submitting}
                className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold py-3 px-8 rounded-full text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-w-40"
              >
                {state.submitting
                  ? dict.contact.form.submitting
                  : dict.contact.form.submit || "Reserve Spot"}
              </button>

              <div className="w-11 h-11 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full flex items-center justify-center shrink-0 shadow-md group pointer-events-none">
                <TbArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-medium"
                >
                  {dict.contact.form.success}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 xl:col-span-4 relative rounded-[2.5rem] overflow-hidden h-112.5 lg:h-auto border border-gray-100 dark:border-neutral-900/60 shadow-sm group"
        >
          <Image
            src={contactHeroImg}
            alt="Nugroho Adi - Contact Background Layout"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.85] dark:brightness-75 transition-transform duration-1000 group-hover:scale-102"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 35vw"
          />

          <div className="absolute top-6 right-6 z-10">
            <span className="border border-white/60 text-white backdrop-blur-md text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-sm">
              {dict.contact.contactInfo.yourJourney}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/40 to-transparent p-6 pt-20 flex flex-col justify-end text-white z-10">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TbMail className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                    {dict.contact.contactInfo.email}
                  </h4>
                  <a
                    href="mailto:deeforce112002@gmail.com"
                    className="text-sm font-medium hover:text-emerald-400 transition break-all"
                  >
                    deeforce112002@gmail.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    {dict.contact.contactInfo.location}
                  </h4>
                  <p className="font-medium text-gray-200">
                    {dict.contact.contactInfo.locationValue}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                    {dict.contact.contactInfo.availability}
                  </h4>
                  <p className="font-medium text-gray-200">
                    {dict.contact.contactInfo.availNow}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 text-lg text-gray-300 border-t border-white/10">
                <a
                  href="https://github.com/NUGROHOADI11/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition"
                  title="GitHub Profile"
                >
                  <TbBrandGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/nugrohoadi11/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition"
                  title="LinkedIn Profile"
                >
                  <TbBrandLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/adi.ngrh._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition"
                  title="Instagram Profile"
                >
                  <TbBrandInstagram />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
