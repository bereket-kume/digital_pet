import { usePet } from '../../../context/PetContext';

interface UserSetupProps {
  onNext: () => void;
}

export const UserSetup = ({ onNext }: UserSetupProps) => {
  const { petSetup, setPetSetup } = usePet();

  return (
    <>
      <h2>What's Your Name?</h2>
      <input
        type="text"
        value={petSetup.userName}
        onChange={(e) => setPetSetup({...petSetup, userName: e.target.value})}
        placeholder="Enter your name"
        className="setup-input"
      />
      <button 
        className="setup-button"
        onClick={onNext}
        disabled={!petSetup.userName.trim()}
      >
        Next
      </button>
    </>
  );
}; 