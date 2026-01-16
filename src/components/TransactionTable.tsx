import React from 'react';
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, MoreVertical } from 'lucide-react';
import theme from '../lib/theme.json';
import { TRANSACTIONS } from '../lib/mockData';
import './TransactionTable.css';

const TransactionTable: React.FC = () =>
{
    return (
        <div
            className="p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl transaction-table-container"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-200">Recent Transactions</h3>
                <button className="text-sky-400 text-sm font-semibold hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                { TRANSACTIONS.map( ( tx ) => (
                    <div
                        key={ tx.id }
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/20 border border-slate-800/50 hover:border-slate-700/50 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={ `w-12 h-12 rounded-2xl flex items-center justify-center ${ tx.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' :
                                tx.type === 'sell' ? 'bg-rose-500/10 text-rose-400' :
                                    'bg-sky-500/10 text-sky-400'
                                }` }>
                                { tx.type === 'buy' ? <ArrowDownLeft size={ 24 } /> : <ArrowUpRight size={ 24 } /> }
                            </div>
                            <div>
                                <p className="font-bold text-slate-200 capitalize">{ tx.type } { tx.asset }</p>
                                <p className="text-xs text-slate-500">{ tx.date }</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-slate-200">${ tx.value.toLocaleString() }</p>
                            <p className={ `text-xs ${ tx.type === 'buy' ? 'text-emerald-400' : 'text-rose-400' }` }>
                                { tx.type === 'buy' ? '+' : '-' }{ tx.amount } { tx.asset }
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase rounded-full tracking-widest border border-slate-700">
                                { tx.status }
                            </span>
                            <button className="p-2 text-slate-500 hover:text-slate-300" title="More options" aria-label="More options">
                                <MoreVertical size={ 18 } />
                            </button>
                        </div>
                    </div>
                ) ) }
            </div>
        </div>
    );
};

export default TransactionTable;
