import { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
}

const ChatbotWindow = ({ isOpen, onClose, isOnline }: ChatbotWindowProps) => {
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    "What are his AI projects and tech stack?",
    "What are his programming skills and frameworks?",
    "Tell me about his research",
    "What is his university and GPA?",
    "Does he have any activities or awards?",
    "Does he have any professional certificates?"
  ];

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
        {/* Bot Welcome Message */}
        <div className="chatbot-message bot-message">
          <p>
            {isOnline 
              ? <>Hi! I'm Nhựt's AI assistant 👋 Ask me anything about his <strong>skills</strong>, <strong>projects</strong>, or <strong>background</strong>!</>
              : "I am currently offline. Please come back later!"
            }
          </p>
        </div>

        {/* Suggested Topics - hidden if offline */}
        {isOnline && (
          <div className="chatbot-onboarding">
            <p className="chatbot-topics-label">SUGGESTED TOPICS</p>
            <div className="chatbot-topics-container">
              {suggestions.map((text, i) => (
                <button key={i} className="chatbot-suggestion-pill">
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="chatbot-footer">
        <div className={`chatbot-input-container ${!isOnline ? 'disabled' : ''}`}>
          <input 
            type="text" 
            placeholder={isOnline ? "Ask a question..." : "Chat is currently offline..."} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isOnline}
          />
          <button className="chatbot-send" disabled={!isOnline || !inputValue.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWindow;
