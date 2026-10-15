"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Locale } from "@/i18n/dictionaries";
import type en from "@/i18n/en.json";
import ThemeToggle from "../ui/ThemeToggle";
import { TbWorld, TbHome, TbLeaf } from "react-icons/tb";
import { CgClose, CgWorkAlt } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import heroImg from "../../../public/assets/images/logo-img.png";
import Image from "next/image";

interface NavbarProps {
  locale: Locale;
  dictionary: typeof en;
  brand?: string;
}

export default function Navbar({ locale, dictionary: dict, brand }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getPillClass = (active: boolean) => {
    return active
      ? "relative text-black dark:text-emerald-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium z-10 transition-colors duration-300"
      : "relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium z-10 transition-colors duration-300 bg-[#f1f3f4] dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700";
  };

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={heroImg}
              alt="Logo"
              className="h-8 w-8 mr-2 object-contain dark:invert"
              priority
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {brand || dict.nav.brand}
            </span>
          </Link>

          <div className="hidden md:flex gap-3 items-center">
            <Link
              href={`/${locale}`}
              className={getPillClass(isActive(`/${locale}`))}
            >
              <span className="relative z-10 flex items-center gap-2">
                {dict.nav.home}
                <TbHome className="h-4 w-4" />
              </span>
              {isActive(`/${locale}`) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <Link
              href={`/${locale}/project`}
              className={getPillClass(isActive(`/${locale}/project`))}
            >
              <span className="relative z-10 flex items-center gap-2">
                {dict.nav.projects}
                <CgWorkAlt className="h-4 w-4" />
              </span>
              {isActive(`/${locale}/project`) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>

            <Link
              href={`/${locale}/about`}
              className={getPillClass(isActive(`/${locale}/about`))}
            >
              <span className="relative z-10 flex items-center gap-2">
                {dict.nav.about}
                <TbLeaf className="h-4 w-4" />
              </span>
              {isActive(`/${locale}/about`) && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <ThemeToggle />

            <div className="relative">
              <button
                onClick={() => setShowLanguage(!showLanguage)}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition text-sm flex items-center"
              >
                <TbWorld className="mr-1 h-5 w-5" />
                {locale.toUpperCase()}
              </button>

              <AnimatePresence>
                {showLanguage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    <Link
                      href={`/en`}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {dict.english}
                    </Link>
                    <Link
                      href={`/id`}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {dict.indonesian}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="bg-secondary hover:bg-[#043e30] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-transform active:scale-95 shadow-sm whitespace-nowrap"
            >
              {dict.nav.contact}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <CgClose className="h-6 w-6" />
              ) : (
                <RxHamburgerMenu className="h-6 w-6" />
              )}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden pb-6 pt-2 border-t border-gray-100 dark:border-gray-900 flex flex-col gap-3"
            >
              <Link
                href={`/${locale}`}
                className={getPillClass(isActive(`/${locale}`))}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex w-full items-center justify-between">
                  {dict.nav.home}
                  <TbHome className="h-4 w-4" />
                </span>
                {isActive(`/${locale}`) && (
                  <motion.span className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0" />
                )}
              </Link>

              <Link
                href={`/${locale}/project`}
                className={getPillClass(isActive(`/${locale}/project`))}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex w-full items-center justify-between">
                  {dict.nav.projects}
                  <CgWorkAlt className="h-4 w-4" />
                </span>
                {isActive(`/${locale}/project`) && (
                  <motion.span className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0" />
                )}
              </Link>

              <Link
                href={`/${locale}/about`}
                className={getPillClass(isActive(`/${locale}/about`))}
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex w-full items-center justify-between">
                  {dict.nav.about}
                  <TbLeaf className="h-4 w-4" />
                </span>
                {isActive(`/${locale}/about`) && (
                  <motion.span className="absolute inset-0 bg-accent dark:bg-emerald-950 rounded-full z-0" />
                )}
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="bg-secondary text-white px-4 py-2 rounded-full flex items-center justify-between text-sm font-medium active:scale-[0.98] transition"
                onClick={() => setIsOpen(false)}
              >
                <span>{dict.nav.contact}</span>
              </Link>

              <div className="border-t border-gray-100 dark:border-gray-900 mt-2 pt-4 flex items-center justify-between px-2">
                <div className="flex gap-4">
                  <Link
                    href={`/en`}
                    className={`text-sm font-medium transition-colors ${locale === "en" ? "text-green-600" : "text-gray-500"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {dict.english}
                  </Link>
                  <Link
                    href={`/id`}
                    className={`text-sm font-medium transition-colors ${locale === "id" ? "text-green-600" : "text-gray-500"}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {dict.indonesian}
                  </Link>
                </div>
                <div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
