import React from 'react';
import { AgentRole } from '../types';
import { 
  BrainCircuit, 
  PenTool, 
  Hammer, 
  Code2, 
  Play, 
  Stethoscope, 
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface AgentStatusProps {
  activeAgent: AgentRole;
  status: 'idle' | 'running' | 'completed' | 'error';
}

const AgentStatus: React.FC<AgentStatusProps> = ({ activeAgent, status }) => {
  const agents = [
    { id: 'planner', name: 'Planner', icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { id: 'designer', name: 'Designer', icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
    { id: 'architect', name: 'Architect', icon: Hammer, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    { id: 'coder', name: 'Coder', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { id: 'compiler', name: 'Compiler', icon: Play, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
    { id: 'patcher', name: 'Patcher', icon: Stethoscope, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  ];

  if (status === 'completed') {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Build Successful</span>
        </div>
    )
  }

  const active = agents.find(a => a.id === activeAgent);

  if (!active || status === 'idle') {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-ide-panel border border-ide-border text-ide-muted">
            <span className="text-sm">Ready to build</span>
        </div>
      );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${active.bg} ${active.border} transition-all duration-300`}>
      <active.icon size={18} className={`${active.color} animate-pulse`} />
      <div className="flex flex-col">
        <span className={`text-xs font-bold uppercase tracking-wider ${active.color}`}>
          {active.name} Agent
        </span>
        <span className="text-[10px] text-white/60 flex items-center gap-1">
             <Loader2 size={8} className="animate-spin"/> Working...
        </span>
      </div>
    </div>
  );
};

export default AgentStatus;