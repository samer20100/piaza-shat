import React from 'react';
import { ChatSession, ViewState, Settings, TRANSLATIONS } from '../types';
import { IconMenu, IconPlus, IconMessage, IconFolder, IconGrid, IconCode } from './Icons';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onViewChats: () => void;
  onViewProjects: () => void;
  onViewSettings: () => void;
  activeView: ViewState;
  settings: Settings;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onNewChat, 
  isOpen, 
  toggleSidebar,
  sessions,
  currentSessionId,
  onSelectSession,
  onViewChats,
  onViewProjects,
  onViewSettings,
  activeView,
  settings
}) => {
  const t = TRANSLATIONS[settings.language];
  const isRtl = settings.language === 'ar';

  if (!isOpen) {
    // Hidden on desktop, but shows a button on mobile/desktop via App.tsx logic usually.
    // However, to prevent duplicate buttons if App.tsx also renders one, we can keep this behavior 
    // or rely on App.tsx. Since the prompt implies Sidebar handles its own closed state UI in some flows:
    return (
      <div className={`fixed top-4 z-50 ${isRtl ? 'right-4' : 'left-4'}`}>
        <button onClick={toggleSidebar} className="p-2 bg-gray-100 dark:bg-claude-bg rounded-md text-zinc-600 dark:text-claude-muted hover:text-black dark:hover:text-white transition-colors border border-transparent dark:border-zinc-800">
            <IconMenu />
        </button>
      </div>
    )
  }

  return (
    <div className={`w-[280px] h-screen flex flex-col bg-gray-50 dark:bg-claude-bg border-r border-gray-200 dark:border-[#27272a] text-zinc-700 dark:text-[#ececec] flex-shrink-0 transition-all duration-300 ${isRtl ? 'border-l border-r-0 right-0' : 'left-0'} fixed z-50 md:relative shadow-2xl md:shadow-none`}>
      {/* Header */}
      <div className={`h-14 flex items-center justify-between px-4 mt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <button onClick={onNewChat} className="flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-claude-panel p-2 rounded-lg -ml-2 transition-colors">
          <div className="w-6 h-6 bg-[#d97757] rounded-sm flex items-center justify-center">
             <span className="text-white font-serif font-bold text-sm">B</span>
          </div>
          <span className="font-medium text-lg tracking-tight text-zinc-800 dark:text-white">biaza</span>
        </button>
        <button onClick={toggleSidebar} className="text-zinc-500 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white transition-colors">
          <IconMenu />
        </button>
      </div>

      {/* Main Nav */}
      <div className="flex flex-col px-3 py-2 gap-1">
        <button 
          onClick={onNewChat}
          className={`flex items-center gap-3 px-3 py-2 rounded-md bg-[#d97757]/10 text-[#d97757] hover:bg-[#d97757]/20 transition-colors font-medium text-sm group ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <div className="bg-[#d97757] rounded-full p-0.5 text-white">
             <IconPlus />
          </div>
          <span className="group-hover:text-[#e08c6f]">
            {t.newChat}
          </span>
        </button>

        <button 
          onClick={onViewChats}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${isRtl ? 'flex-row-reverse' : ''} ${
            activeView === 'chats' 
              ? 'bg-black/5 dark:bg-claude-panel text-zinc-900 dark:text-white' 
              : 'hover:bg-black/5 dark:hover:bg-claude-panel text-zinc-600 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <IconMessage />
          <span>{t.chats}</span>
        </button>
        <button 
          onClick={onViewProjects}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${isRtl ? 'flex-row-reverse' : ''} ${
            activeView === 'projects' 
              ? 'bg-black/5 dark:bg-claude-panel text-zinc-900 dark:text-white' 
              : 'hover:bg-black/5 dark:hover:bg-claude-panel text-zinc-600 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <IconFolder />
          <span>{t.projects}</span>
        </button>
         <button className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-claude-panel text-zinc-600 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white transition-colors text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
          <IconGrid />
          <span>{t.artifacts}</span>
        </button>
         <button className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-claude-panel text-zinc-600 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white transition-colors text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
          <IconCode />
          <span>{t.code}</span>
        </button>
      </div>

      {/* Recents */}
      <div className="flex-1 overflow-y-auto mt-4 px-3">
        <div className={`text-xs font-medium text-zinc-500 dark:text-claude-muted/60 mb-2 px-2 ${isRtl ? 'text-right' : 'text-left'}`}>{t.recents}</div>
        <div className="flex flex-col gap-0.5">
          {sessions.map((chat) => (
            <button 
              key={chat.id} 
              onClick={() => onSelectSession(chat.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors truncate w-full ${isRtl ? 'text-right' : 'text-left'} ${
                currentSessionId === chat.id && activeView === 'chat'
                  ? 'bg-black/5 dark:bg-claude-panel text-zinc-900 dark:text-white' 
                  : 'hover:bg-black/5 dark:hover:bg-claude-panel text-zinc-600 dark:text-claude-muted hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-[#27272a]">
        <button 
          onClick={onViewSettings}
          className={`w-full flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-claude-panel p-2 rounded-lg -mx-2 transition-colors ${activeView === 'settings' ? 'bg-black/5 dark:bg-claude-panel' : ''} ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
             <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
               {settings.nickname.charAt(0).toUpperCase()}
             </div>
             <div className={`flex flex-col ${isRtl ? 'items-end' : 'items-start'}`}>
               <span className="text-sm font-medium leading-none text-zinc-800 dark:text-zinc-200">{settings.nickname}</span>
               <span className="text-xs text-zinc-500 dark:text-claude-muted mt-1">{t.freePlan}</span>
             </div>
          </div>
          <div className="text-zinc-400 dark:text-claude-muted">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;