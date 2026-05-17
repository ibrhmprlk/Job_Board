"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

type Application = {
  id: number;
  user_id: number;
  cover_letter: string | null;
  cv_path: string | null;
  cv_url?: string | null;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  employer_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    profile?: {
      phone?: string;
      linkedin_url?: string;
      github_url?: string;
      portfolio_url?: string;
    };
  };
};

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    pill: string;
    actions: { label: string; value: Application["status"]; variant: string }[];
  }
> = {
  pending: {
    label: "Beklemede",
    pill: "pill-pending",
    actions: [
      {
        label: "İncelemeye Al",
        value: "reviewing",
        variant: "btn-action-blue",
      },
      { label: "Reddet", value: "rejected", variant: "btn-action-red" },
    ],
  },
  reviewing: {
    label: "İnceleniyor",
    pill: "pill-reviewing",
    actions: [
      {
        label: "Kısa Listeye Al",
        value: "shortlisted",
        variant: "btn-action-purple",
      },
      { label: "Reddet", value: "rejected", variant: "btn-action-red" },
    ],
  },
  shortlisted: {
    label: "Kısa Liste",
    pill: "pill-shortlisted",
    actions: [
      { label: "İşe Al", value: "hired", variant: "btn-action-green" },
      { label: "Reddet", value: "rejected", variant: "btn-action-red" },
    ],
  },
  rejected: { label: "Reddedildi", pill: "pill-rejected", actions: [] },
  hired: { label: "İşe Alındı", pill: "pill-hired", actions: [] },
};

