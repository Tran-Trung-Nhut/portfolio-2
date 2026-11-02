import { GuestResponsePayload } from '@/shared/interfaces';
import { GraduationWish, GuestReview } from '@/shared/types';

const postJson = (url: string, body: object) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const checkGuestName = async (name: string): Promise<GuestReview> => {
  const response = await postJson('/api/graduation/name', { name });
  if (!response.ok) throw new Error('NAME_CHECK_FAILED');
  const data = await response.json();
  return { valid: data?.valid === true, reply: typeof data?.reply === 'string' ? data.reply : '' };
};

export const sendGuestResponse = async (payload: GuestResponsePayload): Promise<GuestReview> => {
  const response = await postJson('/api/graduation/wishes', payload);
  if (response.status === 422) {
    const data = await response.json();
    return { valid: false, reply: typeof data?.reply === 'string' ? data.reply : '' };
  }
  if (!response.ok) throw new Error('SEND_FAILED');
  return { valid: true, reply: '' };
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
