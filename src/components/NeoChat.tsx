'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import NeoAsis from '@/components/NeoAsis';
import { NeoMood } from '@/shared/types';

export const NeoChatMascot = ({ mood, className }: { mood: NeoMood; className: string }) => (
  <div key={mood} className={`neo-chat-mascot ${className}`}>
    <NeoAsis mood={mood} />
  </div>
);

export const NeoChatHeader = ({
  status,
  closeLabel,
  onClose,
  titleId,
  className = '',
}: {
  status: string;
  closeLabel: string;
  onClose: () => void;
  titleId?: string;
  className?: string;
}) => (
  <header className={`neo-chat-header ${className}`}>
    <h2 id={titleId} className="neo-chat-name">Neo Asis</h2>
    <p className="neo-chat-status">
      <span className="neo-chat-dot" aria-hidden="true" />
      {status}
    </p>
    <button type="button" className="neo-chat-close" aria-label={closeLabel} onClick={onClose}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </button>
  </header>
);

export const NeoChatLog = ({
  label,
  scrollKey,
  follow = true,
  children,
}: {
  label: string;
  scrollKey: string;
  follow?: boolean;
  children: ReactNode;
}) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (follow) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
    else log.scrollTop = 0;
  }, [scrollKey, follow]);

  return (
    <div ref={logRef} className="neo-chat-log" role="log" aria-live="polite" aria-label={label}>
      {children}
    </div>
  );
};

export const NeoChatTyping = ({ label }: { label: string }) => (
  <div className="neo-chat-bubble is-assistant is-typing" role="status" aria-label={label}>
    <span /><span /><span />
  </div>
);

export const NeoChatSend = ({ label, disabled }: { label: string; disabled: boolean }) => (
  <button type="submit" className="neo-chat-send" aria-label={label} disabled={disabled}>
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);
