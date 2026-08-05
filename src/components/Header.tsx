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

  return (
    <header className="bg-blue-700 text-white px-6 py-5 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Painel Ideb Bahia
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Acompanhamento de indicadores educacionais
          </p>
        </div>
        <div className="text-right text-sm text-blue-100">
          {formattedDate && (
            <p>
              Atualizado em: <span className="font-medium">{formattedDate}</span>
            </p>
          )}
          {source === "mock" && (
            <p className="text-yellow-200 text-xs mt-1">
              Dados de demonstração
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
