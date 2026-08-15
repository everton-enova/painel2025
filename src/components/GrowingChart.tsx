"use client";

import { useState, useEffect } from "react";

export function GrowingChart() {
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
        <radialGradient id="splash-vignette" cx="50%" cy="48%" r="32%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="55%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id="splash-reveal">
          <rect
            x="0" y="0" height={h}
            width={drawn ? w : 0}
            style={{ transition: "width 2.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </clipPath>
      </defs>

      <g clipPath="url(#splash-reveal)">
        <path d={area3} fill="url(#splash-grad3)" />
        <path d={area2} fill="url(#splash-grad2)" />
        <path d={area1} fill="url(#splash-grad1)" />

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

        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r="4"
            fill="#1D5D88"
            fillOpacity="0.15"
          />
        ))}

        <rect x="0" y="0" width={w} height={h} fill="url(#splash-vignette)" />
      </g>
    </svg>
  );
}
