'use client';
import Hero from '@/components/Hero';
import { HomePageProps } from '@/shared/interfaces';

const HomePage = ({ profile, techStack }: HomePageProps) => {
  return <Hero profile={profile} techStack={techStack} />;
};

export default HomePage;
