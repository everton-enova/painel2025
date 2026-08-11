"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-[2.5px] border-[#f0f0f0]" />
        <div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-[var(--accent)] animate-spin" />
      </div>
      <p className="mt-5 text-[13px] text-[var(--text-tertiary)] font-light">
        Carregando dados...
      </p>
    </div>
  );
}
