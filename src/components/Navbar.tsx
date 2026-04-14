'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { navItems } from '@/shared/constants';
import logoPrimary from '@/assets/logo.svg';
import logoAlt from '@/assets/logo.alt.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAlt, setIsAlt] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAlt((prev) => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className={`nav-logo ${isAlt ? 'swapped' : ''}`}>
          <Image src={logoPrimary} alt="nhut.dev logo" className="nav-logo-img nav-logo-primary" priority />
          <Image src={logoAlt} alt="nhut.dev logo" className="nav-logo-img nav-logo-alt" priority />
        </Link>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
