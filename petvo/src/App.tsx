import './App.css'
import { useState, useEffect } from 'react';
import { PetProvider, usePet } from './context/PetContext';
import { SetupWizard } from './components/Setup/SetupWizard';
import { PetImage } from './components/Pet/PetImage';
import { ChatMessages } from './components/Chat/ChatMessages';
import { ChatInput } from './components/Chat/ChatInput';
import { getPetResponse } from './services/geminiService';

// Type definitions for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
  }
}

interface Message {
  content: string;
  sender: 'user' | 'pet';
}

interface PetSetup {
  name: string;
  image: string;
  personality: string;
  hobbies: string[];
  userName: string;
}

const defaultPetImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500', name: 'Cute Dog' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500', name: 'Playful Cat' },
  { id: 3, src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500', name: 'Happy Bunny' },
  { id: 4, src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', name: 'Curious Fox' }
];

const personalityOptions = [
  'Playful and energetic',
  'Calm and wise',
  'Curious and adventurous',
  'Friendly and social',
  'Independent and mysterious'
];

const hobbyOptions = [
  'Playing fetch',
  'Solving puzzles',
  'Learning new tricks',
  'Exploring nature',
  'Making new friends',
  'Collecting treasures',
  'Telling stories',
  'Singing songs'
];

function AppContent() {
  const { petSetup, messages, addMessage } = usePet();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [facialExpression, setFacialExpression] = useState<'neutral' | 'happy' | 'thinking' | 'speaking'>('neutral');
  const speechSynthesis = window.speechSynthesis;
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  const speakText = (text: string) => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Female') ||
      voice.name.includes('Google US English Female')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setFacialExpression('speaking');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setFacialExpression('neutral');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setFacialExpression('neutral');
    };

    speechSynthesis.speak(utterance);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
    } else if (messages.length > 0) {
      const lastPetMessage = [...messages].reverse().find(msg => msg.sender === 'pet');
      if (lastPetMessage) {
        speakText(lastPetMessage.content);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        addMessage({ 
          content: "Sorry, I couldn't start listening. Please check your microphone permissions.", 
          sender: 'pet' 
        });
      }
    }
  };

  const sendMessage = async (messageToSend?: string) => {
    console.log('Sending message:', messageToSend); // Debug log
    if (!messageToSend?.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setFacialExpression('thinking');
      
      // Add user message first
      await addMessage({ content: messageToSend, sender: 'user' });
      
      // Get response from Gemini API with conversation history
      console.log('Getting response from Gemini API...'); // Debug log
      const petResponse = await getPetResponse(messageToSend, messages);
      console.log('Received response from Gemini:', petResponse); // Debug log
      
      // Send pet's response
      const petMessage = { content: petResponse, sender: 'pet' as const };
      console.log('Adding pet message:', petMessage); // Debug log
      await addMessage(petMessage);
      setFacialExpression('happy');
      
      speakText(petResponse);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const errorMessage = "Sorry, I'm having trouble responding right now.";
      await addMessage({ 
        content: errorMessage, 
        sender: 'pet' 
      });
      setFacialExpression('neutral');
      speakText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setFacialExpression('thinking');
    };

    recognition.onend = () => {
      setIsListening(false);
      setFacialExpression('neutral');
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('Speech recognition result:', transcript); // Debug log
      await sendMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setFacialExpression('neutral');
      addMessage({ 
        content: `Sorry, I couldn't hear you. Error: ${event.error}. Please try again.`, 
        sender: 'pet' 
      });
    };

    return () => {
      recognition.stop();
    };
  }, [addMessage]);

  return (
    <div className="main-container">
      <SetupWizard />
      
      <div className="info-card">
        <h2>Getting Started</h2>
        <ul>
          <li>Type your message in the chat box</li>
          <li>Click the send button or press Enter</li>
          <li>Your pet will respond with text and voice</li>
          <li>Use the voice button to speak instead of typing</li>
        </ul>
        <div className="tip">
          Tip: Try asking your pet about its day or favorite activities!
   </div>
   </div>
   
      <div className="app-container">
        <header className="app-header">
          <h1>{petSetup.name || 'Digital Pet'}</h1>
        </header>
        
        <main className="pet-container">
          <PetImage 
            facialExpression={facialExpression}
            isSpeaking={isSpeaking}
            onToggleSpeech={toggleSpeech}
          />
          
          <div className="chat-container">
            <ChatMessages isLoading={isLoading} />
            <ChatInput 
              isLoading={isLoading}
              isListening={isListening}
              onToggleListening={toggleListening}
              onSendMessage={sendMessage}
            />
          </div>
        </main>
      </div>

      <div className="info-card">
        <h2>Features</h2>
        <ul>
          <li>Real-time voice interaction</li>
          <li>Expressive facial animations</li>
          <li>Natural conversation flow</li>
          <li>Responsive design for all devices</li>
        </ul>
        <div className="tip">
          Tip: Watch your pet's expressions change as it responds to you!
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <PetProvider>
      <AppContent />
    </PetProvider>
  );
}

export default App;
