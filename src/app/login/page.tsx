"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
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
        body: JSON.stringify({ username, password }),
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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
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
              <p className="text-[12px] text-[#86868b] mt-0.5">
                Acesso restrito por Núcleo Territorial
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-[12px] font-medium text-[#555] mb-1.5"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: nte1"
                autoComplete="username"
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1D5D88]/30 focus:border-[#1D5D88] transition-colors"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-medium text-[#555] mb-1.5"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1D5D88]/30 focus:border-[#1D5D88] transition-colors"
                required
              />
            </div>

            {error && (
              <p className="text-[12px] text-[#d03b3b] bg-[#fef2f2] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1D5D88] text-white text-[14px] font-medium hover:bg-[#164a6e] disabled:opacity-50 transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#86868b] mt-4">
          Secretaria da Educação do Estado da Bahia
        </p>
      </div>
    </div>
  );
}
