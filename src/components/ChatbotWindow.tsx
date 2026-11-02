'use client';

import { useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { NeoChatHeader, NeoChatLog, NeoChatMascot, NeoChatSend, NeoChatTyping } from '@/components/NeoChat';
import { fetchChatbotResponse } from '@/services/chatbotService';
import { nunito } from '@/shared/fonts';
import { ChatMessage } from '@/shared/interfaces';
import { NeoMood } from '@/shared/types';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

const SUGGESTIONS = [
  "What are his AI projects and tech stack?",
  "What are his programming skills and frameworks?",
  "Tell me about his research",
  "Where does he study?",
  "What is his work experience?",
  "How can I contact him?"
];

const STATUS: Record<NeoMood, string> = {
  greet: 'Online · ready to chat',
  think: 'Thinking…',
  answer: 'Here’s what I found',
  happy: 'Happy to help!',
  sorry: 'Having a little trouble…',
  smug: 'Hmm… really?',
};

const ChatbotWindow = ({ isOpen, onClose, isOnline }: ChatbotWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<NeoMood>('greet');

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !isOnline || isLoading) return;

    const history = messages;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsLoading(true);
    setMood('think');

    const reply = await fetchChatbotResponse(text, history);

    setIsLoading(false);
    setMood(reply.mood);
    setMessages(prev => [...prev, { role: 'assistant', content: reply.message }]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const currentMood = isOnline ? mood : 'sorry';

  return (
    <section
      className={`chatbot-window neo-chat ${nunito.className} ${isOpen ? 'open' : ''}`}
      aria-label="Chat with Neo Asis"
      inert={!isOpen}
    >
      <NeoChatMascot mood={currentMood} className="chatbot-mascot" />

      <div className="neo-chat-card chatbot-card">
        <NeoChatHeader
          className="chatbot-header"
          status={isOnline ? STATUS[currentMood] : 'Offline'}
          closeLabel="Close chat"
          onClose={onClose}
        />

        <NeoChatLog label="Chat with Neo Asis" scrollKey={`${messages.length}-${isLoading}-${isOpen}`} follow={messages.length > 0 || isLoading}>
          <div className="neo-chat-bubble is-assistant chatbot-markdown">
            {isOnline ? (
              <>
                <p>Hi! I&apos;m <strong>Neo Asis</strong>, Nhựt&apos;s AI assistant 👋 Ask me anything about his <strong>skills</strong>, <strong>projects</strong>, or <strong>background</strong>!</p>
                <p className="chatbot-tip">💡 Tip: Using English yields the best and quickest responses!</p>
              </>
            ) : (
              <p>I am currently offline. Please come back later!</p>
            )}
          </div>

          {isOnline && messages.length === 0 && (
            <div className="chatbot-suggestions">
              <p className="chatbot-suggestions-label">Suggested topics</p>
              <div className="chatbot-suggestions-list">
                {SUGGESTIONS.map((text) => (
                  <button key={text} type="button" className="chatbot-suggestion" onClick={() => handleSendMessage(text)}>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            msg.role === 'user' ? (
              <p key={idx} className="neo-chat-bubble is-user">{msg.content}</p>
            ) : (
              <div key={idx} className="neo-chat-bubble is-assistant chatbot-markdown">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )
          ))}

          {isLoading && <NeoChatTyping label="Neo Asis is typing" />}
        </NeoChatLog>

        <div className="neo-chat-composer">
          <form className="neo-chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="neo-chat-field"
              placeholder={isOnline ? 'Ask Neo Asis anything…' : 'Chat is currently offline…'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isOnline || isLoading}
              aria-label="Message Neo Asis"
            />
            <NeoChatSend label="Send" disabled={!isOnline || isLoading || !inputValue.trim()} />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatbotWindow;
