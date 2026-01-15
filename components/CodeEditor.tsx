import React from 'react';

interface CodeEditorProps {
  content: string;
  fileName: string | null;
  activeAgent: string;
  onChange?: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, fileName, activeAgent, onChange }) => {
  const lineCount = content.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 25) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-ide-bg font-mono text-sm relative group">
      {/* Editor Tabs */}
      <div className="flex bg-ide-bg border-b border-ide-border">
        {fileName ? (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-ide-panel border-r border-t-2 border-t-ide-accent border-r-ide-border text-slate-200">
            <span className="text-blue-400">TSX</span>
            <span>{fileName}</span>
            {activeAgent === 'coder' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse ml-2"/>}
          </div>
        ) : (
           <div className="px-4 py-2.5 text-slate-500 italic">No file open</div>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Line Numbers */}
        <div className="w-12 flex-shrink-0 bg-ide-bg border-r border-ide-border/50 text-slate-600 text-right pr-3 pt-4 select-none h-full overflow-hidden">
          {lines.map(line => (
            <div key={line} className="h-6 leading-6 text-xs">{line}</div>
          ))}
        </div>

        {/* Code Content & Input */}
        <div className="flex-1 relative h-full">
           {fileName ? (
             <div className="absolute inset-0 overflow-auto custom-scrollbar">
                {/* Visual Layer (Syntax Highlight - Simplified here as just white text) */}
                <div 
                  className="absolute inset-0 p-4 pointer-events-none whitespace-pre font-mono text-sm leading-6 text-transparent z-10"
                  aria-hidden="true"
                >
                    {content}
                </div>

                {/* Input Layer */}
                <textarea 
                   className="absolute inset-0 w-full h-full bg-transparent p-4 font-mono text-sm leading-6 text-slate-300 outline-none resize-none z-0 focus:bg-white/5 transition-colors tab-4 selection:bg-blue-500/30"
                   value={content}
                   onChange={(e) => onChange && onChange(e.target.value)}
                   spellCheck={false}
                   autoCapitalize="off"
                   autoComplete="off"
                   autoCorrect="off"
                />
             </div>
           ) : (
             <div className="flex items-center justify-center h-full text-slate-600">
               <div className="text-center">
                 <div className="mb-2 text-slate-500 font-medium">Agentic Studio Pro</div>
                 <div className="text-xs">Select a file or generate an app to start editing</div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;