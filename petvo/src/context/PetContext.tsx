import { createContext, useContext, useState, ReactNode } from 'react';

interface PetSetup {
  name: string;
  image: string;
  personality: string;
  hobbies: string[];
  userName: string;
}

interface Message {
  content: string;
  sender: 'user' | 'pet';
  timestamp: Date;
}

interface PetContextType {
  petSetup: PetSetup;
  messages: Message[];
  setPetSetup: (setup: PetSetup) => void;
  addMessage: (message: Omit<Message, 'timestamp'>) => Promise<void>;
  savePetSetup: () => Promise<void>;
  loadPetSetup: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider = ({ children }: { children: ReactNode }) => {
  const [petSetup, setPetSetup] = useState<PetSetup>(() => {
    // Try to load from localStorage
    const savedSetup = localStorage.getItem('petSetup');
    return savedSetup ? JSON.parse(savedSetup) : {
      name: '',
      image: '',
      personality: '',
      hobbies: [],
      userName: ''
    };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load from localStorage
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (error) {
        console.error('Error parsing messages:', error);
        return [];
      }
    }
    return [];
  });

  const savePetSetup = async () => {
    try {
      localStorage.setItem('petSetup', JSON.stringify(petSetup));
    } catch (error) {
      console.error('Error saving pet setup:', error);
    }
  };

  const loadPetSetup = async () => {
    try {
      const savedSetup = localStorage.getItem('petSetup');
      if (savedSetup) {
        const parsed = JSON.parse(savedSetup);
        setPetSetup(parsed);
      }
    } catch (error) {
      console.error('Error loading pet setup:', error);
    }
  };

  const addMessage = async (message: Omit<Message, 'timestamp'>) => {
    try {
      const newMessage = {
        ...message,
        timestamp: new Date()
      };
      
      // Update local state
      setMessages(prev => {
        const updated = [...prev, newMessage];
        // Save to localStorage with proper serialization
        try {
          localStorage.setItem('messages', JSON.stringify(updated.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString() // Convert Date to string for storage
          }))));
        } catch (error) {
          console.error('Error saving messages to localStorage:', error);
        }
        return updated;
      });
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return (
    <PetContext.Provider value={{
      petSetup,
      messages,
      setPetSetup,
      addMessage,
      savePetSetup,
      loadPetSetup
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
}; 