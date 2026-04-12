'use client';
import { useEffect, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { experiences } from '../data/data';

const ExperiencePage = () => {
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
        Work <span>Experience</span>
      </h2>

      <div className="experience-timeline">
        {[...experiences].reverse().map((exp) => (
          <div key={exp.id} className="exp-item reveal" ref={addRevealRef}>
            <div className="exp-dot" />
            <div className="exp-card">
              <div className="exp-header">
                <div className="exp-logo">
                  <img src={exp.logo} alt={exp.company} />
                </div>
                <div>
                  <div className="exp-title">{exp.position}</div>
                  <div className="exp-company">{exp.company}</div>
                </div>
              </div>

              <div className="exp-meta">
                <span>
                  <FaCalendarAlt />
                  {exp.period.start} — {exp.period.end}
                </span>
                <span>
                  <FaMapMarkerAlt />
                  {exp.location.mode} · {exp.location.address}
                </span>
                <span
                  className={`exp-badge ${exp.type === 'Full-time' ? 'full-time' : 'internship'}`}
                >
                  {exp.type}
                </span>
              </div>

              <ul className="exp-highlights">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;

