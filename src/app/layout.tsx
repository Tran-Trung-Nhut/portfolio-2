import type { Metadata } from 'next';
import '../index.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotButton from '@/components/ChatbotButton';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.trantrungnhut.id.vn'),
  title: 'Trần Trung Nhựt',
  description: 'Backend Developer, Researcher & Freelancer based in Ho Chi Minh City, Vietnam.',
  keywords: 'Trần Trung Nhựt, Trung Nhựt, Nhựt, Trần Nhựt, Nhựt Trần, Backend Developer, Software Engineer, NestJS, Spring Boot, AWS, HCMUT, portfolio, freelancer',
  authors: [{ name: 'Trần Trung Nhựt' }],
  alternates: {
    canonical: '/',
  },
  verification: {
    google: '6vOBLrYyd4n7uieDZPqMh7siTCJZWXJDS6b8dSO059Y',
  },
  openGraph: {
    title: 'Trần Trung Nhựt – Portfolio',
    description: 'Backend Developer • Researcher • Freelancer',
    type: 'website',
    url: 'https://www.trantrungnhut.id.vn',
    images: [{
      url: '/me.png',
      width: 800,
      height: 600,
      alt: 'Trần Trung Nhựt Portfolio Preview'
    }],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/me.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Person",
              "name": "Trần Trung Nhựt",
              "jobTitle": "Backend Developer",
              "description": "Backend Developer, Researcher & Freelancer based in Ho Chi Minh City, Vietnam.",
              "url": "https://www.trantrungnhut.id.vn",
              "sameAs": [
                "https://www.linkedin.com/in/tran-trung-nhut",
                "https://www.github.com/Tran-Trung-Nhut"
              ]
            })
          }}
        />
      </head>
      <body>
        <div className="page-container">
          <Navbar />
          {children}
          <Footer />
          <ChatbotButton />
        </div>
      </body>
    </html>
  );
}
