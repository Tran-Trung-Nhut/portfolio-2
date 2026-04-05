import { Link } from 'react-router-dom';
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { ORBIT_ICONS, socialLinks, contactInfo } from '../data/data';
import me from '../assets/me.png';

const Hero = () => {
  // Position icons evenly around orbit rings
  const ring1Icons = ORBIT_ICONS.slice(0, 4);
  const ring2Icons = ORBIT_ICONS.slice(4, 8);
  const ring3Icons = ORBIT_ICONS.slice(8, 12);

  const getIconPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = radius + radius * Math.cos(angle) - 21;
    const y = radius + radius * Math.sin(angle) - 21;
    return { left: `${x}px`, top: `${y}px` };
  };

  const R1 = 135, R2 = 175, R3 = 210;

  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />

      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting">// Hello, World!</p>

          <h1 className="hero-name">
            Trần Trung <span>Nhựt</span>
          </h1>

          <p className="hero-tagline">
            <span className="highlight">Backend Developer</span> &amp; Undergraduate Researcher at HCMUT – VNU-HCM.
            Passionate about building scalable systems, microservices, and clean API architecture.
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
            <Link to="/contact" className="btn-outline">
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

          <Link to="/contact" className="hero-freelance-banner">
            <span className="pulse-dot" />
            Available for freelance — Need a website? Let's build it together.
          </Link>
        </div>

        {/* Orbit animation */}
        <div className="hero-orbit-container">
          <div className="hero-portrait">
            <img src={me} alt="Trần Trung Nhựt" />
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
