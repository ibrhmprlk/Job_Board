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
    --yellow: #b45309; --yellow-bg: #fffbeb; --yellow-border: #fde68a;
    --radius-sm: 6px; --radius: 10px; --radius-lg: 14px;
    --font: 'DM Sans', system-ui, sans-serif;
  }
  body { background: var(--bg); font-family: var(--font); color: var(--text-primary); -webkit-font-smoothing: antialiased; }

  .loader-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .spinner { width: 28px; height: 28px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(220,38,38,0.3); border-top-color: var(--red); border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  .loader-text { font-size: 13px; color: var(--text-secondary); }
  @keyframes spin { to { transform: rotate(360deg); } }

  .logout-overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(4px); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .logout-overlay .spinner { width: 32px; height: 32px; }
  .logout-overlay-text { font-size: 14px; font-weight: 600; color: var(--text-primary); }

  .header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 50; }
  .header-inner { max-width: 1000px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
  .logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .logo-mark { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .logo-mark svg { width: 16px; height: 16px; color: #fff; }
  .logo-text { font-size: 15px; font-weight: 700; color: var(--text-primary); }
  .admin-badge { font-size: 10px; font-weight: 600; background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); padding: 2px 8px; border-radius: 100px; }
  .header-right { display: flex; align-items: center; gap: 8px; }
  .header-user { font-size: 13px; color: var(--text-secondary); }
  .btn-logout { font-size: 13px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 7px 12px; border-radius: var(--radius-sm); transition: background 0.15s; }
  .btn-logout:hover:not(:disabled) { background: var(--red-bg); }
  .btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

  .main { max-width: 1000px; margin: 0 auto; padding: 32px 24px 80px; }

  .tabs { display: flex; gap: 2px; margin-bottom: 28px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 4px; width: fit-content; flex-wrap: wrap; }
  .tab-btn { display: flex; align-items: center; gap: 7px; padding: 8px 16px; border-radius: var(--radius-sm); border: none; background: none; font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; font-family: var(--font); }
  .tab-btn.active { background: var(--accent); color: #fff; }
  .tab-btn:not(.active):hover { background: var(--bg); color: var(--text-primary); }
  .tab-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 24px 20px; display: flex; align-items: center; gap: 14px; }
  .stat-icon { width: 44px; height: 44px; background: var(--accent-subtle); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .stat-icon svg { width: 20px; height: 20px; color: var(--accent); }
  .stat-value { font-size: 22px; font-weight: 700; }
  .stat-label { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

  .table-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
  .table-header { padding: 18px 24px; border-bottom: 1px solid var(--border); }
  .table-title { font-size: 14px; font-weight: 600; }
  .table-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; border-bottom: 1px solid var(--border); gap: 12px; transition: background 0.1s; }
  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: #fafaf9; }
  .row-main { flex: 1; min-width: 0; }
  .row-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .row-sub { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }
  .row-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  .pill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; white-space: nowrap; }
  .pill-admin     { background: var(--red-bg);    color: var(--red);   border: 1px solid var(--red-border); }
  .pill-employer  { background: var(--blue-bg);   color: var(--blue);  border: 1px solid var(--blue-border); }
  .pill-jobseeker { background: var(--green-bg);  color: var(--green); border: 1px solid var(--green-border); }
  .pill-published { background: var(--green-bg);  color: var(--green); border: 1px solid var(--green-border); }
  .pill-draft     { background: var(--yellow-bg); color: var(--yellow);border: 1px solid var(--yellow-border); }
  .pill-default   { background: var(--accent-subtle); color: var(--text-secondary); }

  .btn-del { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: var(--red); background: none; border: none; cursor: pointer; padding: 5px 8px; border-radius: var(--radius-sm); transition: background 0.15s; font-family: var(--font); min-width: 48px; justify-content: center; }
  .btn-del:hover:not(:disabled) { background: var(--red-bg); }
  .btn-del:disabled { opacity: 0.5; cursor: not-allowed; }

  .toast-wrap { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999; display: flex; flex-direction: column; gap: 8px; align-items: center; pointer-events: none; }
  .toast { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--radius); font-size: 13px; font-weight: 500; box-shadow: 0 4px 16px rgba(0,0,0,0.12); animation: slideUp 0.2s ease; pointer-events: none; }
  .toast-success { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .toast-error   { background: var(--red-bg);   color: var(--red);   border: 1px solid var(--red-border); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .dialog { background: var(--surface); border-radius: var(--radius-lg); padding: 28px 28px 24px; max-width: 380px; width: 100%; border: 1px solid var(--border); }
  .dialog-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
  .dialog-desc { font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5; }
  .dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .btn-cancel { font-size: 13px; font-weight: 500; color: var(--text-secondary); background: var(--bg); border: 1px solid var(--border); padding: 8px 16px; border-radius: var(--radius-sm); cursor: pointer; font-family: var(--font); transition: all 0.15s; }
  .btn-cancel:hover:not(:disabled) { border-color: var(--border-strong); color: var(--text-primary); }
  .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-confirm-del { font-size: 13px; font-weight: 600; color: #fff; background: var(--red); border: none; padding: 8px 16px; border-radius: var(--radius-sm); cursor: pointer; font-family: var(--font); transition: opacity 0.15s; display: inline-flex; align-items: center; gap: 6px; }
  .btn-confirm-del:hover:not(:disabled) { opacity: 0.88; }
  .btn-confirm-del:disabled { opacity: 0.6; cursor: not-allowed; }

  .cat-form { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 12px; }
  .cat-form-title { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
  .cat-form-row { display: flex; gap: 10px; }
  .cat-input { flex: 1; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 14px; font-size: 13px; font-family: var(--font); outline: none; color: var(--text-primary); background: var(--bg); transition: border-color 0.15s; }
  .cat-input:focus { border-color: var(--accent); background: var(--surface); }
  .btn-add { background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; padding: 8px 18px; border: none; border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s; font-family: var(--font); }
  .btn-add:hover:not(:disabled) { background: var(--accent-hover); }
  .btn-add:disabled { opacity: 0.6; cursor: not-allowed; }

  .empty-state { padding: 48px 24px; text-align: center; color: var(--text-muted); font-size: 13px; }

  @media (max-width: 768px) {
    .header-inner { padding: 0 16px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .main { padding: 24px 16px 60px; }
    .table-row { flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px 16px; }
    .row-right { width: 100%; justify-content: flex-end; }
  }
`;

type Stats = {
  users: number;
  employers: number;
  jobseekers: number;
  jobs: number;
  applications: number;
  companies: number;
};
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};
type Job = {
  id: number;
  title: string;
  status: string;
  created_at: string;
  company?: { name: string };
};
type Toast = { id: number; message: string; type: "success" | "error" };
type ConfirmState = {
  open: boolean;
  title: string;
  desc: string;
  onConfirm: () => Promise<void>;
};

const IconUsers = () => (
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
);
const IconBriefcase = () => (
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
);
const IconSearch = () => (
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
);
const IconChart = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconFile = () => (
  <svg
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
  </svg>
);
const IconHome = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconTag = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const IconEmployer = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
  </svg>
);
const IconCheck = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "stats" | "users" | "jobs" | "categories"
  >("stats");
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [addingCategory, setAddingCategory] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirm, setConfirm] = useState<ConfirmState>({
    open: false,
    title: "",
    desc: "",
    onConfirm: async () => {},
  });
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };

  const openConfirm = (
    title: string,
    desc: string,
    onConfirm: () => Promise<void>,
  ) => {
    setConfirm({ open: true, title, desc, onConfirm });
  };

  const closeConfirm = () => {
    if (confirmLoading) return;
    setConfirm((prev) => ({ ...prev, open: false }));
  };

  const runConfirm = async () => {
    setConfirmLoading(true);
    try {
      await confirm.onConfirm();
    } finally {
      setConfirmLoading(false);
      setConfirm((prev) => ({ ...prev, open: false }));
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    if (u.role !== "admin") {
      router.push("/login");
      return;
    }
    setUser(u);

    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/jobs"),
      api.get("/categories"),
    ])
      .then(([statsRes, usersRes, jobsRes, catsRes]) => {
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
        setCategories(catsRes.data);
      })
      .catch(() => showToast("Veriler yüklenemedi.", "error"))
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

  const handleDeleteUser = (u: User) => {
    openConfirm(
      "Kullanıcıyı sil",
      `"${u.name}" adlı kullanıcı kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      async () => {
        setDeletingIds((prev) => new Set(prev).add(u.id));
        try {
          await api.delete(`/admin/users/${u.id}`);
          setUsers((prev) => prev.filter((x) => x.id !== u.id));
          showToast("Kullanıcı silindi.", "success");
        } catch {
          showToast("Kullanıcı silinemedi.", "error");
        } finally {
          setDeletingIds((prev) => {
            const s = new Set(prev);
            s.delete(u.id);
            return s;
          });
        }
      },
    );
  };

  const handleDeleteJob = (job: Job) => {
    openConfirm(
      "İlanı sil",
      `"${job.title}" ilanı kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      async () => {
        setDeletingIds((prev) => new Set(prev).add(job.id));
        try {
          await api.delete(`/admin/jobs/${job.id}`);
          setJobs((prev) => prev.filter((x) => x.id !== job.id));
          showToast("İlan silindi.", "success");
        } catch {
          showToast("İlan silinemedi.", "error");
        } finally {
          setDeletingIds((prev) => {
            const s = new Set(prev);
            s.delete(job.id);
            return s;
          });
        }
      },
    );
  };

  const handleDeleteCategory = (cat: { id: number; name: string }) => {
    openConfirm(
      "Kategoriyi sil",
      `"${cat.name}" kategorisi kalıcı olarak silinecek. Bu işlem geri alınamaz.`,
      async () => {
        setDeletingIds((prev) => new Set(prev).add(cat.id));
        try {
          await api.delete(`/categories/${cat.id}`);
          setCategories((prev) => prev.filter((x) => x.id !== cat.id));
          showToast("Kategori silindi.", "success");
        } catch {
          showToast("Kategori silinemedi.", "error");
        } finally {
          setDeletingIds((prev) => {
            const s = new Set(prev);
            s.delete(cat.id);
            return s;
          });
        }
      },
    );
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    try {
      const res = await api.post("/categories", { name: newCategory });
      setCategories((prev) => [...prev, res.data]);
      setNewCategory("");
      showToast("Kategori eklendi.", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Kategori eklenemedi.", "error");
    } finally {
      setAddingCategory(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const rolePillClass: Record<string, string> = {
    admin: "pill pill-admin",
    employer: "pill pill-employer",
    jobseeker: "pill pill-jobseeker",
  };

  const jobStatusPillClass: Record<string, string> = {
    published: "pill pill-published",
    draft: "pill pill-draft",
  };

  const tabs = [
    { key: "stats", label: "İstatistikler", Icon: IconChart },
    { key: "users", label: "Kullanıcılar", Icon: IconUsers },
    { key: "jobs", label: "İlanlar", Icon: IconBriefcase },
    { key: "categories", label: "Kategoriler", Icon: IconTag },
  ] as const;

  const statItems = stats
    ? [
        { label: "Toplam Kullanıcı", value: stats.users, Icon: IconUsers },
        { label: "İşveren", value: stats.employers, Icon: IconEmployer },
        { label: "İş Arayan", value: stats.jobseekers, Icon: IconSearch },
        { label: "Toplam İlan", value: stats.jobs, Icon: IconBriefcase },
        { label: "Başvuru", value: stats.applications, Icon: IconFile },
        { label: "Şirket", value: stats.companies, Icon: IconHome },
      ]
    : [];

  return (
    <>
      <style>{STYLES}</style>

      {loggingOut && (
        <div className="logout-overlay">
          <div className="spinner" />
          <span className="logout-overlay-text">Çıkış yapılıyor...</span>
        </div>
      )}

      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" ? <IconCheck /> : <IconX />}
            {t.message}
          </div>
        ))}
      </div>

      {confirm.open && (
        <div className="dialog-overlay" onClick={closeConfirm}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">{confirm.title}</div>
            <div className="dialog-desc">{confirm.desc}</div>
            <div className="dialog-actions">
              <button
                className="btn-cancel"
                onClick={closeConfirm}
                disabled={confirmLoading}
              >
                Vazgeç
              </button>
              <button
                className="btn-confirm-del"
                onClick={runConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading && <span className="spinner-sm" />}
                Evet, sil
              </button>
            </div>
          </div>
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
              <Link href="/admin" className="logo">
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
                <span className="admin-badge">Admin</span>
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
            <div className="tabs">
              {tabs.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`tab-btn${activeTab === key ? " active" : ""}`}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "stats" && stats && (
              <div className="stats-grid">
                {statItems.map(({ label, value, Icon }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-icon">
                      <Icon />
                    </div>
                    <div>
                      <div className="stat-value">{value}</div>
                      <div className="stat-label">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "users" && (
              <div className="table-card">
                <div className="table-header">
                  <span className="table-title">
                    Kullanıcılar ({users.length})
                  </span>
                </div>
                {users.length === 0 ? (
                  <div className="empty-state">Henüz kullanıcı yok.</div>
                ) : (
                  users.map((u) => (
                    <div key={u.id} className="table-row">
                      <div className="row-main">
                        <div className="row-name">{u.name}</div>
                        <div className="row-sub">
                          {u.email} · {formatDate(u.created_at)}
                        </div>
                      </div>
                      <div className="row-right">
                        <span
                          className={
                            rolePillClass[u.role] ?? "pill pill-default"
                          }
                        >
                          {u.role}
                        </span>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            disabled={deletingIds.has(u.id)}
                            className="btn-del"
                          >
                            {deletingIds.has(u.id) ? (
                              <span className="spinner-sm" />
                            ) : (
                              "Sil"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="table-card">
                <div className="table-header">
                  <span className="table-title">İlanlar ({jobs.length})</span>
                </div>
                {jobs.length === 0 ? (
                  <div className="empty-state">Henüz ilan yok.</div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="table-row">
                      <div className="row-main">
                        <div className="row-name">{job.title}</div>
                        <div className="row-sub">
                          {job.company?.name} · {formatDate(job.created_at)}
                        </div>
                      </div>
                      <div className="row-right">
                        <span
                          className={
                            jobStatusPillClass[job.status] ??
                            "pill pill-default"
                          }
                        >
                          {job.status}
                        </span>
                        <button
                          onClick={() => handleDeleteJob(job)}
                          disabled={deletingIds.has(job.id)}
                          className="btn-del"
                        >
                          {deletingIds.has(job.id) ? (
                            <span className="spinner-sm" />
                          ) : (
                            "Sil"
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "categories" && (
              <div>
                <form onSubmit={handleAddCategory} className="cat-form">
                  <div className="cat-form-title">Kategori Ekle</div>
                  <div className="cat-form-row">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Kategori adı (örn. Yazılım)"
                      className="cat-input"
                      disabled={addingCategory}
                    />
                    <button
                      type="submit"
                      className="btn-add"
                      disabled={addingCategory}
                    >
                      {addingCategory ? "Ekleniyor..." : "Ekle"}
                    </button>
                  </div>
                </form>

                <div className="table-card">
                  <div className="table-header">
                    <span className="table-title">
                      Kategoriler ({categories.length})
                    </span>
                  </div>
                  {categories.length === 0 ? (
                    <div className="empty-state">Henüz kategori yok.</div>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.id} className="table-row">
                        <div className="row-main">
                          <div className="row-name">{cat.name}</div>
                        </div>
                        <div className="row-right">
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            disabled={deletingIds.has(cat.id)}
                            className="btn-del"
                          >
                            {deletingIds.has(cat.id) ? (
                              <span className="spinner-sm" />
                            ) : (
                              "Sil"
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
}
