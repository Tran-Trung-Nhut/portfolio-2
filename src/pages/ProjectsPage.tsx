'use client';
import { useEffect, useRef } from 'react';
import { FaGithub, FaExternalLinkAlt, FaYoutube, FaCode } from 'react-icons/fa';
import { projects } from '../data/data';

const ProjectsPage = () => {
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
        My <span>Projects</span>
      </h2>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', marginTop: '-1.5rem', fontSize: '1.0625rem' }}>
        Real client projects I've built as a freelance developer.
      </p>

      {projects.map((project) => (
        <div key={project.id} className="project-featured reveal" ref={addRevealRef}>
          {project.image ? (
            <div className="project-featured-image">
              <img src={project.image} alt={project.title} />
            </div>
          ) : (
            <div className="project-featured-placeholder">
              <FaCode />
            </div>
          )}

          <div className="project-featured-body">
            <h3 className="project-featured-title">{project.title}</h3>
            <p className="project-featured-desc">{project.description}</p>

            <div className="project-card-techs">
              {project.techs.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>

            <div className="project-card-links">
              {project.repoUrl.length > 0 && (
                <a
                  href={project.repoUrl[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub /> Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube /> Video
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsPage;

