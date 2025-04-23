import { useState } from 'react';

interface ChatInputProps {
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  onSendMessage: (message: string) => void;
}

export const ChatInput = ({ isLoading, isListening, onToggleListening, onSendMessage }: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="chat-input-container">
      <input 
        type="text" 
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message to your pet..." 
        className="chat-input"
        disabled={isLoading}
      />
      <button 
        className={`voice-input-button ${isListening ? 'listening' : ''}`}
        onClick={onToggleListening}
        disabled={isLoading}
      >
        {isListening ? '🎤' : '🎤'}
      </button>
      <button 
        className="send-button" 
        onClick={handleSendMessage}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}; 