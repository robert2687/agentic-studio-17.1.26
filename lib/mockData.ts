import { FileNode } from '../types';

export const INITIAL_FILES: FileNode[] = [
  { name: 'package.json', type: 'file', content: '{}' },
  { name: 'README.md', type: 'file', content: '# Project' },
  { name: 'node_modules', type: 'folder', children: [] },
];

export const COMPLETED_FILES: FileNode[] = [
  { 
    name: 'src', 
    type: 'folder', 
    isOpen: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        isOpen: true,
        children: [
          { name: 'Header.tsx', type: 'file', content: '' },
          { name: 'CryptoCard.tsx', type: 'file', content: '' },
          { name: 'Chart.tsx', type: 'file', content: '' },
        ]
      },
      {
        name: 'lib',
        type: 'folder',
        isOpen: true,
        children: [
           { name: 'mockData.ts', type: 'file', content: '' },
           { name: 'utils.ts', type: 'file', content: '' }
        ]
      },
      { name: 'App.tsx', type: 'file', content: '' },
      { name: 'index.css', type: 'file', content: '' },
    ]
  },
  { name: 'theme.json', type: 'file', content: '' },
  { name: 'package.json', type: 'file', content: '' },
  { name: 'postcss.config.js', type: 'file', content: '' },
  { name: 'tailwind.config.js', type: 'file', content: '' },
];

export const MOCK_CODE_APP_TSX = `import React from 'react';
import { Header } from './components/Header';
import { CryptoCard } from './components/CryptoCard';
import { Chart } from './components/Chart';
import { useCryptoData } from './lib/hooks';

export default function Dashboard() {
  const { data, loading } = useCryptoData();

  if (loading) return <div className="p-8">Loading Agentic Swarm...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <Header title="CryptoDash Pro" />
      
      <main className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
             <h2 className="text-xl font-bold mb-4">Market Overview</h2>
             <Chart data={data.history} color="#3b82f6" />
          </section>
          
          <div className="grid grid-cols-2 gap-4">
             {data.coins.map(coin => (
               <CryptoCard key={coin.id} coin={coin} />
             ))}
          </div>
        </div>

        <aside className="bg-slate-900 border border-slate-800 rounded-xl p-6">
           <h3 className="text-lg font-semibold mb-4 text-slate-400">Recent Transactions</h3>
           <ul className="space-y-3">
             {data.transactions.map(tx => (
               <li key={tx.id} className="flex justify-between text-sm border-b border-slate-800 pb-2">
                 <span>{tx.type}</span>
                 <span className={tx.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                   {tx.amount > 0 ? '+' : ''}{tx.amount} BTC
                 </span>
               </li>
             ))}
           </ul>
        </aside>
      </main>
    </div>
  );
}`;

export const MOCK_THEME_JSON = `{
  "name": "Modern Dark",
  "type": "dark",
  "colors": {
    "background": "#020617",
    "foreground": "#f8fafc",
    "primary": "#3b82f6",
    "secondary": "#64748b",
    "accent": "#f59e0b"
  },
  "borderRadius": "0.75rem",
  "fontFamily": "Inter"
}`;
