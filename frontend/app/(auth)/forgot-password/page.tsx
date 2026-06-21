"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/forgot-password", { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Şifreni Sıfırla
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            E-posta adresini gir, link gönderelim
            ⚠️TEST MODU: Reset emailleri Mailtrap Sandbox'a düşmektedir.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Mail Gönderildi!
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                <strong className="text-slate-700">{email}</strong> adresine
                şifre sıfırlama linki gönderdik. Gelen kutunu ve spam klasörünü
                kontrol et.
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full bg-slate-900 text-white text-sm font-semibold text-center px-4 py-3 rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-slate-900/20"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="ornek@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-800 active:bg-slate-950 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-slate-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  "Sıfırlama Linki Gönder"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-slate-900 font-semibold hover:underline underline-offset-4 decoration-2 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Giriş sayfasına dön
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
