import React from 'react';
import { LayoutGrid, PlusSquare, History, Settings as SettingsIcon, Sun, Moon, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface GlobalSidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all duration-300 group relative ${
      isActive 
        ? 'text-blue-400' 
        : 'text-ide-muted hover:text-ide-text hover:bg-white/5'
    }`}
    title={label}
  >
    {isActive && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] animate-fade-in"></div>
    )}
    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10 transition-transform group-hover:scale-110 duration-300" />
    <span className="text-[10px] font-medium relative z-10">{label}</span>
  </button>
);

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ currentView, onNavigate, isDark, onToggleTheme }) => {
  return (
    <div className="w-20 glass-sidebar flex flex-col items-center py-6 gap-6 z-50 flex-shrink-0">
      {/* Brand */}
      <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 hover:scale-105 transition-transform cursor-default">
        <LayoutGrid size={22} className="text-white" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-3">
        <NavItem 
          icon={PlusSquare} 
          label="New" 
          isActive={currentView === 'home' || currentView === 'wizard'} 
          onClick={() => onNavigate('home')} 
        />
        <NavItem 
          icon={History} 
          label="History" 
          isActive={currentView === 'projects'} 
          onClick={() => onNavigate('projects')} 
        />
        <NavItem 
          icon={SettingsIcon} 
          label="Settings" 
          isActive={currentView === 'settings'} 
          onClick={() => onNavigate('settings')} 
        />
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3 w-full px-3 pb-2">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-center p-3 rounded-2xl text-ide-muted hover:bg-white/5 hover:text-ide-text transition-colors border border-transparent hover:border-white/5"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="w-full flex items-center justify-center p-3 rounded-2xl text-ide-muted hover:bg-red-500/10 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/10"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default GlobalSidebar;