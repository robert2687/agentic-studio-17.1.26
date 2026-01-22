import React from 'react';
import { Trash2, Shield, Monitor, Code } from 'lucide-react';

interface SettingsProps {
  onClearHistory: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClearHistory }) => {
  return (
    <div className="h-full bg-ide-bg p-8 overflow-y-auto animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ide-text">Settings</h1>
          <p className="text-ide-muted mt-2">Manage your workspace preferences.</p>
        </div>

        {/* Editor Preferences */}
        <div className="bg-ide-panel border border-ide-border rounded-xl overflow-hidden">
           <div className="px-6 py-4 border-b border-ide-border bg-ide-bg/50 flex items-center gap-3">
              <Monitor size={18} className="text-ide-accent" />
              <h3 className="font-semibold text-ide-text">Workspace</h3>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Default Generator Stack</h4>
                    <p className="text-xs text-ide-muted mt-1">New projects will default to this tech stack.</p>
                 </div>
                 <select disabled className="bg-ide-bg border border-ide-border rounded-lg px-3 py-1.5 text-sm text-ide-text opacity-50 cursor-not-allowed">
                    <option>React + Tailwind (Default)</option>
                    <option>Vue + UnoCSS</option>
                    <option>Svelte</option>
                 </select>
              </div>

              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Live Preview Mode</h4>
                    <p className="text-xs text-ide-muted mt-1">Render preview in sandbox iframe.</p>
                 </div>
                 <div className="w-10 h-5 bg-ide-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Data Management */}
        <div className="bg-ide-panel border border-ide-border rounded-xl overflow-hidden">
           <div className="px-6 py-4 border-b border-ide-border bg-ide-bg/50 flex items-center gap-3">
              <Shield size={18} className="text-red-400" />
              <h3 className="font-semibold text-ide-text">Data & Storage</h3>
           </div>
           <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                 <div>
                    <h4 className="text-sm font-medium text-ide-text">Clear Project History</h4>
                    <p className="text-xs text-ide-muted mt-1">Remove all locally saved projects. This cannot be undone.</p>
                 </div>
                 <button 
                    onClick={() => {
                        if(confirm('Are you sure you want to delete all project history?')) {
                            onClearHistory();
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
                 >
                    <Trash2 size={14} /> Clear All
                 </button>
              </div>
           </div>
        </div>

        <div className="text-center text-xs text-ide-muted pt-8">
           Agentic Studio Pro v2.5.0 • Local Storage Persistence Active
        </div>

      </div>
    </div>
  );
};

export default Settings;