import React from 'react';
import { LayoutDashboard, Wallet, ArrowUpRight, ArrowDownLeft, Settings, Bell, Search } from 'lucide-react';
import theme from '../lib/theme.json';
import './DashboardLayout.css';

interface DashboardLayoutProps
{
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ( { children } ) =>
{
    return (
        <div
            className="flex h-screen overflow-hidden dashboard-container"
        >
            {/* Sidebar */ }
            <aside
                className="w-64 border-r border-slate-800 flex flex-col dashboard-sidebar"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                        <LayoutDashboard size={ 20 } className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ASP CLI <span className="text-sky-400">PRO</span></span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4" aria-label="Main Navigation">
                    <NavItem icon={ <LayoutDashboard size={ 20 } /> } label="Overview" active title="Overview" />
                    <NavItem icon={ <Wallet size={ 20 } /> } label="Portfolio" title="Portfolio" />
                    <NavItem icon={ <ArrowUpRight size={ 20 } /> } label="Transactions" title="Transactions" />
                    <NavItem icon={ <ArrowDownLeft size={ 20 } /> } label="Exchange" title="Exchange" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <NavItem icon={ <Settings size={ 20 } /> } label="Settings" title="Settings" />
                </div>
            </aside>

            {/* Main Content */ }
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */ }
                <header
                    className="h-16 border-b border-slate-800 flex items-center justify-between px-8 dashboard-header"
                >
                    <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-1.5 w-96">
                        <Search size={ 18 } className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search assets, markers..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-800 rounded-full relative" title="Notifications" aria-label="View notifications">
                            <Bell size={ 20 } />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full border border-slate-900"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                            <div className="text-right">
                                <p className="text-sm font-medium">Alex Rivera</p>
                                <p className="text-xs text-slate-500">Pro Trader</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-purple-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Area */ }
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    { children }
                </div>
            </main>
        </div>
    );
};

interface NavItemProps
{
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const NavItem: React.FC<NavItemProps & { title?: string }> = ( { icon, label, active, title } ) => (
    <div
        className={ `flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${ active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }` }
        title={ title || label }
        aria-label={ label }
        role="button"
        tabIndex={ 0 }
    >
        { icon }
        <span className="font-medium">{ label }</span>
        { active && <div className="ml-auto w-1.5 h-6 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div> }
    </div>
);

export default DashboardLayout;
