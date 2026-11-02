import { GuestResponsePayload } from '@/shared/interfaces';
import { GraduationWish } from '@/shared/types';

const postJson = (url: string, body: object) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const checkGuestName = async (name: string) => {
  const response = await postJson('/api/graduation/name', { name });
  if (!response.ok) throw new Error('NAME_CHECK_FAILED');
  const data = await response.json();
  return data?.valid === true;
};

export const sendGuestResponse = async (payload: GuestResponsePayload) => {
  const response = await postJson('/api/graduation/wishes', payload);
  if (!response.ok) throw new Error('SEND_FAILED');
};

export const fetchWishes = async (): Promise<GraduationWish[]> => {
  try {
    const response = await fetch('/api/graduation/wishes');
    const data = await response.json();
    return Array.isArray(data?.wishes) ? data.wishes : [];
  } catch {
    return [];
  }
};
