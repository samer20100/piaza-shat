import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LandingView from './components/LandingView';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import ChatsView from './components/ChatsView';
import ProjectsView from './components/ProjectsView';
import SettingsView from './components/SettingsView';
import OnboardingModal from './components/OnboardingModal';
import { Message, ModelType, ChatSession, MOCK_CHATS, Project, ViewState, Settings, DEFAULT_SETTINGS, Attachment } from './types';
import { aiService } from './services/aiService';

function App() {
  // Initialize sidebar based on screen width (closed on mobile/tablet < 768px)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  // --- Persistence Logic ---
  
  // Load Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window === 'undefined') return MOCK_CHATS;
    try {
      const saved = localStorage.getItem('biaza_sessions');
      if (saved) {
        return JSON.parse(saved).map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages // basic parsing
        }));
      }
    } catch (e) {
      console.error("Failed to load sessions", e);
    }
    return MOCK_CHATS;
  });

  // Load Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('biaza_projects');
      if (saved) {
        return JSON.parse(saved).map((p: any) => ({
          ...p,
          updatedAt: new Date(p.updatedAt)
        }));
      }
    } catch (e) {
      console.error("Failed to load projects", e);
    }
    return [];
  });

  // Load Settings
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem('biaza_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return DEFAULT_SETTINGS;
  });

  // Load Onboarding State
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('biaza_onboarding_completed');
    return saved !== 'true';
  });

  // Save effects
  useEffect(() => {
    localStorage.setItem('biaza_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('biaza_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('biaza_settings', JSON.stringify(settings));
  }, [settings]);

  // --- End Persistence Logic ---

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelType>('fast');
  
  // Navigation State
  const [activeView, setActiveView] = useState<ViewState>('chat');
  
  // Apply theme and language direction effects
  useEffect(() => {
    // Theme logic - apply to html element
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (settings.theme === 'auto') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.add('light');
      }
    } else {
      root.classList.add(settings.theme);
    }
  }, [settings.theme]);

  // Derived state
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const currentMessages = currentSession?.messages || [];
  
  // View Logic
  const isLanding = activeView === 'chat' && !currentSessionId;

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('biaza_onboarding_completed', 'true');
  };

  const handleCreateProject = (title: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title,
      description,
      updatedAt: new Date(),
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const handleFileSelect = async (fileList: FileList) => {
    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();
      
      const promise = new Promise<Attachment>((resolve) => {
        reader.onload = (e) => {
          resolve({
            id: Date.now() + i + '',
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            mimeType: file.type,
            data: e.target?.result as string
          });
        };
      });
      
      reader.readAsDataURL(file);
      newAttachments.push(await promise);
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      attachments: [...attachments]
    };

    let sessionId = currentSessionId;
    let newSessions = [...sessions];

    // If new chat, create session
    if (!sessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: inputValue.slice(0, 30) + (inputValue.length > 30 ? '...' : '') || 'New Chat',
        updatedAt: new Date(),
        messages: [userMessage]
      };
      newSessions = [newSession, ...sessions];
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    } else {
      // Update existing session
      newSessions = newSessions.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, userMessage], updatedAt: new Date() }
          : s
      );
    }
    
    // Sort sessions by update time
    newSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    setSessions(newSessions);
    setInputValue('');
    const currentAttachments = [...attachments];
    setAttachments([]); // Clear attachments after sending
    setIsLoading(true);
    setActiveView('chat');

    let fullContent = '';

    try {
      // Add placeholder for AI
      const aiMessagePlaceholder: Message = {
        role: 'model',
        content: '',
        timestamp: Date.now()
      };
      
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, aiMessagePlaceholder] }
          : s
      ));

      // Get history for context.
      const sessionMessages = newSessions.find(s => s.id === sessionId)?.messages || [];
      const historyMessages = sessionMessages.slice(0, -1);
      const apiHistory = historyMessages.map(m => ({ role: m.role, content: m.content }));
      
      // Pass attachments AND SETTINGS to AI service
      const stream = aiService.streamChat(model, apiHistory, userMessage.content, currentAttachments, settings);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
            const msgs = [...s.messages];
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content: fullContent };
            return { ...s, messages: msgs };
          }
          return s;
        }));
      }

    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessage = settings.language === 'ar' 
         ? "عذراً، واجهت خطأ. يرجى المحاولة مرة أخرى." 
         : "I'm sorry, I encountered an error. Please try again.";

      // Handle Quota/429 Errors specifically
      const errorStr = (error.message || error.toString()).toLowerCase();
      if (
        errorStr.includes('429') || 
        errorStr.includes('quota') || 
        errorStr.includes('resource_exhausted')
      ) {
        errorMessage = settings.language === 'ar' 
          ? "⚠️ تم تجاوز حصة الاستخدام (Quota Exceeded). يرجى التحقق من الخطة أو المحاولة لاحقاً."
          : "⚠️ API Quota Exceeded. Please check your plan or try again later.";
      }

       setSessions(prev => prev.map(s => {
          if (s.id === sessionId) {
             const msgs = [...s.messages];
             const lastMsg = msgs[msgs.length - 1];
             // If AI hasn't generated anything yet or we want to overwrite
             if (lastMsg.role === 'model') {
                 msgs[msgs.length - 1] = { 
                   ...lastMsg, 
                   content: fullContent ? fullContent + "\n\n[" + errorMessage + "]" : errorMessage 
                 };
             }
             return { ...s, messages: msgs };
          }
          return s;
       }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setActiveView('chat');
    setInputValue('');
    setAttachments([]);
    // Close sidebar on mobile when creating new chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setActiveView('chat');
    setInputValue('');
    setAttachments([]);
    // Close sidebar on mobile when selecting a chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const renderMainContent = () => {
    if (activeView === 'settings') {
      return (
        <SettingsView 
          settings={settings} 
          onUpdateSettings={setSettings}
          onClose={() => setActiveView('chat')}
        />
      );
    }
    
    if (activeView === 'projects') {
      return <ProjectsView projects={projects} onCreateProject={handleCreateProject} />;
    }
    
    if (activeView === 'chats') {
      return <ChatsView sessions={sessions} onSelectSession={handleSelectSession} />;
    }

    if (isLanding) {
      return (
        <LandingView 
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSend={handleSend}
          model={model}
          onModelChange={setModel}
          isLoading={isLoading}
        />
      );
    }

    return (
      <>
        <MessageList 
            messages={currentMessages} 
            isLoading={isLoading} 
            settings={settings}
        />
        <div className={`p-4 bg-white dark:bg-claude-bg transition-colors`}>
          <InputArea 
             value={inputValue}
             onChange={setInputValue}
             onSend={handleSend}
             isLoading={isLoading}
             model={model}
             onModelChange={setModel}
             onFileSelect={handleFileSelect}
             attachments={attachments}
             onRemoveAttachment={handleRemoveAttachment}
             settings={settings}
          />
          <div className="text-center mt-3 text-xs text-zinc-500">
             {settings.language === 'ar' ? 'قد يرتكب biaza أخطاء. يرجى الاستخدام بحذر.' : 'biaza can make mistakes. Please use with caution.'}
          </div>
        </div>
      </>
    );
  };

  // Main App Container controls the global background color based on dark mode class
  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans bg-white dark:bg-claude-bg text-zinc-900 dark:text-[#ececec] transition-colors`} dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
      <OnboardingModal 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete}
        settings={settings}
        onUpdateSettings={setSettings}
      />
      
      <Sidebar 
        onNewChat={handleNewChat} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onViewChats={() => setActiveView('chats')}
        onViewProjects={() => setActiveView('projects')}
        onViewSettings={() => setActiveView('settings')}
        activeView={activeView}
        settings={settings}
      />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col relative h-full">
        {!isSidebarOpen && (
           <div className={`absolute top-4 z-10 ${settings.language === 'ar' ? 'right-4' : 'left-4'}`}>
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-md transition-colors bg-gray-100 hover:bg-gray-200 text-zinc-700 dark:bg-claude-panel dark:hover:bg-[#3f3f46] dark:text-white`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/></svg>
              </button>
           </div>
        )}

        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;