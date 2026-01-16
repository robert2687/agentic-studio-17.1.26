export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  sparkline: number[];
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'receive' | 'send';
  asset: string;
  amount: number;
  value: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export const TICKERS: TickerData[] = [
  {
    symbol: 'BTC',
    price: 64230.5,
    change: 2.4,
    sparkline: [62000, 62500, 63000, 62800, 63500, 64230]
  },
  {
    symbol: 'ETH',
    price: 3450.2,
    change: -1.2,
    sparkline: [3500, 3480, 3520, 3490, 3460, 3450]
  },
  {
    symbol: 'SOL',
    price: 145.8,
    change: 5.6,
    sparkline: [130, 135, 138, 140, 142, 145]
  }
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    asset: 'BTC',
    amount: 0.05,
    value: 3200,
    date: '2024-03-20 10:30',
    status: 'completed'
  },
  {
    id: '2',
    type: 'send',
    asset: 'ETH',
    amount: 1.2,
    value: 4140,
    date: '2024-03-19 15:45',
    status: 'completed'
  },
  {
    id: '3',
    type: 'sell',
    asset: 'SOL',
    amount: 50,
    value: 7250,
    date: '2024-03-18 09:15',
    status: 'completed'
  }
];

export const ALLOCATION = [
  { name: 'BTC', value: 45, color: '#38bdf8' },
  { name: 'ETH', value: 30, color: '#a855f7' },
  { name: 'SOL', value: 15, color: '#f43f5e' },
  { name: 'USDT', value: 10, color: '#10b981' }
];

export const PORTFOLIO_HISTORY = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 59000 },
  { date: 'Jun', value: 75000 }
];
