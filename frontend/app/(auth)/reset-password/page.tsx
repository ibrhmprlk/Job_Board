"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

function ResetPasswordForm() {
    console.log("⚠️ TEST MODU: Reset emailleri Mailtrap Sandbox'a düşmektedir.");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    token: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Token ve email'i URL'den al
  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token) {
      setForm((prev) => ({ ...prev, token }));
    }
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Şifre eşleşme kontrolü
    if (form.password !== form.password_confirmation) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    // Şifre uzunluk kontrolü (backend ile uyumlu)
    if (form.password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/reset-password", {
        token: form.token,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setSuccess(true);

      // 2 saniye sonra login'e yönlendir
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const message = err.response?.data?.message;

      if (errors) {
        // Laravel validation errors
        const firstError = Object.values(errors)[0] as string[];
        setError(firstError[0]);
      } else if (message) {
        setError(message);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Logo & Header */}
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Yeni Şifre Belirle
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Güvenliğin için yeni bir şifre oluştur
          </p>
        </div>

        {/* Success State */}
        {success ? (
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Şifre Güncellendi!
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Giriş sayfasına yönlendiriliyorsun...
              </p>
            </div>
            <Link
              href="/login"
              className="block w-full bg-slate-900 text-white text-sm font-semibold text-center px-4 py-3 rounded-xl hover:bg-slate-800 active:bg-slate-950 transition-all duration-200 active:scale-[0.98] shadow-lg shadow-slate-900/20"
            >
              Giriş Yap
            </Link>
          </div>
        ) : (
          <>
            {/* Error Message */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="ornek@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="En az 8 karakter"
                />
              </div>

              {/* Password Confirmation Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Yeni Şifre Tekrar
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password_confirmation}
                  onChange={(e) =>
                    setForm({ ...form, password_confirmation: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.token}
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
                    Şifre Güncelleniyor...
                  </>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </button>

              {/* Token yoksa uyarı */}
              {!form.token && (
                <p className="text-xs text-amber-600 text-center">
                  Geçersiz veya eksik sıfırlama bağlantısı. Lütfen maildeki
                  bağlantıyı kullanın.
                </p>
              )}
            </form>

            {/* Back to Login */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
