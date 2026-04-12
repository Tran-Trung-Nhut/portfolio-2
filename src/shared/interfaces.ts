export interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface EmailJsSendPayload {
  service_id: string;
  template_id: string;
  user_id: string;
  accessToken: string;
  template_params: Record<string, string>;
}