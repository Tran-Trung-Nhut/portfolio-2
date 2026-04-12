import { useMemo } from 'react';
import Link from 'next/link';
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { ORBIT_ICONS, TECH_STACK, socialLinks, contactInfo, personalInfo } from '../data/data';
import me from '../assets/me.png';

const GALAXY_POSITIONS = [
  { left: '6%', top: '18%', size: '38px', delay: '0s', duration: '12s' },
  { left: '14%', top: '38%', size: '48px', delay: '2s', duration: '16s' },
  { left: '8%', top: '65%', size: '34px', delay: '1s', duration: '14s' },
  { left: '18%', top: '82%', size: '42px', delay: '3s', duration: '18s' },
  { left: '88%', top: '22%', size: '46px', delay: '1.5s', duration: '15s' },
  { left: '82%', top: '42%', size: '36px', delay: '0.5s', duration: '13s' },
  { left: '92%', top: '68%', size: '52px', delay: '2.5s', duration: '17s' },
  { left: '84%', top: '88%', size: '40px', delay: '4s', duration: '19s' },
  { left: '38%', top: '10%', size: '32px', delay: '1.2s', duration: '14s' },
  { left: '62%', top: '15%', size: '44px', delay: '3.5s', duration: '16s' },
  { left: '35%', top: '90%', size: '38px', delay: '2.8s', duration: '15s' },
  { left: '65%', top: '92%', size: '48px', delay: '0.8s', duration: '13s' },
  { left: '10%', top: '50%', size: '32px', delay: '4.5s', duration: '20s' },
  { left: '86%', top: '55%', size: '38px', delay: '2.2s', duration: '15s' },
  { left: '46%', top: '22%', size: '45px', delay: '1.8s', duration: '14s' },
  { left: '55%', top: '80%', size: '40px', delay: '3.2s', duration: '17s' },
  { left: '26%', top: '26%', size: '36px', delay: '0.2s', duration: '13s' },
  { left: '74%', top: '78%', size: '46px', delay: '2.9s', duration: '18s' },
  { left: '50%', top: '8%', size: '34px', delay: '1.1s', duration: '12s' }
];

const Hero = () => {
  // Position icons evenly around orbit rings
  const ring1Icons = ORBIT_ICONS.slice(0, 4);
  const ring2Icons = ORBIT_ICONS.slice(4, 8);
  const ring3Icons = ORBIT_ICONS.slice(8, 12);

  // Background stars for large screens
  const galaxyIcons = useMemo(() => {
    const remaining = TECH_STACK.filter(t => !ORBIT_ICONS.some(o => o.name === t.name));
    return remaining.map((tech, i) => ({
      tech,
      pos: GALAXY_POSITIONS[i % GALAXY_POSITIONS.length]
    }));
  }, []);

  const getIconPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = radius + radius * Math.cos(angle) - 21;
    const y = radius + radius * Math.sin(angle) - 21;
    return { left: `${x}px`, top: `${y}px` };
  };

  const R1 = 135, R2 = 175, R3 = 210;

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="galaxy-container">
          {galaxyIcons.map(({ tech, pos }) => (
            <div
              key={`galaxy-${tech.name}`}
              className="galaxy-star-wrapper"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration
              }}
            >
              <div 
                className="galaxy-star"
                style={{ width: pos.size, height: pos.size }}
                title={tech.name}
              >
                <tech.icon color={tech.color} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting">{personalInfo.greeting}</p>

          <h1 className="hero-name">
            {personalInfo.firstName} <span>{personalInfo.lastName}</span>
          </h1>

          <p className="hero-tagline">
            <span className="highlight">{personalInfo.role}</span>{personalInfo.tagline}
          </p>

          <div className="hero-cta">
            <a
              href={contactInfo.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <FaDownload /> Download CV
            </a>
            <Link href="/contact" className="btn-outline">
              <FaEnvelope /> Get in Touch
            </Link>
          </div>

          <div className="hero-social">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>

          <Link href="/contact" className="hero-freelance-banner">
            <span className="pulse-dot" />
            Need a website? Let's build it together.
          </Link>
        </div>

        {/* Orbit animation */}
        <div className="hero-orbit-container">
          <div className="hero-portrait">
            <img src={me.src} alt="Trần Trung Nhựt" />
          </div>

          {/* Ring 1 */}
          <div className="orbit-ring orbit-ring-1">
            {ring1Icons.map((tech, i) => (
              <div
                key={tech.name}
                className="orbit-icon"
                style={getIconPosition(i, ring1Icons.length, R1)}
                title={tech.name}
              >
                <tech.icon color={tech.color} />
              </div>
            ))}
          </div>

          {/* Ring 2 */}
          <div className="orbit-ring orbit-ring-2">
            {ring2Icons.map((tech, i) => (
              <div
                key={tech.name}
                className="orbit-icon"
                style={getIconPosition(i, ring2Icons.length, R2)}
                title={tech.name}
              >
                <tech.icon color={tech.color} />
              </div>
            ))}
          </div>

          {/* Ring 3 */}
          <div className="orbit-ring orbit-ring-3">
            {ring3Icons.map((tech, i) => (
              <div
                key={tech.name}
                className="orbit-icon"
                style={getIconPosition(i, ring3Icons.length, R3)}
                title={tech.name}
              >
                <tech.icon color={tech.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
