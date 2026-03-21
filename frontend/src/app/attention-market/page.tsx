'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

interface Token {
    token_address: string;
    symbol: string;
    topic: string;
    image_cid: string;
    timestamp: string;
    region?: string;
}

export default function Home() {
    const [usaTokens, setUsaTokens] = useState<Token[]>([]);
    const [otherTokens, setOtherTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTokens() {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
                const apiUrl = `${baseUrl}/api/public/tokens`;
                console.log('Fetching from:', apiUrl);
                const res = await fetch(apiUrl);
                const data = await res.json();
                if (data.success) {
                    const filteredTokens = data.data.filter((t: Token) => t.symbol !== 'JXSN' && t.symbol !== 'TENI' && t.symbol !== 'VERIFY');

                    const usaSymbols = ['SOTU', 'WWRW', 'SPCX'];
                    const usa = filteredTokens.filter((t: Token) => {
                        if (t.region) {
                            const r = t.region.toUpperCase();
                            return r === 'US' || r === 'USA' || r === 'UNITED STATES';
                        }
                        return usaSymbols.includes(t.symbol.toUpperCase());
                    });
                    const others = filteredTokens.filter((t: Token) => {
                        if (t.region) {
                            const r = t.region.toUpperCase();
                            return r === 'NG' || r === 'NIGERIA';
                        }
                        return !usaSymbols.includes(t.symbol.toUpperCase());
                    });

                    setUsaTokens(usa.slice(0, 5));
                    setOtherTokens(others.slice(0, 5));
                }
            } catch (err) {
                console.error('Failed to fetch tokens:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchTokens();
        const interval = setInterval(fetchTokens, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const renderTokenGrid = (tokens: Token[], emptyMessage: string) => {
        if (loading && tokens.length === 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl" />
                    ))}
                </div>
            );
        }

        if (tokens.length === 0) {
            return (
                <div className="text-center py-16 bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl">
                    <TrendingUp className="mx-auto mb-4 text-zinc-600" size={40} />
                    <p className="text-[#C5C6C7]/60">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="flex overflow-x-auto gap-6 pb-6 hide-scrollbar snap-x snap-mandatory">
                {tokens.map((token, index) => (
                    <motion.div
                        key={token.token_address}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="min-w-[320px] max-w-[350px] flex-none snap-start bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl p-6 group hover:bg-[#141A22] hover:border-[#45A29E]/70 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(69,162,158,0.12)] transition-all duration-300 cursor-pointer"
                    >
                        <Link href={`/token/${token.token_address}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#141A22] border border-white/5">
                                    <img
                                        src={`https://gateway.pinata.cloud/ipfs/${token.image_cid}`}
                                        alt={token.symbol}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{token.symbol}</h3>
                                    <div className="flex items-center gap-2 text-[#C5C6C7]/60 text-sm">
                                        <TrendingUp size={14} className="text-emerald-400" />
                                        Trend: {token.topic}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-[#C5C6C7]/60 font-medium">Address</div>
                                    <div className="text-sm text-[#45A29E] font-mono tabular-nums tracking-tight">
                                        {token.token_address.slice(0, 6)}...{token.token_address.slice(-4)}
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-[#45A29E] text-black font-black rounded-xl hover:bg-[#56C6C2] hover:shadow-[0_4px_20px_rgba(69,162,158,0.3)] active:bg-[#61cd21] active:text-white active:scale-[0.97] active:shadow-none transition-all duration-200 ease-out flex items-center justify-center gap-2">
                                    Trade Now
                                    <ExternalLink size={18} />
                                </button>
                            </div>
                        </Link>
                    </motion.div>
                ))}
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
                            <Link href="#" className="hover:text-white transition-colors">Spectator Market</Link>
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

            <main className="pt-32 lg:pt-40 pb-24 max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="font-space text-4xl lg:text-5xl font-black uppercase leading-[1.1] tracking-tight">
                        <span className="text-white">Attention</span> <span className="text-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">Market</span>
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
                        Tokens listed below were deployed by Trend$ agent based on real time social media trends.
                    </p>
                </div>

            {/* Main X Trends Header */}
            <div className="flex items-center justify-center mb-12">
                <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-3 whitespace-nowrap">
                    <span className="text-[#66FCF1]">X Trends</span>
                    <span className="px-3 py-1 rounded-full bg-[#45A29E]/20 text-[#66FCF1] text-xs font-bold border border-[#45A29E]/50 uppercase tracking-widest">Live Updates</span>
                </h2>
            </div>

            {/* US Trends Header */}
            <div className="flex items-center justify-start mb-6">
                <div className="text-[#45A29E] font-bold text-2xl tracking-tight flex items-center gap-2">
                    US Trends
                </div>
            </div>

            <div className="mb-16">
                {renderTokenGrid(usaTokens, "Waiting for USA Trends...")}
                <div className="flex justify-end mt-4">
                    <Link href="/us" className="text-[#45A29E] font-bold hover:text-[#61cd21] transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
                        View All US Trends <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* NG Trends Header */}
            <div className="flex items-center justify-start mb-6">
                <div className="text-[#45A29E] font-bold text-2xl tracking-tight flex items-center gap-2">
                    NG Trends
                </div>
            </div>

            <div className="mb-8">
                {renderTokenGrid(otherTokens, "Waiting for Nigeria Trends...")}
                <div className="flex justify-end mt-4">
                    <Link href="/ng" className="text-[#45A29E] font-bold hover:text-[#61cd21] transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
                        View All NG Trends <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Worldwide Header */}
            <div className="flex items-center justify-start mt-12 mb-16">
                <div className="text-[#45A29E] font-bold text-2xl tracking-tight flex items-center gap-3">
                    Worldwide
                    <span className="px-3 py-1 rounded-full bg-[#45A29E]/20 text-[#45A29E] text-xs font-bold border border-[#45A29E]/50 uppercase tracking-widest">Coming Soon</span>
                </div>
            </div>

            {/* TikTok Trends Header */}
            <div className="flex items-center justify-center mt-12 mb-24">
                <div className="text-[#45A29E] font-bold text-2xl tracking-tight flex items-center gap-3">
                    TikTok Trends
                    <span className="px-3 py-1 rounded-full bg-[#45A29E]/20 text-[#45A29E] text-xs font-bold border border-[#45A29E]/50 uppercase tracking-widest">Coming Soon</span>
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
