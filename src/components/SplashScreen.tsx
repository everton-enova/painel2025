"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

const BAR_COLORS = ["#00923F", "#F8C300", "#1D5D88", "#F8C300"];

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"bars" | "logo" | "text" | "exit">("bars");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 400);
    const t2 = setTimeout(() => setPhase("text"), 1200);
    const t3 = setTimeout(() => setPhase("exit"), 2400);
    const t4 = setTimeout(onFinish, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-600 ${
        phase === "exit" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Animated IDEB bars — matches official logo proportions */}
        <div className="flex items-end gap-[6px] h-[72px]">
          {[0.35, 0.55, 0.8, 1.0].map((h, i) => (
            <div
              key={i}
              className="w-[12px] sm:w-[16px] rounded-t-[3px] transition-all ease-out"
              style={{
                backgroundColor: BAR_COLORS[i],
                height: phase === "bars" ? "4px" : `${h * 72}px`,
                transitionDuration: `${400 + i * 120}ms`,
                transitionDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* IDEB logo + Brasão */}
        <div
          className={`flex flex-col items-center gap-5 transition-all duration-700 ${
            phase === "bars" ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
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
            phase === "bars" || phase === "logo"
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
