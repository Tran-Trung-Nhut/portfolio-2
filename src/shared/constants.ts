import {
  FaReact, FaNodeJs, FaJava, FaAws, FaDocker, FaGitAlt, FaPhp, FaWordpress, FaRobot,
  FaMusic, FaCamera, FaRunning, FaGamepad, FaCode
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
import { IconType } from "react-icons";
import { IconDescriptor } from '@/shared/interfaces';

// ─── NAV ITEMS ─────────────────────────────────────────────
export const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Experience", path: "/experience" },
  { label: "Projects", path: "/projects" },
  { label: "Publications", path: "/publications" },
  { label: "Contact", path: "/contact" },
];

// ─── ICON & COLOR MAPPING ──────────────────────────────────
export const TECH_ICON_MAP: Record<string, IconDescriptor> = {
  "TypeScript": { icon: SiTypescript, color: "#3178C6" },
  "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
  "Java": { icon: FaJava, color: "#007396" },
  "Python": { icon: SiPython, color: "#3776AB" },
  "Go": { icon: SiGo, color: "#00ADD8" },
  "C++": { icon: SiCplusplus, color: "#00599C" },
  "PHP": { icon: FaPhp, color: "#777BB4" },
  "React": { icon: FaReact, color: "#61DAFB" },
  "Tailwind": { icon: SiTailwindcss, color: "#06B6D4" },
  "Vite": { icon: SiVite, color: "#646CFF" },
  "NestJS": { icon: SiNestjs, color: "#E0234E" },
  "Spring Boot": { icon: SiSpringboot, color: "#6DB33F" },
  "Express": { icon: SiExpress, color: "#FFFFFF" },
  "Node.js": { icon: FaNodeJs, color: "#339933" },
  "WordPress": { icon: FaWordpress, color: "#21759B" },
  "Socket.IO": { icon: SiSocketdotio, color: "#FFFFFF" },
  "PostgreSQL": { icon: SiPostgresql, color: "#336791" },
  "MongoDB": { icon: SiMongodb, color: "#47A248" },
  "MySQL": { icon: SiMysql, color: "#4479A1" },
  "Redis": { icon: SiRedis, color: "#DC382D" },
  "Prisma": { icon: SiPrisma, color: "#FFFFFF" },
  "Drizzle": { icon: SiDrizzle, color: "#FFCC33" },
  "Docker": { icon: FaDocker, color: "#2496ED" },
  "AWS": { icon: FaAws, color: "#FF9900" },
  "Kafka": { icon: SiApachekafka, color: "#231F20" },
  "Git": { icon: FaGitAlt, color: "#F05032" },
  "ChatGPT": { icon: SiOpenai, color: "#412991" },
  "Gemini": { icon: SiGooglegemini, color: "#8E75B2" },
  "Claude": { icon: SiAnthropic, color: "#D97757" },
  "DeepSeek": { icon: FaRobot, color: "#4D6BFE" },
};

export const DEFAULT_TECH_ICON: IconDescriptor = {
  icon: FaCode,
  color: "#FFFFFF",
};

export const HOBBY_ICON_MAP: Record<string, IconType> = {
  "Badminton": GiShuttlecock,
  "Music & Guitar": FaMusic,
  "Photography": FaCamera,
  "Running": FaRunning,
  "Movies": FaGamepad,
};

export const DEFAULT_HOBBY_ICON: IconType = FaRobot;


export const FALLBACK_MESSAGE =
  'I am having some issues right now 😔. Please try again later, or contact Nhựt directly through other channels on the [Contact page](/contact).';

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "fetch_portfolio_data",
      description: "Fetch real-time data about Trần Trung Nhựt's portfolio, including his profile, projects, experience, skills, and publications.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            enum: ["profile", "projects", "experience", "skills", "publications"],
            description: "The specific topic to fetch data about."
          }
        },
        required: ["topic"]
      }
    }
  }
];
