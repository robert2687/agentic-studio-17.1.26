import React from 'react';
import './src/styles/theme.css';
import DashboardLayout from './components/DashboardLayout';
import StatCard from './components/StatCard';
import PortfolioChart from './components/PortfolioChart';
import TransactionTable from './components/TransactionTable';
import { TICKERS } from './lib/mockData';

function App ()
{
  return (
    <DashboardLayout>
      {/* Top Section: Highlight Tickers */ }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        { TICKERS.map( ( ticker ) => (
          <StatCard key={ ticker.symbol } { ...ticker } />
        ) ) }
      </div>

      {/* Middle Section: Main Chart and Assets info */ }
      <div className="flex flex-col lg:flex-row gap-8">
        <PortfolioChart />

        {/* Quick Actions / Market News Placeholder */ }
        <div className="w-full lg:w-80 space-y-6">
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-sky-500 to-indigo-600 shadow-xl shadow-sky-500/20 text-white">
            <h4 className="font-black text-xl mb-2">Total Balance</h4>
            <div className="space-y-4">
              <p className="text-4xl font-black">$72,430.15</p>
              <div className="flex items-center gap-2 text-sky-100 text-sm font-bold bg-white/10 w-fit px-3 py-1 rounded-full">
                <span>+12.4%</span>
                <span>since last month</span>
              </div>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors mt-4">
                Deposit Funds
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-slate-800/50 border border-slate-700/50">
            <h4 className="font-bold text-slate-200 mb-4">Market News</h4>
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-700">
                <p className="text-xs text-sky-400 font-bold mb-1">BITCOIN</p>
                <p className="text-sm font-medium text-slate-300">ETF inflows hit record high as institutional demand grows.</p>
              </div>
              <div className="pb-4 border-b border-slate-700">
                <p className="text-xs text-purple-400 font-bold mb-1">ETHEREUM</p>
                <p className="text-sm font-medium text-slate-300">Dencun upgrade lowers L2 fees by 90% in first week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Transactions */ }
      <TransactionTable />
    </DashboardLayout>
  );
}

export default App;