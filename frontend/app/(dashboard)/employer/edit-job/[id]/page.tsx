"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f5f5f4; --surface: #ffffff; --border: #e7e5e4; --border-strong: #d6d3d1;
    --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
    --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
    --red: #dc2626; --red-bg: #fef2f2;
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
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 28px; }

  .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .form-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
  .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); padding-bottom: 12px; border-bottom: 1px solid var(--border); }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .field input, .field textarea, .field select {
    border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px;
    font-size: 14px; font-family: var(--font); color: var(--text-primary); background: var(--surface);
    outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
  }
  .field input::placeholder, .field textarea::placeholder { color: var(--text-muted); }
  .field input:focus, .field textarea:focus, .field select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
  .field textarea { resize: vertical; line-height: 1.6; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .checkbox-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
  .checkbox-row input { width: 16px; height: 16px; cursor: pointer; }
  .checkbox-row label { font-size: 13px; color: var(--text-secondary); cursor: pointer; }

  .form-footer { padding: 20px 32px; border-top: 1px solid var(--border); display: flex; gap: 10px; background: var(--bg); }
  .btn-submit { flex: 1; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: var(--radius); border: none; cursor: pointer; transition: background 0.15s; }
  .btn-submit:hover:not(:disabled) { background: var(--accent-hover); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel { flex: 1; background: var(--accent-subtle); color: var(--text-secondary); font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
  .btn-cancel:hover { background: var(--border); color: var(--text-primary); }

  @media (max-width: 640px) {
    .form-body { padding: 20px; }
    .form-footer { padding: 16px 20px; flex-direction: column; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
  }
`;

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    city: "",
    work_type: "full-time",
    location_type: "onsite",
    salary_min: "",
    salary_max: "",
    salary_currency: "TRY",
    salary_visible: true,
    status: "draft",
  });

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
      .get("/my-listings")
      .then((res) => {
        const job = res.data.data.find((j: any) => j.id === Number(id));
        if (!job) {
          router.push("/employer/dashboard");
          return;
        }
        setForm({
          title: job.title || "",
          description: job.description || "",
          requirements: job.requirements || "",
          city: job.city || "",
          work_type: job.work_type || "full-time",
          location_type: job.location_type || "onsite",
          salary_min: job.salary_min || "",
          salary_max: job.salary_max || "",
          salary_currency: job.salary_currency || "TRY",
          salary_visible: job.salary_visible ?? true,
          status: job.status || "draft",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/jobs/${id}`, form);
      router.push("/employer/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Güncelleme başarısız.");
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
          <span>İlanı Düzenle</span>
        </div>

        <h1 className="page-title">İlanı Düzenle</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-card">
            <div className="form-body">
              <div className="section-label">Temel Bilgiler</div>

              <div className="field">
                <label className="field-label">İlan Başlığı *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="örn. Senior Backend Developer"
                />
              </div>

              <div className="field">
                <label className="field-label">İş Açıklaması *</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Pozisyon hakkında detaylı bilgi verin..."
                />
              </div>

              <div className="field">
                <label className="field-label">Gereksinimler</label>
                <textarea
                  rows={3}
                  value={form.requirements}
                  onChange={(e) =>
                    setForm({ ...form, requirements: e.target.value })
                  }
                  placeholder="Aranan nitelikler, deneyim, teknik beceriler..."
                />
              </div>

              <div className="section-label">Konum & Çalışma Şekli</div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Şehir</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="örn. İstanbul"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Para Birimi</label>
                  <select
                    value={form.salary_currency}
                    onChange={(e) =>
                      setForm({ ...form, salary_currency: e.target.value })
                    }
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Çalışma Tipi</label>
                  <select
                    value={form.work_type}
                    onChange={(e) =>
                      setForm({ ...form, work_type: e.target.value })
                    }
                  >
                    <option value="full-time">Tam Zamanlı</option>
                    <option value="part-time">Yarı Zamanlı</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Staj</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Lokasyon Tipi</label>
                  <select
                    value={form.location_type}
                    onChange={(e) =>
                      setForm({ ...form, location_type: e.target.value })
                    }
                  >
                    <option value="onsite">Ofis</option>
                    <option value="remote">Uzaktan</option>
                    <option value="hybrid">Hibrit</option>
                  </select>
                </div>
              </div>

              <div className="section-label">Maaş Aralığı</div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Min Maaş</label>
                  <input
                    type="number"
                    value={form.salary_min}
                    onChange={(e) =>
                      setForm({ ...form, salary_min: e.target.value })
                    }
                    placeholder="30.000"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Max Maaş</label>
                  <input
                    type="number"
                    value={form.salary_max}
                    onChange={(e) =>
                      setForm({ ...form, salary_max: e.target.value })
                    }
                    placeholder="50.000"
                  />
                </div>
              </div>

              <div className="section-label">Yayın Durumu</div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Durum</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="draft">Taslak</option>
                    <option value="published">Yayınla</option>
                    <option value="closed">Kapat</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Görünürlük</label>
                  <div className="checkbox-row">
                    <input
                      type="checkbox"
                      id="salary_visible"
                      checked={form.salary_visible}
                      onChange={(e) =>
                        setForm({ ...form, salary_visible: e.target.checked })
                      }
                    />
                    <label htmlFor="salary_visible">Maaşı göster</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" disabled={saving} className="btn-submit">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <Link href="/employer/dashboard" className="btn-cancel">
                İptal
              </Link>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
