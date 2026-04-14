import { EmailPayload } from "@/shared/interfaces";

export const sendContactEmail = async (payload: EmailPayload) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorCode = 'SEND_FAILED';
    try {
      const data = await response.json();
      if (typeof data?.error === 'string' && data.error.trim().length > 0) {
        errorCode = data.error;
      }
    } catch {
    }
    throw new Error(errorCode);
  }

  return response.json();
};
