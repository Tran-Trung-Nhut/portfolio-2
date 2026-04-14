export type TechCategory = "language" | "frontend" | "backend" | "database" | "devops" | "llm" | string;

export interface TechItem {
  id: number;
  name: string;
  category: TechCategory;
}

export interface Experience {
  id: number;
  position: string;
  company: string;
  type: string;
  start_date: string;
  end_date: string;
  location_mode: string;
  location_address: string;
  logo: string;
  highlights: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  techs: string[];
  image: string | null;
  repo_urls: string[];
  demo_url: string | null;
}

export interface Publication {
  id: number;
  title: string;
  venue: string;
  year: number;
  authors: string;
  highlight_author: string;
  abstract: string;
  arxiv_url: string;
}

export interface Profile {
  id: number;
  greeting: string;
  first_name: string;
  last_name: string;
  role: string;
  tagline: string;
  description: string;
  about_paragraphs: string[];
  email: string;
  academic_email: string;
  phone: string;
  location: string;
  languages: string;
  cv_url: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
}

export interface Hobby {
  id: number;
  name: string;
}

export interface FreelanceService {
  id: number;
  title: string;
  description: string;
}

// ─── COMPILED TYPES FOR UI (MERGED DB AND ICONS) ───

export interface Stat {
  number: string;
  label: string;
}
