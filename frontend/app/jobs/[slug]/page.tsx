"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { JobListing } from "@/types";

const WORK_TYPE_LABELS: Record<string, string> = {
  "full-time": "Tam Zamanlı",
  "part-time": "Yarı Zamanlı",
  freelance: "Freelance",
  internship: "Staj",
};
const LOCATION_TYPE_LABELS: Record<string, string> = {
  remote: "Uzaktan",
  hybrid: "Hibrit",
  onsite: "Ofis",
};

export default function JobDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const u = stored ? JSON.parse(stored) : null;
    if (u) setUser(u);
    setUserLoaded(true);

    let jobData: JobListing | null = null;

    api
      .get(`/jobs/${slug}`)
      .then((res) => {
        jobData = res.data;
        setJob(res.data);
        if (u && u.role === "jobseeker") {
          return api.get("/my-applications");
        }
        return null;
      })
      .then((appRes) => {
        if (appRes && jobData) {
          const apps = appRes.data.data || appRes.data || [];
          const alreadyApplied = apps.some(
            (a: any) => (a.job_listing_id || a.job_id) === jobData!.id,
          );
          if (alreadyApplied) setApplied(true);
        }
      })
      .catch(() => router.push("/jobs"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    if (applied) return;
    setApplying(true);
    const formData = new FormData();
    if (coverLetter) formData.append("cover_letter", coverLetter);
    if (cv) formData.append("cv", cv);
    try {
      await api.post(`/jobs/${job?.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplied(true);
      setShowForm(false);
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      if (err.response?.status === 422 && msg.includes("zaten")) {
        setApplied(true);
        setShowForm(false);
      } else {
        alert(msg || "Başvuru başarısız.");
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/saved-jobs/${job?.id}`);
        setSaved(false);
      } else {
        await api.post(`/saved-jobs/${job?.id}`);
        setSaved(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "İşlem başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="loader-screen">
        <div className="spinner" />
        <style>{`
          .loader-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f5f5f4;}
          .spinner{width:32px;height:32px;border:3px solid #e7e5e4;border-top-color:#0f172a;border-radius:50%;animation:spin .7s linear infinite;}
          @keyframes spin{to{transform:rotate(360deg);}}
        `}</style>
      </div>
    );

  if (!job) return null;

  const dashboardHref =
    user?.role === "employer" ? "/employer/dashboard" : "/jobseeker/dashboard";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f5f5f4; --surface: #fff; --border: #e7e5e4; --border-strong: #d6d3d1;
          --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
          --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
          --red: #dc2626; --red-bg: #fef2f2;
          --green: #16a34a; --green-bg: #f0fdf4; --green-border: #bbf7d0;
          --amber: #b45309; --amber-bg: #fffbeb; --amber-border: #fde68a;
          --blue: #1d4ed8; --blue-bg: #eff6ff; --blue-border: #bfdbfe;
          --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
          --font: 'DM Sans', system-ui, sans-serif;
        }
        body { background: var(--bg); font-family: var(--font); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
        .spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Header */
        .header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
        .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 16px; height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
        .logo-mark { width: 30px; height: 30px; background: var(--accent); border-radius: 7px; display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 15px; height: 15px; color: #fff; }
        .logo-text { font-size: 14px; font-weight: 700; color: var(--text-primary); }
        .header-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .header-user { font-size: 12px; color: var(--text-secondary); max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .btn-logout { font-size: 12px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: var(--radius-sm); transition: background 0.15s; white-space: nowrap; }
        .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
        .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-header { font-size: 12px; font-weight: 500; padding: 6px 12px; border-radius: var(--radius-sm); text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; white-space: nowrap; }
        .btn-header-ghost { color: var(--text-secondary); border: 1px solid var(--border); background: var(--surface); }
        .btn-header-ghost:hover { border-color: var(--border-strong); color: var(--text-primary); }
        .btn-header-solid { background: var(--accent); color: #fff; border: 1px solid var(--accent); }
        .btn-header-solid:hover { background: var(--accent-hover); }

        /* Logout overlay */
        .logout-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
        .logout-overlay-text { font-size: 14px; font-weight: 600; color: var(--text-primary); }

        /* Main */
        .main { max-width: 1100px; margin: 0 auto; padding: 24px 16px 80px; }

        /* Breadcrumb */
        .breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; font-size: 13px; color: var(--text-secondary); flex-wrap: wrap; }
        .breadcrumb a { color: var(--text-secondary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: color 0.15s; }
        .breadcrumb a:hover { color: var(--text-primary); }
        .breadcrumb-sep { color: var(--text-muted); }

        /* Layout */
        .layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }

        /* Cards */
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 12px; }
        .card:last-child { margin-bottom: 0; }

        .job-title { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 14px; }
        .job-meta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 16px; }
        .meta-item { display: flex; align-items: center; gap: 5px; font-size: 13px; color: var(--text-secondary); }
        .meta-item svg { width: 14px; height: 14px; flex-shrink: 0; }
        .tags-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; }
        .tag-blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .tag-purple { background: #f5f3ff; color: #7c3aed; border: 1px solid #ddd6fe; }
        .tag-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
        .tag-pink   { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
        .tag-emerald{ background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .tag-amber  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .tag-slate  { background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; }

        .section-label { font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .section-label::after { content: ""; flex: 1; height: 1px; background: var(--border); }
        .body-text { font-size: 14px; color: var(--text-secondary); line-height: 1.8; white-space: pre-line; }

        /* Sidebar */
        .sidebar { position: sticky; top: 72px; display: flex; flex-direction: column; gap: 12px; }
        .sidebar-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-lg); }
        .sidebar-title { font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--text-primary); }

        .btn-apply { width: 100%; background: var(--accent); color: #fff; font-size: 14px; font-weight: 700; padding: 12px; border-radius: var(--radius); border: none; cursor: pointer; transition: background 0.15s; }
        .btn-apply:hover { background: var(--accent-hover); }
        .btn-apply:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-save { width: 100%; margin-top: 8px; background: var(--surface); color: var(--text-secondary); font-size: 13px; font-weight: 600; padding: 9px; border-radius: var(--radius); border: 1px solid var(--border); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 7px; }
        .btn-save:hover { border-color: var(--border-strong); color: var(--text-primary); }
        .btn-save.saved { background: var(--amber-bg); border-color: var(--amber-border); color: var(--amber); }

        .success-box { background: var(--green-bg); border: 1px solid var(--green-border); border-radius: var(--radius); padding: 18px; text-align: center; }
        .success-icon { width: 40px; height: 40px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; }
        .success-icon svg { width: 18px; height: 18px; color: #fff; }
        .success-title { font-size: 14px; font-weight: 700; color: var(--green); }
        .success-desc { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

        .login-prompt { text-align: center; }
        .login-prompt p { font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; }
        .btn-login { display: block; width: 100%; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 10px; border-radius: var(--radius); text-decoration: none; text-align: center; }
        .btn-login:hover { background: var(--accent-hover); }
        .employer-notice { background: var(--amber-bg); border: 1px solid var(--amber-border); border-radius: var(--radius); padding: 12px; font-size: 13px; color: var(--amber); text-align: center; }

        /* Apply form */
        .apply-form { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 12px; font-weight: 700; color: var(--text-primary); }
        .field-label span { font-weight: 400; color: var(--text-muted); }
        .field textarea { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 11px; font-size: 13px; font-family: var(--font); color: var(--text-primary); resize: none; outline: none; line-height: 1.6; }
        .field textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
        .field textarea::placeholder { color: var(--text-muted); }
        .file-input { font-size: 12px; color: var(--text-secondary); }
        .file-input input[type="file"] { width: 100%; font-size: 12px; }
        .file-name { font-size: 11px; color: var(--green); margin-top: 4px; font-weight: 500; }
        .btn-submit { width: 100%; background: var(--accent); color: #fff; font-size: 13px; font-weight: 700; padding: 10px; border-radius: var(--radius); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-submit:hover { background: var(--accent-hover); }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel-form { width: 100%; background: none; border: none; font-size: 13px; color: var(--text-secondary); cursor: pointer; padding: 7px; }
        .btn-cancel-form:hover { color: var(--text-primary); }
        .spin-sm { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }

        /* Company card */
        .company-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; }
        .company-logo-placeholder { width: 44px; height: 44px; background: var(--accent); border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .company-logo-placeholder svg { width: 20px; height: 20px; color: #fff; }
        .company-name { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .company-meta { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; }
        .company-meta-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-secondary); }
        .company-meta-item svg { width: 12px; height: 12px; flex-shrink: 0; color: var(--text-muted); }
        .company-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-top: 8px; }
        .company-website { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--blue); text-decoration: none; margin-top: 10px; }
        .company-website:hover { text-decoration: underline; }

        /* Mobile */
        @media (max-width: 768px) {
          .header-user { font-size: 12px; color: var(--text-secondary); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .layout { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .job-title { font-size: 19px; }
          .card { padding: 18px; }
          .sidebar-card { box-shadow: none; }
        }
      `}</style>

      {loggingOut && (
        <div className="logout-overlay">
          <div className="spinner" />
          <span className="logout-overlay-text">Çıkış yapılıyor...</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/jobs" className="logo">
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
            {userLoaded && user ? (
              <>
                <span className="header-user">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="btn-logout"
                >
                  Çıkış Yap
                </button>
              </>
            ) : userLoaded && !user ? (
              <>
                <Link href="/login" className="btn-header btn-header-ghost">
                  Giriş Yap
                </Link>
                <Link href="/register" className="btn-header btn-header-solid">
                  Kayıt Ol
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="main">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/jobs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 13, height: 13 }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            İlanlar
          </Link>
          {user && (
            <>
              <span className="breadcrumb-sep">/</span>
              <Link href={dashboardHref}>Dashboard</Link>
            </>
          )}
          <span className="breadcrumb-sep">/</span>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
            }}
          >
            {job.title}
          </span>
        </div>

        <div className="layout">
          {/* Sol kolon */}
          <div>
            <div className="card">
              <h1 className="job-title">{job.title}</h1>
              <div className="job-meta-row">
                <span className="meta-item">
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
                  {job.company?.name}
                </span>
                <span className="meta-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.city || "Belirtilmemiş"}
                </span>
              </div>
              <div className="tags-row">
                <span
                  className={`tag ${job.work_type === "full-time" ? "tag-blue" : job.work_type === "part-time" ? "tag-purple" : job.work_type === "freelance" ? "tag-orange" : "tag-pink"}`}
                >
                  {WORK_TYPE_LABELS[job.work_type] || job.work_type}
                </span>
                <span
                  className={`tag ${job.location_type === "remote" ? "tag-emerald" : job.location_type === "hybrid" ? "tag-amber" : "tag-slate"}`}
                >
                  {LOCATION_TYPE_LABELS[job.location_type] || job.location_type}
                </span>
                {job.salary_visible && job.salary_min && (
                  <span className="tag tag-emerald">
                    {job.salary_min.toLocaleString()} –{" "}
                    {job.salary_max?.toLocaleString()} {job.salary_currency}
                  </span>
                )}
              </div>
            </div>

            <div className="card">
              <div className="section-label">İş Açıklaması</div>
              <p className="body-text">{job.description}</p>
            </div>

            {job.requirements && (
              <div className="card">
                <div className="section-label">Gereksinimler</div>
                <p className="body-text">{job.requirements}</p>
              </div>
            )}
          </div>

          {/* Sağ sidebar */}
          <div className="sidebar">
            <div className="sidebar-card">
              <div className="sidebar-title">Bu Pozisyona Başvur</div>

              {applied ? (
                <div className="success-box">
                  <div className="success-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="success-title">Başvurunuz alındı</div>
                  <div className="success-desc">
                    İşveren başvurunuzu inceleyecek.
                  </div>
                </div>
              ) : !userLoaded ? null : !user ? (
                <div className="login-prompt">
                  <p>Başvurmak için giriş yapmanız gerekiyor.</p>
                  <Link href="/login" className="btn-login">
                    Giriş Yap
                  </Link>
                </div>
              ) : user.role !== "jobseeker" ? (
                <div className="employer-notice">
                  Sadece iş arayanlar başvuru yapabilir.
                </div>
              ) : !showForm ? (
                <>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-apply"
                  >
                    Hemen Başvur
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`btn-save${saved ? " saved" : ""}`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={saved ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    {saving ? "..." : saved ? "Kaydedildi" : "İlanı Kaydet"}
                  </button>
                </>
              ) : (
                <form onSubmit={handleApply} className="apply-form">
                  <div className="field">
                    <label className="field-label">
                      Ön Yazı <span>(opsiyonel)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Kendinizi kısaca tanıtın..."
                    />
                  </div>
                  <div className="field">
                    <label className="field-label">
                      CV <span>(PDF, maks. 5 MB)</span>
                    </label>
                    <div className="file-input">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCv(e.target.files?.[0] || null)}
                      />
                      {cv && <div className="file-name">{cv.name}</div>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-submit"
                  >
                    {applying ? (
                      <>
                        <span className="spin-sm" />
                        Gönderiliyor...
                      </>
                    ) : (
                      "Başvuruyu Gönder"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-cancel-form"
                  >
                    İptal
                  </button>
                </form>
              )}
            </div>

            {/* Şirket kartı */}
            {job.company && (
              <div className="company-card">
                <div className="company-logo-placeholder">
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
                <div className="company-name">{job.company.name}</div>
                {job.company.description && (
                  <p className="company-desc">
                    {job.company.description.length > 120
                      ? job.company.description.slice(0, 120) + "..."
                      : job.company.description}
                  </p>
                )}
                <div className="company-meta">
                  {job.company.industry && (
                    <div className="company-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                      {job.company.industry}
                    </div>
                  )}
                  {job.company.city && (
                    <div className="company-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {job.company.city}
                    </div>
                  )}
                  {(job.company as any).employee_count && (
                    <div className="company-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {(job.company as any).employee_count} çalışan
                    </div>
                  )}
                  {(job.company as any).founded_year && (
                    <div className="company-meta-item">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {(job.company as any).founded_year} yılında kuruldu
                    </div>
                  )}
                </div>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-website"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 12, height: 12 }}
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Websiteyi Ziyaret Et
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
