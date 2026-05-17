export interface User {
  id: number;
  name: string;
  email: string;
  role: "jobseeker" | "employer" | "admin";
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  industry?: string;
  city?: string;
  logo_path?: string;
}

export interface JobListing {
  id: number;
  title: string;
  slug: string;
  description: string;
  city?: string;
  work_type: "full-time" | "part-time" | "freelance" | "internship";
  location_type: "remote" | "hybrid" | "onsite";
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  salary_visible: boolean;
  status: "draft" | "published" | "closed";
  company: Company;
  published_at?: string;
}

export interface JobApplication {
  id: number;
  job_listing_id: number;
  user_id: number;
  cover_letter?: string;
  cv_path?: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  job_listing?: JobListing;
}
