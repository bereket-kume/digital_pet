import { usePet } from '../../../context/PetContext';

interface PetNameSetupProps {
  onNext: () => void;
}

export const PetNameSetup = ({ onNext }: PetNameSetupProps) => {
  const { petSetup, setPetSetup } = usePet();

  return (
    <>
      <h2>Name Your Pet</h2>
      <input
        type="text"
        value={petSetup.name}
        onChange={(e) => setPetSetup({...petSetup, name: e.target.value})}
        placeholder="Enter your pet's name"
        className="setup-input"
      />
      <button 
        className="setup-button"
        onClick={onNext}
        disabled={!petSetup.name.trim()}
      >
        Next
      </button>
    </>
  );
}; 