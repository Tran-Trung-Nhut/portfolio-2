import { NextRequest, NextResponse } from 'next/server';
import { ContactRequestBody, EmailJsSendPayload } from '@/shared/interfaces';

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactRequestBody;
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !subject || !message || !isValidEmail(email)) {
      return NextResponse.json({ error: 'INVALID_PAYLOAD' }, { status: 400 });
    }

    const serviceId = process.env.EMAILJS_SERVICE_ID?.trim() || '';
    const templateId = process.env.EMAILJS_TEMPLATE_ID?.trim() || '';
    const userId = process.env.EMAILJS_USER_ID?.trim() || '';
    const private_key = process.env.EMAILJS_PRIVATE_KEY?.trim() || '';
    const emailJsApiUrl = process.env.EMAILJS_API_URL?.trim() || '';

    if (!serviceId || !templateId || !userId || !private_key || !emailJsApiUrl) {
      return NextResponse.json({ error: 'MISSING_KEYS' }, { status: 500 });
    }

    const templateParams: Record<string, string> = {
      name,
      from_name: name,
      email,
      from_email: email,
      reply_to: email,
      to_email: email,
      user_email: email,
      subject,
      message,
      to_name: 'Trần Trung Nhựt',
      time: new Date().toISOString(),
    };

    const sendTemplate = async (payload: EmailJsSendPayload) => {
      return fetch(emailJsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    };

    const providerResponse = await sendTemplate({
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      accessToken: private_key,
      template_params: templateParams,
    });

    if (!providerResponse.ok) {
      const providerError = await providerResponse.text().catch(() => 'Unknown EmailJS error');
      console.error('EmailJS API Error:', providerError);
      return NextResponse.json({ error: 'PROVIDER_ERROR' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API route error:', error);
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
