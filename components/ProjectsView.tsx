import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { IconSearch, IconPlus, IconFolder } from './Icons';

interface ProjectsViewProps {
  projects: Project[];
  onCreateProject: (title: string, description: string) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onCreateProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [projects, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectTitle.trim()) {
      onCreateProject(newProjectTitle, newProjectDesc);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewProjectTitle('');
    setNewProjectDesc('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-claude-bg text-zinc-900 dark:text-[#ececec] overflow-hidden relative">
      <div className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-medium">Projects</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#d97757] hover:bg-[#e08c6f] text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <IconPlus className="w-4 h-4" />
            New project
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
           <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-claude-muted">
              <IconSearch />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 dark:bg-claude-panel border border-transparent focus:border-zinc-300 dark:focus:border-zinc-600 rounded-lg py-2 pl-10 pr-4 text-sm text-zinc-900 dark:text-[#ececec] placeholder-zinc-500 outline-none transition-all"
            />
          </div>
          <div className="relative">
             <select className="appearance-none bg-gray-100 dark:bg-claude-panel border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 rounded-lg py-2 pl-4 pr-10 text-sm text-zinc-900 dark:text-[#ececec] outline-none cursor-pointer transition-all">
               <option>Sort by name</option>
               <option>Sort by date</option>
             </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
          </div>
        </div>

        {/* Content */}
        {projects.length === 0 && searchQuery === '' ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center pb-32">
             <div className="w-16 h-16 bg-gray-100 dark:bg-claude-panel rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-6">
                <IconFolder width="32" height="32" strokeWidth="1.5" />
             </div>
             <h2 className="text-lg font-medium text-zinc-900 dark:text-[#ececec] mb-2">Looking to start a project?</h2>
             <p className="text-zinc-500 dark:text-claude-muted max-w-sm text-[15px] leading-relaxed">
               Upload materials, set custom instructions, and organize conversations in one space.
             </p>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8 overflow-y-auto">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-gray-100 dark:bg-claude-panel p-5 rounded-xl border border-transparent hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group flex flex-col h-[180px]">
                <div className="flex items-start justify-between mb-3">
                   <div className="p-2 bg-gray-200 dark:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400">
                     <IconFolder width="20" height="20" />
                   </div>
                   <div className="text-xs text-zinc-500">{formatDate(project.updatedAt)}</div>
                </div>
                <h3 className="font-medium text-lg text-zinc-800 dark:text-zinc-100 mb-1 truncate">{project.title}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2">{project.description || "No description provided."}</p>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <div className="col-span-full text-center text-zinc-500 mt-10">
                No projects found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f1f23] w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
               <h3 className="font-medium text-lg text-zinc-900 dark:text-white">Create Project</h3>
               <button onClick={handleCloseModal} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="e.g. Q3 Marketing Plan"
                  className="w-full bg-gray-50 dark:bg-claude-panel border border-gray-300 dark:border-zinc-700 focus:border-zinc-500 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">Description <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span></label>
                <textarea 
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-claude-panel border border-gray-300 dark:border-zinc-700 focus:border-zinc-500 rounded-lg py-2 px-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                 <button 
                   type="button" 
                   onClick={handleCloseModal}
                   className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={!newProjectTitle.trim()}
                   className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${!newProjectTitle.trim() ? 'bg-[#d97757]/50 cursor-not-allowed' : 'bg-[#d97757] hover:bg-[#e08c6f]'}`}
                 >
                   Create Project
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsView;