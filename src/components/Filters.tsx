"use client";

import { useState, useRef, useEffect } from "react";
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

function MunicipioSearch({
  searchTerm,
  onSearchChange,
  municipios,
  selectedMunicipio,
  onSelectMunicipio,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  municipios: string[];
  selectedMunicipio: string | null;
  onSelectMunicipio: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions =
    searchTerm.length > 0
      ? municipios.filter((m) =>
          m.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : municipios;

  const handleSelect = (municipio: string) => {
    onSelectMunicipio(municipio);
    onSearchChange(municipio);
    setOpen(false);
  };

  const handleInputChange = (value: string) => {
    onSearchChange(value);
    if (!value) {
      onSelectMunicipio(null);
    }
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-1 sm:min-w-[220px] relative" ref={wrapperRef}>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Pesquisar Município
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (!selectedMunicipio) setOpen(true);
        }}
        placeholder="Digite o nome do município..."
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((m) => (
            <li
              key={m}
              onClick={() => handleSelect(m)}
              className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {m}
            </li>
          ))}
        </ul>
      )}
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 flex-wrap">
          <MunicipioSearch
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            municipios={options.municipios}
            selectedMunicipio={filters.municipio}
            onSelectMunicipio={(v) => onFilterChange("municipio", v)}
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
