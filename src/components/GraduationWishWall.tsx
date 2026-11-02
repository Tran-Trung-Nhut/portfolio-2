'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { JoinButton, useGuestbook } from '@/components/GraduationGuestbook';

const LAYOUTS = [
  { query: '(min-width: 960px)', columns: 4, rows: 2 },
  { query: '(min-width: 561px)', columns: 3, rows: 2 },
  { query: 'all', columns: 1, rows: 3 },
];
const SWAP_EVERY_MS = 4500;
const FADE_MS = 600;

interface Slot {
  wishIndex: number;
  cell: number;
  style: CSSProperties;
  leaving: boolean;
}

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const between = (min: number, max: number) => (min + Math.random() * (max - min)).toFixed(1);
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const createSlot = (wishIndex: number, cell: number): Slot => ({
  wishIndex,
  cell,
  leaving: false,
  style: {
    justifySelf: pick(['start', 'center', 'end']),
    alignSelf: pick(['start', 'center', 'end']),
    '--tilt': `${between(-2.5, 2.5)}deg`,
    '--dx': `${between(-14, 14)}px`,
    '--dy': `${between(-12, 12)}px`,
    '--drift': `${between(5, 9)}s`,
  } as CSSProperties,
});

const pickHiddenWish = (slots: Slot[], pool: number[]) => {
  const shown = new Set(slots.map((slot) => slot.wishIndex));
  return pick(pool.filter((wishIndex) => !shown.has(wishIndex)));
};

const useLayout = () => {
  const [layout, setLayout] = useState(LAYOUTS[LAYOUTS.length - 1]);

  useEffect(() => {
    const update = () => setLayout(LAYOUTS.find(({ query }) => window.matchMedia(query).matches) ?? LAYOUTS[2]);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return layout;
};

const GraduationWishWall = () => {
  const { wishes, wallPool } = useGuestbook();
  const { columns, rows } = useLayout();
  const capacity = columns * rows;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const cells = shuffle(Array.from({ length: capacity }, (_, cell) => cell));
    setSlots(wallPool.slice(0, capacity).map((wishIndex, index) => createSlot(wishIndex, cells[index])));
  }, [wallPool, capacity]);

  useEffect(() => {
    if (!wishes || paused || wallPool.length <= capacity) return;

    const firstSwappable = wishes[0].mine ? 1 : 0;
    let fadeTimer: ReturnType<typeof setTimeout>;

    const swapTimer = setInterval(() => {
      const target = firstSwappable + Math.floor(Math.random() * (capacity - firstSwappable));
      setSlots((current) => current.map((slot, index) => (index === target ? { ...slot, leaving: true } : slot)));
      fadeTimer = setTimeout(() => {
        setSlots((current) =>
          current.map((slot, index) => (index === target ? createSlot(pickHiddenWish(current, wallPool), slot.cell) : slot))
        );
      }, FADE_MS);
    }, SWAP_EVERY_MS);

    return () => {
      clearInterval(swapTimer);
      clearTimeout(fadeTimer);
    };
  }, [wishes, wallPool, capacity, paused]);

  return (
    <section id="loi-chuc" className="grad-window grad-wall" aria-label="Lời chúc gửi Nhựt">
      <div className="grad-titlebar">
        <div className="grad-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span className="grad-filename">loi_chuc.log</span>
        {wishes && wishes.length > 0 && <span className="grad-wall-count">{wishes.length} lời chúc</span>}
      </div>

      <div
        className="grad-wall-sky"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {wishes === null && <p className="grad-wall-empty">Đang tải lời chúc…</p>}

        {wishes?.length === 0 && (
          <div className="grad-wall-empty">
            <p>{'// Chưa có lời chúc nào. Bạn hãy là người đầu tiên nhé!'}</p>
            <JoinButton />
          </div>
        )}

        {wishes && slots.map((slot, index) => {
          const wish = wishes[slot.wishIndex];
          if (!wish) return null;
          return (
            <figure
              key={`${index}-${slot.wishIndex}`}
              className={`grad-wish${slot.leaving ? ' is-leaving' : ''}${wish.mine ? ' is-mine' : ''}`}
              style={{ ...slot.style, gridColumn: (slot.cell % columns) + 1, gridRow: Math.floor(slot.cell / columns) + 1 }}
            >
              <div className="grad-wish-card">
                <blockquote title={wish.wish}>{wish.wish}</blockquote>
                <figcaption>— {wish.name}</figcaption>
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
};

export default GraduationWishWall;
