import { Metadata } from 'next';
import AboutPage from '../../pages/AboutPage';

export const metadata: Metadata = {
  title: 'About | Trần Trung Nhựt',
  description: 'Learn more about Trần Trung Nhựt',
  keywords: 'Trần Trung Nhựt tiểu sử, giới thiệu Trần Trung Nhựt, Trần Trung Nhựt HCMUT, Trần Trung Nhựt bio, about Trần Trung Nhựt, HCMUT computer science student, backend developer profile',
};

export default function Page() { return <AboutPage />; }
