import 'server-only';
import { cache } from 'react';
import type {
  Profile, TechItem, Experience, Project, Publication,
  Hobby, FreelanceService
} from '@/shared/types';
import supabase from '@/lib/supabase';

export const getProfile = cache(async (): Promise<Profile | null> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as Profile;
});

export const getTechStack = cache(async (): Promise<TechItem[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('tech_stack')
    .select('*');

  if (error) {
    console.error('Error fetching tech stack:', error);
    return [];
  }

  return data as TechItem[];
});

export const getHobbies = cache(async (): Promise<Hobby[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('hobbies')
    .select('*');

  if (error) {
    console.error('Error fetching hobbies:', error);
    return [];
  }

  return data as Hobby[];
});

export const getExperiences = cache(async (): Promise<Experience[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('id', { ascending: true }); // Modify ordering as necessary

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
  return data as Experience[];
});

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data as Project[];
});

export const getPublications = cache(async (): Promise<Publication[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
  return data as Publication[];
});

export const getFreelanceServices = cache(async (): Promise<FreelanceService[]> => {
  if (!supabase) return new Promise(() => {});
  const { data, error } = await supabase
    .from('freelance_services')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching freelance services:', error);
    return [];
  }
  return data as FreelanceService[];
});
