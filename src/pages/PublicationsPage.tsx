'use client';
import { useEffect, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { publications } from '../data/data';

const PublicationsPage = () => {
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

  const highlightAuthor = (authors: string, highlight: string) => {
    const parts = authors.split(highlight);
    if (parts.length === 1) return <>{authors}</>;
    return (
      <>
        {parts[0]}
        <span className="me">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="page-content">
      <h2 className="section-title reveal" ref={addRevealRef}>
        Research <span>Publications</span>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {publications.map((pub) => (
          <div key={pub.id} className="pub-card reveal" ref={addRevealRef}>
            <span className="pub-venue">
              📄 {pub.venue} · {pub.year}
            </span>
            <h3 className="pub-title">{pub.title}</h3>
            <p className="pub-authors">
              {highlightAuthor(pub.authors, pub.highlightAuthor)}
            </p>
            <p className="pub-abstract">{pub.abstract}</p>
            <a
              href={pub.arxivUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pub-link"
            >
              Read on arXiv <FaArrowRight />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicationsPage;

