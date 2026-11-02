'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import GraduationJoinDialog from '@/components/GraduationJoinDialog';
import { fetchWishes } from '@/services/graduationService';
import { GraduationGuestbookProps } from '@/shared/interfaces';
import { GraduationWish } from '@/shared/types';

interface GuestbookContextValue {
  wishes: GraduationWish[] | null;
  skyPool: number[];
  wallPool: number[];
  openJoin: () => void;
}

const SKY_QUERY = '(min-width: 1600px) and (prefers-reduced-motion: no-preference)';

const GuestbookContext = createContext<GuestbookContextValue | null>(null);

export const useGuestbook = () => {
  const context = useContext(GuestbookContext);
  if (!context) throw new Error('useGuestbook must be used inside GraduationGuestbook');
  return context;
};

export const JoinButton = () => {
  const { openJoin } = useGuestbook();
  return (
    <button type="button" className="grad-btn grad-btn-primary" onClick={openJoin}>
      Tham gia
    </button>
  );
};

const GraduationGuestbook = ({ invite, children }: GraduationGuestbookProps) => {
  const [wishes, setWishes] = useState<GraduationWish[] | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [skyActive, setSkyActive] = useState(false);

  useEffect(() => {
    fetchWishes().then((loaded) => setWishes((current) => [...(current ?? []), ...loaded]));
  }, []);

  useEffect(() => {
    const media = window.matchMedia(SKY_QUERY);
    const update = () => setSkyActive(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const { skyPool, wallPool } = useMemo(() => {
    const all = (wishes ?? []).map((_, index) => index);
    if (!skyActive) return { skyPool: [], wallPool: all };
    return {
      skyPool: all.filter((index) => index % 2 === 1),
      wallPool: all.filter((index) => index % 2 === 0),
    };
  }, [wishes, skyActive]);

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const addWish = useCallback((wish: GraduationWish) => {
    setWishes((current) => [{ ...wish, mine: true }, ...(current ?? [])]);
  }, []);

  return (
    <GuestbookContext.Provider value={{ wishes, skyPool, wallPool, openJoin }}>
      {children}
      <GraduationJoinDialog open={joinOpen} invite={invite} onClose={closeJoin} onWish={addWish} />
    </GuestbookContext.Provider>
  );
};

export default GraduationGuestbook;
