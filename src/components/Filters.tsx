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

interface FiltersProps {
  filters: FilterState;
  options: FilterOptions;
  onFilterChange: (key: "nte" | "rede" | "etapa", value: string | null) => void;
  onToggleMunicipio: (municipio: string) => void;
  onClearMunicipios: () => void;
  onClear: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Todos</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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
        Municípios{selecionados.length > 0 && ` (${selecionados.length}/${MAX_COMPARACAO})`}
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
                    // fecha para não cobrir o resultado; o campo reabre num clique
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
  onFilterChange,
  onToggleMunicipio,
  onClearMunicipios,
  onClear,
  searchTerm,
  onSearchChange,
}: FiltersProps) {
  const hasActiveFilter =
    filters.nte !== null ||
    filters.rede !== null ||
    filters.etapa !== null ||
    filters.municipios.length > 0 ||
    searchTerm.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 flex-wrap">
          <Select
            label="NTE"
            value={filters.nte}
            options={options.ntes}
            onChange={(v) => onFilterChange("nte", v)}
          />
          <MunicipioSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            municipios={options.municipios}
            selecionados={filters.municipios}
            onToggle={onToggleMunicipio}
          />
          <Select
            label="Rede"
            value={filters.rede}
            options={options.redes}
            onChange={(v) => onFilterChange("rede", v)}
          />
          <Select
            label="Etapa"
            value={filters.etapa}
            options={options.etapas}
            onChange={(v) => onFilterChange("etapa", v)}
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
                  style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                {m}
                <button
                  onClick={() => onToggleMunicipio(m)}
                  className="ml-0.5 w-4 h-4 rounded-full text-gray-400 hover:bg-gray-300 hover:text-gray-700 transition-colors"
                  aria-label={`Remover ${m}`}
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={onClearMunicipios}
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
