"use client";

import { useState } from "react";

interface LoginScreenProps {
  onLogin: (password: string) => boolean;
  error: string | null;
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setLocalError("Digite a senha de acesso");
      return;
    }
    const success = onLogin(password);
    if (!success) {
      setLocalError("Senha incorreta");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl mb-4">
            📊
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Painel Ideb Bahia
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhamento de indicadores educacionais
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Senha de acesso
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLocalError(null);
              }}
              placeholder="Digite a senha"
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {displayError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {displayError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          SEC Bahia &mdash; Secretaria da Educação
        </p>
      </div>
    </div>
  );
}
