"use client";

import { useState, useEffect } from "react";

// Recharts recebe espessura e raio como props, não por CSS — então a
// adaptação para tela estreita precisa acontecer em JS.
export function useIsMobile(maxWidth = 640): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const aplica = () => setIsMobile(mq.matches);
    aplica();
    mq.addEventListener("change", aplica);
    return () => mq.removeEventListener("change", aplica);
  }, [maxWidth]);

  return isMobile;
}
