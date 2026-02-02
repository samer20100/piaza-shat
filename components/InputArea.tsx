import React, { useRef, useEffect } from 'react';
import { IconAttachment, IconUpArrow, IconHistory } from './Icons';
import { ModelType, Attachment, Settings, TRANSLATIONS } from '../types';

interface InputAreaProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  model: ModelType;
  onModelChange: (m: ModelType) => void;
  centered?: boolean;
  onFileSelect: (files: FileList) => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  settings?: Settings;
}

const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  model,
  onModelChange,
  centered = false,
  onFileSelect,
  attachments = [],
  onRemoveAttachment,
  settings
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = settings ? TRANSLATIONS[settings.language] : TRANSLATIONS['en'];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || attachments.length > 0) && !isLoading) {
        onSend();
      }
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
    e.target.value = '';
  };

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all duration-500 ease-out ${centered ? 'translate-y-0' : ''}`}>
      <div className="bg-white dark:bg-claude-panel border border-gray-200 dark:border-zinc-700/50 rounded-2xl shadow-lg flex flex-col overflow-hidden focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-500 transition-all">

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="px-4 pt-4 flex gap-3 flex-wrap">
            {attachments.map(att => (
              <div key={att.id} className="relative group">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center relative">
                  {att.type === 'image' ? (
                    <img src={att.data} alt={att.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-zinc-500 dark:text-zinc-300 px-1 text-center truncate">{att.name}</div>
                  )}
                </div>
                <button
                  onClick={() => onRemoveAttachment && onRemoveAttachment(att.id)}
                  className="absolute -top-1.5 -right-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-white rounded-full p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 shadow-md"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          className={`w-full bg-transparent text-zinc-900 dark:text-[#ececec] placeholder-zinc-400 dark:placeholder-zinc-500 px-4 py-4 outline-none resize-none min-h-[56px] max-h-[200px] text-lg leading-relaxed ${settings?.language === 'ar' ? 'text-right' : 'text-left'}`}
          rows={1}
          dir={settings?.language === 'ar' ? 'rtl' : 'ltr'}
        />

        <div className={`flex items-center justify-between px-3 py-2.5 ${settings?.language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*"
            />
            <button
              onClick={handleAttachmentClick}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconAttachment />
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconHistory />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={model}
                onChange={(e) => onModelChange(e.target.value as ModelType)}
                className="appearance-none bg-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-sm font-medium pr-6 cursor-pointer focus:outline-none"
              >
                <option value="gemini-3-flash-preview" className="bg-white dark:bg-claude-panel">biaza 3.5</option>
                <option value="gemini-3-pro-preview" className="bg-white dark:bg-claude-panel">biaza dark</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>

            {/* Search Toggle */}
            <button
              className={`p-2 rounded-lg transition-colors text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 group relative`}
              title="Search Web"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-black text-white text-xs rounded z-20 whitespace-nowrap">
                Search Web (Coming Soon)
              </div>
            </button>

            <button
              onClick={onSend}
              disabled={(!value.trim() && attachments.length === 0) || isLoading}
              className={`p-1.5 rounded-lg transition-all duration-200 ${(value.trim() || attachments.length > 0) && !isLoading
                  ? 'bg-[#d97757] text-white hover:bg-[#e08c6f]'
                  : 'bg-gray-200 dark:bg-[#3f3f46] text-zinc-400 dark:text-zinc-500 cursor-not-allowed'
                }`}
            >
              <IconUpArrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;