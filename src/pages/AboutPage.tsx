import { useEffect, useRef } from 'react';
import { FaMusic, FaCamera, FaRunning, FaGamepad } from 'react-icons/fa';
import { GiShuttlecock } from 'react-icons/gi';

const AboutPage = () => {
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
          <p>
            Hi! I'm <span className="emphasis">Trần Trung Nhựt</span>, a final-year Computer Science student
            at <span className="emphasis">Ho Chi Minh City University of Technology (HCMUT – VNU-HCM)</span>.
            I was born and raised in Dong Thap Province, Vietnam.
          </p>
          <p>
            I'm currently working as a <span className="emphasis">Backend Developer at Nexon Dev Vina</span>,
            where I build and maintain backend services. My focus areas include API development,
            microservices architecture, and database optimization.
          </p>
          <p>
            Beyond work, I'm an undergraduate researcher with a published paper at <span className="emphasis">ICSA 2026</span>
            — exploring how Small Language Models reason about software architecture.
          </p>
          <p>
            I also work as a <span className="emphasis">freelance developer</span>, helping businesses build
            professional websites and web applications. From <span className="emphasis">WordPress CMS</span> solutions
            to custom backends deployed on <span className="emphasis">AWS</span>, I combine my engineering skills
            with <span className="emphasis">AI-powered tools</span> to deliver modern, high-quality web experiences at speed.
          </p>
          <p>
            When I'm not coding, you'll find me playing badminton, strumming my guitar,
            singing, running, or watching traveling vlogs and superhero movies.
          </p>

          <div className="about-hobbies">
            <span className="hobby-tag"><GiShuttlecock /> Badminton</span>
            <span className="hobby-tag"><FaMusic /> Music & Guitar</span>
            <span className="hobby-tag"><FaCamera /> Photography</span>
            <span className="hobby-tag"><FaRunning /> Running</span>
            <span className="hobby-tag"><FaGamepad /> Movies</span>
          </div>
        </div>

        <div className="about-stats reveal" ref={addRevealRef}>
          <div className="stat-card">
            <div className="stat-number">3+</div>
            <div className="stat-label">Years Coding</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1</div>
            <div className="stat-label">Projects Built</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1</div>
            <div className="stat-label">Research Paper</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Companies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
