"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"bars" | "logo" | "text" | "exit">("bars");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 400);
    const t2 = setTimeout(() => setPhase("text"), 1000);
    const t3 = setTimeout(() => setPhase("exit"), 2200);
    const t4 = setTimeout(onFinish, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated IDEB bars */}
        <div className="flex items-end gap-[5px] h-16">
          {[0.4, 0.6, 0.85, 1.0].map((h, i) => (
            <div
              key={i}
              className="w-[10px] sm:w-[14px] rounded-t-[3px] transition-all ease-out"
              style={{
                backgroundColor: ["#2563eb", "#16a34a", "#9333ea", "#0891b2"][i],
                height: phase === "bars" ? "4px" : `${h * 64}px`,
                transitionDuration: `${400 + i * 120}ms`,
                transitionDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>

        {/* Brasão + Title */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ${
            phase === "bars" ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20">
            <Image
              src="/brasao-bahia.svg"
              alt="Brasão"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Text */}
        <div
          className={`flex flex-col items-center gap-1 transition-all duration-700 ${
            phase === "bars" || phase === "logo"
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1a1a1a]">
            Painel Ideb Bahia
          </h1>
          <p className="text-[13px] text-[#86868b] font-light">
            Secretaria da Educação do Estado da Bahia
          </p>
        </div>

        {/* Loading indicator */}
        <div
          className={`mt-2 transition-all duration-500 ${
            phase === "bars" || phase === "logo"
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
                className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-bounce"
                style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.8s" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
