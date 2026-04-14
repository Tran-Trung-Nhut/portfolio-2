import { ChatMessage } from "@/shared/interfaces";

export const fetchChatbotResponse = async (userQuery: string, history: ChatMessage[]): Promise<string> => {
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

    return data.message;
  } catch (error) {
    console.error('Chatbot Service Error:', error);
    return `I am having some issues right now 😔. Please try again later, or contact Nhựt directly through other channels on the [Contact page](/contact).`;
  }
};
