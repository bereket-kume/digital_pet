import { useState } from 'react';
import { usePet } from '../../context/PetContext';
import { UserSetup } from './steps/UserSetup';
import { PetNameSetup } from './steps/PetNameSetup';
import { PetImageSetup } from './steps/PetImageSetup';
import { PersonalitySetup } from './steps/PersonalitySetup';
import { HobbiesSetup } from './steps/HobbiesSetup';

type SetupStep = 'user' | 'name' | 'image' | 'personality' | 'hobbies' | 'complete';

export const SetupWizard = () => {
  const { petSetup, setPetSetup, savePetSetup, addMessage } = usePet();
  const [setupStep, setSetupStep] = useState<SetupStep>('user');

  const handleSetupComplete = async () => {
    setSetupStep('complete');
    await savePetSetup();
    const welcomeMessage = {
      content: `Hello ${petSetup.userName}! I'm ${petSetup.name}, your new digital pet! I'm ${petSetup.personality.toLowerCase()} and I love ${petSetup.hobbies.join(', ')}. How can I help you today?`,
      sender: 'pet' as const
    };
    await addMessage(welcomeMessage);
  };

  const renderSetupStep = () => {
    switch (setupStep) {
      case 'user':
        return <UserSetup onNext={() => setSetupStep('name')} />;
      case 'name':
        return <PetNameSetup onNext={() => setSetupStep('image')} />;
      case 'image':
        return <PetImageSetup onNext={() => setSetupStep('personality')} />;
      case 'personality':
        return <PersonalitySetup onNext={() => setSetupStep('hobbies')} />;
      case 'hobbies':
        return <HobbiesSetup onComplete={handleSetupComplete} />;
      default:
        return null;
    }
  };

  if (setupStep === 'complete') return null;

  return (
    <div className="setup-overlay">
      <div className="setup-card">
        {renderSetupStep()}
      </div>
    </div>
  );
}; 