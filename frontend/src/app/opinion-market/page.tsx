'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    TrendingUp, TrendingDown, ExternalLink, ShieldCheck, ArrowRight, 
    Home, Activity, Eye, History, Wallet, Search, SlidersHorizontal,
    ChevronDown, ChevronUp, MessageSquare
} from 'lucide-react';

interface Opinion {
    id: string;
    topic: string;
    symbol: string;
    image_cid: string;
    timestamp: string;
    yes_price: string;
    no_price: string;
    volume: string;
    liquidity: string;
}

const Sparkline = ({ up }: { up: boolean }) => (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
            d={up ? "M0 15C5 15 10 5 15 5C20 5 25 10 30 10C35 10 40 2 45 2C50 2 55 8 60 8" : "M0 5C5 5 10 15 15 15C20 15 25 10 30 10C35 10 40 18 45 18C50 18 55 12 60 12"} 
            stroke={up ? "#39FF14" : "#ff716c"} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </svg>
);

export default function OpinionMarket() {
    const [opinions, setOpinions] = useState<Opinion[]>([]);
    const [opinionsFull, setOpinionsFull] = useState<Opinion[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Trending');

    useEffect(() => {
        async function fetchOpinions() {
            try {
                // Placeholder - will be replaced with actual API call
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch opinions:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchOpinions();
        const interval = setInterval(fetchOpinions, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, [visibleCount]);

    const handleLoadMore = () => {
        const newCount = visibleCount + 20;
        setVisibleCount(newCount);
        setOpinions(opinionsFull.slice(0, newCount));
    };

    const handleShowLess = () => {
        const newCount = Math.max(5, visibleCount - 20);
        setVisibleCount(newCount);
        setOpinions(opinionsFull.slice(0, newCount));
    };

    const showLoadMore = () => {
        return visibleCount < opinionsFull.length;
    };

    const showShowLess = () => {
        return visibleCount > 5;
    };

    const renderOpinionList = (opinions: Opinion[]) => {
        if (loading && opinions.length === 0) {
            return (
                <div className="space-y-2 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-[#141A22] rounded-xl w-full border border-white/5" />
                    ))}
                </div>
            );
        }

        if (opinions.length === 0) {
            return (
                <div className="text-center py-12 bg-[#141A22] rounded-xl border border-white/5">
                    <MessageSquare className="mx-auto mb-4 text-[#A0ABC0]/50" size={32} />
                    <p className="text-[#A0ABC0]">No opinions found.</p>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {opinions.map((opinion, index) => {
                    const isUp = index % 2 === 0;
                    return (
                        <motion.div
                            key={opinion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={`/opinion/${opinion.id}`}>
                                <div className="flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] justify-between gap-4 items-center p-4 bg-[#141A22] hover:bg-[#1A222C] rounded-xl border border-transparent hover:border-white/5 transition-colors cursor-pointer group">
                                    {/* ASSET */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1F2833] shrink-0 border border-white/5">
                                            <img src={opinion.image_cid?.startsWith('http') ? opinion.image_cid : `https://dweb.link/ipfs/${opinion.image_cid}`} alt={opinion.symbol} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="min-w-0 flex flex-col">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <span className="font-bold text-white group-hover:text-[#66FCF1] transition-colors truncate text-sm md:text-base">{opinion.topic}</span>
                                                <span className="text-[9px] md:text-[10px] text-[#A0ABC0] bg-[#1F2833] px-1.5 py-0.5 rounded font-mono shrink-0">{opinion.symbol}</span>
                                            </div>
                                            <div className="text-[10px] md:text-[11px] text-[#A0ABC0] mt-0.5 truncate">Opinion Market</div>
                                        </div>
                                    </div>
                                    
                                    {/* YES PRICE */}
                                    <div className="hidden sm:block">
                                        <div className="font-bold text-[#39FF14] tracking-tight text-sm md:text-base">{opinion.yes_price}</div>
                                        <div className="text-[10px] md:text-[11px] text-[#A0ABC0] font-mono">YES</div>
                                    </div>

                                    {/* NO PRICE */}
                                    <div className="hidden sm:block">
                                        <div className="font-bold text-[#ff716c] tracking-tight text-sm md:text-base">{opinion.no_price}</div>
                                        <div className="text-[10px] md:text-[11px] text-[#A0ABC0] font-mono">NO</div>
                                    </div>

                                    {/* 24H VOLUME */}
                                    <div className="hidden md:block">
                                        <div className="font-bold text-white tracking-tight">{opinion.volume}</div>
                                        <div className="text-[11px] text-[#A0ABC0] font-mono">VOL</div>
                                    </div>

                                    {/* LIQUIDITY */}
                                    <div className="text-[#A0ABC0] font-medium tracking-tight hidden lg:block">
                                        {opinion.liquidity}
                                    </div>

                                    {/* LAST 7 DAYS */}
                                    <div className="hidden lg:block">
                                        <Sparkline up={isUp} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        );
    };

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
                            <Link href="/spectator-markets" className="hover:text-white transition-colors">Spectator Market</Link>
                            <Link href="/opinion-market" className="text-white transition-colors border-b border-[#00E5FF]">Opinion Market</Link>
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

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Home size={18} /> Dashboard
                        </Link>
                        <Link href="/attention-market" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Activity size={18} /> Attention Market
                        </Link>
                        <Link href="/spectator-markets" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Eye size={18} /> Spectator Market
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#00E5FF] bg-[#141A22] rounded-r-lg border-l-2 border-[#00E5FF] font-medium text-left">
                            <MessageSquare size={18} /> Opinion Market
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Wallet size={18} /> Staking
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <History size={18} /> History
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
                                <span className="text-white">OPINION</span> <span className="bg-gradient-to-br from-primary to-primary-container text-transparent bg-clip-text inline-block">MARKET</span>
                            </h1>
                            <p className="text-[#A0ABC0] text-sm md:text-base">
                                Trade opinions on trending topics and events.
                            </p>
                        </div>
                        <div className="flex gap-4 self-stretch md:self-auto relative z-10">
                            <div className="bg-[#141A22] rounded-2xl p-4 md:p-5 border border-white/5 min-w-[140px] md:min-w-[160px] flex-1">
                                <div className="text-[10px] font-bold tracking-wider text-[#A0ABC0] uppercase mb-1">24H Volume</div>
                                <div className="text-lg md:text-xl font-bold text-[#66FCF1]">$1.8B</div>
                            </div>
                            <div className="bg-[#141A22] rounded-2xl p-4 md:p-5 border border-white/5 min-w-[140px] md:min-w-[160px] flex-1">
                                <div className="text-[10px] font-bold tracking-wider text-[#A0ABC0] uppercase mb-1">Active Markets</div>
                                <div className="text-lg md:text-xl font-bold text-[#c4b5fd]">142</div>
                            </div>
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="flex items-center gap-3 mt-2 mb-2">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <span className="bg-gradient-to-br from-primary to-primary-container text-transparent bg-clip-text inline-block uppercase">Trending Opinions</span>
                        </h2>
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold border border-primary/50 uppercase tracking-widest">Live</span>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex flex-col xl:flex-row justify-between gap-4">
                        <div className="flex p-1 bg-[#141A22] rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
                            {['Trending', 'New', 'Closing Soon', 'Resolved'].map(tab => (
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
                                    placeholder="Search opinions" 
                                    className="pl-9 pr-4 py-2 bg-[#141A22] border border-white/5 rounded-xl text-sm text-white placeholder:text-[#5A6B80] focus:outline-none focus:border-[#00E5FF]/50 w-full xl:w-64 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-transparent md:bg-[#0C1014] md:border border-white/5 rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-white/5 text-[10px] font-bold text-[#5A6B80] tracking-wider uppercase">
                            <div>Opinion</div>
                            <div>Yes Price</div>
                            <div>No Price</div>
                            <div>24H Volume</div>
                            <div className="hidden lg:block">Liquidity</div>
                            <div className="hidden lg:block">Last 7 Days</div>
                        </div>

                        {/* Table Body */}
                        <div className="md:p-2">
                            {renderOpinionList(opinions)}
                        </div>
                    </div>

                    {/* Load More / Show Less Buttons */}
                    {(showLoadMore() || showShowLess()) && (
                        <div className="flex justify-center mt-4 gap-3">
                            {showLoadMore() && (
                                <button 
                                    onClick={handleLoadMore}
                                    className="px-8 py-3 bg-[#141A22] hover:bg-[#1F2833] text-[#A0ABC0] hover:text-white text-sm font-medium rounded-full transition-all border border-white/5 hover:border-white/10 active:scale-95 shadow-sm"
                                >
                                    Load More
                                </button>
                            )}
                            {showShowLess() && (
                                <button 
                                    onClick={handleShowLess}
                                    className="px-8 py-3 bg-[#1F2833] hover:bg-[#141A22] text-[#A0ABC0] hover:text-white text-sm font-medium rounded-full transition-all border border-white/5 hover:border-white/10 active:scale-95 shadow-sm"
                                >
                                    Show Less
                                </button>
                            )}
                        </div>
                    )}

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
