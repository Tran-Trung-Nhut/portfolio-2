import {
  FaReact, FaNodeJs, FaJava, FaAws, FaDocker, FaGitAlt, FaPhp
} from "react-icons/fa";
import {
  SiTypescript, SiPrisma, SiNestjs, SiPostgresql, SiRedis,
  SiExpress, SiDrizzle, SiMongodb, SiMysql,
  SiPython, SiJavascript, SiCplusplus,
  SiSpringboot, SiApachekafka, SiGo,
  SiTailwindcss, SiSocketdotio, SiVite
} from "react-icons/si";
import type { IconType } from "react-icons";

// ─── TECH STACK ────────────────────────────────────────────
export type TechItem = {
  name: string;
  icon: IconType;
  color: string;
  category: "language" | "backend" | "database" | "devops";
};

export const TECH_STACK: TechItem[] = [
  // Languages
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "language" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "language" },
  { name: "Java", icon: FaJava, color: "#007396", category: "language" },
  { name: "Python", icon: SiPython, color: "#3776AB", category: "language" },
  { name: "Go", icon: SiGo, color: "#00ADD8", category: "language" },
  { name: "C++", icon: SiCplusplus, color: "#00599C", category: "language" },
  { name: "PHP", icon: FaPhp, color: "#777BB4", category: "language" },

  // Backend
  { name: "NestJS", icon: SiNestjs, color: "#E0234E", category: "backend" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F", category: "backend" },
  { name: "Express", icon: SiExpress, color: "#FFFFFF", category: "backend" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933", category: "backend" },
  { name: "React", icon: FaReact, color: "#61DAFB", category: "backend" },
  { name: "Socket.IO", icon: SiSocketdotio, color: "#FFFFFF", category: "backend" },

  // Databases
  { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", category: "database" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", category: "database" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1", category: "database" },
  { name: "Redis", icon: SiRedis, color: "#DC382D", category: "database" },
  { name: "Prisma", icon: SiPrisma, color: "#FFFFFF", category: "database" },
  { name: "Drizzle", icon: SiDrizzle, color: "#FFCC33", category: "database" },

  // DevOps
  { name: "Docker", icon: FaDocker, color: "#2496ED", category: "devops" },
  { name: "AWS", icon: FaAws, color: "#FF9900", category: "devops" },
  { name: "Kafka", icon: SiApachekafka, color: "#231F20", category: "devops" },
  { name: "Git", icon: FaGitAlt, color: "#F05032", category: "devops" },
  { name: "Vite", icon: SiVite, color: "#646CFF", category: "devops" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", category: "devops" },
];

// Icons used for orbiting animation in Hero (subset)
export const ORBIT_ICONS = TECH_STACK.filter(t =>
  ["TypeScript", "NestJS", "PostgreSQL", "Docker", "React", "Spring Boot", "AWS", "Redis", "Go", "Python", "Node.js", "MongoDB"].includes(t.name)
);

// ─── EXPERIENCES ───────────────────────────────────────────
export type Experience = {
  id: number;
  position: string;
  company: string;
  type: string;
  period: { start: string; end: string };
  location: { mode: string; address: string };
  logo: string;
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    id: 1,
    position: "Quality Assurance Engineer",
    company: "ITC GROUP",
    type: "Internship",
    period: { start: "May 2025", end: "Aug 2025" },
    location: { mode: "On-site", address: "Tan Phu, Ho Chi Minh City" },
    logo: "https://itcgroup.io/wp-content/uploads/2024/08/ITC-Group-Official-logo.svg",
    highlights: [
      "Worked in Scrum-based sprints: sprint planning, test plans, release notes",
      "Wrote test cases, reported bugs, executed regression & smoke testing",
      "Knowledge transfer on live project with active users",
    ],
  },
  {
    id: 2,
    position: "Backend Developer",
    company: "NEXON DEV VINA",
    type: "Full-time",
    period: { start: "Oct 2025", end: "Present" },
    location: { mode: "On-site", address: "District 7, Ho Chi Minh City" },
    logo: "/nexon_dev_vina.png",
    highlights: [
      "Building and maintaining backend services with modern tech stack",
      "Working on scalable system architecture and API development",
    ],
  },
];

// ─── PROJECTS ──────────────────────────────────────────────
export type Project = {
  id: number;
  title: string;
  description: string;
  techs: string[];
  image?: string;
  repoUrl: string[];
  demoUrl?: string;
  videoUrl?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Lotus Paint – Corporate Website",
    description:
      "A full-featured corporate website for Lotus Paint (Bich Trang Co., Ltd), a Vietnamese manufacturer of eco-friendly water-based paints and construction chemicals. Features include a product catalog with category filtering, project portfolio showcase, bilingual support (Vietnamese & English), contact inquiry form, and SEO optimization. Built as a freelance project using WordPress CMS.",
    techs: ["WordPress", "PHP", "MySQL", "CSS", "JavaScript"],
    image: "/lotuspaint_preview.png",
    repoUrl: [],
    demoUrl: "https://lotuspaint-demo.great-site.net/",
  },
];

// ─── PUBLICATIONS ──────────────────────────────────────────
export type Publication = {
  id: number;
  title: string;
  venue: string;
  year: number;
  authors: string;
  highlightAuthor: string;
  abstract: string;
  arxivUrl: string;
};

export const publications: Publication[] = [
  {
    id: 1,
    title:
      "Exploring the Reasoning Depth of Small Language Models in Software Architecture: A Multidimensional Evaluation Framework Towards Software Engineering 2.0",
    venue: "ICSA 2026",
    year: 2026,
    authors: "Ha Vo, Nhut Tran, Khang Vo, Phat T. Tran-Truong, Son Ha",
    highlightAuthor: "Nhut Tran",
    abstract:
      "A multidimensional framework benchmarking 10 state-of-the-art Small Language Models (SLMs) on their reasoning capabilities for Architectural Decision Records generation, analyzing the trade-offs between model size, context windows, and performance.",
    arxivUrl: "https://arxiv.org/abs/2603.07091",
  },
];

// ─── SOCIAL LINKS ──────────────────────────────────────────
export const socialLinks = {
  github: "https://github.com/Tran-Trung-Nhut",
  linkedin: "https://www.linkedin.com/in/tran-trung-nhut/",
  facebook: "https://www.facebook.com/tran.trung.nhut.nov.25th",
  instagram: "https://www.instagram.com/_ttnhwjt.25thnov/",
  tiktok: "https://www.tiktok.com/@nhwtj2mais",
};

// ─── CONTACT INFO ──────────────────────────────────────────
export const contactInfo = {
  email: "ttnhut904@gmail.com",
  academicEmail: "nhut.trannov25th@hcmut.edu.vn",
  phone: "+84 389 819 223",
  location: "Ward 15, Tan Binh, Ho Chi Minh City",
  languages: "Vietnamese & English",
  cvUrl: "https://drive.google.com/file/d/1dz0E1ZZQJUTHkst9x_KtNgDgu8rKZ6qP/view?usp=sharing",
};

// ─── FREELANCE SERVICES ────────────────────────────────────
export const freelanceServices = [
  {
    title: "Backend Development",
    description: "Building robust APIs and microservices with NestJS, Express, and Spring Boot.",
  },
  {
    title: "WordPress & CMS",
    description: "Custom WordPress themes and plugins for content-driven websites.",
  },
  {
    title: "Cloud & AWS",
    description: "Deploying and managing applications on AWS (EC2, S3, RDS, Lambda).",
  },
  {
    title: "AI-Powered Web",
    description: "Integrating AI tools and LLMs to create smart, modern web experiences.",
  },
];

// ─── NAV ITEMS ─────────────────────────────────────────────
export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Experience", path: "/experience" },
  { label: "Projects", path: "/projects" },
  { label: "Publications", path: "/publications" },
  { label: "Contact", path: "/contact" },
];
