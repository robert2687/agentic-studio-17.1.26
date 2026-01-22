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
    className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-ide-accent text-white shadow-lg shadow-blue-500/20' 
        : 'text-ide-muted hover:bg-ide-panel hover:text-ide-text'
    }`}
    title={label}
  >
    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const GlobalSidebar: React.FC<GlobalSidebarProps> = ({ currentView, onNavigate, isDark, onToggleTheme }) => {
  return (
    <div className="w-20 bg-ide-sidebar border-r border-ide-border flex flex-col items-center py-6 gap-6 z-50 flex-shrink-0">
      {/* Brand */}
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
        <LayoutGrid size={20} className="text-white" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-3 w-full px-2">
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
      <div className="flex flex-col gap-3 w-full px-2">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-center p-3 rounded-xl text-ide-muted hover:bg-ide-panel hover:text-ide-text transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="w-full flex items-center justify-center p-3 rounded-xl text-ide-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          title="Sign Out (Mock)"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
};

export default GlobalSidebar;