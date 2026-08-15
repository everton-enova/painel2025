"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GrowingChart } from "@/components/GrowingChart";

const NTE_LIST = Array.from({ length: 27 }, (_, i) => {
  const n = i + 1;
  return `NTE ${String(n).padStart(2, "0")}`;
});

export default function LoginPage() {
  const [nte, setNte] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nte, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
      <GrowingChart />
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Image
                src="/ideb-logo.svg"
                alt="IDEB"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <div className="w-px h-8 bg-[#ddd]" />
              <Image
                src="/brasao-bahia.svg"
                alt="Bahia"
                width={36}
                height={42}
                className="h-10 w-auto"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-[#1D5D88]">
                Painel Ideb — NTE
              </h1>
              <p className="text-[15px] text-[#86868b] mt-0.5">
                Acesso restrito por Núcleo Territorial
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="nte"
                className="block text-[15px] font-medium text-[#555] mb-1.5"
              >
                Núcleo Territorial
              </label>
              <select
                id="nte"
                value={nte}
                onChange={(e) => setNte(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[17px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1D5D88]/30 focus:border-[#1D5D88] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2386868b%22%20d%3D%22M3%204.5L6%208l3-3.5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
                required
              >
                <option value="">Selecione o NTE</option>
                {NTE_LIST.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[15px] font-medium text-[#555] mb-1.5"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[17px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1D5D88]/30 focus:border-[#1D5D88] transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-[15px] text-[#d03b3b] bg-[#fef2f2] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1D5D88] text-white text-[17px] font-medium hover:bg-[#164a6e] disabled:opacity-50 transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[14px] text-[#86868b] mt-4">
          Secretaria da Educação do Estado da Bahia
        </p>
      </div>
    </div>
  );
}
