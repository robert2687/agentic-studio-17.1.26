import React, { useState } from 'react';
import { AppDefinition, Page, Entity, ThemeVibe } from '../types';
import { Layout, Globe, FileText, Check, ArrowRight, ArrowLeft, Palette, Grid, Sidebar as SidebarIcon, LayoutTemplate, Database, Plus, Trash2, Layers } from 'lucide-react';

interface WizardProps {
  onComplete: (def: AppDefinition) => void;
  onCancel: () => void;
}

const Wizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<AppDefinition>>({
    name: 'Untitled Project',
    type: 'Dashboard',
    platform: 'Web SPA',
    tech: 'React + Tailwind',
    features: [],
    description: '',
    entities: [],
    pages: [],
    design: {
      theme: 'Modern',
      primaryColor: '#3b82f6',
      navStyle: 'Sidebar'
    }
  });

  const [newEntity, setNewEntity] = useState({ name: '', fields: '' });
  const [newPage, setNewPage] = useState({ name: '', type: 'dashboard' as Page['type'] });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else if (data.description && data.name) onComplete(data as AppDefinition);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const toggleFeature = (feat: string) => {
    const current = data.features || [];
    if (current.includes(feat)) {
      setData({ ...data, features: current.filter(f => f !== feat) });
    } else {
      setData({ ...data, features: [...current, feat] });
    }
  };

  const addEntity = () => {
    if (!newEntity.name) return;
    const entity: Entity = { id: Math.random().toString(36).substr(2, 9), name: newEntity.name, fields: newEntity.fields };
    setData({ ...data, entities: [...(data.entities || []), entity] });
    setNewEntity({ name: '', fields: '' });
  };

  const removeEntity = (id: string) => {
    setData({ ...data, entities: data.entities?.filter(e => e.id !== id) });
  };

  const addPage = () => {
    if (!newPage.name) return;
    const page: Page = { id: Math.random().toString(36).substr(2, 9), name: newPage.name, type: newPage.type };
    setData({ ...data, pages: [...(data.pages || []), page] });
    setNewPage({ name: '', type: 'dashboard' });
  };

  const removePage = (id: string) => {
    setData({ ...data, pages: data.pages?.filter(p => p.id !== id) });
  };

  const SelectCard = ({ selected, onClick, title, desc, icon: Icon }: any) => (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-4 group ${
        selected 
          ? 'border-ide-accent bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
          : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
      }`}
    >
      <div className={`p-2.5 rounded-lg transition-colors ${selected ? 'bg-blue-500 text-white' : 'bg-white/5 text-ide-muted group-hover:text-ide-text'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h4 className={`font-medium text-sm ${selected ? 'text-white' : 'text-ide-text'}`}>{title}</h4>
        <p className="text-xs text-ide-muted mt-1 leading-relaxed">{desc}</p>
      </div>
      {selected && <div className="text-ide-accent animate-in fade-in zoom-in duration-200"><Check size={18} /></div>}
    </div>
  );

  return (
    <div className="h-full flex items-center justify-center p-6 animate-fade-in">
      <div className="max-w-5xl w-full glass rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[850px] relative">
        {/* Progress Header */}
        <div className="px-8 py-6 border-b border-ide-border flex items-center justify-between bg-black/20 backdrop-blur-xl">
          <div>
             <h2 className="text-lg font-semibold text-ide-text tracking-tight">Project Initialization</h2>
             <p className="text-xs text-ide-muted mt-1 font-mono">STEP 0{step} / 04</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${i <= step ? 'bg-ide-accent shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
              <div className="space-y-3">
                <label className="text-sm font-medium text-ide-muted uppercase tracking-wider">Project Name</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-lg text-ide-text focus:outline-none focus:border-ide-accent/50 focus:ring-1 focus:ring-ide-accent/50 transition-all placeholder:text-white/10"
                  placeholder="e.g. Nexus Dashboard"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-ide-muted uppercase tracking-wider">Archetype</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectCard title="Analytical Dashboard" desc="Data visualization, heavy grids, charts." icon={Layout} selected={data.type === 'Dashboard'} onClick={() => setData({ ...data, type: 'Dashboard' })} />
                  <SelectCard title="Landing Experience" desc="Marketing, hero sections, feature grids." icon={Globe} selected={data.type === 'Landing Page'} onClick={() => setData({ ...data, type: 'Landing Page' })} />
                  <SelectCard title="CRUD System" desc="Resource management, tables, forms." icon={FileText} selected={data.type === 'CRUD App'} onClick={() => setData({ ...data, type: 'CRUD App' })} />
                  <SelectCard title="Conversational UI" desc="Chat bots, messaging interfaces." icon={LayoutTemplate} selected={data.type === 'Chat UI'} onClick={() => setData({ ...data, type: 'Chat UI' })} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-8">
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-ide-muted uppercase tracking-wider">Core Logic</label>
                      <span className="text-[10px] text-ide-accent bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Natural Language</span>
                   </div>
                   <textarea 
                      value={data.description || ''}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-5 text-ide-text focus:outline-none focus:border-ide-accent/50 focus:ring-1 focus:ring-ide-accent/50 transition-all resize-none leading-relaxed"
                      placeholder="Describe the application flow, key interactions, and user goals..."
                   />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-ide-muted uppercase tracking-wider">Capabilities</label>
                  <div className="flex flex-wrap gap-2">
                    {['Responsive Layout', 'Dark Mode', 'Authentication', 'Charts', 'Data Grid', 'Sidebar Nav', 'Modals', 'Forms', 'Notifications', 'Settings Panel'].map(feat => (
                      <button
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          data.features?.includes(feat)
                            ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                            : 'bg-white/5 border-white/10 text-ide-muted hover:border-white/20 hover:text-ide-text'
                        }`}
                      >
                        {feat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 {/* Entities */}
                 <div className="glass-panel p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                       <Database size={16} />
                       <h3 className="text-sm font-bold uppercase tracking-wider">Data Schema</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4 min-h-[100px]">
                      {data.entities?.map(entity => (
                        <div key={entity.id} className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-white/5 group">
                           <div>
                              <div className="text-sm font-medium text-ide-text">{entity.name}</div>
                              <div className="text-[10px] text-ide-muted font-mono">{entity.fields}</div>
                           </div>
                           <button onClick={() => removeEntity(entity.id)} className="text-ide-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      {data.entities?.length === 0 && <div className="text-xs text-ide-muted/50 italic text-center py-8">No entities defined</div>}
                    </div>

                    <div className="flex gap-2">
                       <input 
                         placeholder="Entity Name" 
                         className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ide-accent text-ide-text placeholder:text-white/20"
                         value={newEntity.name}
                         onChange={e => setNewEntity({...newEntity, name: e.target.value})}
                       />
                       <input 
                         placeholder="fields: id, name..." 
                         className="flex-[2] bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ide-accent text-ide-text placeholder:text-white/20"
                         value={newEntity.fields}
                         onChange={e => setNewEntity({...newEntity, fields: e.target.value})}
                       />
                       <button onClick={addEntity} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg border border-white/10"><Plus size={16}/></button>
                    </div>
                 </div>

                 {/* Pages */}
                 <div className="glass-panel p-5 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-orange-400">
                       <Layers size={16} />
                       <h3 className="text-sm font-bold uppercase tracking-wider">Route Map</h3>
                    </div>
                    
                    <div className="space-y-2 mb-4 min-h-[100px]">
                      {data.pages?.map(page => (
                        <div key={page.id} className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-white/5 group">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-ide-muted uppercase">{page.type}</span>
                              <span className="text-sm font-medium text-ide-text">{page.name}</span>
                           </div>
                           <button onClick={() => removePage(page.id)} className="text-ide-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      {data.pages?.length === 0 && <div className="text-xs text-ide-muted/50 italic text-center py-8">No pages defined</div>}
                    </div>

                    <div className="flex gap-2">
                       <input 
                         placeholder="Page Name" 
                         className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ide-accent text-ide-text placeholder:text-white/20"
                         value={newPage.name}
                         onChange={e => setNewPage({...newPage, name: e.target.value})}
                       />
                       <select 
                          className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ide-accent text-ide-text"
                          value={newPage.type}
                          onChange={e => setNewPage({...newPage, type: e.target.value as any})}
                       >
                          <option value="dashboard">Dashboard</option>
                          <option value="list">List</option>
                          <option value="detail">Detail</option>
                          <option value="form">Form</option>
                          <option value="landing">Landing</option>
                       </select>
                       <button onClick={addPage} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg border border-white/10"><Plus size={16}/></button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
              <div>
                <h3 className="text-sm font-medium text-ide-muted uppercase tracking-wider mb-4">Aesthetic Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {['Modern', 'Corporate', 'Playful', 'Brutalist', 'Minimalist'].map((vibe) => (
                    <button
                       key={vibe}
                       onClick={() => setData({ ...data, design: { ...data.design!, theme: vibe as ThemeVibe } })}
                       className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                          data.design?.theme === vibe 
                             ? 'border-ide-accent bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                             : 'border-white/5 bg-white/5 text-ide-muted hover:bg-white/10 hover:text-ide-text'
                       }`}
                    >
                       {vibe}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-sm font-medium text-ide-muted uppercase tracking-wider mb-4">Navigation Structure</h3>
                    <div className="space-y-3">
                    <SelectCard 
                        title="Sidebar" 
                        desc="Vertical rail with expandable menus." 
                        icon={SidebarIcon} 
                        selected={data.design?.navStyle === 'Sidebar'} 
                        onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'Sidebar' } })} 
                    />
                    <SelectCard 
                        title="Top Bar" 
                        desc="Horizontal header with dropdowns." 
                        icon={Layout} 
                        selected={data.design?.navStyle === 'TopBar'} 
                        onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'TopBar' } })} 
                    />
                    <SelectCard 
                        title="Minimal" 
                        desc="Hamburger menu / off-canvas drawer." 
                        icon={Grid} 
                        selected={data.design?.navStyle === 'Minimal'} 
                        onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'Minimal' } })} 
                    />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-ide-muted uppercase tracking-wider mb-4">Primary Brand Token</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'].map(color => (
                        <button
                            key={color}
                            onClick={() => setData({ ...data, design: { ...data.design!, primaryColor: color } })}
                            className={`aspect-square rounded-xl border transition-all hover:scale-105 flex items-center justify-center ${data.design?.primaryColor === color ? 'border-white ring-2 ring-white/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            style={{ backgroundColor: color }}
                        >
                            {data.design?.primaryColor === color && <Check className="text-white drop-shadow-md" size={20} />}
                        </button>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
               <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none -mt-10 -mr-10"></div>
                  
                  <h3 className="text-xl font-bold text-ide-text mb-6">Execution Plan</h3>
                  
                  <div className="grid grid-cols-2 gap-y-8 gap-x-8 mb-8">
                     <div>
                        <span className="text-[10px] uppercase font-bold text-ide-muted tracking-widest">Target</span>
                        <p className="text-ide-text text-lg font-medium mt-1">{data.name}</p>
                     </div>
                     <div>
                        <span className="text-[10px] uppercase font-bold text-ide-muted tracking-widest">Architecture</span>
                        <p className="text-ide-text text-lg font-medium mt-1">{data.type} / {data.platform}</p>
                     </div>
                     <div>
                        <span className="text-[10px] uppercase font-bold text-ide-muted tracking-widest">Complexity</span>
                        <p className="text-ide-text font-medium mt-1 text-base">{data.entities?.length || 0} Models, {data.pages?.length || 0} Routes</p>
                     </div>
                     <div>
                        <span className="text-[10px] uppercase font-bold text-ide-muted tracking-widest">Vibe</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full" style={{ background: data.design?.primaryColor }}></div>
                            <p className="text-ide-text font-medium text-base">{data.design?.theme}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                     <span className="text-[10px] uppercase font-bold text-ide-muted tracking-widest">Objective</span>
                     <p className="text-ide-text/80 italic border-l-2 border-ide-accent pl-4 py-1 leading-relaxed">
                        "{data.description}"
                     </p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <Palette className="text-blue-400 shrink-0 mt-0.5" size={20} />
                  <div>
                      <h4 className="text-blue-400 font-bold text-sm">Ready to Synthesize</h4>
                      <p className="text-blue-300/70 text-sm mt-1">The Planner agent has verified the requirements. Click "Generate" to begin the autonomous build process.</p>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-ide-border bg-black/20 backdrop-blur-xl flex justify-between items-center z-10">
          <button 
            onClick={handleBack}
            className="px-6 py-3 rounded-xl text-ide-muted hover:text-ide-text hover:bg-white/5 transition-colors flex items-center gap-2 font-medium text-sm"
          >
            {step === 1 ? 'Cancel' : <><ArrowLeft size={16} /> Previous</>}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={step === 4 ? false : (step === 1 && !data.name) || (step === 2 && !data.description)}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {step === 4 ? 'Initialize Swarm' : <>Next <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;