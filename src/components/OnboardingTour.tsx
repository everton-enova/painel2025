"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "painel_ideb_onboarding_done";

interface Step {
  title: string;
  description: string;
  icon: string;
}

const STEPS: Step[] = [
  {
    title: "Pesquise um município",
    description:
      "Clique no campo de pesquisa para ver a lista completa dos 417 municípios da Bahia, ou digite para filtrar rapidamente.",
    icon: "🔍",
  },
  {
    title: "Filtre por rede e etapa",
    description:
      "Use os filtros de Rede (Municipal ou Estadual) e Etapa (Anos Iniciais, Anos Finais ou Ensino Médio) para refinar os dados.",
    icon: "🎯",
  },
  {
    title: "Analise os indicadores",
    description:
      "Ao selecionar um município, os cards mostram os valores de 2025 com a variação em relação a 2023, e os gráficos exibem a evolução histórica.",
    icon: "📊",
  },
  {
    title: "Explore as tabelas",
    description:
      "A tabela de Resultado 2025 permite ordenar por qualquer coluna. O Ranking mostra a variação entre edições por indicador.",
    icon: "📋",
  },
  {
    title: "Pronto para começar!",
    description:
      "Você pode voltar a ver este guia a qualquer momento clicando no botão de ajuda no cabeçalho.",
    icon: "🚀",
  },
];

export function OnboardingTour({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setVisible(true);
    }
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    onComplete?.();
  }, [onComplete]);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-xl px-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-7 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-tertiary)]">
              {step + 1} de {STEPS.length}
            </span>
            <button
              onClick={finish}
              className="text-[var(--text-tertiary)] hover:text-[var(--foreground)] text-[13px] transition-colors"
            >
              Pular
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-[var(--accent)]" : "bg-[#f0f0f0]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-7 py-6 text-center">
          <div className="text-4xl mb-5">{current.icon}</div>
          <h3 className="text-[20px] font-semibold text-[var(--foreground)] mb-2 tracking-tight">
            {current.title}
          </h3>
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed font-light">
            {current.description}
          </p>
        </div>

        <div className="px-7 pb-7 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={step === 0}
            className="rounded-full px-5 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[#f0f0f0] transition-all duration-200 disabled:opacity-0"
          >
            Anterior
          </button>
          <button
            onClick={next}
            className="rounded-full bg-[var(--accent)] px-7 py-2.5 text-[13px] font-semibold text-white hover:brightness-110 transition-all duration-200 shadow-sm"
          >
            {step === STEPS.length - 1 ? "Começar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useOnboardingReset() {
  return () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };
}
