'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import NeoAsis from '@/components/NeoAsis';
import { fetchChatbotResponse } from '@/services/chatbotService';
import { FALLBACK_MESSAGE } from '@/shared/constants';
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
  smug: 'Hmm…',
};

const ChatbotWindow = ({ isOpen, onClose, isOnline }: ChatbotWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState<NeoMood>('greet');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (messages.length === 0 && !isLoading) log.scrollTop = 0;
    else log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !isOnline || isLoading) return;

    const history = messages;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsLoading(true);
    setMood('think');

    const reply = await fetchChatbotResponse(text, history);

    setIsLoading(false);
    setMood(reply === FALLBACK_MESSAGE ? 'sorry' : 'answer');
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
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
      <div key={currentMood} className="neo-chat-mascot chatbot-mascot">
        <NeoAsis mood={currentMood} />
      </div>

      <div className="neo-chat-card chatbot-card">
        <header className="neo-chat-header chatbot-header">
          <h2 className="neo-chat-name">Neo Asis</h2>
          <p className="neo-chat-status">
            <span className="neo-chat-dot" aria-hidden="true" />
            {isOnline ? STATUS[currentMood] : 'Offline'}
          </p>
          <button type="button" className="neo-chat-close" onClick={onClose} aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div ref={logRef} className="neo-chat-log chatbot-log" role="log" aria-live="polite">
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

          {isLoading && (
            <div className="neo-chat-bubble is-assistant is-typing" role="status" aria-label="Neo Asis is typing">
              <span /><span /><span />
            </div>
          )}
        </div>

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
            <button type="submit" className="neo-chat-send" aria-label="Send" disabled={!isOnline || isLoading || !inputValue.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatbotWindow;
