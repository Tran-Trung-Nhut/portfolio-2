import { ChatMessage, ChatbotReply } from "@/shared/interfaces";
import { CHATBOT_MOODS, FALLBACK_MESSAGE } from "@/shared/constants";

const FALLBACK_REPLY: ChatbotReply = { message: FALLBACK_MESSAGE, mood: 'sorry' };

export const fetchChatbotResponse = async (userQuery: string, history: ChatMessage[]): Promise<ChatbotReply> => {
  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userQuery,
        history,
      })
    });

    if (!response.ok) {
      throw new Error('Chatbot API call failed.');
    }

    const data = await response.json();
    if (typeof data?.message !== 'string' || data.message.length === 0) {
      throw new Error('Invalid chatbot response payload.');
    }
    if (data.message === FALLBACK_MESSAGE) return FALLBACK_REPLY;

    return { message: data.message, mood: CHATBOT_MOODS.find((mood) => mood === data.mood) ?? 'answer' };
  } catch (error) {
    console.error('Chatbot Service Error:', error);
    return FALLBACK_REPLY;
  }
};
