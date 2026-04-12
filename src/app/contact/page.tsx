import { Metadata } from 'next';
import ContactPage from '../../pages/ContactPage';

export const metadata: Metadata = {
  title: 'Contact | Trần Trung Nhựt',
  description: 'Get in touch with Trần Trung Nhựt for freelance work or hiring.',
  keywords: 'Liên hệ Trần Trung Nhựt, thuê Trần Trung Nhựt làm web, Trần Trung Nhựt email, contact Trần Trung Nhựt, hire backend developer, freelance web developer contact',
};

export default function Page() { return <ContactPage />; }
