import { Metadata } from 'next';
import AboutPage from '@/pages/AboutPage';
import { getProfile, getHobbies, getProjects, getPublications, getExperiences } from '@/services/supabaseService';

export const metadata: Metadata = {
  title: 'About | Trần Trung Nhựt',
  description: 'Learn more about Trần Trung Nhựt, his background, and his journey.',
};

export default async function Page() { 
  const [profile, hobbies, projects, publications, experiences] = await Promise.all([
    getProfile(),
    getHobbies(),
    getProjects(),
    getPublications(),
    getExperiences()
  ]);

  const stats = [
    { number: "3+", label: "Years Coding" },
    { number: projects.length.toString(), label: "Projects Built" },
    { number: publications.length.toString(), label: "Research Paper" },
    { number: experiences.length.toString(), label: "Companies" }
  ];

  if (!profile) return <div>Failed to load profile.</div>;

  return <AboutPage profile={profile} hobbies={hobbies} stats={stats} />; 
}
