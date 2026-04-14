import { Metadata } from 'next';
import ContactPage from '@/views/ContactPage';
import { getProfile, getFreelanceServices } from '@/services/supabaseService';

export const metadata: Metadata = {
  title: 'Contact | Trần Trung Nhựt',
  description: 'Get in touch with Trần Trung Nhựt for freelance projects, collaborations, or open roles.',
};

export default async function Page() { 
  const profile = await getProfile();
  const freelanceServices = await getFreelanceServices();
  
  if (!profile) return <div>Failed to load profile.</div>;

  return <ContactPage profile={profile} freelanceServices={freelanceServices} />; 
}
