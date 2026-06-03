"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const roles = [
  "React JS",
  "Next JS",
  "Nest JS",
  "Java",
  "Python",
  "Golang",
  "AWS",
  "Alibaba Cloud",
  "Google Cloud",
  "Adobe Photoshop",
  "Figma",
];
const experience = [
  "Bangkit Academy Graduate 2023 Batch 2",
  "MSIB 7 Intern at Telkom Indonesia",
  "Digital Network Club Lead",
  "Internal Vice lead at Digistar CLub",
  "American Corner Malang Part Time Staff",
];
const hobbies = [
  "Traveller",
  "Coffee Addict",
  "Researcher",
  "Mountain Hiker",
  "Art Enthusiast",
  "Tech Enthusiast",
];

const PortfolioMarquee = () => {
  return (
    <div className="relative w-screen left-[50%] right-[50%] mx-[-50vw] py-4 flex flex-col gap-4 bg-gray-50/20 dark:bg-neutral-900/10 border-y border-[0.5] border-black dark:border-gray-900 overflow-hidden select-none">
      <Marquee direction="right" speed={45} autoFill className="py-1">
        {roles.map((role, idx) => (
          <div
            key={`role-${idx}`}
            className="flex items-center gap-6 mx-6 text-2xl md:text-4xl font-light tracking-tight text-gray-800 dark:text-gray-200"
          >
            <span>{role}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          </div>
        ))}
      </Marquee>

      <div className="h-0.5 bg-black dark:bg-white" />

      <Marquee direction="left" speed={55} autoFill className="py-1">
        {experience.map((exp, idx) => (
          <div
            key={`exp-${idx}`}
            className="flex items-center gap-6 mx-6 text-2xl md:text-4xl font-semibold tracking-tight text-secondary dark:text-emerald-400"
          >
            <span>{exp}</span>
            <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 shrink-0" />
          </div>
        ))}
      </Marquee>

      <div className="h-0.5 bg-black dark:bg-white" />

      <Marquee direction="right" speed={35} autoFill className="py-1">
        {hobbies.map((hobby, idx) => (
          <div
            key={`hobby-${idx}`}
            className="flex items-center gap-6 mx-6 text-2xl md:text-4xl font-light tracking-tight text-gray-500 dark:text-gray-400 italic"
          >
            <span>{hobby}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default PortfolioMarquee;
