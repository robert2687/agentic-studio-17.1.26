import React, { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { SimulationState, AppDefinition, FileNode, Project } from './types';
import AgentStatus from './components/AgentStatus';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import Preview from './components/Preview';
import Home from './components/Home';
import Wizard from './components/Wizard';
import Projects from './components/Projects';
import Settings from './components/Settings';
import GlobalSidebar from './components/GlobalSidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { INITIAL_FILES } from './lib/mockData';
import { orchestrator } from './lib/orchestrator';
import { aiClient } from './lib/aiClient';
import { logger } from './lib/logger';
import { Send, Sparkles, Sidebar as SidebarIcon, MonitorPlay, Play, Download, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isDark, setIsDark] = useState(true);
  
  const [state, setState] = useState<SimulationState>({
    view: 'home',
    status: 'idle',
    activeAgent: 'idle',
    currentFile: null,
    files: INITIAL_FILES,
    logs: [],
    messages: [],
    previewUrl: 'localhost:3000',
    codeContent: '',
    previewContent: null,
    iteration: 0,
    projects: []
  });

  // Logger Subscription
  useEffect(() => {
    const unsubscribe = logger.subscribe((entry) => {
      setState(prev => ({
        ...prev,
        logs: [...prev.logs, entry]
      }));
    });
    return unsubscribe;
  }, []);

  // Load Projects from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('agentic-projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, projects: parsed }));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  // Save Projects to LocalStorage on change
  useEffect(() => {
    if (state.projects.length > 0) {
      localStorage.setItem('agentic-projects', JSON.stringify(state.projects));
    }
  }, [state.projects]);

  // Layout State
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [previewWidth, setPreviewWidth] = useState(450);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Theme Handling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Helper for State Updates from Orchestrator
  const updateState = useCallback((update: Partial<SimulationState>) => {
    setState(prev => ({ ...prev, ...update }));
  }, []);

  // --- Core Actions using Orchestrator ---

  const runAgentSequence = async (def: AppDefinition) => {
    try {
      const result = await orchestrator.startGeneration(def, updateState);
      
      const newProject: Project = {
          id: Math.random().toString(36),
          name: def.name,
          definition: def,
          createdAt: Date.now(),
          files: result.files as FileNode[], 
          previewUrl: 'localhost:3000',
          status: 'completed'
      };
      
      setState(prev => {
          const updatedProjects = [newProject, ...prev.projects];
          return { ...prev, projects: updatedProjects };
      });

    } catch (e) {
      console.error(e);
    }
  };

  const startRefinement = async () => {
    if (state.status === 'running' || !prompt.trim()) return;
    const userPrompt = prompt;
    setPrompt(''); // Clear input immediately
    
    await orchestrator.refineCode(state.codeContent, userPrompt, updateState);
  };

  const handleManualCompile = async () => {
     if (!state.codeContent) return;
     updateState({ status: 'running', activeAgent: 'compiler' });
     logger.log('user', 'Manual build triggered');
     try {
        const html = await aiClient.compileToHtml(state.codeContent);
        updateState({ previewContent: html, status: 'completed', activeAgent: 'idle' });
        logger.success('compiler', 'Build successful');
     } catch (e: any) {
        logger.error('compiler', `Build failed: ${e.message}`);
        updateState({ status: 'completed', activeAgent: 'idle' });
     }
  };

  const healApp = async (errorMsg: string) => {
      if (state.status === 'running' || state.activeAgent === 'patcher') return;
      await orchestrator.healApp(state.codeContent, errorMsg, updateState);
  };

  // --- Chat & Export ---

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
        const response = await aiClient.chat(state.messages, text, state.codeContent);
        addChatMessage('model', response);
    } catch (e) {
        addChatMessage('model', "Connection error.");
    } finally {
        setIsChatting(false);
    }
  };

  const handleExport = async () => {
     if (!state.codeContent) return;
     const zip = new JSZip();
     zip.file("package.json", JSON.stringify({ name: state.definition?.name.toLowerCase().replace(/\s/g, '-') || "agentic-app", version: "1.0.0", dependencies: { "react": "^18.2.0", "react-dom": "^18.2.0", "lucide-react": "^0.263.1" }}, null, 2));
     zip.file("index.html", '<div id="root"></div>');
     zip.file("src/App.tsx", state.codeContent);
     zip.file("README.md", `# ${state.definition?.name}\n\nGenerated by Agentic Studio Pro.\n\n## How to run\n1. Install dependencies: \`npm install\`\n2. Run dev server: \`npm start\``);
     
     const content = await zip.generateAsync({ type: "blob" });
     const url = window.URL.createObjectURL(content);
     const a = document.createElement("a");
     a.href = url;
     a.download = `${state.definition?.name || 'project'}.zip`;
     a.click();
     window.URL.revokeObjectURL(url);
     logger.success('system', 'Project exported to ZIP');
  };

  const openProject = (project: Project) => {
    setState(prev => ({
        ...prev,
        view: 'workspace',
        status: 'completed',
        activeAgent: 'idle',
        files: project.files,
        logs: [{ id: 'restored', timestamp: Date.now(), source: 'system', message: `Restored: ${project.name}`, type: 'info' }],
        definition: project.definition,
        codeContent: project.files.find(f => f.children?.find(c => c.name === 'App.tsx'))?.children?.find(c => c.name === 'App.tsx')?.content || "// Code not found"
    }));
  };

  const clearHistory = () => {
      localStorage.removeItem('agentic-projects');
      setState(prev => ({ ...prev, projects: [] }));
  };

  // --- Effects ---

  // Resize Logic
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
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(el => el.style.pointerEvents = 'auto');
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(el => el.style.pointerEvents = 'none');
    document.body.style.cursor = direction === 'terminal' ? 'row-resize' : 'col-resize';
  }, [sidebarWidth, previewWidth, terminalHeight]);

  // Error Listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'PREVIEW_ERROR') {
            logger.error('system', `Runtime Error: ${event.data.message}`);
            healApp(event.data.message);
        }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [state.codeContent]); 

  // --- View Router ---
  const renderView = () => {
    switch(state.view) {
        case 'home':
            return <ErrorBoundary><Home onStart={() => setState(prev => ({ ...prev, view: 'wizard' }))} /></ErrorBoundary>;
        case 'wizard':
            return <ErrorBoundary><Wizard onComplete={(def) => runAgentSequence(def)} onCancel={() => setState(prev => ({ ...prev, view: 'home' }))} /></ErrorBoundary>;
        case 'projects':
            return <ErrorBoundary><Projects projects={state.projects} onOpenProject={openProject} /></ErrorBoundary>;
        case 'settings':
            return <ErrorBoundary><Settings onClearHistory={clearHistory} /></ErrorBoundary>;
        case 'workspace':
        case 'generating':
            return (
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Sidebar */}
                    <div style={{ width: sidebarWidth }} className="flex-shrink-0 flex flex-col bg-ide-sidebar border-r border-ide-border transition-none">
                    <div className="h-9 border-b border-ide-border flex items-center px-3 gap-2 text-xs font-medium text-ide-muted uppercase tracking-wider">
                        <SidebarIcon size={12} /> Explorer
                    </div>
                    <FileExplorer files={state.files} activeFile={state.currentFile} />
                    </div>
                    
                    {/* Sidebar Resizer */}
                    <div 
                        className="w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-10 flex items-center justify-center group"
                        onMouseDown={startResizing('sidebar')}
                    >
                        <div className="w-0.5 h-8 bg-ide-border group-hover:bg-blue-400 rounded-full transition-colors" />
                    </div>

                    {/* Center: Editor & Terminal */}
                    <div className="flex-1 flex flex-col min-w-0 bg-ide-bg">
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                        <ErrorBoundary fallback={<div className="p-4 text-red-400">Editor Error</div>}>
                        <CodeEditor 
                            content={state.codeContent} 
                            fileName={state.currentFile}
                            activeAgent={state.activeAgent}
                            onChange={(newCode) => setState(prev => ({ ...prev, codeContent: newCode }))}
                        />
                        </ErrorBoundary>
                        
                        {/* Floating Agent Status Toast */}
                        {state.status === 'running' && (
                        <div className="absolute top-4 right-4 bg-ide-panel/90 backdrop-blur border border-ide-border p-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 z-20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-xs text-ide-text font-medium">
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
                        <div className="h-0.5 w-16 bg-ide-border group-hover:bg-blue-400 rounded-full transition-colors" />
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
                        <div className="w-0.5 h-8 bg-ide-border group-hover:bg-blue-400 rounded-full transition-colors" />
                    </div>

                    {/* Right: Preview */}
                    <div style={{ width: previewWidth }} className="flex-shrink-0 bg-ide-bg flex flex-col transition-none">
                        <div className="h-9 border-b border-ide-border flex items-center px-3 gap-2 text-xs font-medium text-ide-muted uppercase tracking-wider bg-ide-panel">
                            <MonitorPlay size={12} /> Live Preview
                        </div>
                        <div className="flex-1 p-4 bg-zinc-950/50">
                            <ErrorBoundary fallback={<div className="text-white p-4">Preview Crash</div>}>
                            <Preview 
                                url={state.previewUrl} 
                                isReady={state.status === 'completed'} 
                                activeAgent={state.activeAgent}
                                previewContent={state.previewContent}
                            />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="flex h-screen bg-ide-bg text-ide-text overflow-hidden font-sans selection:bg-ide-accent selection:text-white transition-colors duration-300">
      
      {/* Global Sidebar (Navigation) */}
      <GlobalSidebar 
        currentView={state.view} 
        onNavigate={(view) => setState(prev => ({ ...prev, view }))} 
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Header (Only visible in Workspace mode) */}
        {state.view === 'workspace' && (
            <header className="h-14 bg-ide-panel border-b border-ide-border flex items-center justify-between px-4 flex-shrink-0 z-40 transition-colors duration-300">
                <div className="flex items-center gap-3">
                    <span className="font-bold tracking-tight text-ide-text text-sm">{state.definition?.name || 'Untitled Project'}</span>
                    {state.status === 'running' && <span className="text-xs text-ide-muted animate-pulse">Building...</span>}
                </div>
                
                <div className="flex-1 max-w-xl mx-8 relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none transition-colors group-focus-within:text-ide-accent text-ide-muted">
                    <Sparkles size={16} />
                </div>
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && startRefinement()}
                    className="w-full bg-ide-bg border border-ide-border rounded-lg pl-10 pr-24 py-2 text-sm focus:outline-none focus:border-ide-accent focus:bg-ide-panel transition-all text-ide-text placeholder:text-ide-muted"
                    placeholder="Describe changes to update the app..."
                    disabled={state.status === 'running'}
                />
                <button 
                    onClick={startRefinement}
                    disabled={state.status === 'running'}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-ide-accent hover:bg-ide-accentHover text-white px-3 text-xs font-medium rounded-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-sm"
                >
                    {state.status === 'running' ? 'Working...' : 'Update'}
                    <Send size={12} />
                </button>
                </div>

                <div className="flex items-center gap-4 w-auto justify-end">
                {state.status === 'completed' && (
                    <>
                    <button 
                        onClick={handleManualCompile}
                        className="bg-green-600/20 hover:bg-green-600/30 text-green-600 dark:text-green-400 border border-green-600/30 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors"
                        title="Run manual code changes"
                    >
                        <Play size={12} fill="currentColor" /> Run
                    </button>
                    <button 
                        onClick={handleExport}
                        className="bg-ide-panel hover:bg-ide-border text-ide-text border border-ide-border px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors"
                        title="Download Project ZIP"
                    >
                        <Download size={14} /> Export
                    </button>
                    </>
                )}
                <AgentStatus activeAgent={state.activeAgent} status={state.status} />
                </div>
            </header>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative bg-ide-bg">
            <ErrorBoundary>
                {renderView()}
            </ErrorBoundary>
        </div>
      </div>
      
      {/* Resizing Overlay */}
      {isResizing && <div className="fixed inset-0 z-[9999] cursor-col-resize" />}
    </div>
  );
};

export default App;