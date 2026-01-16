import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import theme from '../lib/theme.json';
import { PORTFOLIO_HISTORY } from '../lib/mockData';
import './PortfolioChart.css';

const PortfolioChart: React.FC = () =>
{
    return (
        <div
            className="flex-1 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl portfolio-chart-container"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-200">Portfolio Performance</h3>
                    <p className="text-sm text-slate-500">Total assets value over time</p>
                </div>
                <div className="flex gap-2">
                    { [ '24H', '1W', '1M', '1Y', 'ALL' ].map( range => (
                        <button
                            key={ range }
                            className={ `px-4 py-1.5 rounded-full text-xs font-bold transition-all ${ range === '3M' ? 'bg-sky-500 text-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }` }
                        >
                            { range }
                        </button>
                    ) ) }
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ PORTFOLIO_HISTORY }>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={ theme.colors.primary } stopOpacity={ 0.3 } />
                                <stop offset="95%" stopColor={ theme.colors.primary } stopOpacity={ 0 } />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={ false } />
                        <XAxis
                            dataKey="date"
                            axisLine={ false }
                            tickLine={ false }
                            tick={ { fill: '#64748b', fontSize: 12 } }
                            dy={ 10 }
                        />
                        <YAxis
                            axisLine={ false }
                            tickLine={ false }
                            tick={ { fill: '#64748b', fontSize: 12 } }
                            tickFormatter={ ( val ) => `$${ val / 1000 }k` }
                        />
                        <Tooltip
                            contentStyle={ {
                                backgroundColor: '#0f172a',
                                border: '1px solid #1e293b',
                                borderRadius: '12px',
                                color: '#fff'
                            } }
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={ theme.colors.primary }
                            strokeWidth={ 3 }
                            fillOpacity={ 1 }
                            fill="url(#colorValue)"
                            animationDuration={ 2000 }
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PortfolioChart;
