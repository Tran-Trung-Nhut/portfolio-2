import {
  FaReact, FaNodeJs, FaJava, FaAws, FaDocker, FaGitAlt, FaPhp, FaWordpress, FaRobot,
  FaMusic, FaCamera, FaRunning, FaGamepad
} from "react-icons/fa";
import {
  SiTypescript, SiPrisma, SiNestjs, SiPostgresql, SiRedis,
  SiExpress, SiDrizzle, SiMongodb, SiMysql,
  SiPython, SiJavascript, SiCplusplus,
  SiSpringboot, SiApachekafka, SiGo,
  SiTailwindcss, SiSocketdotio, SiVite,
  SiAnthropic, SiGooglegemini, SiOpenai
} from "react-icons/si";
import { GiShuttlecock } from "react-icons/gi";

import type { TechItem, Experience, Project, Publication, PersonalInfo, AboutInfo } from "../shared/types";

// ─── TECH STACK ────────────────────────────────────────────

export const TECH_STACK: TechItem[] = [
  // Languages
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "language" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", category: "language" },
  { name: "Java", icon: FaJava, color: "#007396", category: "language" },
  { name: "Python", icon: SiPython, color: "#3776AB", category: "language" },
  { name: "Go", icon: SiGo, color: "#00ADD8", category: "language" },
  { name: "C++", icon: SiCplusplus, color: "#00599C", category: "language" },
  { name: "PHP", icon: FaPhp, color: "#777BB4", category: "language" },

  // Frontend
  { name: "React", icon: FaReact, color: "#61DAFB", category: "frontend" },
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4", category: "frontend" },
  { name: "Vite", icon: SiVite, color: "#646CFF", category: "frontend" },

  // Backend
  { name: "NestJS", icon: SiNestjs, color: "#E0234E", category: "backend" },
  { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F", category: "backend" },
  { name: "Express", icon: SiExpress, color: "#FFFFFF", category: "backend" },
  { name: "Node.js", icon: FaNodeJs, color: "#339933", category: "backend" },
  { name: "WordPress", icon: FaWordpress, color: "#21759B", category: "backend" },
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
  
  // AI Techs
  { name: "ChatGPT", icon: SiOpenai, color: "#412991", category: "llm" },
  { name: "Gemini", icon: SiGooglegemini, color: "#8E75B2", category: "llm" },
  { name: "Claude", icon: SiAnthropic, color: "#D97757", category: "llm" },
  { name: "DeepSeek", icon: FaRobot, color: "#4D6BFE", category: "llm" },
];

// Icons used for orbiting animation in Hero (subset)
export const ORBIT_ICONS = TECH_STACK.filter(t =>
  ["TypeScript", "NestJS", "PostgreSQL", "Docker", "WordPress", "Spring Boot", "AWS", "Redis", "Go", "Python", "Node.js", "MongoDB"].includes(t.name)
);

// ─── EXPERIENCES ───────────────────────────────────────────

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

// ─── PERSONAL INFO (HERO) ──────────────────────────────────
export const personalInfo: PersonalInfo = {
  greeting: "// Hello, World!",
  firstName: "Trần Trung",
  lastName: "Nhựt",
  role: "Backend Developer",
  tagline: " & Undergraduate Researcher at HCMUT – VNU-HCM. Passionate about building scalable systems, microservices, and clean API architecture.",
  description: "Trần Trung Nhựt is a Backend Developer focusing on APIs, miscroservices, databases, and AI integration. He is also a passionate undergraduate researcher.",
};

// ─── ABOUT PAGE DATA ───────────────────────────────────────
export const aboutInfo: AboutInfo = {
  paragraphs: [
    "Hi! I'm <span class=\"emphasis\">Trần Trung Nhựt</span>, a final-year Computer Science student at <span class=\"emphasis\">Ho Chi Minh City University of Technology (HCMUT – VNU-HCM)</span>. I was born and raised in Dong Thap Province, Vietnam.",
    "I'm currently working as a <span class=\"emphasis\">Backend Developer at Nexon Dev Vina</span>, where I build and maintain backend services. My focus areas include API development, microservices architecture, and database optimization.",
    "Beyond work, I'm an undergraduate researcher with a published paper at <span class=\"emphasis\">ICSA 2026</span> — exploring how Small Language Models reason about software architecture.",
    "I also work as a <span class=\"emphasis\">freelance developer</span>, helping businesses build professional websites and web applications. From <span class=\"emphasis\">WordPress CMS</span> solutions to custom backends deployed on <span class=\"emphasis\">AWS</span>, I combine my engineering skills with <span class=\"emphasis\">AI-powered tools</span> to deliver modern, high-quality web experiences at speed.",
    "When I'm not coding, you'll find me playing badminton, strumming my guitar, singing, running, or watching traveling vlogs and superhero movies."
  ],
  stats: [
    { number: "3+", label: "Years Coding" },
    { number: "1", label: "Projects Built" },
    { number: "1", label: "Research Paper" },
    { number: "2", label: "Companies" }
  ],
  hobbies: [
    { name: "Badminton", icon: GiShuttlecock },
    { name: "Music & Guitar", icon: FaMusic },
    { name: "Photography", icon: FaCamera },
    { name: "Running", icon: FaRunning },
    { name: "Movies", icon: FaGamepad }
  ]
};
