import React, { useState } from 'react';
import { AppDefinition, AppType, Platform, ThemeVibe, NavStyle, Entity, Page } from '../types';
import { Layout, Globe, Code, FileText, Check, ArrowRight, ArrowLeft, Palette, Grid, Sidebar as SidebarIcon, LayoutTemplate, Database, Plus, Trash2, Layers } from 'lucide-react';

interface WizardProps {
  onComplete: (def: AppDefinition) => void;
  onCancel: () => void;
}

const Wizard: React.FC<WizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<AppDefinition>>({
    name: 'My Awesome App',
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

  // Helper State for Step 2 Inputs
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
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected 
          ? 'border-ide-accent bg-ide-accent/5' 
          : 'border-ide-border bg-ide-panel hover:border-ide-muted'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${selected ? 'bg-ide-accent text-white' : 'bg-ide-bg text-ide-muted'}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className={`font-semibold ${selected ? 'text-ide-text' : 'text-ide-text'}`}>{title}</h4>
          <p className="text-xs text-ide-muted mt-1">{desc}</p>
        </div>
        {selected && <div className="ml-auto text-ide-accent"><Check size={20} /></div>}
      </div>
    </div>
  );

  return (
    <div className="h-full flex items-center justify-center bg-ide-bg p-6 animate-in fade-in duration-500">
      <div className="max-w-5xl w-full bg-ide-sidebar border border-ide-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[800px]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-ide-border flex items-center justify-between bg-ide-panel">
          <div>
             <h2 className="text-xl font-bold text-ide-text">Create New Application</h2>
             <p className="text-sm text-ide-muted">Step {step} of 4: {
                step === 1 ? 'Project Basics' : 
                step === 2 ? 'Structure & Data' : 
                step === 3 ? 'Design System' : 'Review & Generate'
             }</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-12 h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-ide-accent' : 'bg-ide-border'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-ide-bg">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 max-w-3xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ide-text">Project Name</label>
                <input 
                  type="text" 
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full bg-ide-panel border border-ide-border rounded-lg px-4 py-3 text-ide-text focus:outline-none focus:border-ide-accent transition-all"
                  placeholder="e.g. CryptoDash 2025"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ide-text">Application Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectCard title="Dashboard" desc="Analytics, tables, and data visualization." icon={Layout} selected={data.type === 'Dashboard'} onClick={() => setData({ ...data, type: 'Dashboard' })} />
                  <SelectCard title="Landing Page" desc="Marketing sites, portfolios, products." icon={Globe} selected={data.type === 'Landing Page'} onClick={() => setData({ ...data, type: 'Landing Page' })} />
                  <SelectCard title="CRUD App" desc="Data management, forms, listings." icon={FileText} selected={data.type === 'CRUD App'} onClick={() => setData({ ...data, type: 'CRUD App' })} />
                  <SelectCard title="Chat Interface" desc="AI assistants, support bots, messaging." icon={LayoutTemplate} selected={data.type === 'Chat UI'} onClick={() => setData({ ...data, type: 'Chat UI' })} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Requirements & Features */}
              <div className="space-y-6">
                <div>
                   <h3 className="text-lg font-medium text-ide-text mb-2">Requirements</h3>
                   <p className="text-ide-muted text-sm mb-3">Describe functionality in natural language.</p>
                   <textarea 
                      value={data.description || ''}
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      className="w-full h-32 bg-ide-panel border border-ide-border rounded-xl p-4 text-ide-text focus:outline-none focus:border-ide-accent transition-all resize-none"
                      placeholder="e.g., Users can see a list of top 10 cryptocurrencies. Clicking one opens a detail modal with a line chart..."
                   />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-ide-text mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Responsive Design', 'Dark Mode', 'Auth UI', 'Charts', 'Data Tables', 'Sidebar', 'Modals', 'Forms', 'User Profile', 'Settings'].map(feat => (
                      <button
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          data.features?.includes(feat)
                            ? 'bg-ide-accent/10 border-ide-accent text-ide-accent'
                            : 'bg-ide-panel border-ide-border text-ide-muted hover:border-ide-text'
                        }`}
                      >
                        {feat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Structured Data & Pages */}
              <div className="space-y-6">
                 {/* Entities Builder */}
                 <div className="bg-ide-panel border border-ide-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                       <Database size={18} className="text-purple-400" />
                       <h3 className="font-medium text-ide-text">Data Entities</h3>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {data.entities?.map(entity => (
                        <div key={entity.id} className="flex items-center justify-between bg-ide-bg p-2 rounded border border-ide-border">
                           <div>
                              <div className="font-bold text-sm text-ide-text">{entity.name}</div>
                              <div className="text-xs text-ide-muted">{entity.fields}</div>
                           </div>
                           <button onClick={() => removeEntity(entity.id)} className="text-ide-muted hover:text-red-400 p-1"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      {data.entities?.length === 0 && <div className="text-xs text-ide-muted italic text-center py-2">No entities defined.</div>}
                    </div>

                    <div className="flex gap-2">
                       <input 
                         placeholder="Name (e.g. Product)" 
                         className="flex-1 bg-ide-bg border border-ide-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-ide-accent text-ide-text"
                         value={newEntity.name}
                         onChange={e => setNewEntity({...newEntity, name: e.target.value})}
                       />
                       <input 
                         placeholder="Fields (e.g. id, price)" 
                         className="flex-[2] bg-ide-bg border border-ide-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-ide-accent text-ide-text"
                         value={newEntity.fields}
                         onChange={e => setNewEntity({...newEntity, fields: e.target.value})}
                       />
                       <button onClick={addEntity} className="bg-ide-accent hover:bg-ide-accentHover text-white p-1.5 rounded"><Plus size={16}/></button>
                    </div>
                 </div>

                 {/* Pages Builder */}
                 <div className="bg-ide-panel border border-ide-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                       <Layers size={18} className="text-orange-400" />
                       <h3 className="font-medium text-ide-text">Site Map</h3>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {data.pages?.map(page => (
                        <div key={page.id} className="flex items-center justify-between bg-ide-bg p-2 rounded border border-ide-border">
                           <div className="flex items-center gap-2">
                              <span className="text-xs bg-ide-border px-1.5 rounded text-ide-text">{page.type}</span>
                              <span className="font-medium text-sm text-ide-text">{page.name}</span>
                           </div>
                           <button onClick={() => removePage(page.id)} className="text-ide-muted hover:text-red-400 p-1"><Trash2 size={14}/></button>
                        </div>
                      ))}
                      {data.pages?.length === 0 && <div className="text-xs text-ide-muted italic text-center py-2">No pages defined.</div>}
                    </div>

                    <div className="flex gap-2">
                       <input 
                         placeholder="Page Name (e.g. Home)" 
                         className="flex-1 bg-ide-bg border border-ide-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-ide-accent text-ide-text"
                         value={newPage.name}
                         onChange={e => setNewPage({...newPage, name: e.target.value})}
                       />
                       <select 
                          className="bg-ide-bg border border-ide-border rounded px-2 py-1.5 text-sm focus:outline-none focus:border-ide-accent text-ide-text"
                          value={newPage.type}
                          onChange={e => setNewPage({...newPage, type: e.target.value as any})}
                       >
                          <option value="dashboard">Dashboard</option>
                          <option value="list">List View</option>
                          <option value="detail">Detail View</option>
                          <option value="form">Form</option>
                          <option value="landing">Landing</option>
                       </select>
                       <button onClick={addPage} className="bg-ide-accent hover:bg-ide-accentHover text-white p-1.5 rounded"><Plus size={16}/></button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 max-w-3xl mx-auto">
              
              {/* Vibe Selection */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4">Visual Theme</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Modern', 'Corporate', 'Playful', 'Brutalist', 'Minimalist'].map((vibe) => (
                    <button
                       key={vibe}
                       onClick={() => setData({ ...data, design: { ...data.design!, theme: vibe as ThemeVibe } })}
                       className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          data.design?.theme === vibe 
                             ? 'border-ide-accent bg-ide-accent/10 text-ide-accent' 
                             : 'border-ide-border bg-ide-panel text-ide-muted hover:border-ide-text'
                       }`}
                    >
                       {vibe}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Style */}
              <div>
                <h3 className="text-lg font-medium text-ide-text mb-4">Navigation Layout</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <SelectCard 
                      title="Sidebar" 
                      desc="Vertical side navigation" 
                      icon={SidebarIcon} 
                      selected={data.design?.navStyle === 'Sidebar'} 
                      onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'Sidebar' } })} 
                   />
                   <SelectCard 
                      title="Top Bar" 
                      desc="Horizontal header menu" 
                      icon={Layout} 
                      selected={data.design?.navStyle === 'TopBar'} 
                      onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'TopBar' } })} 
                   />
                   <SelectCard 
                      title="Minimal" 
                      desc="Hidden/Drawer menu" 
                      icon={Grid} 
                      selected={data.design?.navStyle === 'Minimal'} 
                      onClick={() => setData({ ...data, design: { ...data.design!, navStyle: 'Minimal' } })} 
                   />
                </div>
              </div>

               {/* Color Picker (Simple) */}
               <div>
                 <h3 className="text-lg font-medium text-ide-text mb-4">Primary Brand Color</h3>
                 <div className="flex gap-4">
                    {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                       <button
                          key={color}
                          onClick={() => setData({ ...data, design: { ...data.design!, primaryColor: color } })}
                          className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${data.design?.primaryColor === color ? 'border-ide-text ring-2 ring-offset-2 ring-ide-bg' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                       />
                    ))}
                 </div>
               </div>

            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 max-w-3xl mx-auto">
               <div className="bg-ide-panel border border-ide-border rounded-xl p-6">
                  <h3 className="text-lg font-bold text-ide-text mb-4 border-b border-ide-border pb-2">Project Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                     <div>
                        <span className="text-xs uppercase font-bold text-ide-muted">Project Name</span>
                        <p className="text-ide-text font-medium">{data.name}</p>
                     </div>
                     <div>
                        <span className="text-xs uppercase font-bold text-ide-muted">App Type</span>
                        <p className="text-ide-text font-medium">{data.type}</p>
                     </div>
                     <div>
                        <span className="text-xs uppercase font-bold text-ide-muted">Structure</span>
                        <p className="text-ide-text font-medium">{data.entities?.length || 0} Entities, {data.pages?.length || 0} Pages</p>
                     </div>
                     <div>
                        <span className="text-xs uppercase font-bold text-ide-muted">Design Style</span>
                        <p className="text-ide-text font-medium">{data.design?.theme} / {data.design?.navStyle}</p>
                     </div>
                  </div>

                  <div className="mt-6">
                     <span className="text-xs uppercase font-bold text-ide-muted">Features</span>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {data.features?.map(f => (
                           <span key={f} className="px-2 py-1 rounded-md bg-ide-bg border border-ide-border text-xs text-ide-text">{f}</span>
                        ))}
                     </div>
                  </div>

                  <div className="mt-6">
                     <span className="text-xs uppercase font-bold text-ide-muted">Description</span>
                     <p className="text-sm text-ide-text mt-1 italic opacity-80 border-l-2 border-ide-accent pl-3">
                        "{data.description}"
                     </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500 text-sm">
                  <Palette size={20} />
                  <p>The <strong>Planner Agent</strong> will use your entities and page list to structure the application architecture.</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-ide-border bg-ide-panel flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="px-6 py-2.5 rounded-lg text-ide-muted hover:text-ide-text hover:bg-ide-bg transition-colors flex items-center gap-2 font-medium"
          >
            {step === 1 ? 'Cancel' : <><ArrowLeft size={18} /> Back</>}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={step === 4 ? false : (step === 1 && !data.name) || (step === 2 && !data.description)}
            className="px-8 py-2.5 rounded-lg bg-ide-accent hover:bg-ide-accentHover text-white font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {step === 4 ? 'Generate App' : <>Next <ArrowRight size={18} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;