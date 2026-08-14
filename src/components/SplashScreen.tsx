"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

function GrowingChart() {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const w = 1400;
  const h = 700;
  const points = [
    [0, 620], [120, 580], [240, 540], [360, 490],
    [480, 520], [600, 450], [720, 400], [840, 350],
    [960, 310], [1080, 250], [1200, 200], [1320, 130], [1400, 80],
  ];

  const points2 = [
    [0, 650], [120, 630], [240, 600], [360, 560],
    [480, 580], [600, 530], [720, 490], [840, 460],
    [960, 420], [1080, 370], [1200, 330], [1320, 280], [1400, 220],
  ];

  const points3 = [
    [0, 690], [120, 670], [240, 640], [360, 580],
    [480, 520], [600, 430], [720, 350], [840, 280],
    [960, 220], [1080, 160], [1200, 110], [1320, 65], [1400, 30],
  ];

  const toPath = (pts: number[][]) => {
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * 0.5;
      const cp1y = pts[i - 1][1];
      const cp2x = pts[i][0] - (pts[i][0] - pts[i - 1][0]) * 0.5;
      const cp2y = pts[i][1];
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i][0]} ${pts[i][1]}`;
    }
    return d;
  };

  const path1 = toPath(points);
  const path2 = toPath(points2);
  const path3 = toPath(points3);
  const area1 = `${path1} L ${w} ${h} L 0 ${h} Z`;
  const area2 = `${path2} L ${w} ${h} L 0 ${h} Z`;
  const area3 = `${path3} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="splash-grad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1D5D88" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1D5D88" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="splash-grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00923F" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#00923F" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="splash-grad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D03B3B" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#D03B3B" stopOpacity="0.01" />
        </linearGradient>
        <filter id="splash-shadow-red" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#D03B3B" floodOpacity="0.3" />
        </filter>
        <clipPath id="splash-reveal">
          <rect
            x="0" y="0" height={h}
            width={drawn ? w : 0}
            style={{ transition: "width 2.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </clipPath>
      </defs>

      <g clipPath="url(#splash-reveal)">
        {/* Area fills */}
        <path d={area3} fill="url(#splash-grad3)" />
        <path d={area2} fill="url(#splash-grad2)" />
        <path d={area1} fill="url(#splash-grad1)" />

        {/* Lines */}
        <path
          d={path3}
          fill="none"
          stroke="#D03B3B"
          strokeWidth="2.5"
          strokeOpacity="0.22"
          style={{ filter: "url(#splash-shadow-red)" }}
        />
        <path
          d={path2}
          fill="none"
          stroke="#00923F"
          strokeWidth="2.5"
          strokeOpacity="0.18"
        />
        <path
          d={path1}
          fill="none"
          stroke="#1D5D88"
          strokeWidth="3"
          strokeOpacity="0.22"
        />

        {/* Dots on main line */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r="4"
            fill="#1D5D88"
            fillOpacity="0.15"
          />
        ))}
      </g>
    </svg>
  );
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"init" | "logo" | "text" | "exit">("init");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 300);
    const t2 = setTimeout(() => setPhase("text"), 1100);
    const t3 = setTimeout(() => setPhase("exit"), 2400);
    const t4 = setTimeout(onFinish, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden transition-opacity duration-600 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background growing chart */}
      <GrowingChart />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* IDEB logo + Brasão */}
        <div
          className={`flex flex-col items-center gap-5 transition-all duration-700 ${
            phase === "init" ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <div className="flex items-center gap-5 sm:gap-7">
            <Image
              src="/ideb-logo.svg"
              alt="IDEB - Índice de Desenvolvimento da Educação Básica"
              width={280}
              height={64}
              className="h-12 sm:h-16 w-auto object-contain"
              priority
            />
            <div className="w-px h-10 sm:h-14 bg-[#ddd]" />
            <Image
              src="/brasao-bahia.svg"
              alt="Brasão do Estado da Bahia"
              width={56}
              height={66}
              className="h-12 sm:h-16 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Title + subtitle */}
        <div
          className={`flex flex-col items-center gap-1.5 transition-all duration-700 ${
            phase === "init" || phase === "logo"
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1D5D88]">
            Painel Ideb Bahia
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#86868b] font-light">
            Secretaria da Educação do Estado da Bahia
          </p>
        </div>

        {/* Loading dots */}
        <div
          className={`mt-1 transition-all duration-500 ${
            phase === "init" || phase === "logo"
              ? "opacity-0"
              : phase === "exit"
                ? "opacity-0"
                : "opacity-100"
          }`}
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#1D5D88] animate-bounce"
                style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.8s" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
