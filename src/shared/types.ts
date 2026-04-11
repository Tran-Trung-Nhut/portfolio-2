import type { IconType } from "react-icons";

// ─── TECH STACK TYPES ──────────────────────────────────────
export type TechCategory = "language" | "frontend" | "backend" | "database" | "devops" | "llm";

export interface TechItem {
  name: string;
  icon: IconType;
  color: string;
  category: TechCategory;
}

// ─── EXPERIENCES TYPES ─────────────────────────────────────
export interface Experience {
  id: number;
  position: string;
  company: string;
  type: string;
  period: { start: string; end: string };
  location: { mode: string; address: string };
  logo: string;
  highlights: string[];
}

// ─── PROJECTS TYPES ────────────────────────────────────────
export interface Project {
  id: number;
  title: string;
  description: string;
  techs: string[];
  image?: string;
  repoUrl: string[];
  demoUrl?: string;
  videoUrl?: string;
}

// ─── PUBLICATIONS TYPES ────────────────────────────────────
export interface Publication {
  id: number;
  title: string;
  venue: string;
  year: number;
  authors: string;
  highlightAuthor: string;
  abstract: string;
  arxivUrl: string;
}

// ─── ABOUT & PERSONAL TYPES ────────────────────────────────
export interface PersonalInfo {
  greeting: string;
  firstName: string;
  lastName: string;
  role: string;
  tagline: string;
  description: string;
}

export interface Stat {
  number: string;
  label: string;
}

export interface Hobby {
  name: string;
  icon: IconType;
}

export interface AboutInfo {
  paragraphs: string[];
  stats: Stat[];
  hobbies: Hobby[];
}
