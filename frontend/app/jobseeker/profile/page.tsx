"use client";

import { useEffect, useState } from "react";
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
    --green: #16a34a; --green-bg: #f0fdf4; --green-border: #bbf7d0;
    --blue: #1d4ed8; --blue-bg: #eff6ff; --blue-border: #bfdbfe;
    --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --font: 'DM Sans', system-ui, sans-serif;
  }
  body { background: var(--bg); font-family: var(--font); color: var(--text-primary); -webkit-font-smoothing: antialiased; }

  /* Loader */
  .loader-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; background: var(--bg); }
  .spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .loader-text { font-size: 13px; color: var(--text-secondary); }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Logout overlay */
  .logout-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .logout-overlay .spinner { width: 32px; height: 32px; }
  .logout-overlay-text { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  /* Header */
  .header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
  .header-inner { max-width: 1000px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo-mark { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-mark svg { width: 16px; height: 16px; color: #fff; }
  .logo-text { font-size: 15px; font-weight: 700; color: var(--text-primary); }
  .header-right { display: flex; align-items: center; gap: 8px; }
  .header-user { font-size: 13px; color: var(--text-secondary); display: inline; }
  .btn-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); text-decoration: none; background: var(--bg); padding: 7px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); transition: all 0.15s; }
  .btn-link:hover { color: var(--text-primary); border-color: var(--border-strong); }
  .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 7px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
  .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
  .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Main */
  .main { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
  .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; display: flex; align-items: center; gap: 6px; }
  .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
  .breadcrumb a:hover { color: var(--text-primary); }
  .breadcrumb-sep { color: var(--text-muted); }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 4px; }
  .page-subtitle { font-size: 13px; color: var(--text-secondary); margin-bottom: 32px; }

  /* Card */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 16px; }
  .card:last-child { margin-bottom: 0; }
  .card-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }

  /* Danger card */
  .card-danger { background: var(--red-bg); border: 1px solid var(--red-border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 16px; }
  .card-danger-title { font-size: 14px; font-weight: 700; color: var(--red); margin-bottom: 8px; }
  .card-danger-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5; }
  .btn-danger { background: var(--surface); color: var(--red); font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: var(--radius); border: 1px solid var(--red-border); cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-danger:hover:not(:disabled) { background: var(--red); color: #fff; border-color: var(--red); }
  .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Form */
  .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--text-primary); }
  .form-input { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 13px; font-family: var(--font); color: var(--text-primary); outline: none; transition: all 0.15s; background: var(--surface); }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-textarea { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 13px; font-family: var(--font); color: var(--text-primary); outline: none; resize: none; line-height: 1.6; transition: all 0.15s; background: var(--surface); }
  .form-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
  .form-textarea::placeholder { color: var(--text-muted); }
  .form-select { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; font-size: 13px; font-family: var(--font); color: var(--text-primary); outline: none; background: var(--surface); cursor: pointer; }
  .form-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }

  /* Checkbox */
  .checkbox-wrap { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
  .checkbox-wrap input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); cursor: pointer; }
  .checkbox-label { font-size: 13px; color: var(--text-primary); cursor: pointer; }

  /* File Input */
  .file-wrap { display: flex; align-items: center; gap: 12px; }
  .file-input { flex: 1; font-size: 12px; color: var(--text-secondary); }
  .file-input input[type="file"] { width: 100%; font-size: 12px; padding: 8px 0; }
  .file-name { font-size: 11px; color: var(--green); font-weight: 500; margin-top: 4px; }

  /* Buttons */
  .btn-primary { background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; padding: 11px 20px; border-radius: var(--radius); border: none; cursor: pointer; transition: background 0.15s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary { background: var(--accent-subtle); color: var(--text-secondary); font-size: 13px; font-weight: 600; padding: 11px 20px; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; text-decoration: none; text-align: center; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
  .btn-secondary:hover { background: var(--bg); color: var(--text-primary); border-color: var(--border-strong); }
  .btn-group { display: flex; gap: 10px; padding-top: 8px; }
  .btn-group .btn-primary, .btn-group .btn-secondary { flex: 1; }

  /* Spin */
  .spin-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .spin-sm-red { width: 14px; height: 14px; border: 2px solid rgba(220,38,38,0.3); border-top-color: var(--red); border-radius: 50%; animation: spin 0.7s linear infinite; }

  @media (max-width: 768px) {
    .header-inner { padding: 0 16px; }
    .header-user { display: inline; font-size: 12px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .main { padding: 24px 16px 60px; }
    .form-grid { grid-template-columns: 1fr; }
    .card { padding: 20px 16px; }
    .card-danger { padding: 20px 16px; }
    .btn-group { flex-direction: column; }
  }
  @media (min-width: 769px) {
    .header-user { display: inline; }
  }
`;

export default function JobseekerProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [deletingCv, setDeletingCv] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState(false);
  const [form, setForm] = useState({
    title: "",
    bio: "",
    phone: "",
    city: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    experience_years: "",
    expected_salary: "",
    salary_currency: "TRY",
    is_open_to_work: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "jobseeker") {
      router.push("/login");
      return;
    }
    setUser(u);

    api
      .get("/profile")
      .then((res) => {
        setHasProfile(true);
        const p = res.data;
        setCvUrl(p.cv_url || null);
        setCvName(p.cv_name || p.cv_filename || null);
        setForm({
          title: p.title || "",
          bio: p.bio || "",
          phone: p.phone || "",
          city: p.city || "",
          linkedin_url: p.linkedin_url || "",
          github_url: p.github_url || "",
          portfolio_url: p.portfolio_url || "",
          experience_years: p.experience_years || "",
          expected_salary: p.expected_salary || "",
          salary_currency: p.salary_currency || "TRY",
          is_open_to_work: p.is_open_to_work ?? true,
        });
      })
      .catch(() => setHasProfile(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/profile", form);
      setHasProfile(true);
      alert("Profil kaydedildi!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handleCvUpload = async () => {
    if (!cvFile) {
      alert("Lütfen bir dosya seçin.");
      return;
    }
    setUploadingCv(true);
    const formData = new FormData();
    formData.append("cv", cvFile);
    try {
      const res = await api.post("/profile/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.cv_url) {
        setCvUrl(res.data.cv_url);
        setCvName(res.data.cv_name || cvFile.name);
      } else {
        const profileRes = await api.get("/profile");
        setCvUrl(profileRes.data.cv_url || null);
        setCvName(
          profileRes.data.cv_name || profileRes.data.cv_filename || cvFile.name,
        );
      }
      alert("CV yüklendi!");
      setCvFile(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "CV yüklenemedi.");
    } finally {
      setUploadingCv(false);
    }
  };

  const handleCvDelete = async () => {
    if (!cvUrl) return;
    if (!confirm("CV'nizi silmek istediğinize emin misiniz?")) return;
    setDeletingCv(true);
    try {
      await api.delete("/profile/cv");
      setCvUrl(null);
      setCvName(null);
      setCvFile(null);
      alert("CV silindi.");
    } catch (err: any) {
      alert(err.response?.data?.message || "CV silinemedi.");
    } finally {
      setDeletingCv(false);
    }
  };

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

  if (loading)
    return (
      <>
        <style>{STYLES}</style>
        <div className="loader-wrap">
          <div className="spinner" />
          <span className="loader-text">Yükleniyor...</span>
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
          <Link href="/jobseeker/dashboard" className="logo">
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
              type="button"
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
          <Link href="/jobseeker/dashboard">Dashboard</Link>
          <span className="breadcrumb-sep">/</span>
          <span>Profilim</span>
        </div>

        <h1 className="page-title">Profilim</h1>
        <p className="page-subtitle">
          {hasProfile ? "Profilinizi güncelleyin." : "Profilinizi oluşturun."}
        </p>

        {/* CV Yönetimi */}
        <div className="card">
          <div className="card-title">CV</div>

          {cvUrl && (
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                Mevcut:
              </span>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--blue)",
                  textDecoration: "none",
                  background: "var(--blue-bg)",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--blue-border)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {cvName || "CV İndir"}
              </a>
              <button
                type="button"
                onClick={handleCvDelete}
                disabled={deletingCv}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--red)",
                  background: "var(--red-bg)",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--red-border)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
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
                {deletingCv ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          )}

          <div className="file-wrap">
            <div className="file-input">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file =
                    e.target.files && e.target.files.length > 0
                      ? e.target.files[0]
                      : null;
                  setCvFile(file);
                }}
              />
              {cvFile && <div className="file-name">{cvFile.name}</div>}
            </div>
            <button
              type="button"
              onClick={handleCvUpload}
              disabled={!cvFile || uploadingCv}
              className="btn-primary"
            >
              {uploadingCv ? (
                <>
                  <span className="spin-sm" />
                  Yükleniyor...
                </>
              ) : cvUrl ? (
                "Değiştir"
              ) : (
                "Yükle"
              )}
            </button>
          </div>
        </div>

        {/* Profil Formu */}
        <form onSubmit={handleSubmit} className="card">
          <div className="form-grid">
            <div className="form-field full">
              <label className="form-label">Ünvan</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="form-input"
                placeholder="Senior Frontend Developer"
              />
            </div>

            <div className="form-field full">
              <label className="form-label">Hakkımda</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="form-textarea"
                placeholder="Kendinizi tanıtın..."
              />
            </div>

            <div className="form-field">
              <label className="form-label">Telefon</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
                placeholder="+90 555 000 0000"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Şehir</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="form-input"
                placeholder="İstanbul"
              />
            </div>

            <div className="form-field full">
              <label className="form-label">LinkedIn</label>
              <input
                type="url"
                value={form.linkedin_url}
                onChange={(e) =>
                  setForm({ ...form, linkedin_url: e.target.value })
                }
                className="form-input"
                placeholder="https://linkedin.com/in/kullanici"
              />
            </div>

            <div className="form-field full">
              <label className="form-label">GitHub</label>
              <input
                type="url"
                value={form.github_url}
                onChange={(e) =>
                  setForm({ ...form, github_url: e.target.value })
                }
                className="form-input"
                placeholder="https://github.com/kullanici"
              />
            </div>

            <div className="form-field full">
              <label className="form-label">Portfolio / Website</label>
              <input
                type="url"
                value={form.portfolio_url}
                onChange={(e) =>
                  setForm({ ...form, portfolio_url: e.target.value })
                }
                className="form-input"
                placeholder="https://portfoliom.com"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Deneyim (Yıl)</label>
              <input
                type="number"
                value={form.experience_years}
                onChange={(e) =>
                  setForm({ ...form, experience_years: e.target.value })
                }
                className="form-input"
                placeholder="3"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Beklenen Maaş</label>
              <input
                type="number"
                value={form.expected_salary}
                onChange={(e) =>
                  setForm({ ...form, expected_salary: e.target.value })
                }
                className="form-input"
                placeholder="50000"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Para Birimi</label>
              <select
                value={form.salary_currency}
                onChange={(e) =>
                  setForm({ ...form, salary_currency: e.target.value })
                }
                className="form-select"
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="form-field full">
              <div className="checkbox-wrap">
                <input
                  type="checkbox"
                  id="is_open_to_work"
                  checked={form.is_open_to_work}
                  onChange={(e) =>
                    setForm({ ...form, is_open_to_work: e.target.checked })
                  }
                />
                <label htmlFor="is_open_to_work" className="checkbox-label">
                  İş tekliflerine açığım
                </label>
              </div>
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? (
                <>
                  <span className="spin-sm" />
                  Kaydediliyor...
                </>
              ) : hasProfile ? (
                "Güncelle"
              ) : (
                "Oluştur"
              )}
            </button>
            <Link href="/jobseeker/dashboard" className="btn-secondary">
              İptal
            </Link>
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
