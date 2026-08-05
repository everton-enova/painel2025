"use client";

import { FilterState } from "@/types/ideb";

interface FilterOptions {
  municipios: string[];
  redes: string[];
  etapas: string[];
}

interface FiltersProps {
  filters: FilterState;
  options: FilterOptions;
  onFilterChange: (key: keyof FilterState, value: string | null) => void;
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

export function Filters({
  filters,
  options,
  onFilterChange,
  onClear,
  searchTerm,
  onSearchChange,
}: FiltersProps) {
  const hasActiveFilter =
    Object.values(filters).some((v) => v !== null) || searchTerm.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1 sm:min-w-[220px]">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pesquisar Município
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Digite o nome do município..."
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Select
            label="Município"
            value={filters.municipio}
            options={options.municipios}
            onChange={(v) => onFilterChange("municipio", v)}
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
      </div>
    </div>
  );
}
