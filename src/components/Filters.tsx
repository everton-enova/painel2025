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
}

/**
 * Rede e etapa têm poucas opções, então botões alternáveis pedem um clique
 * só — um menu suspenso com caixas de seleção exigiria abrir, marcar e
 * fechar. Nenhum marcado significa "todos".
 */
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
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
        {selecionados.length > 0 && (
          <button
            onClick={onClear}
            className="ml-2 normal-case tracking-normal text-gray-400 hover:text-gray-600 underline"
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
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                ativo
                  ? "border-blue-600 bg-blue-600 text-white font-medium"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
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
      className="flex flex-col gap-1 relative flex-1 sm:min-w-[240px]"
      ref={ref}
    >
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
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
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {aberto && lista.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
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
                    // fecha para não cobrir o resultado; reabre num clique
                    setAberto(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                    bloqueado
                      ? "text-gray-300 cursor-not-allowed"
                      : ativo
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="w-4 shrink-0">{ativo ? "✓" : ""}</span>
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
}: FiltersProps) {
  const hasActiveFilter =
    filters.nte !== null ||
    filters.municipios.length > 0 ||
    filters.redes.length > 0 ||
    filters.etapas.length > 0 ||
    searchTerm.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              NTE
            </label>
            <select
              value={filters.nte ?? ""}
              onChange={(e) => onNteChange(e.target.value || null)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            selecionados={filters.municipios}
            onToggle={(m) => onToggle("municipios", m)}
          />

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
              className="self-end rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filters.municipios.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.municipios.map((m, i) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 pl-2 pr-1 py-1 text-xs font-medium text-gray-700"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length],
                  }}
                />
                {m}
                <button
                  onClick={() => onToggle("municipios", m)}
                  className="ml-0.5 w-4 h-4 rounded-full text-gray-400 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                  aria-label={`Remover ${m}`}
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => onClearKey("municipios")}
              className="text-xs text-gray-500 hover:text-gray-700 underline px-1"
            >
              limpar municípios
            </button>
            {filters.municipios.length === 1 && (
              <span className="text-xs text-gray-400 italic">
                adicione outro município para comparar
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
