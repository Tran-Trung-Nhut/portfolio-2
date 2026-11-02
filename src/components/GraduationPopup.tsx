'use client';

import { useEffect, useState, type AnimationEvent, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaGraduationCap, FaTimes } from 'react-icons/fa';

const STORAGE_KEY = 'graduation-popup-dismissed';
const SHOW_DELAY_MS = 1800;

type PopupStatus = 'hidden' | 'open' | 'closing';

const isDismissed = () => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const rememberDismissed = () => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    return;
  }
};

const GraduationPopup = () => {
  const [status, setStatus] = useState<PopupStatus>('hidden');

  useEffect(() => {
    if (isDismissed()) return;
    const timer = setTimeout(() => setStatus('open'), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    rememberDismissed();
    setStatus('closing');
  };

  const handleOpenPage = () => {
    rememberDismissed();
    setStatus('hidden');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') close();
  };

  const handleAnimationEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && status === 'closing') setStatus('hidden');
  };

  if (status === 'hidden') return null;

  return (
    <aside
      className={`grad-popup ${status === 'closing' ? 'closing' : ''}`}
      aria-label="Graduation announcement"
      onKeyDown={handleKeyDown}
      onAnimationEnd={handleAnimationEnd}
    >
      <Link href="/graduation" className="grad-popup-link" onClick={handleOpenPage}>
        <span className="grad-popup-icon" aria-hidden="true">
          <FaGraduationCap />
        </span>
        <span className="grad-popup-body">
          <span className="grad-popup-eyebrow">
            <span className="grad-popup-dot" aria-hidden="true" />
            just_graduated
          </span>
          <strong className="grad-popup-title">I&apos;ve officially graduated!</strong>
          <span className="grad-popup-text">B.Sc. in Computer Science · HCMUT</span>
          <span className="grad-popup-cta">
            Celebrate with me <FaArrowRight aria-hidden="true" />
          </span>
        </span>
      </Link>
      <button type="button" className="grad-popup-close" aria-label="Dismiss" onClick={close}>
        <FaTimes />
      </button>
    </aside>
  );
};

export default GraduationPopup;
