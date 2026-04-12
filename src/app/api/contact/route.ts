import { NextRequest, NextResponse } from 'next/server';

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

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

    if (!serviceId || !templateId || !userId || !private_key) {
      return NextResponse.json({ error: 'MISSING_KEYS' }, { status: 500 });
    }

    const providerResponse = await fetch(emailJsApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        accessToken: private_key,
        template_params: {
          from_name: name,
          from_email: email,
          subject,
          message,
          to_name: 'Trần Trung Nhựt',
        },
      }),
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
