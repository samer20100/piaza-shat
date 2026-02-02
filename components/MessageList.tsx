import React from 'react';
import { Message, Settings } from '../types';
import { IconSparkle, IconCopy, IconThumbUp, IconThumbDown, IconRefresh } from './Icons';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  settings: Settings;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, settings }) => {
  const getFontClass = () => {
    switch (settings.font) {
      case 'system': return 'font-system';
      case 'dyslexic': return 'font-dyslexic';
      case 'sans': return 'font-sans';
      case 'default':
      default: return 'font-serif';
    }
  };

  const fontClass = getFontClass();
  const isRtl = settings.language === 'ar';

  return (
    <div className={`flex-1 overflow-y-auto px-4 py-6 scroll-smooth`}>
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${isRtl && msg.role === 'model' ? 'flex-row-reverse' : ''}`}>

            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-sm bg-transparent flex-shrink-0 flex items-start justify-center pt-1">
                <IconSparkle />
              </div>
            )}

            <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {msg.attachments.map(att => (
                    att.type === 'image' && (
                      <div key={att.id} className="rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700 max-w-[200px]">
                        <img src={att.data} alt="attachment" className="w-full h-auto" />
                      </div>
                    )
                  ))}
                </div>
              )}

              <div className={`${msg.role === 'user' ? 'bg-gray-100 dark:bg-claude-panel px-5 py-3 rounded-2xl text-zinc-900 dark:text-[#ececec]' : 'text-zinc-900 dark:text-[#ececec]'} ${fontClass} ${isRtl ? 'text-right' : 'text-left'}`}>
                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap leading-7 text-[15px]">{msg.content}</div>
                ) : (
                  <div className={`prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed ${isRtl ? 'text-[1.1rem]' : 'text-[15px]'}`} dir={isRtl ? 'rtl' : 'ltr'}>
                    {msg.content}

                    {/* Fake Sources UI if invoked */}
                    {msg.content.includes("Sources:") && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sources</span>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          <div className="min-w-[120px] p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <div className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200">Wikipedia</div>
                            <div className="text-[10px] text-zinc-500 truncate">en.wikipedia.org/wiki/Topic</div>
                          </div>
                          <div className="min-w-[120px] p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                            <div className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200">News Article</div>
                            <div className="text-[10px] text-zinc-500 truncate">nytimes.com/2023/...</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === 'model' && (
                <div className={`flex items-center gap-1 mt-1 ${isRtl ? 'mr-1 flex-row-reverse' : 'ml-1'}`}>
                  <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <IconCopy />
                  </button>
                  <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <IconThumbUp />
                  </button>
                  <button className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <IconThumbDown />
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                {settings.nickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={`flex gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-sm bg-transparent flex-shrink-0 flex items-start justify-center pt-1">
              <IconSparkle />
            </div>
            <div className="flex items-center gap-1 h-8">
              <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;