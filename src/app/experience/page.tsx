import { Metadata } from 'next';
import ExperiencePage from '@/views/ExperiencePage';
import { getExperiences } from '@/services/supabaseService';

export const metadata: Metadata = {
  title: 'Experience | Trần Trung Nhựt',
  description: 'Professional experience and internships of Trần Trung Nhựt.',
};

export default async function Page() { 
  const experiences = await getExperiences();
  return <ExperiencePage experiences={experiences} />; 
}
