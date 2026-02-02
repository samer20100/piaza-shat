import React, { useState, useMemo } from 'react';
import { ChatSession } from '../types';
import { IconSearch, IconMessage } from './Icons';

interface ChatsViewProps {
  sessions: ChatSession[];
  onSelectSession: (id: string) => void;
}

const ChatsView: React.FC<ChatsViewProps> = ({ sessions, onSelectSession }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [sessions, searchQuery]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-claude-bg text-zinc-900 dark:text-[#ececec] overflow-hidden">
      <div className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col h-full">
        <h1 className="text-3xl font-serif font-medium mb-6">Chats</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-claude-muted">
            <IconSearch />
          </div>
          <input 
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-claude-panel border border-transparent focus:border-zinc-300 dark:focus:border-zinc-600 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-900 dark:text-[#ececec] placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-1 pb-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-zinc-500 dark:text-claude-muted mt-10">
              No chats found matching "{searchQuery}"
            </div>
          ) : (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-claude-panel transition-colors group text-left border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700/50"
              >
                <div className="mt-1 p-2 rounded-lg bg-gray-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-[#ececec] transition-colors">
                   <IconMessage />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-[15px] truncate pr-4 text-zinc-900 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white">{session.title}</span>
                    <span className="text-xs text-zinc-500 flex-shrink-0">{formatDate(session.updatedAt)}</span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">
                    {session.messages[session.messages.length - 1]?.content || 'No messages'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsView;