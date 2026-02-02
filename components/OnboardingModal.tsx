import React, { useState } from 'react';
import { Settings } from '../types';
import { IconSparkle, IconUpArrow } from './Icons';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete, settings, onUpdateSettings }) => {
  const [nameInput, setNameInput] = useState(settings.nickname);

  if (!isOpen) return null;

  const handleComplete = () => {
    if (nameInput.trim()) {
      onUpdateSettings({...settings, nickname: nameInput});
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-claude-bg overflow-y-auto font-sans animate-in fade-in zoom-in-95 duration-500">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col items-center my-8">
          
          <div className="mb-8 scale-150">
             <IconSparkle />
          </div>

           <div className="w-full max-w-lg text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
               <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#ececec] mb-8 leading-tight">
                  Is <span className="text-[#d97757]">{settings.nickname}</span> how I should refer to you? If not, you can change that now.
               </h2>
               
               <div className="relative max-w-md mx-auto">
                  <div className="bg-claude-panel rounded-xl p-1.5 flex items-center">
                      <input 
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleComplete()}
                          className="flex-1 bg-transparent border-none text-[#ececec] text-lg px-4 py-2 outline-none placeholder-zinc-500"
                          placeholder="Your name"
                          autoFocus
                      />
                      <button 
                          onClick={handleComplete}
                          disabled={!nameInput.trim()}
                          className={`p-2 rounded-lg transition-colors ${nameInput.trim() ? 'bg-[#3f3f46] hover:bg-[#52525b] text-[#ececec]' : 'text-zinc-600 cursor-not-allowed'}`}
                      >
                          <IconUpArrow />
                      </button>
                  </div>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;