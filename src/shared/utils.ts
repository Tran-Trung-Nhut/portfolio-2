type StorageArea = 'localStorage' | 'sessionStorage';

export const cleanText = (value: unknown) =>
  typeof value === 'string' ? value.normalize('NFC').replace(/\s+/g, ' ').trim() : '';

export const pickRandom = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const readStorage = (area: StorageArea, key: string) => {
  try {
    return window[area].getItem(key);
  } catch {
    return null;
  }
};

export const writeStorage = (area: StorageArea, key: string, value: string) => {
  try {
    window[area].setItem(key, value);
  } catch {
    return;
  }
};
