'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import GraduationJoinDialog from '@/components/GraduationJoinDialog';
import { fetchWishes } from '@/services/graduationService';
import { GraduationGuestbookProps } from '@/shared/interfaces';
import { GraduationWish } from '@/shared/types';

interface GuestbookContextValue {
  wishes: GraduationWish[] | null;
  openJoin: () => void;
}

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

const GraduationGuestbook = ({ guestName, children }: GraduationGuestbookProps) => {
  const [wishes, setWishes] = useState<GraduationWish[] | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    fetchWishes().then((loaded) => setWishes((current) => [...(current ?? []), ...loaded]));
  }, []);

  const openJoin = useCallback(() => setJoinOpen(true), []);
  const closeJoin = useCallback(() => setJoinOpen(false), []);
  const addWish = useCallback((wish: GraduationWish) => {
    setWishes((current) => [{ ...wish, mine: true }, ...(current ?? [])]);
  }, []);

  return (
    <GuestbookContext.Provider value={{ wishes, openJoin }}>
      {children}
      <GraduationJoinDialog open={joinOpen} guestName={guestName} onClose={closeJoin} onWish={addWish} />
    </GuestbookContext.Provider>
  );
};

export default GraduationGuestbook;
