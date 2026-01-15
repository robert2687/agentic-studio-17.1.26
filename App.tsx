import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgentRole, LogEntry, SimulationState, ChatMessage, FileNode } from './types';
import AgentStatus from './components/AgentStatus';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import Preview from './components/Preview';
import { INITIAL_FILES } from './lib/mockData';
import { generateProjectPlan, generateCode, compileToHtml, fixCode, chatWithAI, generateDesignSystem } from './lib/gemini';
import { Send, Sparkles, Layout, Zap, GripVertical, PanelBottom, Sidebar as SidebarIcon, MonitorPlay } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('Create a modern crypto dashboard with dark mode and real-time charts');
  const [state, setState] = useState<SimulationState>({
    status: 'idle',
    activeAgent: 'idle',
    currentFile: null,
    files: INITIAL_FILES,
    logs: [],
    messages: [],
    previewUrl: 'localhost:3000',
    codeContent: '',
    previewContent: null,
    iteration: 0
  });

  // --- Resizable Layout State ---
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [previewWidth, setPreviewWidth] = useState(450);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Resize Handlers
  const startResizing = useCallback((direction: 'sidebar' | 'preview' | 'terminal') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = direction === 'sidebar' ? sidebarWidth : previewWidth;
    const startHeight = terminalHeight;

    const doDrag = (moveEvent: MouseEvent) => {
      if (direction === 'sidebar') {
        setSidebarWidth(Math.max(200, Math.min(600, startWidth + (moveEvent.clientX - startX))));
      } else if (direction === 'preview') {
        setPreviewWidth(Math.max(300, Math.min(800, startWidth - (moveEvent.clientX - startX))));
      } else if (direction === 'terminal') {
        setTerminalHeight(Math.max(100, Math.min(600, startHeight - (moveEvent.clientY - startY))));
      }
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.body.style.cursor = 'default';
      // Re-enable pointer events on iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(el => el.style.pointerEvents = 'auto');
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    // Disable pointer events on iframes during drag to prevent capturing mouse
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(el => el.style.pointerEvents = 'none');
    document.body.style.cursor = direction === 'terminal' ? 'row-resize' : 'col-resize';
  }, [sidebarWidth, previewWidth, terminalHeight]);

  // --- App Logic ---

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'PREVIEW_ERROR') {
            const errorMsg = event.data.message;
            addLog('system', `Runtime Error detected: ${errorMsg}`, 'error');
            healApp(errorMsg);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [state.codeContent]);

  const addLog = (source: AgentRole | 'system' | 'user', message: string, type: LogEntry['type'] = 'info') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        source,
        message,
        type
      }]
    }));
  };

  const addChatMessage = (role: 'user' | 'model', text: string) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: Math.random().toString(36),
        role,
        text,
        timestamp: Date.now()
      }]
    }));
  };

  const handleChat = async (text: string) => {
    setIsChatting(true);
    addChatMessage('user', text);
    try {
        const response = await chatWithAI(state.messages, text, state.codeContent);
        addChatMessage('model', response);
    } catch (e) {
        addChatMessage('model', "I'm having trouble connecting right now. Please try again.");
    } finally {
        setIsChatting(false);
    }
  };

  const healApp = async (errorMsg: string) => {
      if (state.status === 'running' || state.activeAgent === 'patcher') return;
      setState(prev => ({ ...prev, status: 'running', activeAgent: 'patcher' }));
      addLog('patcher', 'Runtime error intercepted. Initiating self-healing...', 'warning');
      try {
          const fixedCode = await fixCode(state.codeContent, errorMsg);
          const cleanCode = fixedCode.replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');
          setState(prev => ({ ...prev, codeContent: cleanCode }));
          addLog('patcher', 'Patch applied. Recompiling...', 'info');
          setState(prev => ({ ...prev, activeAgent: 'compiler' }));
          const html = await compileToHtml(cleanCode);
          setState(prev => ({ ...prev, previewContent: html, activeAgent: 'idle', status: 'completed' }));
          addLog('system', 'Recovery successful', 'success');
      } catch (e: any) {
          addLog('patcher', `Healing failed: ${e.message}`, 'error');
          setState(prev => ({ ...prev, status: 'error', activeAgent: 'idle' }));
      }
  };

  const startSimulation = async () => {
    if (state.status === 'running') return;
    setState(prev => ({ ...prev, status: 'running', logs: [], files: INITIAL_FILES, codeContent: '', previewContent: null }));
    try {
        await runAgentSequence(prompt);
    } catch (error: any) {
        addLog('system', `Critical Error: ${error.message}`, 'error');
        setState(prev => ({ ...prev, status: 'error', activeAgent: 'idle' }));
    }
  };

  const runAgentSequence = async (userPrompt: string) => {
    // 1. Planner Agent
    setState(prev => ({ ...prev, activeAgent: 'planner' }));
    addLog('system', 'Initializing Gemini Agent Swarm...', 'info');
    await wait(500);
    
    addLog('planner', `Analyzing request: "${userPrompt}"`, 'info');
    let plan;
    try {
        plan = await generateProjectPlan(userPrompt);
        addLog('planner', 'Blueprint generated (grounded via Search)', 'success');
        if (plan.reasoning) {
            addLog('planner', `Strategy: ${plan.reasoning}`, 'info');
        }
    } catch (e) {
        addLog('planner', 'Failed to generate plan. Retrying...', 'warning');
        plan = await generateProjectPlan(userPrompt); 
    }

    // 2. Designer Agent
    setState(prev => ({ ...prev, activeAgent: 'designer' }));
    await wait(800);
    addLog('designer', 'Crafting design system...', 'info');
    let theme;
    try {
        theme = await generateDesignSystem(userPrompt);
        addLog('designer', `Design Vibe: ${theme.metadata.styleVibe}`, 'success');
        setState(prev => ({ ...prev, files: [...prev.files, { name: 'theme.json', type: 'file', content: JSON.stringify(theme, null, 2) }] }));
    } catch (e) {
        addLog('designer', 'Using default design system.', 'warning');
    }

    // 3. Architect Agent
    setState(prev => ({ ...prev, activeAgent: 'architect' }));
    await wait(800);
    const newFiles: FileNode[] = [...state.files, { name: 'src', type: 'folder', isOpen: true, children: plan.files?.map((f: any) => ({ name: f.name, type: f.type === 'folder' ? 'folder' : 'file', children: [] })) || [] }];
    setState(prev => ({ ...prev, files: newFiles }));
    addLog('architect', 'File structure scaffolded', 'success');

    // 4. Coder Agent
    setState(prev => ({ ...prev, activeAgent: 'coder' }));
    await wait(800);
    addLog('coder', 'Generating React implementation...', 'info');
    let generatedCode = '';
    try {
        generatedCode = await generateCode(userPrompt, plan, theme);
        generatedCode = generatedCode.replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');
        setState(prev => ({ ...prev, currentFile: 'App.tsx', codeContent: generatedCode }));
        addLog('coder', 'App.tsx generated', 'success');
    } catch (e: any) {
         addLog('coder', `Generation failed: ${e.message}`, 'error');
         throw e;
    }

    // 5. Compiler Agent
    setState(prev => ({ ...prev, activeAgent: 'compiler' }));
    await wait(500);
    addLog('compiler', 'Compiling to runnable bundle...', 'info');
    try {
        const html = await compileToHtml(generatedCode);
        setState(prev => ({ ...prev, previewContent: html }));
        addLog('compiler', 'Build successful', 'success');
    } catch (e: any) {
         setState(prev => ({ ...prev, activeAgent: 'patcher' }));
         addLog('compiler', `Build error: ${e.message}`, 'error');
         addLog('patcher', 'Attempting auto-repair...', 'warning');
         const fixedCode = await fixCode(generatedCode, e.message);
         const cleanFixed = fixedCode.replace(/^```tsx|^```typescript|^```javascript|^```/g, '').replace(/```$/g, '');
         setState(prev => ({ ...prev, codeContent: cleanFixed }));
         const html = await compileToHtml(cleanFixed);
         setState(prev => ({ ...prev, previewContent: html }));
         addLog('patcher', 'Repair successful', 'success');
    }
    setState(prev => ({ ...prev, activeAgent: 'idle', status: 'completed' }));
    addLog('system', 'Application ready', 'success');
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="flex flex-col h-screen bg-ide-bg text-ide-text overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="h-14 bg-ide-panel/50 backdrop-blur-md border-b border-ide-border flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-3 w-48">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Layout size={18} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white text-sm">Agentic Studio <span className="text-blue-400 font-extrabold">Pro</span></span>
        </div>
        
        <div className="flex-1 max-w-2xl mx-8 relative group">
           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-500">
             <Sparkles size={16} />
           </div>
           <input 
             type="text" 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && startSimulation()}
             className="w-full bg-black/20 border border-ide-border rounded-lg pl-10 pr-24 py-2 text-sm focus:outline-none focus:border-ide-accent focus:bg-ide-panel transition-all text-slate-200 placeholder:text-slate-600"
             placeholder="Describe your dream app..."
           />
           <button 
             onClick={startSimulation}
             disabled={state.status === 'running'}
             className="absolute right-1.5 top-1.5 bottom-1.5 bg-ide-accent hover:bg-ide-accentHover text-white px-3 text-xs font-medium rounded-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-sm"
           >
             {state.status === 'running' ? 'Building...' : 'Generate'}
             <Send size={12} />
           </button>
        </div>

        <div className="flex items-center gap-4 w-48 justify-end">
           <AgentStatus activeAgent={state.activeAgent} status={state.status} />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar */}
        <div style={{ width: sidebarWidth }} className="flex-shrink-0 flex flex-col bg-ide-sidebar border-r border-ide-border transition-none">
          <div className="h-9 border-b border-ide-border flex items-center px-3 gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <SidebarIcon size={12} /> Explorer
          </div>
          <FileExplorer files={state.files} activeFile={state.currentFile} />
        </div>
        
        {/* Sidebar Resizer */}
        <div 
           className="w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-10 flex items-center justify-center group"
           onMouseDown={startResizing('sidebar')}
        >
           <div className="w-0.5 h-8 bg-slate-700 group-hover:bg-blue-400 rounded-full transition-colors" />
        </div>

        {/* Center: Editor & Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-ide-bg">
          <div className="flex-1 flex flex-col relative overflow-hidden">
             <CodeEditor 
               content={state.codeContent} 
               fileName={state.currentFile}
               activeAgent={state.activeAgent} 
             />
             
             {/* Floating Agent Status Toast */}
             {state.status === 'running' && (
               <div className="absolute top-4 right-4 bg-ide-panel/90 backdrop-blur border border-ide-border p-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 z-20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {state.activeAgent === 'patcher' ? 'Self-Healing Active' : 'Swarm Intelligence Active'}
                  </span>
                  <Zap size={14} className="text-yellow-500 fill-yellow-500/20" />
               </div>
             )}
          </div>

          {/* Terminal Resizer */}
          <div 
             className="h-1 cursor-row-resize hover:bg-blue-500/50 transition-colors z-10 flex items-center justify-center group bg-ide-border/50"
             onMouseDown={startResizing('terminal')}
          >
             <div className="h-0.5 w-16 bg-slate-600 group-hover:bg-blue-400 rounded-full transition-colors" />
          </div>

          <div style={{ height: terminalHeight }} className="flex-shrink-0 bg-ide-panel flex flex-col transition-none">
             <Terminal 
                logs={state.logs} 
                messages={state.messages}
                onSendMessage={handleChat}
                isTyping={isChatting}
             />
          </div>
        </div>

        {/* Preview Resizer */}
        <div 
           className="w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-10 flex items-center justify-center group bg-ide-bg border-l border-ide-border"
           onMouseDown={startResizing('preview')}
        >
          <div className="w-0.5 h-8 bg-slate-700 group-hover:bg-blue-400 rounded-full transition-colors" />
        </div>

        {/* Right: Preview */}
        <div style={{ width: previewWidth }} className="flex-shrink-0 bg-ide-bg flex flex-col transition-none">
           <div className="h-9 border-b border-ide-border flex items-center px-3 gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider bg-ide-panel">
             <MonitorPlay size={12} /> Live Preview
           </div>
           <div className="flex-1 p-4 bg-zinc-950/50">
             <Preview 
               url={state.previewUrl} 
               isReady={state.status === 'completed'} 
               activeAgent={state.activeAgent}
               previewContent={state.previewContent}
             />
           </div>
        </div>

      </div>
      
      {/* Resizing Overlay (for smooth dragging over iframes) */}
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize" />}
    </div>
  );
};

export default App;