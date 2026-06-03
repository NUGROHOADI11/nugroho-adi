"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const CELL_SIZE = 15;
const ANIMATION_DURATION = 0.2;
const STEP_INTERVAL = 500;
const LOOP_DELAY = 3000;

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

const ShuffleLogo: React.FC = () => {
  const refs = useRef<HTMLDivElement[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
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

  useEffect(() => {
    const currentLayout = steps[stepIndex];
    animateTo(currentLayout);

    const delay = stepIndex === steps.length - 1 ? LOOP_DELAY : 0;
    timeoutRef.current = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, STEP_INTERVAL + delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stepIndex, animateTo]);

  return (
    <div
      className="relative"
      style={{ width: CELL_SIZE * 3, height: CELL_SIZE * 3 }}
    >
      {layouts.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          className="absolute text-black dark:text-white text-xs font-extrabold"
          style={{
            transform: `translate(${(item.pos[0] as number) * CELL_SIZE}px, ${(item.pos[1] as number) * CELL_SIZE}px)`,
          }}
        >
          {item.char}
        </div>
      ))}
    </div>
  );
};

export default ShuffleLogo;
