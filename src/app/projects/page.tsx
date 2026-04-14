import { Metadata } from 'next';
import ProjectsPage from '@/pages/ProjectsPage';
import { getProjects } from '@/services/supabaseService';

export const metadata: Metadata = {
  title: 'Projects | Trần Trung Nhựt',
  description: 'Explore the portfolio and freelance projects built by Trần Trung Nhựt.',
  keywords: 'Dự án Trần Trung Nhựt, web freelancer Trần Trung Nhựt, Trần Trung Nhựt projects, freelance developer, backend projects, WordPress developer',
};

export default async function Page() { 
  const projects = await getProjects();
  return <ProjectsPage projects={projects} />; 
}
