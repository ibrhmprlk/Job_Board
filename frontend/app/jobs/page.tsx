"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { JobListing } from "@/types";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const u = stored ? JSON.parse(stored) : null;
    if (u) setUser(u);
    setUserLoaded(true);

    Promise.all([
      api.get("/jobs"),
      u && u.role === "jobseeker"
        ? api.get("/my-applications")
        : Promise.resolve(null),
    ])
      .then(([jobsRes, appRes]) => {
        setJobs(jobsRes.data.data);
        if (appRes) {
          const apps = appRes.data.data || appRes.data || [];
          const ids = new Set(
            apps.map((a: any) => a.job_listing_id || a.job_id),
          );
          setAppliedJobIds(ids);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          background: "#f5f5f4",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            border: "3px solid #e7e5e4",
            borderTopColor: "#0f172a",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <span style={{ fontSize: "13px", color: "#78716c" }}>
          İlanlar yükleniyor...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f4" }}>
      {/* Header */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e7e5e4",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/jobs"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#0f172a",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "16px", height: "16px", color: "#fff" }}
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <span
              style={{ fontSize: "15px", fontWeight: 700, color: "#1c1917" }}
            >
              JobBoard
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {userLoaded && user ? (
              <Link
                href={
                  user.role === "employer"
                    ? "/employer/dashboard"
                    : "/jobseeker/dashboard"
                }
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#78716c",
                  textDecoration: "none",
                  background: "#f5f5f4",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  border: "1px solid #e7e5e4",
                  transition: "all 0.15s",
                }}
              >
                Dashboard
              </Link>
            ) : userLoaded && !user ? (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#78716c",
                    textDecoration: "none",
                    background: "#f5f5f4",
                    padding: "7px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e7e5e4",
                    transition: "all 0.15s",
                  }}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "#0f172a",
                    color: "#fff",
                    padding: "7px 16px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    border: "1px solid #0f172a",
                  }}
                >
                  Kayıt Ol
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div
        style={{
          background: "#0f172a",
          color: "#fff",
          padding: "64px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              marginBottom: "12px",
              letterSpacing: "-0.6px",
              lineHeight: 1.2,
            }}
          >
            Hayalindeki İşi Bul
          </h2>
          <p
            style={{
              color: "#a8a29e",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Binlerce ilan arasından sana en uygun olanı keşfet
          </p>
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(4px)",
                borderRadius: "14px",
                padding: "12px 24px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{ fontSize: "24px", fontWeight: 800, color: "#fff" }}
              >
                {jobs.length}
              </span>
              <span
                style={{
                  color: "#a8a29e",
                  fontSize: "13px",
                  marginLeft: "8px",
                }}
              >
                Aktif İlan
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* İlanlar */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1c1917" }}>
            Son İlanlar
          </h3>
          <span style={{ fontSize: "13px", color: "#78716c" }}>
            {jobs.length} sonuç
          </span>
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e7e5e4",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#f1f5f9",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "22px", height: "22px", color: "#78716c" }}
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
            <p style={{ color: "#78716c", fontWeight: 600, fontSize: "14px" }}>
              Henüz ilan bulunmuyor.
            </p>
            <p style={{ color: "#a8a29e", fontSize: "13px", marginTop: "4px" }}>
              İlk ilanı sen vermek ister misin?
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  border: "1px solid #e7e5e4",
                  padding: "24px",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#d6d3d1";
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e7e5e4";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1c1917",
                          transition: "color 0.15s",
                        }}
                      >
                        {job.title}
                      </h4>
                      {job.salary_visible && job.salary_min && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "100px",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {job.salary_min.toLocaleString()}
                          {job.salary_max
                            ? ` – ${job.salary_max.toLocaleString()}`
                            : ""}{" "}
                          {job.salary_currency}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        fontSize: "13px",
                        color: "#78716c",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "14px", height: "14px" }}
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                        {job.company?.name}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "14px", height: "14px" }}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {job.city || "Belirtilmemiş"}
                      </span>
                    </div>

                    {/* Etiketler */}
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          ...(job.work_type === "full-time"
                            ? {
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                              }
                            : job.work_type === "part-time"
                              ? {
                                  background: "#f5f3ff",
                                  color: "#7c3aed",
                                  border: "1px solid #ddd6fe",
                                }
                              : job.work_type === "freelance"
                                ? {
                                    background: "#fff7ed",
                                    color: "#c2410c",
                                    border: "1px solid #fed7aa",
                                  }
                                : {
                                    background: "#fdf2f8",
                                    color: "#be185d",
                                    border: "1px solid #fbcfe8",
                                  }),
                        }}
                      >
                        {job.work_type === "full-time"
                          ? "Tam Zamanlı"
                          : job.work_type === "part-time"
                            ? "Yarı Zamanlı"
                            : job.work_type === "freelance"
                              ? "Freelance"
                              : "Staj"}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          ...(job.location_type === "remote"
                            ? {
                                background: "#f0fdf4",
                                color: "#15803d",
                                border: "1px solid #bbf7d0",
                              }
                            : job.location_type === "hybrid"
                              ? {
                                  background: "#fffbeb",
                                  color: "#b45309",
                                  border: "1px solid #fde68a",
                                }
                              : {
                                  background: "#f8fafc",
                                  color: "#475569",
                                  border: "1px solid #e2e8f0",
                                }),
                        }}
                      >
                        {job.location_type === "remote"
                          ? "Uzaktan"
                          : job.location_type === "hybrid"
                            ? "Hibrit"
                            : "Ofis"}
                      </span>
                      {job.salary_visible && job.salary_min && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "100px",
                            background: "#f0fdf4",
                            color: "#16a34a",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          {job.salary_min.toLocaleString()}
                          {job.salary_max
                            ? ` – ${job.salary_max.toLocaleString()}`
                            : ""}{" "}
                          {job.salary_currency}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexShrink: 0,
                    }}
                  >
                    {appliedJobIds.has(job.id) && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "100px",
                          background: "#f0fdf4",
                          color: "#16a34a",
                          border: "1px solid #bbf7d0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Başvuruldu
                      </span>
                    )}
                    <Link
                      href={`/jobs/${job.slug}`}
                      style={{
                        flexShrink: 0,
                        background: "#0f172a",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 700,
                        padding: "10px 20px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "background 0.15s",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#1e293b")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#0f172a")
                      }
                    >
                      İncele
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "14px", height: "14px" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
