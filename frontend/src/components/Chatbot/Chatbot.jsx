import React, { useState, useEffect } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotInterface from './ChatbotInterface';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
      setUnreadCount(0);
    }
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chatbot Button - Always visible */}
      <ChatbotButton
        onClick={toggleChatbot}
        isOpen={isOpen}
        unreadCount={unreadCount}
      />

      {/* Mobile Full Screen Overlay */}
      {isMobile && isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeChatbot}
        />
      )}

      {/* Chatbot Interface */}
      {isMobile && isOpen ? (
        // Mobile: Full screen with overlay
        <div className="fixed inset-2 sm:inset-4 z-50 flex items-end">
          <div className={`
            w-full bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl 
            border border-gray-200 dark:border-gray-700 overflow-hidden
            transition-all duration-300 ease-out
            ${isMinimized ? 'h-16' : 'h-full max-h-[600px]'}
          `}>
            <ChatbotInterface
              isOpen={isOpen}
              onClose={closeChatbot}
              onMinimize={toggleMinimize}
              isMinimized={isMinimized}
              isMobile={isMobile}
            />
          </div>
        </div>
      ) : (
        // Desktop: Floating interface
        <ChatbotInterface
          isOpen={isOpen}
          onClose={closeChatbot}
          onMinimize={toggleMinimize}
          isMinimized={isMinimized}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

export default Chatbot;
