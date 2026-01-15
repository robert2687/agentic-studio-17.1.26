import React from 'react';

interface CodeEditorProps {
  content: string;
  fileName: string | null;
  activeAgent: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, fileName, activeAgent }) => {
  const lineCount = content.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 25) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-ide-bg font-mono text-sm">
      {/* Editor Tabs */}
      <div className="flex bg-ide-bg border-b border-ide-border">
        {fileName ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-ide-panel border-r border-t-2 border-t-ide-accent border-r-ide-border text-slate-200">
            <span className="text-blue-400">TSX</span>
            <span>{fileName}</span>
            <span className="ml-2 hover:bg-slate-700 rounded p-0.5 cursor-pointer">×</span>
          </div>
        ) : (
           <div className="px-4 py-2.5 text-slate-500 italic">No file open</div>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-auto custom-scrollbar flex">
        {/* Line Numbers */}
        <div className="w-12 flex-shrink-0 bg-ide-bg border-r border-ide-border/50 text-slate-600 text-right pr-3 pt-4 select-none">
          {lines.map(line => (
            <div key={line} className="h-6 leading-6 text-xs">{line}</div>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 pt-4 pl-4 relative">
          {fileName ? (
             <pre className="font-mono text-sm leading-6 text-slate-300 tab-4">
               <code>{content}</code>
               {/* Blinking Cursor */}
               {activeAgent === 'coder' && (
                 <span className="w-2 h-5 bg-ide-accent inline-block align-middle animate-pulse ml-0.5" />
               )}
             </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600">
               <div className="text-center">
                 <div className="mb-2">Agentic Studio Pro</div>
                 <div className="text-xs">Use the prompt below to generate an app</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;