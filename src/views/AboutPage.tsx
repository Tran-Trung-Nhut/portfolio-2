'use client';
import { useEffect, useRef } from 'react';
import { HOBBY_ICON_MAP, DEFAULT_HOBBY_ICON } from '@/shared/constants';
import { AboutPageProps } from '@/shared/interfaces';

const AboutPage = ({ profile, hobbies, stats }: AboutPageProps) => {
  const revealRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="page-content">
      <h2 className="section-title reveal" ref={addRevealRef}>
        About <span>Me</span>
      </h2>

      <div className="about-grid">
        <div className="about-text reveal" ref={addRevealRef}>
          {profile.about_paragraphs && profile.about_paragraphs.map((paragraph, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}

          <div className="about-hobbies">
            {hobbies.map((hobby) => {
              const IconComponent = HOBBY_ICON_MAP[hobby.name] || DEFAULT_HOBBY_ICON;
              return (
              <span key={hobby.name} className="hobby-tag">
                {IconComponent && <IconComponent />} {hobby.name}
              </span>
            )})}
          </div>
        </div>

        <div className="about-stats reveal" ref={addRevealRef}>
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