export default function JobApplicationsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [noteMap, setNoteMap] = useState<Record<number, string>>({});
  const [cvLoading, setCvLoading] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingNoteId, setSavingNoteId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "employer") {
      router.push("/");
      return;
    }
    setUser(u);
    api
      .get(`/jobs/${jobId}/applications`)
      .then((res) => {
        setApplications(res.data.data);
        if (res.data.data.length > 0)
          setJobTitle(res.data.data[0].job_listing?.title || "");
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          alert("Bu ilana erişim yetkiniz yok.");
          router.push("/employer");
        }
      })
      .finally(() => setLoading(false));
  }, [jobId, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleStatusChange = async (
    appId: number,
    newStatus: Application["status"],
  ) => {
    setUpdatingId(appId);
    try {
      await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        employer_note: noteMap[appId] || "",
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? {
                ...app,
                status: newStatus,
                reviewed_at: new Date().toISOString(),
              }
            : app,
        ),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || "Durum güncellenemedi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewCv = async (app: Application) => {
    if (!app.cv_path && !app.cv_url) return;
    setCvLoading(app.id);
    try {
      // If cv_url is directly available (presigned URL), use it
      if (app.cv_url) {
        window.open(app.cv_url, "_blank", "noopener,noreferrer");
        return;
      }
      // Otherwise fetch presigned URL from backend
      const res = await api.get(`/cv/${app.cv_path}`);
      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch {
      alert("CV yüklenemedi.");
    } finally {
      setCvLoading(null);
    }
  };

  const handleSaveNote = async (appId: number) => {
    setSavingNoteId(appId);
    try {
      await api.put(`/applications/${appId}/status`, {
        status: applications.find((a) => a.id === appId)?.status,
        employer_note: noteMap[appId] || "",
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId
            ? { ...app, employer_note: noteMap[appId] || "" }
            : app,
        ),
      );
      alert("Not kaydedildi.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Not kaydedilemedi.");
    } finally {
      setSavingNoteId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus);

  const counts = applications.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  if (loading)
    return (
      <div className="loader-screen">
        <div className="spinner" />
      </div>
    );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f5f5f4; --surface: #fff; --border: #e7e5e4; --border-strong: #d6d3d1;
          --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
          --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
          --red: #dc2626; --red-bg: #fef2f2; --red-border: #fecaca;
          --green: #16a34a; --green-bg: #f0fdf4; --green-border: #bbf7d0;
          --blue: #1d4ed8; --blue-bg: #eff6ff; --blue-border: #bfdbfe;
          --purple: #7c3aed; --purple-bg: #f5f3ff; --purple-border: #ddd6fe;
          --yellow: #b45309; --yellow-bg: #fffbeb; --yellow-border: #fde68a;
          --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
          --shadow: 0 4px 16px rgba(0,0,0,0.08);
          --font: 'DM Sans', system-ui, sans-serif;
        }
        body { background: var(--bg); font-family: var(--font); color: var(--text-primary); -webkit-font-smoothing: antialiased; }
        .loader-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Logout overlay */
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
        .btn-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); text-decoration: none; background: var(--bg); padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); }
        .btn-link:hover { color: var(--text-primary); border-color: var(--border-strong); }
        .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
        .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
        .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

        .main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
        .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 28px; display: flex; align-items: center; gap: 6px; }
        .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
        .breadcrumb a:hover { color: var(--text-primary); }
        .breadcrumb-sep { color: var(--text-muted); }

        .page-header { margin-bottom: 24px; }
        .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; }
        .page-subtitle { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

        /* Filter bar */
        .filter-bar { display: flex; align-items: center; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-btn { font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .filter-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
        .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
        .filter-count { font-size: 11px; background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 100px; }
        .filter-btn:not(.active) .filter-count { background: var(--bg); color: var(--text-muted); }

        /* Cards */
        .app-list { display: flex; flex-direction: column; gap: 12px; }
        .app-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: grid; grid-template-columns: 1fr 280px; gap: 24px; transition: border-color 0.15s; }
        .app-card:hover { border-color: var(--border-strong); }

        /* Applicant info */
        .app-avatar { width: 38px; height: 38px; border-radius: var(--radius); background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        .app-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .app-name { font-size: 14px; font-weight: 700; }
        .app-email { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
        .app-links { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .app-link-tag { font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); color: var(--text-secondary); text-decoration: none; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
        .app-link-tag:hover { border-color: var(--border-strong); color: var(--text-primary); background: var(--bg); }
        .app-link-tag svg { flex-shrink: 0; }
        .cover-letter { background: var(--bg); border-radius: var(--radius); padding: 12px 14px; font-size: 13px; color: var(--text-secondary); line-height: 1.6; white-space: pre-line; border-left: 3px solid var(--border-strong); }
        .app-date { font-size: 11px; color: var(--text-muted); margin-top: 12px; }

        /* Right panel */
        .app-panel { display: flex; flex-direction: column; gap: 14px; }
        .panel-top { display: flex; align-items: center; justify-content: space-between; }

        /* Status pills */
        .pill { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; letter-spacing: 0.3px; }
        .pill-pending   { background: var(--yellow-bg); color: var(--yellow); border: 1px solid var(--yellow-border); }
        .pill-reviewing { background: var(--blue-bg);   color: var(--blue);   border: 1px solid var(--blue-border); }
        .pill-shortlisted { background: var(--purple-bg); color: var(--purple); border: 1px solid var(--purple-border); }
        .pill-rejected  { background: var(--red-bg);    color: var(--red);    border: 1px solid var(--red-border); }
        .pill-hired     { background: var(--green-bg);  color: var(--green);  border: 1px solid var(--green-border); }

        .btn-cv { width: 100%; font-size: 12px; font-weight: 600; padding: 9px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-cv:hover:not(:disabled) { background: var(--bg); border-color: var(--border-strong); color: var(--text-primary); }
        .btn-cv:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cv svg { flex-shrink: 0; }

        .panel-actions { display: flex; flex-direction: column; gap: 6px; }
        .panel-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted); margin-bottom: 2px; }
        .btn-action { width: 100%; font-size: 12px; font-weight: 600; padding: 9px 14px; border-radius: var(--radius-sm); border: 1px solid transparent; cursor: pointer; transition: all 0.15s; }
        .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-action-blue   { background: var(--blue-bg);   color: var(--blue);   border-color: var(--blue-border); }
        .btn-action-blue:hover:not(:disabled)   { background: #dbeafe; }
        .btn-action-purple { background: var(--purple-bg); color: var(--purple); border-color: var(--purple-border); }
        .btn-action-purple:hover:not(:disabled) { background: #ede9fe; }
        .btn-action-green  { background: var(--green-bg);  color: var(--green);  border-color: var(--green-border); }
        .btn-action-green:hover:not(:disabled)  { background: #dcfce7; }
        .btn-action-red    { background: var(--red-bg);    color: var(--red);    border-color: var(--red-border); }
        .btn-action-red:hover:not(:disabled)    { background: #fee2e2; }

        .note-area { width: 100%; font-size: 13px; font-family: var(--font); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 12px; resize: none; outline: none; color: var(--text-primary); line-height: 1.5; }
        .note-area:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15,23,42,0.08); }
        .note-area::placeholder { color: var(--text-muted); }

        .empty-state { background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); padding: 80px 24px; text-align: center; }
        .empty-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px; }
        .empty-desc { font-size: 13px; color: var(--text-secondary); }

        @media (max-width: 768px) {
          .app-card { grid-template-columns: 1fr; }
          .app-panel { border-top: 1px solid var(--border); padding-top: 16px; }
        }
      `}</style>

      {/* Çıkış yapılıyor overlay */}
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
          <span>Başvurular</span>
        </div>

        <div className="page-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <h1 className="page-title">Başvurular</h1>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: "100px",
                background: "var(--accent)",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {applications.length} başvuru
            </span>
          </div>
          <p className="page-subtitle">
            {jobTitle || "İlan"} için gelen başvuruları yönetin
          </p>
        </div>

        {/* Summary stats */}
        {applications.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Beklemede",
                count: counts.pending || 0,
                color: "var(--yellow)",
                bg: "var(--yellow-bg)",
                border: "var(--yellow-border)",
              },
              {
                label: "İnceleniyor",
                count: counts.reviewing || 0,
                color: "var(--blue)",
                bg: "var(--blue-bg)",
                border: "var(--blue-border)",
              },
              {
                label: "Kısa Liste",
                count: counts.shortlisted || 0,
                color: "var(--purple)",
                bg: "var(--purple-bg)",
                border: "var(--purple-border)",
              },
              {
                label: "İşe Alındı",
                count: counts.hired || 0,
                color: "var(--green)",
                bg: "var(--green-bg)",
                border: "var(--green-border)",
              },
              {
                label: "Reddedildi",
                count: counts.rejected || 0,
                color: "var(--red)",
                bg: "var(--red-bg)",
                border: "var(--red-border)",
              },
            ]
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: "var(--radius)",
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: s.color,
                    }}
                  >
                    {s.count}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: s.color,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Filter bar */}
        {applications.length > 0 && (
          <div className="filter-bar">
            {[
              { key: "all", label: "Tümü", count: applications.length },
              {
                key: "pending",
                label: "Beklemede",
                count: counts.pending || 0,
              },
              {
                key: "reviewing",
                label: "İnceleniyor",
                count: counts.reviewing || 0,
              },
              {
                key: "shortlisted",
                label: "Kısa Liste",
                count: counts.shortlisted || 0,
              },
              { key: "hired", label: "İşe Alındı", count: counts.hired || 0 },
              {
                key: "rejected",
                label: "Reddedildi",
                count: counts.rejected || 0,
              },
            ]
              .filter((f) => f.key === "all" || f.count > 0)
              .map((f) => (
                <button
                  key={f.key}
                  className={`filter-btn${filterStatus === f.key ? " active" : ""}`}
                  onClick={() => setFilterStatus(f.key)}
                >
                  {f.label}
                  <span className="filter-count">{f.count}</span>
                </button>
              ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">
              {applications.length === 0
                ? "Henüz başvuru yok"
                : "Bu filtrede başvuru bulunamadı"}
            </div>
            <div className="empty-desc">
              {applications.length === 0
                ? "İlan yayına girdiğinde başvurular burada görünecek."
                : "Farklı bir filtre deneyin."}
            </div>
          </div>
        ) : (
          <div className="app-list">
            {filtered.map((app) => {
              const config = STATUS_CONFIG[app.status];
              return (
                <div key={app.id} className="app-card">
                  {/* Left: applicant info */}
                  <div>
                    <div className="app-header">
                      <div className="app-avatar">
                        {app.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="app-name">{app.user.name}</div>
                        <div className="app-email">{app.user.email}</div>
                      </div>
                    </div>

                    {app.user.profile && (
                      <div className="app-links">
                        {app.user.profile.phone &&
                          app.user.profile.phone.trim() !== "" && (
                            <span className="app-link-tag">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              {app.user.profile.phone}
                            </span>
                          )}
                        {app.user.profile.linkedin_url &&
                          app.user.profile.linkedin_url.trim() !== "" && (
                            <a
                              href={app.user.profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="app-link-tag"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                              </svg>
                              LinkedIn
                            </a>
                          )}
                        {app.user.profile.github_url &&
                          app.user.profile.github_url.trim() !== "" && (
                            <a
                              href={app.user.profile.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="app-link-tag"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                              </svg>
                              GitHub
                            </a>
                          )}
                        {app.user.profile.portfolio_url &&
                          app.user.profile.portfolio_url.trim() !== "" && (
                            <a
                              href={app.user.profile.portfolio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="app-link-tag"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                              </svg>
                              Website
                            </a>
                          )}
                      </div>
                    )}

                    {app.cover_letter && (
                      <div className="cover-letter">{app.cover_letter}</div>
                    )}

                    <div className="app-date">
                      Başvuru tarihi: {formatDate(app.created_at)}
                      {app.reviewed_at && (
                        <> · Son güncelleme: {formatDate(app.reviewed_at)}</>
                      )}
                    </div>
                  </div>

                  {/* Right: panel */}
                  <div className="app-panel">
                    <div className="panel-top">
                      <span className={`pill ${config.pill}`}>
                        {config.label}
                      </span>
                    </div>

                    {(app.cv_path || app.cv_url) && (
                      <button
                        onClick={() => handleViewCv(app)}
                        disabled={cvLoading === app.id}
                        className="btn-cv"
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
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        {cvLoading === app.id
                          ? "Yükleniyor..."
                          : "CV Görüntüle"}
                      </button>
                    )}

                    {config.actions.length > 0 && (
                      <div className="panel-actions">
                        <div className="panel-label">Durum Güncelle</div>
                        {config.actions.map((action) => (
                          <button
                            key={action.value}
                            onClick={() =>
                              handleStatusChange(app.id, action.value)
                            }
                            disabled={updatingId === app.id}
                            className={`btn-action ${action.variant}`}
                          >
                            {updatingId === app.id
                              ? "Güncelleniyor..."
                              : action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <div className="panel-label" style={{ marginBottom: 6 }}>
                        Dahili Not
                      </div>
                      <textarea
                        rows={3}
                        value={noteMap[app.id] ?? app.employer_note ?? ""}
                        onChange={(e) =>
                          setNoteMap((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                        placeholder="Aday hakkında not ekleyin..."
                        className="note-area"
                      />
                      <button
                        onClick={() => handleSaveNote(app.id)}
                        disabled={savingNoteId === app.id}
                        style={{
                          width: "100%",
                          marginTop: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "8px 14px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          background: "var(--accent-subtle)",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--bg)";
                          e.currentTarget.style.color = "var(--text-primary)";
                          e.currentTarget.style.borderColor =
                            "var(--border-strong)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "var(--accent-subtle)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                          e.currentTarget.style.borderColor = "var(--border)";
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
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        {savingNoteId === app.id
                          ? "Kaydediliyor..."
                          : "Notu Kaydet"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
