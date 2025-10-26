"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "bark" | "startle" | "run" | "reset";

const useSequence = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const cycleRef = useRef(0);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  };

  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      callback();
    }, delay);
    timers.current.push(timer);
  };

  const play = () => {
    clearTimers();
    const cycleId = ++cycleRef.current;

    const runIfCurrent = (nextPhase: Phase) => {
      if (cycleRef.current === cycleId) {
        setPhase(nextPhase);
      }
    };

    runIfCurrent("bark");
    schedule(() => runIfCurrent("startle"), 700);
    schedule(() => runIfCurrent("run"), 1300);
    schedule(() => runIfCurrent("reset"), 3200);
    schedule(() => runIfCurrent("idle"), 4000);
  };

  useEffect(() => {
    play();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase, play };
};

const barkBursts = [
  { id: 1, delay: 0, text: "WOOF!" },
  { id: 2, delay: 120, text: "WOOF!" },
  { id: 3, delay: 260, text: "GRRR!" },
];

const cloudPuffs = [0, 1, 2];

export const DogLionScene = () => {
  const { phase, play } = useSequence();

  const barkActive = phase === "bark";
  const lionStartled = phase === "startle";
  const lionRunning = phase === "run" || phase === "reset";

  const barkWaves = useMemo(
    () =>
      barkBursts.map((burst, index) => (
        <motion.div
          key={burst.id}
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={
            barkActive
              ? {
                  scale: [0.9, 1.05, 1],
                  opacity: [0, 1, 0],
                  y: [-10, -24, -36],
                }
              : { opacity: 0 }
          }
          transition={{
            delay: barkActive ? burst.delay / 1000 : 0,
            duration: 0.6,
            ease: "easeOut",
            repeat: barkActive ? 1 : 0,
            repeatDelay: 0.1,
          }}
          className={`absolute left-full top-1/2 -translate-y-1/2 rounded-3xl bg-white px-5 py-2 text-xl font-bold uppercase tracking-widest text-orange-500 shadow-lg ring-2 ring-orange-300`}
          style={{ marginLeft: `${1.4 + index * 0.4}rem` }}
        >
          {burst.text}
        </motion.div>
      )),
    [barkActive],
  );

  return (
    <div className="relative flex w-full max-w-6xl flex-col items-center gap-10 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-amber-100 via-white to-orange-50 p-10 shadow-xl">
      <div className="absolute inset-x-12 bottom-24 h-32 rounded-full bg-gradient-to-r from-orange-200/70 via-white to-orange-200/70 blur-3xl" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-sky-200/60 via-transparent to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative flex w-full items-end justify-between gap-6 text-neutral-900">
        <motion.div
          className="relative flex flex-col items-center justify-end"
          animate={
            barkActive
              ? { y: [0, -6, 0], rotate: [-2, 2, -2, 1, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: barkActive ? 0.8 : 0.3,
            repeat: barkActive ? 2 : 0,
            repeatDelay: 0.05,
          }}
        >
          <DogSVG />
          {barkActive && barkWaves}
          <motion.div
            initial={false}
            animate={
              barkActive
                ? { opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }
                : { opacity: 0 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute -top-14 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border-2 border-orange-200 bg-white/90 shadow-inner"
          >
            <motion.div
              animate={
                barkActive
                  ? { scale: [1, 1.4, 0.9, 1.2, 1], opacity: [1, 0.4, 1] }
                  : { scale: 0, opacity: 0 }
              }
              transition={{ duration: 0.6, repeat: barkActive ? 2 : 0 }}
              className="absolute inset-3 rounded-full border-2 border-dashed border-orange-400"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="relative flex items-center justify-center"
          animate={
            lionRunning
              ? { x: 520, opacity: [1, 0.7, 0] }
              : lionStartled
                ? { x: [0, 24, 12, 18, 0], rotate: [0, -3, 4, -2, 0] }
                : { x: 0, opacity: 1, rotate: 0 }
          }
          transition={
            lionRunning
              ? { duration: 1.4, ease: "easeIn", opacity: { duration: 0.8 } }
              : { duration: 0.55, ease: "easeOut" }
          }
        >
          <LionSVG frightened={lionStartled || lionRunning} />
          <AnimatePresence>
            {lionRunning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.7, 1.1, 1.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute -left-24 bottom-4 flex gap-3"
              >
                {cloudPuffs.map((puff) => (
                  <motion.div
                    key={puff}
                    initial={{ opacity: 0, scale: 0.5, y: 10 }}
                    animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.2, 1.6], y: [-4, 8, 20] }}
                    transition={{ duration: 1, delay: puff * 0.08, ease: "easeOut" }}
                    className="h-7 w-7 rounded-full bg-white/90 shadow-md"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative flex w-full flex-col items-center gap-3 rounded-2xl border border-orange-200/70 bg-white/80 px-6 py-4 text-center shadow-md backdrop-blur">
        <p className="text-lg font-medium text-orange-900">
          A brave little dog lets out a thunderous bark. The lion freezes, eyes wide,
          then bolts in a cloud of dust!
        </p>
        <button
          onClick={play}
          className="rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-orange-600 active:scale-95"
        >
          Replay the Bark
        </button>
      </div>
    </div>
  );
};

const DogSVG = () => (
  <svg
    width={220}
    height={190}
    viewBox="0 0 220 190"
    className="drop-shadow-xl"
    aria-labelledby="brave-dog"
  >
    <title id="brave-dog">Brave dog barking heroically</title>
    <g fill="none" fillRule="evenodd">
      <path
        d="M40 150c-6 12-6 20 0 24 9 6 28 8 48-4 12-7 18-19 18-29 0-8-3-14-9-19-15-12-42-3-57 28Z"
        fill="#f9d6b3"
      />
      <path
        d="M88 90c-12 3-28 15-30 46 10-14 27-15 42-11 18 4 30 0 44-14 15-15 16-36 2-59-12-19-47-22-66-4-8 7-16 25-12 42 2 10 9 9 20 0z"
        fill="#f7b57f"
      />
      <path
        d="M116 36c-7-9-16-14-28-14-20 0-33 14-38 34-4 18 2 30 12 42 3-44 26-63 54-62z"
        fill="#6a4028"
      />
      <path
        d="M57 42c-5 10-4 20 3 30 4-10 10-18 18-22 12-6 26-5 38 0 3-11-7-23-24-26-12-2-28 4-35 18z"
        fill="#885338"
      />
      <path
        d="M158 60c6 13 8 24 4 32-5 10-21 7-25-8-3-11 6-23 21-24z"
        fill="#6a4028"
      />
      <ellipse cx="152" cy="80" rx="7" ry="9" fill="#fff" />
      <circle cx="152" cy="78" r="3" fill="#111" />
      <path
        d="M164 89c-5 8-12 11-20 9"
        stroke="#492e1d"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M128 106c10 5 22 5 36-2"
        stroke="#f38b54"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M106 146c-26 21-54 27-82 18 6 11 19 20 40 24 28 5 60-9 75-39"
        fill="#6a4028"
      />
      <path
        d="M28 158c-2 7-1 12 4 15 10 6 32 4 50-6"
        stroke="#443025"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g transform="translate(120 72)">
        <path
          d="M0 20c12 6 25 6 38 0 5-3 7-10 4-16-4-9-11-11-17-11-6 0-16 4-23 15-4 6-4 10-2 12z"
          fill="#fce7d5"
        />
        <path
          d="M4 14c10 3 21 3 32 0"
          stroke="#d78248"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M140 32c-6-10-20-20-38-20 18-6 40 2 50 20 7 13 8 30 5 49 6-12 7-31-17-49z"
        fill="#3f2515"
      />
    </g>
  </svg>
);

const LionSVG = ({ frightened }: { frightened: boolean }) => {
  const leftEye = frightened ? { cx: 172, cy: 96 } : { cx: 164, cy: 102 };
  const rightEye = frightened ? { cx: 208, cy: 96 } : { cx: 200, cy: 102 };
  const mouthPath = frightened
    ? "M170 150c-16 4-32 0-48-12"
    : "M170 140c-12 10-28 12-48 6";

  return (
    <svg
      width={260}
      height={220}
      viewBox="0 0 260 220"
      className="drop-shadow-2xl"
      aria-labelledby="timid-lion"
    >
      <title id="timid-lion">Lion shocked and running away</title>
      <g fill="none" fillRule="evenodd">
        <path
          d="M118 162c-16 10-26 31-12 42 17 13 56 9 72-10 11-14 11-32 2-44-8-11-24-13-62 12z"
          fill="#f2b354"
        />
        <path
          d="M90 182c-8 10-11 22-6 27 11 12 44 10 64-7"
          stroke="#9c5a18"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M132 66c-20 0-40 12-52 36-14 28-10 60 22 76 34 16 72 13 92-16 25-36 6-94-34-104-10-3-20-7-28 8z"
          fill="#fdd086"
        />
        <path
          d="M170 40c-20-18-52-25-86-1-38 26-36 80-8 105 8-36 29-52 72-48 38 4 54-20 30-56 14 38 4 57-32 57-30 0-52 10-64 32-4-40 10-74 40-94 22-15 44-12 64 5z"
          fill="#a75d1c"
        />
        <path
          d="M88 110c-4 8-4 16 0 24 6-8 14-12 24-12 10 0 18 6 24 15 4-8 4-16 0-24-6-10-16-15-24-15-10 0-18 4-24 12z"
          fill="#773915"
        />
        <path
          d="M150 102c6 12 16 18 30 18 16 0 26-10 24-26-2-16-14-24-36-20"
          fill="#fdd086"
        />
        <ellipse cx="166" cy="102" rx="16" ry="20" fill="#fff" />
        <ellipse cx="202" cy="102" rx="14" ry="20" fill="#fff" />
        <circle {...leftEye} r={6} fill="#111" />
        <circle {...rightEye} r={6} fill="#111" />
        <path
          d={mouthPath}
          stroke="#9c5a18"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <g transform="translate(122 126)">
          <path
            d="M0 26c12 0 22-6 30-18 4-6 12-8 18-4 8 4 8 14 2 20-12 12-30 18-50 12z"
            fill="#f5b55c"
          />
          <path
            d="M2 20c10 4 20 4 30 0"
            stroke="#7d3e0f"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M68 96c-10 18-12 38-4 60-18-12-26-44-8-78 12-22 36-40 68-42-34 12-48 32-56 60z"
          fill="#7d3e0f"
        />
        <path
          d="M182 48c22 10 36 32 38 66 2 38-12 62-36 80 28-8 54-34 56-76 2-36-20-74-58-76z"
          fill="#7d3e0f"
        />
        <motion.path
          d="M156 164c10 14 22 20 36 18"
          stroke="#9c5a18"
          strokeWidth="8"
          strokeLinecap="round"
          animate={
            frightened
              ? { y: [-2, 2, -3, 1, 0], rotate: [0, 3, -4, 2, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.6,
            repeat: frightened ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      </g>
    </svg>
  );
};
