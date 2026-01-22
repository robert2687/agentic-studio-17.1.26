import React from 'react';
import { Project } from '../types';
import { Folder, Clock, ChevronRight, MonitorPlay } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onOpenProject }) => {
  return (
    <div className="h-full w-full bg-transparent p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
           <div>
             <h1 className="text-3xl font-bold text-ide-text tracking-tight">Project History</h1>
             <p className="text-ide-muted mt-2 text-sm">Resume previous generation sessions.</p>
           </div>
           <div className="bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-medium text-ide-muted backdrop-blur-sm">
              {projects.length} Saved Projects
           </div>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 border border-dashed border-ide-border rounded-3xl bg-white/5 glass">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                 <Folder size={32} className="text-ide-muted" />
             </div>
             <h3 className="text-lg font-medium text-ide-text">Workspace Empty</h3>
             <p className="text-ide-muted text-sm mt-1">Initialize a new generation to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => onOpenProject(project)}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-ide-accent/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 cursor-pointer flex flex-col h-[280px]"
              >
                {/* Preview Header */}
                <div className="h-32 bg-black/20 border-b border-white/5 relative overflow-hidden group-hover:bg-black/30 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center text-ide-muted/20 group-hover:text-ide-accent/40 group-hover:scale-110 transition-all duration-500">
                        <MonitorPlay size={48} />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase tracking-wider border border-green-500/20 backdrop-blur-sm">
                        {project.status}
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-ide-text mb-1 group-hover:text-ide-accent transition-colors truncate">
                      {project.name}
                  </h3>
                  <p className="text-xs text-ide-muted mb-4 line-clamp-2 leading-relaxed">
                      {project.definition.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-auto">
                      <span className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-ide-muted uppercase tracking-wider">
                          {project.definition.type}
                      </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-ide-muted uppercase tracking-wider">
                          <Clock size={12} />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-ide-accent flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          Resume <ChevronRight size={14} />
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;