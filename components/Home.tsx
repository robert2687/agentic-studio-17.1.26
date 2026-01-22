import React from 'react';
import { Sparkles, Layout, Zap, ArrowRight, Code2, Layers, Cpu } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-ide-panel/50 border border-ide-border p-6 rounded-xl hover:bg-ide-panel hover:border-ide-accent/50 transition-all group">
    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-blue-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-ide-bg to-ide-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full px-6 z-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-6 animate-in slide-in-from-top-4 duration-700">
           <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider flex items-center gap-2">
             <Sparkles size={12} /> AI-Powered Development
           </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Agentic Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Pro</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mb-10 animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Describe your dream application and watch as a swarm of AI agents architect, design, and code it in real-time.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-slate-900 animate-in slide-in-from-bottom-4 duration-700 delay-300"
        >
          Start Building
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/10 group-hover:ring-white/20 transition-all"></div>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left animate-in fade-in duration-1000 delay-500 w-full">
          <FeatureCard 
            icon={Layout} 
            title="Intelligent Architecture" 
            desc="The Planner agent analyzes your needs to create a robust file structure and component hierarchy." 
          />
          <FeatureCard 
            icon={Code2} 
            title="Production-Ready Code" 
            desc="Generates clean, modern React + Tailwind code that follows best practices and is easy to maintain." 
          />
          <FeatureCard 
            icon={Cpu} 
            title="Self-Healing Runtime" 
            desc="Runtime errors are automatically detected, analyzed, and patched by the Patcher agent instantly." 
          />
        </div>
      </div>
      
      <div className="absolute bottom-6 text-slate-600 text-xs font-mono">
        v2.5.0-stable • Powered by Gemini 1.5 Pro
      </div>
    </div>
  );
};

export default Home;