import { useRef, useEffect } from 'react';
import { usePet } from '../../context/PetContext';

interface ChatMessagesProps {
  isLoading: boolean;
}

export const ChatMessages = ({ isLoading }: ChatMessagesProps) => {
  const { messages } = usePet();
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Messages in ChatMessages:', messages); // Debug log
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-messages" ref={chatMessagesRef}>
      {messages.map((message, index) => {
        console.log('Rendering message:', message); // Debug log
        return (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'pet-message'}`}
          >
            <div className="message-content">
              <p>{message.content}</p>
            </div>
          </div>
        );
      })}
      {isLoading && (
        <div className="message pet-message">
          <div className="message-content">
            <p>Thinking...</p>
          </div>
        </div>
      )}
    </div>
  );
}; 