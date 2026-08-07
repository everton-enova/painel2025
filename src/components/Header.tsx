"use client";

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
    <header className="bg-blue-700 text-white px-4 sm:px-6 py-4 sm:py-5 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            Painel Ideb Bahia
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            Acompanhamento de indicadores educacionais
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right text-xs sm:text-sm text-blue-100">
            {formattedDate && (
              <p>
                Atualizado em:{" "}
                <span className="font-medium">{formattedDate}</span>
              </p>
            )}
            {source === "mock" && (
              <p className="text-yellow-200 text-xs mt-1">
                Dados de demonstração
              </p>
            )}
          </div>
          <button
            onClick={showHelp}
            title="Como usar o painel"
            className="rounded-lg bg-blue-600 hover:bg-blue-500 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm font-bold transition-colors border border-blue-400/30"
          >
            ?
          </button>
        </div>
      </div>
    </header>
  );
}
