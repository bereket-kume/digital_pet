import { usePet } from '../../../context/PetContext';

interface PersonalitySetupProps {
  onNext: () => void;
}

const personalityOptions = [
  'Playful and energetic',
  'Calm and wise',
  'Curious and adventurous',
  'Friendly and social',
  'Independent and mysterious'
];

export const PersonalitySetup = ({ onNext }: PersonalitySetupProps) => {
  const { petSetup, setPetSetup } = usePet();

  return (
    <>
      <h2>Choose Your Pet's Personality</h2>
      <div className="personality-grid">
        {personalityOptions.map((option) => (
          <div 
            key={option}
            className={`personality-option ${petSetup.personality === option ? 'selected' : ''}`}
            onClick={() => setPetSetup({...petSetup, personality: option})}
          >
            {option}
          </div>
        ))}
      </div>
      <button 
        className="setup-button"
        onClick={onNext}
        disabled={!petSetup.personality}
      >
        Next
      </button>
    </>
  );
}; 