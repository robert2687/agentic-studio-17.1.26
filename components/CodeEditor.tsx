import React, { useState } from 'react';
import { Copy, Check, FileCode, Maximize2 } from 'lucide-react';

interface CodeEditorProps {
  content: string;
  fileName: string | null;
  activeAgent: string;
  onChange?: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, fileName, activeAgent, onChange }) => {
  const lineCount = content.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 25) }, (_, i) => i + 1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = (name: string | null) => {
    if (!name) return 'Text';
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return 'TypeScript';
    if (name.endsWith('.json')) return 'JSON';
    if (name.endsWith('.html')) return 'HTML';
    if (name.endsWith('.css')) return 'CSS';
    return 'Text';
  };

  return (
    <div className="flex flex-col h-full bg-ide-bg font-mono text-sm relative group border-r border-ide-border">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between bg-ide-panel border-b border-ide-border pr-2">
        <div className="flex">
          {fileName ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-ide-bg border-r border-t-2 border-t-ide-accent border-r-ide-border text-ide-text">
              <span className="text-ide-accent"><FileCode size={14}/></span>
              <span className="font-medium text-xs">{fileName}</span>
              {activeAgent === 'coder' && <span className="w-1.5 h-1.5 rounded-full bg-ide-accent animate-pulse ml-2"/>}
            </div>
          ) : (
             <div className="px-4 py-2.5 text-ide-muted italic text-xs">No file open</div>
          )}
        </div>
        
        {fileName && (
          <div className="flex items-center gap-3">
             <span className="text-[10px] uppercase text-ide-muted font-bold tracking-wider">{getLanguage(fileName)}</span>
             <div className="h-4 w-[1px] bg-ide-border"></div>
             <button 
                onClick={handleCopy}
                className="text-ide-muted hover:text-ide-text p-1.5 rounded-md hover:bg-ide-bg transition-colors"
                title="Copy content"
             >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
             </button>
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative overflow-hidden flex bg-[#0c0a09]">
        {/* Line Numbers */}
        <div className="w-12 flex-shrink-0 bg-ide-bg border-r border-ide-border text-ide-muted text-right pr-3 pt-4 select-none h-full overflow-hidden opacity-50">
          {lines.map(line => (
            <div key={line} className="h-6 leading-6 text-xs">{line}</div>
          ))}
        </div>

        {/* Code Content & Input */}
        <div className="flex-1 relative h-full">
           {fileName ? (
             <div className="absolute inset-0 overflow-auto custom-scrollbar">
                {/* Visual Layer (Syntax Highlight - Simplified here) */}
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
             <div className="flex items-center justify-center h-full text-ide-muted">
               <div className="text-center opacity-50">
                 <div className="mb-2 font-medium">Agentic Studio Pro</div>
                 <div className="text-xs">Select a file to edit</div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;