import { Metadata } from 'next';
import PublicationsPage from '@/pages/PublicationsPage';
import { getPublications } from '@/services/supabaseService';

export const metadata: Metadata = {
  title: 'Publications | Trần Trung Nhựt',
  description: 'Research papers and publications by Trần Trung Nhựt.',
};

export default async function Page() { 
  const publications = await getPublications();
  return <PublicationsPage publications={publications} />; 
}
