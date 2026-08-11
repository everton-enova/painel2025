"use client";

import Image from "next/image";

interface HeaderProps {
  updatedAt: string | null;
  source: "sheet" | "mock" | null;
}

export function Header({ updatedAt, source }: HeaderProps) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const showHelp = () => {
    localStorage.removeItem("painel_ideb_onboarding_done");
    window.location.reload();
  };

  return (
    <header className="relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-r from-[#1d1d1f] to-[#2c2c2e] px-5 sm:px-8 py-5 sm:py-7">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,122,255,0.15),transparent_70%)]" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl bg-white/10 backdrop-blur-sm p-1.5 sm:p-2 flex items-center justify-center">
            <Image
              src="/brasao-bahia.svg"
              alt="Brasão do Estado da Bahia"
              width={56}
              height={66}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white">
              Painel Ideb Bahia
            </h1>
            <p className="text-[12px] sm:text-[13px] text-white/50 mt-0.5 font-light">
              Secretaria da Educação do Estado da Bahia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-[12px] sm:text-[13px] text-white/40">
            {formattedDate && (
              <p>
                Atualizado em{" "}
                <span className="text-white/60">{formattedDate}</span>
              </p>
            )}
            {source === "mock" && (
              <p className="text-amber-400/70 text-xs mt-0.5">
                Dados de demonstração
              </p>
            )}
          </div>
          <button
            onClick={showHelp}
            title="Como usar o painel"
            className="rounded-full bg-white/10 hover:bg-white/20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-medium text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
}
