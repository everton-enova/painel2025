"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GrowingChart } from "@/components/GrowingChart";

export default function LoginPage() {
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
        body: JSON.stringify({ password }),
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
              <Image src="/ideb-logo.svg" alt="IDEB" width={180} height={40} className="h-10 w-auto" priority />
              <div className="w-px h-8 bg-[#ddd]" />
              <Image src="/brasao-bahia.svg" alt="Bahia" width={36} height={42} className="h-10 w-auto" priority />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-[#1D5D88]">Painel Ideb Bahia</h1>
              <p className="text-[15px] text-[#86868b] mt-0.5">Acesso restrito</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-[15px] font-medium text-[#555] mb-1.5">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                autoFocus
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[17px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1D5D88]/30 focus:border-[#1D5D88] transition-colors"
                required
              />
            </div>
            {error && <p className="text-[15px] text-[#d03b3b] bg-[#fef2f2] rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-[#1D5D88] text-white text-[17px] font-medium hover:bg-[#164a6e] disabled:opacity-50 transition-colors">
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center text-[14px] text-[#86868b] mt-4">Secretaria da Educação do Estado da Bahia</p>
      </div>
    </div>
  );
}
