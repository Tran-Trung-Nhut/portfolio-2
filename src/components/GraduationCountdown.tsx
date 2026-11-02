'use client';

import { useEffect, useState } from 'react';
import { GraduationCountdownProps } from '@/shared/interfaces';

const SECOND = 1000;

const pad = (value: number) => String(value).padStart(2, '0');

const getParts = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / SECOND));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

const GraduationCountdown = ({ start, end, initialNow, className = '' }: GraduationCountdownProps) => {
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current < end) timer = setTimeout(tick, SECOND - (current % SECOND) + 20);
    };
    tick();
    return () => clearTimeout(timer);
  }, [end]);

  if (now >= end) return null;

  if (now >= start) {
    return (
      <div className={`grad-countdown is-live ${className}`} role="status">
        <span className="grad-countdown-label">
          <span className="grad-countdown-dot" aria-hidden="true" />
          TRẠNG THÁI
        </span>
        <p className="grad-countdown-value">
          <span className="grad-countdown-live">Buổi lễ đang diễn ra</span>
        </p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = getParts(start - now);
  const label = `Còn ${days} ngày ${hours} giờ ${minutes} phút tới buổi lễ`;

  return (
    <div className={`grad-countdown ${className}`} role="timer" aria-label={label}>
      <span className="grad-countdown-label" aria-hidden="true">ĐẾM NGƯỢC</span>
      <p className="grad-countdown-value" aria-hidden="true">
        <span className="grad-countdown-word">Còn</span>
        {days > 0 && (
          <>
            <span className="grad-countdown-num">{days}</span>
            <span className="grad-countdown-word">ngày</span>
          </>
        )}
        <span className="grad-countdown-num">
          {pad(hours)}
          <span className="grad-countdown-colon">:</span>
          {pad(minutes)}
          <span className="grad-countdown-colon">:</span>
          {pad(seconds)}
        </span>
      </p>
    </div>
  );
};

export default GraduationCountdown;
