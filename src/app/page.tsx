import HomePage from '@/pages/HomePage';
import { getProfile, getTechStack } from '@/services/supabaseService';

export default async function Page() { 
  const profile = await getProfile();
  const techStack = await getTechStack();

  if (!profile) {
    return <div>Failed to load profile data.</div>;
  }

  return <HomePage profile={profile} techStack={techStack} />; 
}
