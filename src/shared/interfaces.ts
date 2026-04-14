import { IconType } from "react-icons";
import { Experience, FreelanceService, Hobby, Profile, Project, Publication, Stat, TechItem } from '@/shared/types';

export interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface EmailJsSendPayload {
  service_id: string;
  template_id: string;
  user_id: string;
  accessToken: string;
  template_params: Record<string, string>;
}

export interface ExperiencePageProps {
  experiences: Experience[];
}

export interface AboutPageProps {
  profile: Profile;
  hobbies: Hobby[];
  stats: Stat[];
}

export interface ContactPageProps {
  profile: Profile;
  freelanceServices: FreelanceService[];
}

export interface HomePageProps {
  profile: Profile;
  techStack: TechItem[];
}

export interface ProjectsPageProps {
  projects: Project[];
}

export interface PublicationsPageProps {
  publications: Publication[];
}

export interface IconDescriptor {
  icon: IconType;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface ChatbotRequestBody {
  userQuery?: string;
  history?: ChatMessage[];
}

export interface EmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}
