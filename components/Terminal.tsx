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
  Sparkles
} from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const AgentIcon: React.FC<{ role: AgentRole }> = ({ role }) => {
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

const LogItem: React.FC<{ log: LogEntry }> = ({ log }) => {
  const isError = log.type === 'error';
  const isSuccess = log.type === 'success';
  const isWarning = log.type === 'warning';
  
  return (
    <div className={`flex gap-3 py-1.5 px-3 rounded hover:bg-white/5 transition-colors font-mono text-xs ${isError ? 'bg-red-500/10' : ''}`}>
      <span className="text-slate-600 shrink-0 select-none w-16 text-[10px] pt-0.5 opacity-70">
        {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      
      <div className="flex items-start gap-2 min-w-0">
        <div className="mt-0.5 shrink-0">
           {log.source !== 'system' && log.source !== 'user' ? (
             <AgentIcon role={log.source as AgentRole} />
           ) : (
             <ChevronRight size={14} className="text-slate-600" />
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
          <span className={`break-words leading-relaxed ${isError ? 'text-red-300' : isSuccess ? 'text-green-300' : 'text-slate-300'}`}>
            {log.message}
          </span>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex gap-3 flex-row animate-fade-in pl-2">
     <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
        <Sparkles size={12} className="text-blue-400" />
     </div>
     <div className="flex items-center">
       <div className="flex gap-1 h-2 items-center">
         <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
         <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
         <div className="w-1 h-1 bg-blue-400 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
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
    <div className="flex flex-col h-full bg-[#050505]">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-white/5 bg-black/40 backdrop-blur-sm">
        <button 
          onClick={() => setActiveTab('trace')}
          className={`relative flex items-center gap-2 text-xs font-medium py-2.5 px-5 transition-colors ${activeTab === 'trace' ? 'text-blue-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <TerminalIcon size={14} />
          <span>Execution Trace</span>
          {activeTab === 'trace' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`relative flex items-center gap-2 text-xs font-medium py-2.5 px-5 transition-colors ${activeTab === 'chat' ? 'text-blue-400 bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <MessageSquare size={14} />
          <span>Swarm Chat</span>
          {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
        </button>
        
        <div className="flex-1" />
        <div className="px-3 text-[10px] text-slate-700 font-mono flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           SYSTEM ONLINE
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'trace' ? (
           <div className="h-full overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50">
                    <TerminalIcon size={32} className="mb-3 opacity-50" />
                    <p className="text-xs tracking-wider uppercase">Awaiting Instructions</p>
                </div>
            )}
            {logs.map((log) => <LogItem key={log.id} log={log} />)}
            <div ref={bottomRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col bg-black/20">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
               {messages.length === 0 && !isTyping && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                   <div className="w-12 h-12 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center">
                     <Sparkles size={20} className="text-blue-400/50" />
                   </div>
                   <div className="text-center">
                     <h3 className="text-sm font-medium text-slate-300">Agentic Assistant</h3>
                     <p className="text-xs text-slate-600 mt-1 max-w-[250px]">
                       Coordinate directly with the agent swarm.
                     </p>
                   </div>
                 </div>
               )}
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-blue-600/10 border border-blue-500/20'}`}>
                      {msg.role === 'user' ? <User size={14} className="text-slate-400" /> : <Sparkles size={14} className="text-blue-400" />}
                   </div>
                   <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                          : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
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
            
            <div className="p-3 border-t border-white/5 bg-black/40">
               <div className="relative flex items-center">
                 <input 
                   className="w-full bg-white/5 border border-white/5 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500/30 focus:bg-black/40 transition-all placeholder:text-slate-600"
                   placeholder="Command the swarm..."
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   disabled={isTyping}
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