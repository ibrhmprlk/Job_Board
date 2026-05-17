"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f5f5f4; --surface: #ffffff; --border: #e7e5e4; --border-strong: #d6d3d1;
    --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
    --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
    --red: #dc2626; --red-bg: #fef2f2; --red-border: #fecaca;
    --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
    --font: 'DM Sans', system-ui, sans-serif;
  }
  body { background: var(--bg); font-family: var(--font); color: var(--text-primary); -webkit-font-smoothing: antialiased; }

  .loader-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .logout-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .logout-overlay .spinner { width: 32px; height: 32px; }
  .logout-overlay-text { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
  .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo-mark { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-mark svg { width: 16px; height: 16px; color: #fff; }
  .logo-text { font-size: 15px; font-weight: 700; color: var(--text-primary); }
  .header-right { display: flex; align-items: center; gap: 16px; }
  .header-user { font-size: 13px; color: var(--text-secondary); }
  .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
  .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
  .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

  .main { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
  .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; display: flex; align-items: center; gap: 6px; }
  .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
  .breadcrumb a:hover { color: var(--text-primary); }
  .breadcrumb-sep { color: var(--text-muted); }

  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 4px; }
  .page-subtitle { font-size: 14px; color: var(--text-secondary); margin-bottom: 28px; }

  .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 32px; display: flex; flex-direction: column; gap: 24px; margin-bottom: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .field input, .field textarea {
    border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px;
    font-size: 14px; font-family: var(--font); color: var(--text-primary); background: var(--surface);
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--text-muted); }
  .field input:focus, .field textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
  .field textarea { resize: vertical; line-height: 1.6; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .form-footer { display: flex; gap: 10px; padding-top: 8px; }
  .btn-submit { flex: 1; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: var(--radius); border: none; cursor: pointer; transition: background 0.15s; }
  .btn-submit:hover:not(:disabled) { background: var(--accent-hover); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel { flex: 1; background: var(--accent-subtle); color: var(--text-secondary); font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .btn-cancel:hover { background: var(--border); color: var(--text-primary); }

  /* Danger card */
  .card-danger { background: var(--red-bg); border: 1px solid var(--red-border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 16px; }
  .card-danger-title { font-size: 14px; font-weight: 700; color: var(--red); margin-bottom: 8px; }
  .card-danger-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5; }
  .btn-danger { background: var(--surface); color: var(--red); font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: var(--radius); border: 1px solid var(--red-border); cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-danger:hover:not(:disabled) { background: var(--red); color: #fff; border-color: var(--red); }
  .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }
  .spin-sm-red { width: 14px; height: 14px; border: 2px solid rgba(220,38,38,0.3); border-top-color: var(--red); border-radius: 50%; animation: spin 0.7s linear infinite; }

  @media (max-width: 640px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .form-footer { flex-direction: column; }
  }
`;

export default function CompanyProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [deletingEmail, setDeletingEmail] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    city: "",
    employee_count: "",
    founded_year: "",
  });

  const handleDeleteEmail = async () => {
    if (
      !confirm(
        "Hesabınız kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misiniz?",
      )
    )
      return;
    setDeletingEmail(true);
    try {
      await api.delete("/account"); // ← değişti
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "İşlem başarısız.");
    } finally {
      setDeletingEmail(false);
    }
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "employer") {
      router.push("/login");
      return;
    }
    setUser(u);

    api
      .get("/company")
      .then((res) => {
        setHasCompany(true);
        const c = res.data;
        setForm({
          name: c.name || "",
          description: c.description || "",
          website: c.website || "",
          industry: c.industry || "",
          city: c.city || "",
          employee_count: c.employee_count || "",
          founded_year: c.founded_year || "",
        });
      })
      .catch(() => setHasCompany(false))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (hasCompany) {
        await api.put("/company", form);
      } else {
        await api.post("/company", form);
        setHasCompany(true);
      }
      alert("Şirket profili kaydedildi!");
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(err.response?.data?.message || "Kayıt başarısız.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <>
        <style>{STYLES}</style>
        <div className="loader-wrap">
          <div className="spinner" />
        </div>
      </>
    );

  return (
    <>
      <style>{STYLES}</style>

      {loggingOut && (
        <div className="logout-overlay">
          <div className="spinner" />
          <span className="logout-overlay-text">Çıkış yapılıyor...</span>
        </div>
      )}

      <header className="header">
        <div className="header-inner">
          <Link href="/employer/dashboard" className="logo">
            <div className="logo-mark">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <span className="logo-text">JobBoard</span>
          </Link>
          <div className="header-right">
            <span className="header-user">{user?.name}</span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="btn-logout"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="breadcrumb">
          <Link href="/employer/dashboard">Dashboard</Link>
          <span className="breadcrumb-sep">/</span>
          <span>Şirket Profili</span>
        </div>

        <h1 className="page-title">Şirket Profili</h1>
        <p className="page-subtitle">
          {hasCompany
            ? "Şirket bilgilerinizi güncelleyin."
            : "Şirket profilinizi oluşturun."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="field">
              <label className="field-label">Şirket Adı *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Şirket adınız"
              />
            </div>

            <div className="field">
              <label className="field-label">Hakkında</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Şirketiniz hakkında kısa bilgi..."
              />
            </div>

            <div className="grid-2">
              <div className="field">
                <label className="field-label">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                  placeholder="https://sirket.com"
                />
              </div>
              <div className="field">
                <label className="field-label">Sektör</label>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  placeholder="Yazılım, Fintech..."
                />
              </div>
            </div>

            <div className="grid-3">
              <div className="field">
                <label className="field-label">Şehir</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="İstanbul"
                />
              </div>
              <div className="field">
                <label className="field-label">Çalışan Sayısı</label>
                <input
                  type="number"
                  value={form.employee_count}
                  onChange={(e) =>
                    setForm({ ...form, employee_count: e.target.value })
                  }
                  placeholder="50"
                />
              </div>
              <div className="field">
                <label className="field-label">Kuruluş Yılı</label>
                <input
                  type="number"
                  value={form.founded_year}
                  onChange={(e) =>
                    setForm({ ...form, founded_year: e.target.value })
                  }
                  placeholder="2020"
                />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" disabled={saving} className="btn-submit">
                {saving
                  ? "Kaydediliyor..."
                  : hasCompany
                    ? "Güncelle"
                    : "Oluştur"}
              </button>
              <Link href="/employer/dashboard" className="btn-cancel">
                İptal
              </Link>
            </div>
          </div>
        </form>

        {/* Tehlikeli Alan */}
        <div className="card-danger">
          <div className="card-danger-title">Tehlikeli Alan</div>
          <p className="card-danger-desc">
            Hesabınızı sildiğinizde mail adresiniz kalıcı olarak kaldırılır ve
            bir daha giriş yapamazsınız. Bu işlem geri alınamaz.
          </p>
          <button
            type="button"
            onClick={handleDeleteEmail}
            disabled={deletingEmail}
            className="btn-danger"
          >
            {deletingEmail ? (
              <>
                <span className="spin-sm-red" />
                Siliniyor...
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Hesabı Sil
              </>
            )}
          </button>
        </div>
      </main>
    </>
  );
}
