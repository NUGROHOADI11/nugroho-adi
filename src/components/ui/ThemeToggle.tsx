"use client";

import { useTheme } from "next-themes";
import { MdOutlineLight, MdNightlight, MdComputer } from "react-icons/md";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { id: "light", label: "Light", icon: MdOutlineLight },
    { id: "dark", label: "Dark", icon: MdNightlight },
    { id: "system", label: "System", icon: MdComputer },
  ] as const;

  const activeThemeId = mounted ? theme : "system";
  const currentTheme = themes.find((t) => t.id === activeThemeId);
  const CurrentIcon = currentTheme?.icon || MdComputer;

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-900 border border-transparent active:scale-95 duration-200"
        title="Toggle theme"
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-xl z-50 overflow-hidden p-1.5 flex flex-col gap-0.5"
          >
            {themes.map(({ id, label, icon: Icon }) => {
              const isSelected = activeThemeId === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setTheme(id);
                    setShowDropdown(false);
                  }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-xl transition-all duration-200 ${
                    isSelected
                      ? "bg-gray-100 dark:bg-neutral-900 font-semibold text-emerald-600 dark:text-emerald-400"
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-900/60 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isSelected ? "text-emerald-500" : ""}`}
                  />
                  <span className="text-sm">{label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
