'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Home, Activity, Eye, Wallet, History, Search, Trophy, Clock
} from 'lucide-react';

interface Market {
    id: string;
    title: string;
    category: string;
    volume: string;
    odds: string;
    timeLeft: string;
    status: 'Active' | 'Settled' | 'Upcoming';
    image: string;
}

const mockMarkets: Market[] = [
    {
        id: '1',
        title: "Will Trend$ reach $50M Market Cap by end of March?",
        category: 'Platform',
        volume: '$1.2M',
        odds: '65%',
        timeLeft: '10d 4h',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1611974714658-058e11ee6d80?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: '2',
        title: "Next AI Trend to go viral in the US: 'AI Fashion'",
        category: 'Trends',
        volume: '$420K',
        odds: '42%',
        timeLeft: '2d 18h',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200'
    },
    {
        id: '3',
        title: "Base Network daily active users to exceed 1M in April",
        category: 'Network',
        volume: '$2.8M',
        odds: '78%',
        timeLeft: '42d 1h',
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200'
    }
];

export default function SpectatorMarkets() {
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="min-h-screen bg-surface font-sans text-on-surface selection:bg-primary/30">
            {/* Navbar */}
            <div className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
                <nav className="pointer-events-auto w-full max-w-[1200px] bg-[#0A0B0C]/90 backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-full shadow-2xl">
                    <div className="px-8 h-14 flex items-center justify-between">
                        <Link href="/" className="font-space text-xl font-bold tracking-tighter shrink-0 min-w-[120px] italic">
                            <span className="text-primary">Trend</span><span className="text-secondary">$</span>
                        </Link>
                        
                        <div className="hidden md:flex flex-1 items-center justify-evenly px-8 text-sm font-medium text-on-surface-variant">
                            <Link href="/attention-market" className="hover:text-white transition-colors">Attention Market</Link>
                            <Link href="/spectator-markets" className="text-white transition-colors border-b border-[#00E5FF]">Spectator Market</Link>
                        </div>

                        <div className="flex items-center justify-end gap-6 shrink-0 min-w-[120px]">
                            <button className="text-on-surface-variant hover:text-white transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                            <button className="bg-primary text-black font-bold text-sm px-6 py-2 rounded-full hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            <main className="pt-32 lg:pt-40 pb-24 max-w-[1400px] mx-auto px-4 lg:px-6 flex flex-col lg:flex-row gap-8">
                
                {/* Left Sidebar */}
                <aside className="hidden lg:flex w-64 flex-col gap-6 shrink-0">
                    <nav className="flex flex-col gap-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors font-mono">
                            <Home size={18} /> DASHBOARD
                        </Link>
                        <Link href="/attention-market" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors font-mono">
                            <Activity size={18} /> ATTENTION MARKET
                        </Link>
                        <Link href="/spectator-markets" className="flex items-center gap-3 px-4 py-3 text-sm text-[#00E5FF] bg-[#141A22] rounded-r-lg border-l-2 border-[#00E5FF] font-black font-mono">
                            <Eye size={18} /> SPECTATOR MARKET
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left font-mono">
                            <Wallet size={18} /> STAKING
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left font-mono">
                            <History size={18} /> HISTORY
                        </button>
                    </nav>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8 min-w-0">
                    
                    {/* Top Stats */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
                        {/* Kinetic Aura Background Glow */}
                        <div className="absolute top-1/2 left-0 w-[500px] h-[300px] bg-primary/10 mix-blend-screen blur-[100px] rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-2">
                                <span className="text-white">SPECTATOR</span> <span className="bg-gradient-to-br from-primary to-primary-container text-transparent bg-clip-text inline-block">MARKET</span>
                            </h1>
                            <p className="text-[#A0ABC0] text-sm md:text-base">
                                Trade on the outcomes of trends and global events.
                            </p>
                        </div>
                        <div className="flex gap-4 self-stretch md:self-auto relative z-10">
                            <div className="bg-[#141A22] rounded-2xl p-4 md:p-5 border border-white/5 min-w-[140px] md:min-w-[160px] flex-1">
                                <div className="text-[10px] font-bold tracking-wider text-[#A0ABC0] uppercase mb-1">Total PoP</div>
                                <div className="text-lg md:text-xl font-bold text-[#66FCF1]">$18.4M</div>
                            </div>
                            <div className="bg-[#141A22] rounded-2xl p-4 md:p-5 border border-white/5 min-w-[140px] md:min-w-[160px] flex-1">
                                <div className="text-[10px] font-bold tracking-wider text-[#A0ABC0] uppercase mb-1">Active Markets</div>
                                <div className="text-lg md:text-xl font-bold text-[#c4b5fd]">142</div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Market Banner */}
                    <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-[#141A22] to-[#0A0B0C] border border-white/5 p-8 flex items-center justify-between overflow-hidden relative group">
                        <div className="relative z-10 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                <Trophy size={14} /> Featured Prediction
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black max-w-lg">Will an AI agent deploy a Top 100 token by Q3?</h2>
                            <button className="bg-white text-black font-bold text-sm px-6 py-2 rounded-full hover:bg-white/90 transition-all">
                                Trade Yes 82%
                            </button>
                        </div>
                        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none skew-x-12 translate-x-12 bg-primary blur-3xl group-hover:opacity-30 transition-opacity"></div>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col xl:flex-row justify-between gap-4">
                        <div className="flex p-1 bg-[#141A22] rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
                            {['All', 'Platform', 'Trends', 'Network', 'AI', 'Politics'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap px-4 md:px-6 py-2 text-sm rounded-lg transition-colors font-medium ${activeTab === tab ? 'bg-[#1F2833] text-white' : 'text-[#A0ABC0] hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 xl:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A6B80]" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by market title" 
                                    className="pl-9 pr-4 py-2 bg-[#141A22] border border-white/5 rounded-xl text-sm text-white placeholder:text-[#5A6B80] focus:outline-none focus:border-[#00E5FF]/50 w-full xl:w-64 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-transparent md:bg-[#0C1014] md:border border-white/5 rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-white/5 text-[10px] font-bold text-[#5A6B80] tracking-wider uppercase">
                            <div>Market Title</div>
                            <div>Outcome Odds</div>
                            <div>24H Volume</div>
                            <div>Status</div>
                            <div>Time Left</div>
                        </div>

                        {/* Table Body */}
                        <div className="md:p-2 space-y-1">
                            {mockMarkets
                                .filter(m => activeTab === 'All' || m.category === activeTab)
                                .map((market, index) => (
                                <motion.div
                                    key={market.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex md:grid md:grid-cols-[3fr_1fr_1fr_1fr_1fr] justify-between gap-4 items-center p-4 bg-[#141A22] hover:bg-[#1A222C] rounded-xl border border-transparent hover:border-white/5 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4 min-w-0 flex-1 md:flex-none">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1D252F] shrink-0 border border-white/5">
                                                <img src={market.image} alt={market.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white group-hover:text-[#66FCF1] transition-colors truncate text-sm md:text-base">{market.title}</span>
                                                </div>
                                                <div className="text-[10px] text-[#A0ABC0] bg-[#1D252F] px-2 py-0.5 rounded-full w-fit uppercase font-bold tracking-widest">{market.category}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden sm:block">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-16 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: market.odds }}></div>
                                                </div>
                                                <span className="font-bold text-white text-sm">{market.odds}</span>
                                            </div>
                                            <div className="text-[10px] text-[#A0ABC0] mt-1">Winning Odds</div>
                                        </div>

                                        <div className="hidden md:block">
                                            <div className="font-bold text-white tracking-tight text-sm">{market.volume}</div>
                                            <div className="text-[10px] text-[#A0ABC0]">PoP Locked</div>
                                        </div>

                                        <div className="hidden md:block">
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#39FF14]/10 border border-[#39FF14]/20 text-[#39FF14] text-[10px] font-bold uppercase w-fit">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></div>
                                                {market.status}
                                            </div>
                                        </div>

                                        <div className="hidden lg:block">
                                            <div className="flex items-center gap-2 text-white font-mono text-sm uppercase">
                                                <Clock size={14} className="text-[#A0ABC0]" />
                                                {market.timeLeft}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-surface-container-lowest bg-surface-container-lowest">
                <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
                    <div className="space-y-6 max-w-xs">
                        <Link href="/" className="font-space text-3xl font-bold tracking-tighter italic">
                            <span className="text-primary">Trend</span><span className="text-secondary">$</span>
                        </Link>
                        <p className="text-xs text-on-surface-variant leading-relaxed font-mono">
                            © 2026 TREND$.
                        </p>
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap gap-x-24 gap-y-12 lg:gap-x-48 text-[10px] font-bold tracking-[0.2em] uppercase mt-8 md:mt-0 ml-0 md:ml-12">
                        <div className="space-y-8 min-w-[140px]">
                            <h4 className="text-primary">PLATFORM</h4>
                            <div className="flex flex-col gap-6 text-[#A0ABC0]">
                                <Link href="#" className="hover:text-white transition-colors">MARKETS</Link>
                                <Link href="#" className="hover:text-white transition-colors">TRADE</Link>
                                <Link href="#" className="hover:text-white transition-colors">API DOCS</Link>
                            </div>
                        </div>
                        <div className="space-y-8 min-w-[140px]">
                            <h4 className="text-primary">LEGAL</h4>
                            <div className="flex flex-col gap-6 text-[#A0ABC0]">
                                <Link href="#" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
                                <Link href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
                                <Link href="#" className="hover:text-white transition-colors">RISK DISCLOSURE</Link>
                            </div>
                        </div>
                        <div className="space-y-8 min-w-[140px]">
                            <h4 className="text-primary">SUPPORT</h4>
                            <div className="flex flex-col gap-6 text-[#A0ABC0]">
                                <Link href="#" className="hover:text-white transition-colors">HELP CENTER</Link>
                                <Link href="#" className="hover:text-white transition-colors">STATUS</Link>
                                <Link href="#" className="hover:text-white transition-colors">CONTACT</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
