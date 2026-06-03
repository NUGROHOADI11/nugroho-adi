"use client";

import Link from "next/link";
import { Locale } from "@/i18n/dictionaries";
import type en from "@/i18n/en.json";
import { TbArrowUpRight } from "react-icons/tb";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

interface FooterProps {
  locale: Locale;
  dictionary: typeof en;
}

export default function Footer({ locale, dictionary: dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black w-full px-4 sm:px-6 lg:px-8 py-12 mt-auto select-none">
      <div className="max-w-7xl mx-auto relative">
        <div className="relative bg-[#f1f3f4] dark:bg-neutral-900/50 md:bg-transparent md:dark:bg-transparent rounded-4xl md:rounded-none p-6 md:p-8 flex flex-col justify-between z-10 pb-8 md:pb-10 min-h-auto md:min-h-80 transition-all duration-300">
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none drop-shadow-sm">
            <svg
              className="w-full h-full text-[#f1f3f4] dark:text-neutral-900/50 fill-current border-transparent"
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              <path d="M 0,45 Q 0,0 45,0 L 440,0 C 475,0 485,35 520,35 L 955,35 Q 1000,35 1000,80 L 1000,355 Q 1000,400 955,400 L 360,400 C 325,400 315,360 280,360 L 45,360 Q 0,360 0,315 Z" />
            </svg>
          </div>
          <div className="relative z-10 w-full flex flex-col gap-10">
            <div className="flex flex-row justify-between items-start sm:items-center gap-6 pt-2 md:pt-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-1.5">
                  {dict.footer.brand}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm max-w-sm leading-relaxed">
                  {dict.footer.tagline}
                </p>
              </div>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-secondary text-white dark:bg-white dark:text-neutral-950 font-medium py-3 px-6 rounded-full text-sm hover:bg-[#043e30] dark:hover:bg-neutral-100 transition shadow-sm group self-start sm:self-auto shrink-0"
              >
                <span>{dict.nav.contact || "Work together?"}</span>
                <TbArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="text-sm">
              <h4 className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-3">
                {dict.footer.navigation}
              </h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
                <Link
                  href={`/${locale}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {dict.nav.about}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  {dict.nav.contact}
                </Link>
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full flex sm:justify-end items-center my-4 sm:my-0 sm:mt-6">
            <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400 text-lg">
              <a
                href="mailto:deeforce112002@gmail.com"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
                title={dict.footer.links.email}
              >
                <FaEnvelope />
              </a>
              <a
                href="https://github.com/NUGROHOADI11/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
                title={dict.footer.links.github}
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/nugrohoadi11/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
                title={dict.footer.links.linkedin}
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/adi.ngrh._/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition duration-200"
                title={dict.footer.links.instagram}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute left-4 bottom-4 md:bottom-0.5 md:left-6 z-20 pointer-events-none">
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-neutral-500 tracking-wide">
            {dict.footer.copyright.replace("{year}", currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  );
}
