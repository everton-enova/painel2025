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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-80">
              {step + 1} de {STEPS.length}
            </span>
            <button
              onClick={finish}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Pular
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="text-4xl mb-4">{current.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {current.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={step === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-0"
          >
            Anterior
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
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
