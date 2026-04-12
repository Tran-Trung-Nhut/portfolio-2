import { Metadata } from 'next';
import PublicationsPage from '../../pages/PublicationsPage';

export const metadata: Metadata = {
  title: 'Publications | Trần Trung Nhựt',
  description: 'Academic research and publications by Trần Trung Nhựt.',
  keywords: 'Nghiên cứu khoa học Trần Trung Nhựt, ICSA 2026, SLMs in Software Architecture, Trần Trung Nhựt research, academic publications, computer science papers',
};

export default function Page() { return <PublicationsPage />; }
