import React, { useEffect, useRef, useState } from 'react';
import { LogEntry, ChatMessage, AgentRole } from '../types';
import { 
  Terminal as TerminalIcon, 
  MessageSquare, 
  Send, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  BrainCircuit,
  PenTool,
  Hammer,
  Code2,
  Play,
  Stethoscope,
  ChevronRight,
  User,
  Bot,
  Sparkles
} from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const AgentIcon = ({ role }: { role: AgentRole }) => {
  switch(role) {
    case 'planner': return <BrainCircuit size={14} className="text-purple-400" />;
    case 'designer': return <PenTool size={14} className="text-pink-400" />;
    case 'architect': return <Hammer size={14} className="text-orange-400" />;
    case 'coder': return <Code2 size={14} className="text-blue-400" />;
    case 'compiler': return <Play size={14} className="text-yellow-400" />;
    case 'patcher': return <Stethoscope size={14} className="text-red-400" />;
    default: return <Cpu size={14} className="text-slate-400" />;
  }
};

const LogItem = ({ log }: { log: LogEntry }) => {
  const isError = log.type === 'error';
  const isSuccess = log.type === 'success';
  const isWarning = log.type === 'warning';
  
  return (
    <div className={`flex gap-3 py-1.5 px-2 rounded-sm hover:bg-white/5 transition-colors font-mono text-xs ${isError ? 'bg-red-500/10' : ''}`}>
      <span className="text-slate-600 shrink-0 select-none w-14 text-[10px] pt-0.5">
        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      
      <div className="flex items-start gap-2 min-w-0">
        <div className="mt-0.5 shrink-0">
           {log.source !== 'system' && log.source !== 'user' ? (
             <AgentIcon role={log.source as AgentRole} />
           ) : (
             <ChevronRight size={14} className="text-slate-500" />
           )}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className={`uppercase font-bold text-[10px] tracking-wider ${
              log.source === 'planner' ? 'text-purple-400' :
              log.source === 'designer' ? 'text-pink-400' :
              log.source === 'architect' ? 'text-orange-400' :
              log.source === 'coder' ? 'text-blue-400' :
              log.source === 'compiler' ? 'text-yellow-400' :
              log.source === 'patcher' ? 'text-red-400' :
              'text-slate-500'
            }`}>
              {log.source}
            </span>
            {isSuccess && <CheckCircle2 size={10} className="text-green-500" />}
            {isError && <XCircle size={10} className="text-red-500" />}
            {isWarning && <AlertTriangle size={10} className="text-yellow-500" />}
          </div>
          <span className={`break-words ${isError ? 'text-red-200' : isSuccess ? 'text-green-300' : 'text-slate-300'}`}>
            {log.message}
          </span>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex gap-3 flex-row animate-in fade-in duration-300">
     <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
        <Sparkles size={14} className="text-blue-400" />
     </div>
     <div className="flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-blue-600/10 border border-blue-500/20 text-blue-100">
           <div className="flex gap-1 h-2 items-center">
             <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
             <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
             <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
           </div>
        </div>
     </div>
  </div>
);

const Terminal: React.FC<TerminalProps> = ({ logs, messages, onSendMessage, isTyping }) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'chat'>('trace');
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'trace') bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (activeTab === 'chat') chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, messages, activeTab, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0a09]">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-ide-border bg-ide-panel/50">
        <button 
          onClick={() => setActiveTab('trace')}
          className={`relative flex items-center gap-2 text-xs font-medium py-2 px-4 transition-colors ${activeTab === 'trace' ? 'text-blue-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <TerminalIcon size={14} />
          <span>Agent Trace</span>
          {activeTab === 'trace' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`relative flex items-center gap-2 text-xs font-medium py-2 px-4 transition-colors ${activeTab === 'chat' ? 'text-blue-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare size={14} />
          <span>Assistant</span>
          {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
        </button>
        
        <div className="flex-1" />
        <div className="px-3 text-[10px] text-slate-600 font-mono">
           v2.5.0-stable
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'trace' ? (
           <div className="h-full overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                    <TerminalIcon size={32} className="mb-2" />
                    <p className="text-xs">System ready. Waiting for tasks...</p>
                </div>
            )}
            {logs.map((log) => <LogItem key={log.id} log={log} />)}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col bg-[#0c0a09]">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
               {messages.length === 0 && !isTyping && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                   <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                     <Sparkles size={24} className="text-blue-400" />
                   </div>
                   <div className="text-center">
                     <h3 className="text-sm font-medium text-slate-300">Agentic Assistant</h3>
                     <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
                       Ask questions about the generated code, request changes, or get technical explanations.
                     </p>
                   </div>
                 </div>
               )}
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                      {msg.role === 'user' ? <User size={14} className="text-slate-300" /> : <Sparkles size={14} className="text-blue-400" />}
                   </div>
                   <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                          : 'bg-blue-600/10 text-blue-100 border border-blue-500/20 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-600 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                   </div>
                 </div>
               ))}
               {isTyping && <TypingIndicator />}
               <div ref={chatBottomRef} />
            </div>
            
            <div className="p-3 border-t border-ide-border bg-ide-panel/30">
               <div className="relative flex items-center">
                 <input 
                   className="w-full bg-black/20 border border-ide-border rounded-lg pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-ide-accent/50 focus:bg-black/40 transition-all placeholder:text-slate-600"
                   placeholder="Type a message to the assistant..."
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <button 
                   onClick={handleSend} 
                   className="absolute right-2 p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                 >
                   <Send size={16} />
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;