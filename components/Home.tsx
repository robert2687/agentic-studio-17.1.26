import React from 'react';
import { Sparkles, Layout, Zap, ArrowRight, Code2, Cpu } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass p-6 rounded-2xl hover:border-ide-accent/40 hover:bg-white/5 transition-all group duration-300">
    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all border border-blue-500/20">
      <Icon size={24} className="text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-ide-text mb-2">{title}</h3>
    <p className="text-sm text-ide-muted leading-relaxed">{desc}</p>
  </div>
);

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-blob"></div>
         <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[20%] left-[40%] w-[300px] h-[300px] bg-cyan-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full px-6 z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-8 animate-fade-in opacity-0">
           <span className="px-3 py-1 rounded-full glass border-blue-500/30 text-blue-400 text-xs font-medium uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
             <Sparkles size={12} /> Gen-3 Alpha Preview
           </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-8 animate-fade-in opacity-0 [animation-delay:100ms] drop-shadow-sm">
          Agentic Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pro</span>
        </h1>
        
        <p className="text-xl text-ide-muted max-w-2xl mb-12 animate-fade-in opacity-0 [animation-delay:200ms] font-light">
          Orchestrate a swarm of AI agents to architect, design, and build production-ready applications in real-time.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white transition-all duration-300 bg-blue-600 rounded-full hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 animate-fade-in opacity-0 [animation-delay:300ms]"
        >
          <span className="mr-2">Initialize Workspace</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all"></div>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full animate-fade-in opacity-0 [animation-delay:500ms]">
          <FeatureCard 
            icon={Layout} 
            title="Recursive Architecture" 
            desc="The Planner agent breaks down high-level prompts into granular file structures and component trees automatically." 
          />
          <FeatureCard 
            icon={Code2} 
            title="Polyglot Generation" 
            desc="Generates clean, typed React + Tailwind code. Adheres to modern patterns and strictly typed interfaces." 
          />
          <FeatureCard 
            icon={Cpu} 
            title="Self-Healing Runtime" 
            desc="The Patcher agent monitors the preview runtime, intercepting errors and hot-patching code instantly." 
          />
        </div>
      </div>
      
      <div className="absolute bottom-6 flex items-center gap-6 text-ide-muted text-[10px] font-mono uppercase tracking-widest opacity-50">
        <span>v2.5.0 Stable</span>
        <span>•</span>
        <span>Latency: 12ms</span>
        <span>•</span>
        <span>Swarm: Active</span>
      </div>
    </div>
  );
};

export default Home;