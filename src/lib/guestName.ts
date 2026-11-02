import 'server-only';
import { NAME_MAX_LENGTH } from '@/shared/graduationConfig';

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

const PROMPT = `You check what a guest typed when asked "Bạn là ai?" ("Who are you?") on a Vietnamese graduation invitation.
Reply with exactly one word: YES or NO.

YES if it is a plausible Vietnamese personal name:
- a full name, a given name alone, or the parts in any order, with or without diacritics: "Trần Trung Nhựt", "Nhựt", "Nhựt Trần", "Trung Nhựt", "nhut"
- a name with a kinship word, or a family: "Anh Ba", "Chị Lan", "Cô Hạnh", "Gia đình chú Tư"
- a common Vietnamese nickname: "Bé Na", "Tí", "Bin"

NO for anything else: random letters or keyboard mashing ("asdf", "aaaa", "hjkl"), ordinary words or sentences that are not a name ("con mèo", "xin chào", "không biết"), insults, profanity or jokes.`;

export const normalizeName = (value: unknown) =>
  typeof value === 'string' ? value.normalize('NFC').replace(/\s+/g, ' ').trim() : '';

const askModel = async (name: string): Promise<boolean | null> => {
  const apiUrl = process.env.GROQ_API_URL?.trim() || '';
  const apiKey = process.env.GROQ_API_KEY?.trim() || '';
  const model = process.env.GROQ_MODEL?.trim() || '';
  if (!apiUrl || !apiKey || !model) return null;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 400,
        messages: [
          { role: 'system', content: PROMPT },
          { role: 'user', content: name },
        ],
      }),
    });
    if (!response.ok) return null;

    const data = await response.json();
    const content = String(data?.choices?.[0]?.message?.content ?? '').replace(/<think>[\s\S]*?<\/think>/g, '');
    const answer = content.toUpperCase().match(/\b(YES|NO)\b/g)?.pop();
    return answer ? answer === 'YES' : null;
  } catch {
    return null;
  }
};

export const isGuestName = async (name: string) => {
  if (!name || Array.from(name).length > NAME_MAX_LENGTH || !NAME_PATTERN.test(name)) return false;
  return (await askModel(name)) ?? true;
};
