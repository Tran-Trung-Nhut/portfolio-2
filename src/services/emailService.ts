import emailjs from 'emailjs-com';

export interface EmailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (payload: EmailPayload) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID || '';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || '';
  const userId = process.env.EMAILJS_USER_ID || '';

  if (!serviceId || !templateId || !userId) {
    throw new Error('MISSING_KEYS');
  }

  const templateParams = {
    from_name: payload.name,
    from_email: payload.email,
    subject: payload.subject,
    message: payload.message,
    to_name: 'Trần Trung Nhựt',
  };

  return await emailjs.send(serviceId, templateId, templateParams, userId);
};
