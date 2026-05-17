"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { User, JobListing } from "@/types";

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f5f5f4; --surface: #ffffff; --border: #e7e5e4; --border-strong: #d6d3d1;
    --text-primary: #1c1917; --text-secondary: #78716c; --text-muted: #a8a29e;
    --accent: #0f172a; --accent-hover: #1e293b; --accent-subtle: #f1f5f9;
    --red: #dc2626; --red-bg: #fef2f2;
    --green: #16a34a; --green-bg: #f0fdf4;
    --yellow: #b45309; --yellow-bg: #fffbeb;
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

  /* Main */
  .main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }
  .page-header { margin-bottom: 32px; }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; }
  .page-subtitle { font-size: 14px; color: var(--text-secondary); margin-top: 4px; }

  /* Stats */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; }
  .stat-value { font-size: 28px; font-weight: 700; letter-spacing: -1px; color: var(--text-primary); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Quick actions */
  .quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 40px; }
  .action-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--text-primary); transition: border-color 0.15s, box-shadow 0.15s; }
  .action-card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-sm); }
  .action-icon { width: 40px; height: 40px; background: var(--accent-subtle); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .action-icon svg { width: 18px; height: 18px; color: var(--accent); }
  .action-text { font-size: 13px; font-weight: 600; }
  .action-desc { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  /* Section */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 15px; font-weight: 700; }
  .btn-primary { background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s; }
  .btn-primary:hover { background: var(--accent-hover); }

  /* Jobs list */
  .jobs-list { display: flex; flex-direction: column; gap: 8px; }
  .job-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: border-color 0.15s; }
  .job-card:hover { border-color: var(--border-strong); }
  .job-info { flex: 1; min-width: 0; }
  .job-title { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .job-meta { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
  .job-city { font-size: 12px; color: var(--text-secondary); }
  .status-pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; }
  .status-draft     { background: var(--yellow-bg); color: var(--yellow); }
  .status-published { background: var(--green-bg);  color: var(--green); }
  .status-closed    { background: var(--accent-subtle); color: var(--text-secondary); }
  .job-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .btn-ghost { font-size: 12px; font-weight: 500; padding: 7px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); color: var(--text-secondary); text-decoration: none; cursor: pointer; transition: all 0.15s; }
  .btn-ghost:hover { background: var(--bg); border-color: var(--border-strong); color: var(--text-primary); }
  .btn-danger { font-size: 12px; font-weight: 500; padding: 7px 12px; border-radius: var(--radius-sm); border: 1px solid transparent; background: var(--red-bg); color: var(--red); cursor: pointer; transition: all 0.15s; }
  .btn-danger:hover { background: #fee2e2; }

  /* Empty */
  .empty-state { background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); padding: 60px 24px; text-align: center; }
  .empty-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .empty-desc { font-size: 13px; color: var(--text-secondary); }
  .empty-action { display: inline-flex; margin-top: 20px; }

  @media (max-width: 768px) {
    .stats-row, .quick-actions { grid-template-columns: 1fr 1fr; }
    .job-card { flex-direction: column; align-items: flex-start; }
    .job-actions { width: 100%; }
    .btn-ghost, .btn-danger { flex: 1; text-align: center; }
  }
`;

export default function EmployerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [applicationCounts, setApplicationCounts] = useState<
    Record<number, number>
  >({});

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
        const jobList = res.data.data || [];
        setJobs(jobList);
        // Fetch application counts for each job
        return Promise.all(
          jobList.map((job: JobListing) =>
            api
              .get(`/jobs/${job.id}/applications`)
              .then((appRes) => ({
                id: job.id,
                count: appRes.data.data?.length || appRes.data?.length || 0,
              }))
              .catch(() => ({ id: job.id, count: 0 })),
          ),
        );
      })
      .then((counts) => {
        const map: Record<number, number> = {};
        counts.forEach((c) => {
          map[c.id] = c.count;
        });
        setApplicationCounts(map);
      })
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

  const handleDelete = async (id: number) => {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    await api.delete(`/jobs/${id}`);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Taslak", className: "status-draft" },
    published: { label: "Yayında", className: "status-published" },
    closed: { label: "Kapalı", className: "status-closed" },
  };

  const publishedCount = jobs.filter((j) => j.status === "published").length;
  const draftCount = jobs.filter((j) => j.status === "draft").length;

  return (
    <>
      <style>{STYLES}</style>

      {/* Çıkış yapılıyor overlay */}
      {loggingOut && (
        <div className="logout-overlay">
          <div className="spinner" />
          <span className="logout-overlay-text">Çıkış yapılıyor...</span>
        </div>
      )}

      {/* Sayfa yükleniyor */}
      {loading ? (
        <div className="loader-wrap">
          <div className="spinner" />
          <span className="loader-text">Yükleniyor...</span>
        </div>
      ) : (
        <>
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
            <div className="page-header">
              <h1 className="page-title">İşveren Paneli</h1>
              <p className="page-subtitle">
                İlanlarınızı ve başvuruları buradan yönetin.
              </p>
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">{jobs.length}</div>
                <div className="stat-label">Toplam İlan</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{publishedCount}</div>
                <div className="stat-label">Yayında</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{draftCount}</div>
                <div className="stat-label">Taslak</div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="quick-actions">
              <Link href="/employer/create-job" className="action-card">
                <div className="action-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div>
                  <div className="action-text">İlan Oluştur</div>
                  <div className="action-desc">Yeni pozisyon yayınla</div>
                </div>
              </Link>
              <Link href="/employer/company" className="action-card">
                <div className="action-icon">
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
                <div>
                  <div className="action-text">Şirket Profili</div>
                  <div className="action-desc">Bilgilerinizi düzenleyin</div>
                </div>
              </Link>
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
                <div>
                  <div className="action-text">İlanları Görüntüle</div>
                  <div className="action-desc">Aday bakış açısı</div>
                </div>
              </Link>
            </div>

            {/* Jobs */}
            <div className="section-header">
              <h2 className="section-title">İlanlarım</h2>
              <Link href="/employer/create-job" className="btn-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: 14, height: 14 }}
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Yeni İlan
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-title">Henüz ilan yayınlamadınız</div>
                <div className="empty-desc">
                  İlk ilanınızı oluşturarak aday almaya başlayın.
                </div>
                <Link
                  href="/employer/create-job"
                  className="btn-primary empty-action"
                >
                  İlk İlanı Oluştur
                </Link>
              </div>
            ) : (
              <div className="jobs-list">
                {jobs.map((job) => {
                  const sc = statusConfig[job.status] || {
                    label: job.status,
                    className: "",
                  };
                  return (
                    <div key={job.id} className="job-card">
                      <div className="job-info">
                        <div className="job-title">{job.title}</div>
                        <div className="job-meta">
                          <span className="job-city">
                            {job.city || "Şehir belirtilmemiş"}
                          </span>
                          <span className={`status-pill ${sc.className}`}>
                            {sc.label}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: "100px",
                              background: "var(--blue-bg)",
                              color: "var(--blue)",
                              border: "1px solid var(--blue-border)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <svg
                              width="12"
                              height="12"
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
                            {applicationCounts[job.id] || 0} başvuru
                          </span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <Link
                          href={`/employer/applications/${job.id}`}
                          className="btn-ghost"
                        >
                          Başvurular
                        </Link>
                        <Link
                          href={`/employer/edit-job/${job.id}`}
                          className="btn-ghost"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="btn-danger"
                        >
                          Sil
                        </button>
                      </div>
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
