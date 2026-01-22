import React from 'react';
import { Project } from '../types';
import { Folder, Clock, ChevronRight, FileCode, MonitorPlay } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onOpenProject }) => {
  return (
    <div className="h-full bg-ide-bg p-8 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
           <div>
             <h1 className="text-3xl font-bold text-ide-text">Project History</h1>
             <p className="text-ide-muted mt-2">Manage your generated applications and simulations.</p>
           </div>
           <div className="bg-ide-panel px-4 py-2 rounded-lg border border-ide-border text-sm text-ide-muted">
              {projects.length} Projects
           </div>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-ide-border rounded-2xl bg-ide-panel/50">
             <Folder size={48} className="text-ide-border mb-4" />
             <h3 className="text-lg font-medium text-ide-text">No projects yet</h3>
             <p className="text-ide-muted">Start a new generation to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => onOpenProject(project)}
                className="group bg-ide-panel border border-ide-border rounded-xl overflow-hidden hover:border-ide-accent hover:shadow-lg hover:shadow-ide-accent/10 transition-all cursor-pointer flex flex-col"
              >
                {/* Preview Header (Mock) */}
                <div className="h-32 bg-ide-bg border-b border-ide-border relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center text-ide-muted">
                        <MonitorPlay size={32} />
                    </div>
                    {/* If we had a thumbnail, it would go here */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded uppercase tracking-wider border border-green-500/20">
                        {project.status}
                    </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-ide-text mb-1 group-hover:text-ide-accent transition-colors truncate">
                      {project.name}
                  </h3>
                  <p className="text-xs text-ide-muted mb-4 line-clamp-2 h-8">
                      {project.definition.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-0.5 rounded bg-ide-bg border border-ide-border text-[10px] text-ide-muted uppercase tracking-wider">
                          {project.definition.type}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-ide-bg border border-ide-border text-[10px] text-ide-muted uppercase tracking-wider">
                          {project.definition.design.theme}
                      </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-ide-border">
                      <div className="flex items-center gap-1.5 text-xs text-ide-muted">
                          <Clock size={12} />
                          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-ide-accent flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                          Open <ChevronRight size={14} />
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