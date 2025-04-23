import { usePet } from '../../../context/PetContext';

interface HobbiesSetupProps {
  onComplete: () => void;
}

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

export const HobbiesSetup = ({ onComplete }: HobbiesSetupProps) => {
  const { petSetup, setPetSetup } = usePet();

  return (
    <>
      <h2>Choose Your Pet's Hobbies</h2>
      <div className="hobbies-grid">
        {hobbyOptions.map((hobby) => (
          <div 
            key={hobby}
            className={`hobby-option ${petSetup.hobbies.includes(hobby) ? 'selected' : ''}`}
            onClick={() => {
              const newHobbies = petSetup.hobbies.includes(hobby)
                ? petSetup.hobbies.filter(h => h !== hobby)
                : [...petSetup.hobbies, hobby];
              setPetSetup({...petSetup, hobbies: newHobbies});
            }}
          >
            {hobby}
          </div>
        ))}
      </div>
      <button 
        className="setup-button"
        onClick={onComplete}
        disabled={petSetup.hobbies.length === 0}
      >
        Complete Setup
      </button>
    </>
  );
}; 