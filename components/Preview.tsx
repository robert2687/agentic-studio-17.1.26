import React from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, ShieldCheck, ExternalLink, MonitorPlay } from 'lucide-react';

interface PreviewProps {
  url: string;
  isReady: boolean;
  activeAgent: string;
  previewContent: string | null;
}

const Preview: React.FC<PreviewProps> = ({ url, isReady, activeAgent, previewContent }) => {
  const handleOpenNewTab = () => {
    if (!previewContent) return;
    const blob = new Blob([previewContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Browser Toolbar */}
      <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 flex-shrink-0">
        <div className="flex gap-2 text-slate-400">
           <ArrowLeft size={16} className="cursor-not-allowed opacity-50" />
           <ArrowRight size={16} className="cursor-not-allowed opacity-50" />
           <RefreshCw size={14} className="cursor-pointer hover:text-slate-600 hover:rotate-180 transition-all duration-500" />
        </div>
        <div className="flex-1 bg-white border border-slate-200 rounded-lg h-8 flex items-center px-3 text-xs text-slate-500 gap-2 shadow-sm">
           <ShieldCheck size={12} className="text-green-500" />
           <span className="truncate flex-1">{url}</span>
           <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 rounded text-slate-400">Secure Context</span>
        </div>
        <button 
          onClick={handleOpenNewTab}
          disabled={!isReady || !previewContent}
          className="text-slate-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1.5 hover:bg-blue-50 rounded"
          title="Open in new tab"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white relative w-full h-full">
        {isReady && previewContent ? (
          <iframe 
            srcDoc={previewContent}
            title="App Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-slate-50/50 p-8 text-center backdrop-blur-sm">
            {activeAgent !== 'idle' && activeAgent !== 'completed' ? (
              <>
                 <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-blue-500 shadow-sm border border-slate-100">AI</div>
                    </div>
                 </div>
                 <h3 className="text-slate-800 font-semibold text-lg mb-2">
                    {activeAgent === 'planner' && 'Architecting Solution...'}
                    {activeAgent === 'designer' && 'Designing UI System...'}
                    {activeAgent === 'architect' && 'Scaffolding Structure...'}
                    {activeAgent === 'coder' && 'Generating Implementation...'}
                    {activeAgent === 'compiler' && 'Bundling Assets...'}
                    {activeAgent === 'patcher' && 'Hot-Patching Errors...'}
                 </h3>
                 <p className="text-slate-500 text-sm max-w-xs animate-pulse">
                   The agent swarm is constructing your application based on the defined requirements.
                 </p>
              </>
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 mb-4 flex items-center justify-center">
                    <MonitorPlay size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">Preview Unavailable</p>
                <p className="text-xs opacity-70 mt-1">Initialize generation to view output</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;