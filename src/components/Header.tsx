"use client";

import Image from "next/image";

interface NteSessionInfo {
  nte: string | null;
  logout: () => Promise<void>;
}

interface HeaderProps {
  updatedAt: string | null;
  source: "sheet" | "mock" | null;
  nteSession?: NteSessionInfo;
}

export function Header({ updatedAt, source, nteSession }: HeaderProps) {
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
    <header className="rounded-2xl bg-white px-5 sm:px-8 py-5 sm:py-7" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-14 h-14 sm:w-[72px] sm:h-[72px] flex items-center justify-center">
            <Image
              src="/brasao-bahia.svg"
              alt="Brasão do Estado da Bahia"
              width={56}
              height={66}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Painel Ideb Bahia
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] mt-0.5 font-light">
              Secretaria da Educação do Estado da Bahia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-[15px] sm:text-[16px] text-[var(--text-tertiary)]">
            {formattedDate && (
              <p>
                Atualizado em{" "}
                <span className="text-[var(--text-secondary)]">{formattedDate}</span>
              </p>
            )}
            {source === "mock" && (
              <p className="text-amber-500 text-xs mt-0.5">
                Dados de demonstração
              </p>
            )}
          </div>
          {nteSession?.nte && (
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-[var(--text-secondary)] bg-[#e8f4fd] px-3 py-1.5 rounded-full font-medium">
                {nteSession.nte}
              </span>
              <button
                onClick={nteSession.logout}
                title="Sair"
                className="rounded-full bg-[#f0f0f0] hover:bg-[#fce8e8] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm text-[var(--text-secondary)] hover:text-[#d03b3b] transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          )}
          <button
            onClick={showHelp}
            title="Como usar o painel"
            className="rounded-full bg-[#f0f0f0] hover:bg-[#e5e5e5] w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-all duration-200"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
}
