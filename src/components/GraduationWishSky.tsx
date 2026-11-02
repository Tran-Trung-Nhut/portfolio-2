'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useGuestbook } from '@/components/GraduationGuestbook';

const MAX_BUBBLES = 8;
const LANES = [0.15, 0.85, 0.4, 0.65];
const SIDE_DURATIONS = [40, 46];

const GraduationWishSky = () => {
  const { wishes, skyPool } = useGuestbook();
  const [shown, setShown] = useState<number[]>([]);
  const cursor = useRef(0);

  useEffect(() => {
    const count = Math.min(MAX_BUBBLES, skyPool.length);
    cursor.current = count;
    setShown(skyPool.slice(0, count));
  }, [skyPool]);

  if (!wishes || shown.length === 0) return null;

  const showNextWish = (bubble: number) => {
    if (skyPool.length <= shown.length) return;
    let next = cursor.current;
    while (shown.includes(skyPool[next % skyPool.length])) next += 1;
    cursor.current = next + 1;
    setShown(shown.map((wishIndex, index) => (index === bubble ? skyPool[next % skyPool.length] : wishIndex)));
  };

  return (
    <div className="grad-sky" aria-hidden="true">
      {shown.map((wishIndex, index) => {
        const side = index % 2;
        const order = Math.floor(index / 2);
        const sideCount = Math.ceil((shown.length - side) / 2);
        const duration = SIDE_DURATIONS[side];
        const wish = wishes[wishIndex];
        if (!wish) return null;
        const style = {
          '--lane': LANES[order % LANES.length],
          '--sway': `${order % 2 ? -16 : 16}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${-(order / sideCount) * duration}s`,
        } as CSSProperties;

        return (
          <figure
            key={index}
            className={`grad-sky-wish ${side ? 'is-right' : 'is-left'}${wish.mine ? ' is-mine' : ''}`}
            style={style}
            onAnimationIteration={() => showNextWish(index)}
          >
            <blockquote>{wish.wish}</blockquote>
            <figcaption>— {wish.name}</figcaption>
          </figure>
        );
      })}
    </div>
  );
};

export default GraduationWishSky;
