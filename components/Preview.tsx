import React from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

interface PreviewProps {
  url: string;
  isReady: boolean;
  activeAgent: string;
  previewContent: string | null;
}

const Preview: React.FC<PreviewProps> = ({ url, isReady, activeAgent, previewContent }) => {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden rounded-tl-xl border-l border-ide-border">
      {/* Browser Toolbar */}
      <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-2 flex-shrink-0">
        <div className="flex gap-2 text-slate-400">
           <ArrowLeft size={14} className="cursor-not-allowed" />
           <ArrowRight size={14} className="cursor-not-allowed" />
           <RefreshCw size={14} className="cursor-pointer hover:text-slate-600" />
        </div>
        <div className="flex-1 bg-white border border-slate-300 rounded-md h-7 flex items-center px-3 text-xs text-slate-600 gap-2">
           <ShieldCheck size={12} className="text-green-500" />
           <span className="truncate">{url}</span>
        </div>
        <ExternalLink size={14} className="text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white relative w-full h-full">
        {isReady && previewContent ? (
          <iframe 
            srcDoc={previewContent}
            title="App Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-8 text-center">
            {activeAgent !== 'idle' && activeAgent !== 'completed' ? (
              <>
                 <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-500">AI</div>
                    </div>
                 </div>
                 <h3 className="text-slate-800 font-medium text-lg mb-2">
                    {activeAgent === 'planner' && 'Architecting solution...'}
                    {activeAgent === 'coder' && 'Writing code...'}
                    {activeAgent === 'compiler' && 'Compiling assets...'}
                    {activeAgent === 'patcher' && 'Fixing errors...'}
                 </h3>
                 <p className="text-slate-500 text-sm max-w-xs animate-pulse">
                   Agent Swarm is working on your application.
                 </p>
              </>
            ) : (
              <div className="text-slate-400">
                <p>Enter a prompt to start generation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;