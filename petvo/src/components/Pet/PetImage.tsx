import { usePet } from '../../context/PetContext';

interface PetImageProps {
  facialExpression: 'neutral' | 'happy' | 'thinking' | 'speaking';
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const PetImage = ({ facialExpression, isSpeaking, onToggleSpeech }: PetImageProps) => {
  const { petSetup } = usePet();

  return (
    <div className="pet-image-container">
      <img 
        src={petSetup.image}
        alt="Your digital pet" 
        className={`pet-image ${facialExpression} ${isSpeaking ? 'speaking' : ''}`}
      />
      <div className="pet-controls">
        <button 
          className="speech-toggle-button"
          onClick={onToggleSpeech}
        >
          {isSpeaking ? '🔊 Stop' : '🔈 Speak'}
        </button>
      </div>
    </div>
  );
}; 