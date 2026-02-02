import React, { useState } from 'react';
import { IconSparkle } from './Icons';
import InputArea from './InputArea';
import { ModelType } from '../types';

interface LandingViewProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  model: ModelType;
  onModelChange: (m: ModelType) => void;
  isLoading: boolean;
}

const LandingView: React.FC<LandingViewProps> = ({ 
  inputValue, 
  onInputChange, 
  onSend,
  model,
  onModelChange,
  isLoading
}) => {
  return (
    <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-claude-bg">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8 mb-4">
          
          {/* Badge */}
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
            <span>Free plan</span>
            <span className="w-0.5 h-0.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"></span>
            <span className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer underline decoration-zinc-400 dark:decoration-zinc-600 underline-offset-2">Upgrade</span>
          </div>

          {/* Greeting */}
          <div className="flex items-center gap-4 mb-2">
              <div className="scale-150">
                  <IconSparkle />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-zinc-800 dark:text-[#ececec] text-center">
                  Back at it, biaza
              </h1>
          </div>

          {/* Input */}
          <div className="w-full">
              <InputArea 
                  value={inputValue}
                  onChange={onInputChange}
                  onSend={onSend}
                  isLoading={isLoading}
                  model={model}
                  onModelChange={onModelChange}
                  centered={true}
                  // Mock these for landing view as they aren't strictly needed until active
                  onFileSelect={() => {}}
                  attachments={[]}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingView;