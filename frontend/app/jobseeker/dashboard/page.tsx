"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { User, JobApplication } from "@/types";

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f5f5f4; --surface: #ffffff; --border: #e7e5e4; --border-strong: #d6d3d1;
    --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
    --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
    --red: #dc2626; --red-bg: #fef2f2; --red-border: #fecaca;
    --green: #16a34a; --green-bg: #f0fdf4; --green-border: #bbf7d0;
    --blue: #1d4ed8; --blue-bg: #eff6ff; --blue-border: #bfdbfe;
    --purple: #7c3aed; --purple-bg: #f5f3ff; --purple-border: #ddd6fe;
    --yellow: #b45309; --yellow-bg: #fffbeb; --yellow-border: #fde68a;
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
  .header-user { font-size: 13px; color: var(--text-secondary); display: none; }
  .btn-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); text-decoration: none; background: var(--bg); padding: 7px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); transition: all 0.15s; }
  .btn-link:hover { color: var(--text-primary); border-color: var(--border-strong); }
  .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 7px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
  .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
  .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Main */
  .main { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }

  /* Quick actions */
  .quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 40px; }
  .action-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 20px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--text-primary); transition: border-color 0.15s, box-shadow 0.15s; }
  .action-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .action-icon { width: 44px; height: 44px; background: var(--accent-subtle); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .action-icon svg { width: 20px; height: 20px; color: var(--accent); }
  .action-text { font-size: 14px; font-weight: 600; }

  /* Section Header */
  .section-title { font-size: 15px; font-weight: 700; margin-bottom: 16px; }

  /* Applications List */
  .apps-list { display: flex; flex-direction: column; gap: 8px; }
  .app-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: border-color 0.15s; }
  .app-card:hover { border-color: var(--border-strong); }
  .job-info { flex: 1; min-width: 0; }
  .job-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .company-name { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }

  /* Status pills */
  .status-pill { font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px; white-space: nowrap; }
  .status-pending     { background: var(--yellow-bg);    color: var(--yellow);    border: 1px solid var(--yellow-border); }
  .status-reviewing   { background: var(--blue-bg);      color: var(--blue);      border: 1px solid var(--blue-border); }
  .status-shortlisted { background: var(--purple-bg);    color: var(--purple);    border: 1px solid var(--purple-border); }
  .status-rejected    { background: var(--red-bg);       color: var(--red);       border: 1px solid var(--red-border); }
  .status-hired       { background: var(--green-bg);     color: var(--green);     border: 1px solid var(--green-border); }
  .status-default     { background: var(--accent-subtle); color: var(--text-secondary); }

  /* Empty */
  .empty-state { background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); padding: 60px 24px; text-align: center; }
  .empty-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .empty-desc { font-size: 13px; color: var(--text-secondary); }
  .empty-link { text-decoration: none; color: var(--accent); font-weight: 600; }
  .empty-link:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .header-inner { padding: 0 16px; }
    .header-user { display: none; }
    .quick-actions { grid-template-columns: 1fr; gap: 10px; margin-bottom: 32px; }
    .action-card { padding: 20px 16px; }
    .action-icon { width: 48px; height: 48px; }
    .action-icon svg { width: 22px; height: 22px; }
    .action-text { font-size: 15px; }
    .main { padding: 24px 16px 60px; }
    .app-card { flex-direction: column; align-items: flex-start; gap: 12px; padding: 16px; }
  }
  @media (min-width: 769px) {
    .header-user { display: inline; }
  }
`;

export default function JobseekerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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
      .get("/my-applications")
      .then((res) => setApplications(res.data.data))
      .catch(console.error)
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

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Beklemede", className: "status-pending" },
    reviewing: { label: "İnceleniyor", className: "status-reviewing" },
    shortlisted: { label: "Kısa Listede", className: "status-shortlisted" },
    rejected: { label: "Reddedildi", className: "status-rejected" },
    hired: { label: "İşe Alındı", className: "status-hired" },
  };

  return (
    <>
      <style>{STYLES}</style>

      {loggingOut && (
        <div className="logout-overlay">
          <div className="spinner" />
          <span className="logout-overlay-text">Çıkış yapılıyor...</span>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <span className="loader-text">Yükleniyor...</span>
        </div>
      ) : (
        <>
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
            <div className="quick-actions">
              <Link href="/jobs" className="action-card">
                <div className="action-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div className="action-text">İlanları Gez</div>
              </Link>

              <Link href="/jobseeker/profile" className="action-card">
                <div className="action-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="action-text">Profilim</div>
              </Link>

              <Link href="/jobseeker/saved" className="action-card">
                <div className="action-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="action-text">Kayıtlı İlanlar</div>
              </Link>
            </div>

            <h2 className="section-title">Başvurularım</h2>

            {applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">Henüz başvurun yok</div>
                <div className="empty-desc">
                  Kariyeriniz için ilk adımı atmak üzere hemen{" "}
                  <Link href="/jobs" className="empty-link">
                    ilanları incele
                  </Link>
                  .
                </div>
              </div>
            ) : (
              <div className="apps-list">
                {applications.map((app) => {
                  const sc = statusConfig[app.status] || {
                    label: app.status,
                    className: "status-default",
                  };
                  return (
                    <div key={app.id} className="app-card">
                      <div className="job-info">
                        <div className="job-title">
                          {app.job_listing?.title}
                        </div>
                        <div className="company-name">
                          {app.job_listing?.company?.name}
                        </div>
                      </div>
                      <span className={`status-pill ${sc.className}`}>
                        {sc.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
}
