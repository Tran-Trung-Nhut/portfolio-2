'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub,
  FaLinkedin, FaFacebook, FaInstagram, FaTiktok, FaPaperPlane
} from 'react-icons/fa';
import { FaEarthAsia } from 'react-icons/fa6';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendContactEmail } from '@/services/emailService';
import { ContactPageProps } from '@/shared/interfaces';

const ContactPage = ({ profile, freelanceServices }: ContactPageProps) => {
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all fields.');
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address.", { autoClose: 4000 });
      return;
    }

    setSending(true);

    try {
      await sendContactEmail(formData);
      toast.success("Your message was sent successfully. Thank you for reaching out!", { autoClose: 5000 });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error("Failed to send the message due to a server error. Please try again later or contact me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-content">
      <ToastContainer theme="dark" position="bottom-right" />

      <h2 className="section-title reveal" ref={addRevealRef}>
        Get in <span>Touch</span>
      </h2>

      <div className="contact-grid reveal" ref={addRevealRef}>
        {/* Left: contact info */}
        <div className="contact-info-section">
          <h3>Contact Information</h3>

          <div className="contact-info-item">
            <div className="contact-info-icon"><FaEnvelope /></div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">{profile.email}</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><FaEnvelope /></div>
            <div>
              <div className="contact-info-label">Academic Email</div>
              <div className="contact-info-value">{profile.academic_email}</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><FaPhone /></div>
            <div>
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">{profile.phone}</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><FaMapMarkerAlt /></div>
            <div>
              <div className="contact-info-label">Location</div>
              <div className="contact-info-value">{profile.location}</div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon"><FaEarthAsia /></div>
            <div>
              <div className="contact-info-label">Languages</div>
              <div className="contact-info-value">{profile.languages}</div>
            </div>
          </div>

          <div className="contact-social">
            {profile.github_url && <a href={profile.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>}
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>}
            {profile.facebook_url && <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>}
            {profile.instagram_url && <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>}
            {profile.tiktok_url && <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>}
          </div>
        </div>

        {/* Right: Contact form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send me a message</h3>
          <div className="form-group">
            <label htmlFor="contact-name">Your Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Your Email</label>
            <input
              id="contact-email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="E.g., Freelance Project Inquiry"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              placeholder="Tell me about your project..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn-primary" disabled={sending}>
              <FaPaperPlane /> {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Freelance Section */}
      <div className="freelance-section reveal" ref={addRevealRef}>
        <h3 className="freelance-title">Available for Freelance ✨</h3>
        <p className="freelance-subtitle">
          Looking for a developer to bring your idea to life? I offer the following services:
        </p>

        <div className="freelance-grid">
          {freelanceServices.map((service, i) => (
            <div key={i} className="freelance-card">
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

