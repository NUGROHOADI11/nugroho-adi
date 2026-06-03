"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const CELL_SIZE = 36;
const ANIMATION_DURATION = 0.2;
const STEP_INTERVAL = 450;

const layouts = [
  ["N", [0, 0]],
  ["G", [1, 0]],
  ["R", [0, 1]],
  ["H", [2, 1]],
  ["A", [1, 2]],
].map(([char, pos]) => ({ char, pos }));

const steps = [
  [
    ["N", [0, 0]],
    ["G", [1, 0]],
    ["R", [0, 1]],
    ["H", [2, 1]],
    ["A", [1, 2]],
  ],
  [
    ["N", [1, 0]],
    ["G", [2, 0]],
    ["R", [0, 2]],
    ["H", [2, 2]],
    ["A", [1, 1]],
  ],
  [
    ["N", [0, 0]],
    ["G", [2, 1]],
    ["R", [0, 2]],
    ["H", [1, 2]],
    ["A", [1, 0]],
  ],
  [
    ["N", [0, 0]],
    ["G", [1, 1]],
    ["R", [0, 1]],
    ["H", [1, 2]],
    ["A", [2, 0]],
  ],
  [
    ["N", [0, 0]],
    ["G", [1, 0]],
    ["R", [0, 1]],
    ["H", [1, 1]],
    ["A", [2, 1]],
  ],
  [
    ["N", [0, 0]],
    ["G", [1, 0]],
    ["R", [0, 1]],
    ["H", [2, 1]],
    ["A", [2, 2]],
  ],
  [
    ["N", [0, 0]],
    ["G", [1, 0]],
    ["R", [0, 1]],
    ["H", [2, 1]],
    ["A", [1, 2]],
  ],
].map((layout) => layout.map(([char, pos]) => ({ char, pos })));

const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const refs = useRef<HTMLDivElement[]>([]);

  const [stepIndex, setStepIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const animateTo = useCallback((layout: typeof layouts) => {
    layout.forEach((item, i) => {
      const [x, y] = item.pos;
      gsap.to(refs.current[i], {
        x: (x as number) * CELL_SIZE,
        y: (y as number) * CELL_SIZE,
        duration: ANIMATION_DURATION,
        ease: "power2.out",
      });
    });
  }, []);

  const triggerExitAnimation = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        if (containerRef.current) containerRef.current.style.display = "none";
      },
    });

    tl.to(logoWrapperRef.current, {
      scale: 0.6,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
    }).to(
      containerRef.current,
      {
        scale: 0.93,
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
      },
      "-=0.15",
    );
  }, []);

  useEffect(() => {
    const currentLayout = steps[stepIndex];
    animateTo(currentLayout);

    if (stepIndex === steps.length - 1 && isLoaded) {
      triggerExitAnimation();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, STEP_INTERVAL);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stepIndex, animateTo, isLoaded, triggerExitAnimation]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handlePageLoad = () => {
      setIsLoaded(true);
    };

    if (document.readyState === "complete") {
      const safetyTimer = setTimeout(() => setIsLoaded(true), 2000);
      return () => clearTimeout(safetyTimer);
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#f1f3f4] dark:bg-black select-none"
    >
      <div
        ref={logoWrapperRef}
        className="relative"
        style={{ width: CELL_SIZE * 3, height: CELL_SIZE * 3 }}
      >
        {layouts.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
            className="absolute text-secondary dark:text-white font-black tracking-tighter flex items-center justify-center transition-colors"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              fontSize: `${CELL_SIZE * 0.65}px`,
              lineHeight: `${CELL_SIZE}px`,
              transform: `translate(${(item.pos[0] as number) * CELL_SIZE}px, ${(item.pos[1] as number) * CELL_SIZE}px)`,
            }}
          >
            {item.char}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
