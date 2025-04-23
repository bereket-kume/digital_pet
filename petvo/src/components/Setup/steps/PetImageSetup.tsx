import { usePet } from '../../../context/PetContext';
import petImage from '../../../assets/karsten-winegeart-Qb7D1xw28Co-unsplash.jpg';

interface PetImageSetupProps {
  onNext: () => void;
}

const defaultPetImages = [
  { id: 1, src: petImage, name: 'Cute Dog' },
  { id: 2, src: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500', name: 'Playful Cat' },
  { id: 3, src: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500', name: 'Happy Bunny' },
  { id: 4, src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', name: 'Curious Fox' }
];

export const PetImageSetup = ({ onNext }: PetImageSetupProps) => {
  const { petSetup, setPetSetup } = usePet();

  return (
    <>
      <h2>Choose Your Pet's Image</h2>
      <div className="image-grid">
        {defaultPetImages.map((img) => (
          <div 
            key={img.id}
            className={`image-option ${petSetup.image === img.src ? 'selected' : ''}`}
            onClick={() => setPetSetup({...petSetup, image: img.src})}
          >
            <img src={img.src} alt={img.name} />
            <span>{img.name}</span>
          </div>
        ))}
      </div>
      <button 
        className="setup-button"
        onClick={onNext}
        disabled={!petSetup.image}
      >
        Next
      </button>
    </>
  );
}; 