import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import theme from '../lib/theme.json';
import './StatCard.css';

interface StatCardProps
{
    symbol: string;
    price: number;
    change: number;
    sparkline: number[];
}

const StatCard: React.FC<StatCardProps> = ( { symbol, price, change, sparkline } ) =>
{
    const isPositive = change >= 0;

    return (
        <div
            className="p-6 rounded-3xl border border-slate-800/50 backdrop-blur-xl hover:border-slate-700/50 transition-all group stat-card-surface"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-sky-500/50 transition-colors">
                        <span className="font-bold text-sm tracking-tighter">{ symbol }</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-200">{ symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : 'Solana' }</h3>
                        <span className="text-xs text-slate-500 tracking-wider">USD</span>
                    </div>
                </div>
                <div className={ `flex items-center gap-1 text-sm font-semibold ${ isPositive ? 'text-emerald-400' : 'text-rose-400' }` }>
                    { isPositive ? <TrendingUp size={ 16 } /> : <TrendingDown size={ 16 } /> }
                    { isPositive ? '+' : '' }{ change }%
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <p className="text-2xl font-black tracking-tight stat-card-text-base">
                        ${ price.toLocaleString() }
                    </p>
                    <p className="text-xs text-slate-500">24h Volume: $42.5B</p>
                </div>

                {/* Simple SVG Sparkline */ }
                <div className="w-24 h-12">
                    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <path
                            d={ generatePath( sparkline ) }
                            fill="none"
                            stroke={ isPositive ? theme.colors.success : theme.colors.accent }
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const generatePath = ( data: number[] ) =>
{
    const min = Math.min( ...data );
    const max = Math.max( ...data );
    const range = max - min;
    const width = 100;
    const height = 40;

    return data.map( ( val, i ) =>
    {
        const x = ( i / ( data.length - 1 ) ) * width;
        const y = height - ( ( val - min ) / range ) * height;
        return `${ i === 0 ? 'M' : 'L' } ${ x } ${ y }`;
    } ).join( ' ' );
};

export default StatCard;
