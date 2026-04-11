import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { fetchChatbotResponse } from '../services/chatbotService';
import type { ChatMessage } from '../services/chatbotService';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

const ChatbotWindow = ({ isOpen, onClose, isOnline }: ChatbotWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What are his AI projects and tech stack?",
    "What are his programming skills and frameworks?",
    "Tell me about his research",
    "What is his university and GPA?",
    "Does he have any activities or awards?",
    "Does he have any professional certificates?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !isOnline) return;
    
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const historySnapshot = [...messages]; // capture history before sending this new one
    
    // Call the Groq service
    const botReplyContent = await fetchChatbotResponse(text, historySnapshot);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'assistant', content: botReplyContent }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <div className="chatbot-header-icon">
            <FaRobot />
          </div>
          <div className="chatbot-header-info">
            <h3>Nhựt's Assistant</h3>
            <span className={`online-status ${!isOnline ? 'offline' : ''}`}>
              <span className={`dot ${!isOnline ? 'offline' : ''}`}></span> {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <button className="chatbot-close" onClick={onClose} aria-label="Close Chat">
          <FaTimes />
        </button>
      </div>

      <div className="chatbot-body">
        {/* Default Welcome Message */}
        <div className="chatbot-message bot-message">
          <p>
            {isOnline 
              ? <>Hi! I'm Nhựt's AI assistant 👋 Ask me anything about his <strong>skills</strong>, <strong>projects</strong>, or <strong>background</strong>!</>
              : "I am currently offline. Please come back later!"
            }
          </p>
        </div>

        {/* Suggested Topics - visible only if online and no messages yet */}
        {isOnline && messages.length === 0 && (
          <div className="chatbot-onboarding">
            <p className="chatbot-topics-label">SUGGESTED TOPICS</p>
            <div className="chatbot-topics-container">
              {suggestions.map((text, i) => (
                <button 
                  key={i} 
                  className="chatbot-suggestion-pill"
                  onClick={() => handleSendMessage(text)}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Message History */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}>
            {msg.role === 'user' ? (
               <p>{msg.content}</p>
            ) : (
               <div className="bot-content markdown-body">
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
               </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="chatbot-message bot-message typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-footer">
        <div className={`chatbot-input-container ${!isOnline ? 'disabled' : ''}`}>
          <input 
            type="text" 
            placeholder={isOnline ? "Ask a question..." : "Chat is currently offline..."} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isOnline || isLoading}
          />
          <button 
            className="chatbot-send" 
            disabled={!isOnline || isLoading || !inputValue.trim()}
            onClick={() => handleSendMessage(inputValue)}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWindow;
