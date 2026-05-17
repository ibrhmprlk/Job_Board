"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

type Category = { id: number; name: string };

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

  .main { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; display: flex; align-items: center; gap: 6px; }
  .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
  .breadcrumb a:hover { color: var(--text-primary); }
  .breadcrumb-sep { color: var(--text-muted); }

  .form-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .form-card-header { padding: 28px 32px 24px; border-bottom: 1px solid var(--border); }
  .form-card-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .form-card-desc { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
  .form-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
  .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); padding-bottom: 12px; border-bottom: 1px solid var(--border); }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
  .field-label .req { color: var(--red); }
  .field-label .opt { font-weight: 400; color: var(--text-muted); margin-left: 4px; }
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

  .radio-group { display: flex; gap: 8px; }
  .radio-option { flex: 1; position: relative; }
  .radio-option input { position: absolute; opacity: 0; width: 0; height: 0; }
  .radio-label { display: flex; align-items: center; justify-content: center; padding: 10px 16px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .radio-option input:checked + .radio-label { border-color: var(--accent); background: var(--accent); color: #fff; }

  .error-box { background: var(--red-bg); border: 1px solid #fecaca; color: var(--red); padding: 12px 16px; border-radius: var(--radius); font-size: 13px; }

  .form-footer { padding: 20px 32px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; background: var(--bg); }
  .btn-submit { flex: 1; font-size: 13px; font-weight: 600; padding: 10px 24px; border-radius: var(--radius); border: none; background: var(--accent); color: #fff; cursor: pointer; transition: background 0.15s; }
  .btn-submit:hover:not(:disabled) { background: var(--accent-hover); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-cancel { font-size: 13px; font-weight: 500; padding: 10px 20px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
  .btn-cancel:hover { border-color: var(--border-strong); color: var(--text-primary); }

  @media (max-width: 640px) {
    .form-body { padding: 20px; }
    .form-card-header { padding: 20px; }
    .form-footer { padding: 16px 20px; flex-direction: column; }
    .btn-submit, .btn-cancel { width: 100%; text-align: center; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .radio-group { flex-wrap: wrap; }
  }
`;

export default function CreateJobPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    city: "",
    work_type: "full-time",
    location_type: "onsite",
    salary_min: "",
    salary_max: "",
    salary_currency: "TRY",
    category_id: "",
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
    const parsed = JSON.parse(stored);
    if (parsed.role !== "employer") {
      router.push("/");
      return;
    }
    setUser(parsed);
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
    };
    try {
      await api.post("/jobs", payload);
      router.push("/employer/dashboard");
    } catch (err: any) {
      if (err.response?.status === 422 && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(", "));
      } else {
        setError("İlan oluşturulurken bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user)
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
          <span>Yeni İlan</span>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h1 className="form-card-title">Yeni İlan Oluştur</h1>
            <p className="form-card-desc">
              Şirketiniz için yeni bir pozisyon yayınlayın.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-body">
              {error && <div className="error-box">{error}</div>}

              <div className="section-label">Temel Bilgiler</div>

              <div className="field">
                <label className="field-label">
                  İlan Başlığı <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="örn. Senior Backend Developer"
                />
              </div>

              <div className="field">
                <label className="field-label">
                  İş Açıklaması <span className="req">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Pozisyon hakkında detaylı bilgi verin..."
                  style={{ minHeight: 160 }}
                />
              </div>

              <div className="field">
                <label className="field-label">
                  Gereksinimler <span className="opt">(opsiyonel)</span>
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Aranan nitelikler, deneyim, teknik beceriler..."
                />
              </div>

              <div className="section-label">Konum & Çalışma Şekli</div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">Şehir</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="örn. İstanbul"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Kategori</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Kategori seçin...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="field-label">
                    Çalışma Tipi <span className="req">*</span>
                  </label>
                  <select
                    name="work_type"
                    required
                    value={formData.work_type}
                    onChange={handleChange}
                  >
                    <option value="full-time">Tam Zamanlı</option>
                    <option value="part-time">Yarı Zamanlı</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Staj</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">
                    Lokasyon Tipi <span className="req">*</span>
                  </label>
                  <select
                    name="location_type"
                    required
                    value={formData.location_type}
                    onChange={handleChange}
                  >
                    <option value="onsite">Ofis</option>
                    <option value="hybrid">Hibrit</option>
                    <option value="remote">Uzaktan</option>
                  </select>
                </div>
              </div>

              <div className="section-label">Maaş Aralığı</div>

              <div className="grid-3">
                <div className="field">
                  <label className="field-label">Minimum</label>
                  <input
                    type="number"
                    name="salary_min"
                    value={formData.salary_min}
                    onChange={handleChange}
                    placeholder="30.000"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Maksimum</label>
                  <input
                    type="number"
                    name="salary_max"
                    value={formData.salary_max}
                    onChange={handleChange}
                    placeholder="50.000"
                  />
                </div>
                <div className="field">
                  <label className="field-label">Para Birimi</label>
                  <select
                    name="salary_currency"
                    value={formData.salary_currency}
                    onChange={handleChange}
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="section-label">Yayın Durumu</div>

              <div className="field">
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={handleChange}
                    />
                    <span className="radio-label">Taslak Olarak Kaydet</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === "published"}
                      onChange={handleChange}
                    />
                    <span className="radio-label">Hemen Yayınla</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <button
                type="button"
                onClick={() => router.push("/employer/dashboard")}
                className="btn-cancel"
              >
                İptal
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading
                  ? "Kaydediliyor..."
                  : formData.status === "published"
                    ? "İlanı Yayınla"
                    : "Taslak Olarak Kaydet"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
