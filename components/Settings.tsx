import React from 'react';
import { Trash2, Shield, Monitor } from 'lucide-react';

interface SettingsProps {
  onClearHistory: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearHistory }) => {
  return (
    <div className="h-full bg-transparent p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ide-text tracking-tight">Configuration</h1>
          <p className="text-ide-muted mt-2 text-sm">System preferences and data management.</p>
        </div>

        {/* Editor Preferences */}
        <div className="glass-panel rounded-2xl overflow-hidden">
           <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
              <Monitor size={18} className="text-ide-accent" />
              <h3 className="font-semibold text-ide-text text-sm uppercase tracking-wider">Workspace Environment</h3>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Generator Stack</h4>
                    <p className="text-xs text-ide-muted mt-1">Default tech stack for new agents.</p>
                 </div>
                 <select disabled className="bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-ide-text opacity-50 cursor-not-allowed">
                    <option>React + Tailwind (Locked)</option>
                 </select>
              </div>

              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Sandbox Isolation</h4>
                    <p className="text-xs text-ide-muted mt-1">Run previews in secure iframe contexts.</p>
                 </div>
                 <div className="w-10 h-5 bg-ide-accent rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel rounded-2xl overflow-hidden">
           <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
              <Shield size={18} className="text-red-400" />
              <h3 className="font-semibold text-ide-text text-sm uppercase tracking-wider">Persistence Layer</h3>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Flush Project Cache</h4>
                    <p className="text-xs text-ide-muted mt-1">Permanently remove all locally stored projects.</p>
                 </div>
                 <button 
                    onClick={() => {
                        if(confirm('Are you sure you want to delete all project history?')) {
                            onClearHistory();
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 hover:border-red-500/30 transition-all text-sm font-medium"
                 >
                    <Trash2 size={14} /> Clear All
                 </button>
              </div>
           </div>
        </div>

        <div className="text-center text-[10px] text-ide-muted/50 pt-8 uppercase tracking-widest font-mono">
           Agentic Studio Pro v2.5.0 • Build 2024.05.15
        </div>

      </div>
    </div>
  );
};

export default Settings;