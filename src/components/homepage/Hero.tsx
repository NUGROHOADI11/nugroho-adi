"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { TbArrowUpRight } from "react-icons/tb";
import { motion, Variants } from "framer-motion";
import heroImg from "../../../public/assets/images/hero.jpg";

type HeroDict = {
  nav: {
    brand: string;
  };
  home: {
    subtitle: string;
    learnMore: string;
    getInTouch: string;
  };
};

interface HeroProps {
  dict: HeroDict;
  validLocale: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
      transition: { type: "spring", stiffness: 120 },
  },
};
const Hero = ({ dict, validLocale }: HeroProps) => {
  return (
    <section className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-tight max-w-4xl mx-auto">
          Growing through{" "}
          <span className="inline-flex items-center bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-200 px-6 py-1 rounded-full font-medium my-1">
            Complexity
          </span>
          <br />{" "}
          <span className="inline-flex items-center bg-accent dark:bg-emerald-950 text-secondary dark:text-emerald-200 px-6 py-1 rounded-full font-medium my-1">
            Building
          </span>{" "}
          for the future.
        </h1>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-20"
      >
        <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
          <motion.div
            variants={itemVariants}
            className="bg-[#f1f3f4] dark:bg-gray-900 p-5 rounded-4xl flex items-center gap-3"
          >
            <Logo />
            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
              Hi, I&apos;m {dict.nav.brand}
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-accent dark:bg-emerald-950/40 p-6 rounded-4xl flex flex-col justify-between min-h-40 relative overflow-hidden group hover:shadow-md transition cursor-pointer"
          >
            <Link
              href={`/${validLocale}/project`}
              className="absolute inset-0 z-20"
              aria-label="View My Work"
            />
            <div className="flex justify-between items-start z-10">
              <span className="text-[#1b3b22] dark:text-emerald-300 font-medium text-lg">
                My Work
              </span>
              <TbArrowUpRight className="text-[#1b3b22] dark:text-emerald-300 h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
            <div className="absolute -bottom-10 -right-6 w-24 h-24 bg-white/40 dark:bg-emerald-900/40 rounded-full blur-sm" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 bg-[#f1f3f4] dark:bg-gray-900 rounded-4xl flex flex-col justify-end min-h-35"
          >
            <span className="text-xs text-green-600 dark:text-emerald-400 font-bold tracking-wider uppercase mb-2 block">
              + Expertise
            </span>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">
              Mobile Development, Web Development, Cloud Computing, AI Engineer, and more.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="lg:col-span-9 flex flex-col gap-6"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden min-h-85 md:min-h-100 bg-gray-100 dark:bg-gray-800 flex items-stretch group">
            <Image
              src={heroImg}
              alt="Hero Portfolio Background"
              className="absolute inset-0 w-full h-full object-cover brightness-95 transition-transform duration-700 group-hover:scale-105"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 75vw"
            />

            <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
              <span className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-xs font-medium px-4 py-1.5 rounded-full shadow-sm text-gray-800 dark:text-gray-200">
                Software Developer
              </span>
              <span className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-xs font-medium px-4 py-1.5 rounded-full shadow-sm text-gray-800 dark:text-gray-200">
                Leadership
              </span>
              <span className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-xs font-medium px-4 py-1.5 rounded-full shadow-sm text-gray-800 dark:text-gray-200">
                Explorer
              </span>
            </div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl leading-relaxed">
              {dict.home.subtitle}
            </p>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                href={`/${validLocale}/about`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-medium py-2.5 px-6 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1.5 shadow-sm group"
              >
                {dict.home.learnMore}
                <TbArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={`https://www.linkedin.com/in/nugrohoadi11/`}
                target="_blank"
                className="bg-secondary text-white font-medium py-2.5 px-6 rounded-full text-sm hover:bg-[#043e30] transition shadow-sm"
              >
                {dict.home.getInTouch}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
