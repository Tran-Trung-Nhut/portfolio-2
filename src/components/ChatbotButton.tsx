import { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import ChatbotWindow from './ChatbotWindow';

const ChatbotButton = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const isOnline = true;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowTooltip(false); 
  };

  return (
    <div className="chatbot-wrapper">
      <ChatbotWindow isOpen={isOpen} onClose={() => setIsOpen(false)} isOnline={isOnline} />

      {/* FAB Button always visible */}
      <div className="chatbot-fab-container">
        <div className={`chatbot-tooltip ${showTooltip && !isOpen && isOnline ? 'visible' : ''}`}>
          Ask AI assistant about Nhựt
        </div>
        <button 
          className={`chatbot-fab ${isOpen ? 'active' : ''}`}
          aria-label="Toggle AI Assistant"
          onClick={handleToggle}
        >
          <FaRobot />
          <span className={`chatbot-online-dot ${!isOnline ? 'offline' : ''}`}></span>
        </button>
      </div>
    </div>
  );
};

export default ChatbotButton;
