"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

type SavedJob = {
  id: number;
  job_listing_id: number;
  created_at: string;
  job_listing: {
    id: number;
    title: string;
    slug: string;
    city?: string;
    work_type: string;
    location_type: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency: string;
    salary_visible: boolean;
    status: string;
    company: {
      name: string;
    };
  };
};

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
  .header-right { display: flex; align-items: center; gap: 16px; }
  .header-user { font-size: 13px; color: var(--text-secondary); }
  .btn-link { font-size: 13px; font-weight: 500; color: var(--text-secondary); text-decoration: none; background: var(--bg); padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); transition: all 0.15s; }
  .btn-link:hover { color: var(--text-primary); border-color: var(--border-strong); }
  .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
  .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
  .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Main */
  .main { max-width: 1000px; margin: 0 auto; padding: 40px 24px 80px; }
  .breadcrumb { font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; display: flex; align-items: center; gap: 6px; }
  .breadcrumb a { color: var(--text-secondary); text-decoration: none; }
  .breadcrumb a:hover { color: var(--text-primary); }
  .breadcrumb-sep { color: var(--text-muted); }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 24px; }

  /* Saved Jobs List */
  .jobs-list { display: flex; flex-direction: column; gap: 12px; }
  .job-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 24px; transition: border-color 0.15s; }
  .job-card:hover { border-color: var(--border-strong); }
  .job-info { flex: 1; min-width: 0; }
  .job-title { font-size: 15px; font-weight: 600; color: var(--text-primary); }
  .job-meta { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
  
  /* Tags */
  .job-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; background: var(--accent-subtle); color: var(--text-secondary); }
  .tag-salary { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .tag-closed { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }

  /* Actions */
  .job-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .btn-primary { background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; transition: background 0.15s; }
  .btn-primary:hover { background: var(--accent-hover); }
  
  /* Modern Yeşil Kaydedildi / Kaldır Butonu */
  .btn-bookmark { width: 36px; height: 36px; border-radius: var(--radius); border: 1px solid var(--green-border); background: var(--green-bg); color: var(--green); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .btn-bookmark svg { width: 16px; height: 16px; fill: currentColor; }
  .btn-bookmark:hover { background: var(--red-bg); border-color: var(--red-border); color: var(--red); }
  .btn-bookmark:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Empty State */
  .empty-state { background: var(--surface); border: 1px dashed var(--border-strong); border-radius: var(--radius-lg); padding: 60px 24px; text-align: center; }
  .empty-icon { width: 48px; height: 48px; background: var(--accent-subtle); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .empty-icon svg { width: 22px; height: 22px; }
  .empty-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .empty-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; }

  @media (max-width: 768px) {
    .job-card { flex-direction: column; align-items: flex-start; gap: 16px; }
    .job-actions { width: 100%; }
    .btn-primary { flex: 1; text-align: center; }
  }
`;

export default function SavedJobsPage() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
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
      .get("/saved-jobs")
      .then((res) => setSavedJobs(res.data.data))
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

  const handleRemove = async (jobId: number, savedId: number) => {
    setRemovingId(savedId);
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((s) => s.id !== savedId));
    } catch {
      alert("Kaldırılamadı.");
    } finally {
      setRemovingId(null);
    }
  };

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
          {/* Header */}
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
            <div className="breadcrumb">
              <Link href="/jobseeker/dashboard">Dashboard</Link>
              <span className="breadcrumb-sep">/</span>
              <span>Kayıtlı İlanlar</span>
            </div>

            <h1 className="page-title">Kayıtlı İlanlar</h1>

            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
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
                <div className="empty-title">Henüz kayıtlı ilanın yok</div>
                <div className="empty-desc">
                  İlginizi çeken pozisyonları kaydederek daha sonra kolayca
                  erişebilirsiniz.
                </div>
                <Link href="/jobs" className="btn-primary">
                  İlanları Gez
                </Link>
              </div>
            ) : (
              <div className="jobs-list">
                {savedJobs.map((saved) => (
                  <div key={saved.id} className="job-card">
                    <div className="job-info">
                      <h3 className="job-title">{saved.job_listing.title}</h3>
                      <p className="job-meta">
                        {saved.job_listing.company?.name} ·{" "}
                        {saved.job_listing.city || "Belirtilmemiş"}
                      </p>

                      <div className="job-tags">
                        <span className="tag">
                          {saved.job_listing.work_type === "full-time"
                            ? "Tam Zamanlı"
                            : saved.job_listing.work_type === "part-time"
                              ? "Yarı Zamanlı"
                              : saved.job_listing.work_type === "freelance"
                                ? "Freelance"
                                : "Staj"}
                        </span>
                        <span className="tag">
                          {saved.job_listing.location_type === "remote"
                            ? "Uzaktan"
                            : saved.job_listing.location_type === "hybrid"
                              ? "Hibrit"
                              : "Ofis"}
                        </span>
                        {saved.job_listing.salary_visible &&
                          saved.job_listing.salary_min && (
                            <span className="tag tag-salary">
                              {saved.job_listing.salary_min.toLocaleString()} -{" "}
                              {saved.job_listing.salary_max?.toLocaleString()}{" "}
                              {saved.job_listing.salary_currency}
                            </span>
                          )}
                        {saved.job_listing.status === "closed" && (
                          <span className="tag tag-closed">Kapalı</span>
                        )}
                      </div>
                    </div>

                    <div className="job-actions">
                      <Link
                        href={`/jobs/${saved.job_listing.slug}`}
                        className="btn-primary"
                      >
                        İncele
                      </Link>

                      {/* Kaydedildi Belirteci / Tıklayınca Siler */}
                      <button
                        onClick={() =>
                          handleRemove(saved.job_listing_id, saved.id)
                        }
                        disabled={removingId === saved.id}
                        title="Kaydı Kaldır"
                        className="btn-bookmark"
                      >
                        {removingId === saved.id ? (
                          <div
                            className="spinner"
                            style={{ width: 14, height: 14, borderWidth: 2 }}
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
}
