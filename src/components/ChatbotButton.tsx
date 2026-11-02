'use client';

import { useState, useEffect } from 'react';
import ChatbotWindow from '@/components/ChatbotWindow';
import NeoAsis from '@/components/NeoAsis';

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

      <div className="chatbot-fab-container">
        <div className={`chatbot-tooltip ${showTooltip && !isOpen && isOnline ? 'visible' : ''}`}>
          Hi! Ask Neo Asis about Nhựt
        </div>
        <button
          type="button"
          className={`chatbot-fab ${isOpen ? 'active' : ''}`}
          aria-label={isOpen ? 'Close chat with Neo Asis' : 'Chat with Neo Asis'}
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          <NeoAsis variant="avatar" mood="greet" />
          <span className={`chatbot-online-dot ${!isOnline ? 'offline' : ''}`}></span>
        </button>
      </div>
    </div>
  );
};

export default ChatbotButton;
