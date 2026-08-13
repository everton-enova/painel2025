"use client";

import { useState, useRef, useEffect } from "react";
import { FilterState } from "@/types/ideb";
import { SERIES_COLORS, MAX_COMPARACAO } from "@/lib/constants";

interface FilterOptions {
  ntes: string[];
  municipios: string[];
  redes: string[];
  etapas: string[];
}

type ChaveMulti = "municipios" | "redes" | "etapas";

interface FiltersProps {
  filters: FilterState;
  options: FilterOptions;
  onNteChange: (value: string | null) => void;
  onToggle: (key: ChaveMulti, valor: string) => void;
  onClearKey: (key: ChaveMulti) => void;
  onClear: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  bahiaDisponivel: boolean;
  bahiaSelecionada: boolean;
  onToggleBahia: () => void;
}

function GrupoAlternavel({
  label,
  opcoes,
  selecionados,
  onToggle,
  onClear,
}: {
  label: string;
  opcoes: string[];
  selecionados: string[];
  onToggle: (valor: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-[var(--text-secondary)] tracking-wide">
        {label}
        {selecionados.length > 0 && (
          <button
            onClick={onClear}
            className="ml-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] underline underline-offset-2 transition-colors"
          >
            todos
          </button>
        )}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {opcoes.map((opt) => {
          const ativo = selecionados.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              aria-pressed={ativo}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                ativo
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MunicipioSearch({
  searchTerm,
  onSearchChange,
  municipios,
  selecionados,
  onToggle,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  municipios: string[];
  selecionados: string[];
  onToggle: (value: string) => void;
}) {
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const lista = searchTerm
    ? municipios.filter((m) =>
        m.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : municipios;

  const cheio = selecionados.length >= MAX_COMPARACAO;

  return (
    <div
      className="flex flex-col gap-1.5 relative flex-1 sm:min-w-[240px]"
      ref={ref}
    >
      <label className="text-[11px] font-medium text-[var(--text-secondary)] tracking-wide">
        Municípios
        {selecionados.length > 0 && ` (${selecionados.length}/${MAX_COMPARACAO})`}
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        placeholder={
          selecionados.length === 0
            ? "Digite o nome do município..."
            : "Adicionar outro município..."
        }
        className="rounded-xl bg-[#f0f0f0] px-4 py-2.5 text-[13px] text-[var(--foreground)] placeholder:text-[var(--text-tertiary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all duration-200"
      />
      {aberto && lista.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-white/95 backdrop-blur-xl shadow-lg shadow-black/10 ring-1 ring-black/5">
          {lista.map((m) => {
            const ativo = selecionados.includes(m);
            const bloqueado = cheio && !ativo;
            return (
              <li key={m}>
                <button
                  type="button"
                  disabled={bloqueado}
                  onClick={() => {
                    onToggle(m);
                    onSearchChange("");
                    setAberto(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2.5 ${
                    bloqueado
                      ? "text-[var(--text-tertiary)] cursor-not-allowed"
                      : ativo
                        ? "bg-[var(--accent-light)] text-[var(--accent)] font-medium"
                        : "text-[var(--foreground)] hover:bg-[#f5f5f7]"
                  }`}
                >
                  <span className="w-4 shrink-0 text-[var(--accent)]">
                    {ativo ? "✓" : ""}
                  </span>
                  {m}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Filters({
  filters,
  options,
  onNteChange,
  onToggle,
  onClearKey,
  onClear,
  searchTerm,
  onSearchChange,
  bahiaDisponivel,
  bahiaSelecionada,
  onToggleBahia,
}: FiltersProps) {
  const hasActiveFilter =
    filters.nte !== null ||
    filters.municipios.length > 0 ||
    filters.redes.length > 0 ||
    filters.etapas.length > 0 ||
    searchTerm.length > 0;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5" style={{ boxShadow: "var(--card-shadow)" }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[var(--text-secondary)] tracking-wide">
              NTE
            </label>
            <select
              value={filters.nte ?? ""}
              onChange={(e) => onNteChange(e.target.value || null)}
              className="rounded-xl bg-[#f0f0f0] px-4 py-2.5 text-[13px] text-[var(--foreground)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2386868b%22%20d%3D%22M3%204.5L6%208l3-3.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
            >
              <option value="">Todos</option>
              {options.ntes.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <MunicipioSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            municipios={options.municipios}
            selecionados={filters.municipios.filter((m) => m !== "Bahia")}
            onToggle={(m) => onToggle("municipios", m)}
          />

          {bahiaDisponivel && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-[var(--text-secondary)] tracking-wide">
                Estado
              </span>
              <button
                type="button"
                onClick={onToggleBahia}
                aria-pressed={bahiaSelecionada}
                className={`rounded-full px-4 py-2.5 text-[13px] font-medium transition-all duration-200 flex items-center gap-2 ${
                  bahiaSelecionada
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "bg-[#f0f0f0] text-[var(--text-secondary)] hover:bg-[#e5e5e5]"
                }`}
              >
                Bahia
              </button>
            </div>
          )}

          <GrupoAlternavel
            label="Rede"
            opcoes={options.redes}
            selecionados={filters.redes}
            onToggle={(v) => onToggle("redes", v)}
            onClear={() => onClearKey("redes")}
          />

          <GrupoAlternavel
            label="Etapa"
            opcoes={options.etapas}
            selecionados={filters.etapas}
            onToggle={(v) => onToggle("etapas", v)}
            onClear={() => onClearKey("etapas")}
          />

          {hasActiveFilter && (
            <button
              onClick={onClear}
              className="self-end rounded-full bg-[#f0f0f0] px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[#e5e5e5] transition-all duration-200"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filters.municipios.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--separator)]">
            {filters.municipios.map((m, i) => (
              <span
                key={m}
                className={`inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-1 text-[12px] font-medium ${
                  m === "Bahia"
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "bg-[#f5f5f7] text-[var(--foreground)]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length],
                  }}
                />
                {m === "Bahia" ? "Bahia (Estado)" : m}
                <button
                  onClick={() => m === "Bahia" ? onToggleBahia() : onToggle("municipios", m)}
                  className="ml-0.5 w-4 h-4 rounded-full text-[var(--text-tertiary)] hover:bg-black/10 hover:text-[var(--foreground)] flex items-center justify-center transition-all duration-200"
                  aria-label={`Remover ${m}`}
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => onClearKey("municipios")}
              className="text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] underline underline-offset-2 px-1 transition-colors"
            >
              limpar seleção
            </button>
            {filters.municipios.filter((m) => m !== "Bahia").length === 1 && !bahiaSelecionada && (
              <span className="text-[11px] text-[var(--text-tertiary)]">
                adicione outro município para comparar
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
