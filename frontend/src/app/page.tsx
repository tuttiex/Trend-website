'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import localFont from 'next/font/local';

const spriteGraffiti = localFont({ src: '../../public/SpriteGraffitiShadow.woff' });

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
                        <div key={i} className="h-64 bg-[#61cd21]/10 backdrop-blur-md border border-[#61cd21]/20 rounded-2xl" />
                    ))}
                </div>
            );
        }

        if (tokens.length === 0) {
            return (
                <div className="text-center py-16 bg-[#61cd21]/10 backdrop-blur-md border border-[#61cd21]/20 rounded-2xl">
                    <TrendingUp className="mx-auto mb-4 text-zinc-600" size={40} />
                    <p className="text-zinc-500">{emptyMessage}</p>
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
                        className="min-w-[320px] max-w-[350px] flex-none snap-start bg-[#61cd21]/10 backdrop-blur-md border border-[#61cd21]/20 rounded-2xl p-6 group hover:border-[#61cd21]/50 transition-all cursor-pointer"
                    >
                        <Link href={`/token/${token.token_address}`}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                                    <img
                                        src={`https://gateway.pinata.cloud/ipfs/${token.image_cid}`}
                                        alt={token.symbol}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{token.symbol}</h3>
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                        <TrendingUp size={14} className="text-emerald-400" />
                                        Trend: {token.topic}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-xs text-zinc-600 uppercase tracking-widest font-bold">Address</div>
                                    <div className="text-sm text-zinc-400 font-mono">
                                        {token.token_address.slice(0, 6)}...{token.token_address.slice(-4)}
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-[#61cd21] text-white font-black rounded-xl hover:bg-[#3fd0c9] hover:text-white transition-colors flex items-center justify-center gap-2">
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
        <main className="max-w-7xl mx-auto px-4 py-12">
            <header className="mb-16 text-center">
                <h1 className={`text-[5rem] md:text-[8rem] font-black mb-4 tracking-tighter leading-none ${spriteGraffiti.className}`}>
                    <span style={{ color: '#61cd21' }}>Trend</span>
                    <span style={{ color: '#61cd21' }}>$</span>
                </h1>
                <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
                    Tokens listed below were deployed by Trend$ agent based on real time social media trends.
                </p>
            </header>

            {/* Main X Trends Header */}
            <div className="flex items-center justify-center mb-12">
                <h2 className="text-3xl font-black flex items-center justify-center gap-3 whitespace-nowrap">
                    <span className="text-[#61cd21]">X Trends</span>
                    <span className="px-3 py-1 rounded-full bg-[#61cd21]/20 text-[#61cd21] text-xs font-bold border border-[#61cd21]/30 uppercase tracking-widest">Live Updates</span>
                </h2>
            </div>

            {/* US Trends Header */}
            <div className="flex items-center justify-start mb-6">
                <div className="text-[#61cd21] font-bold text-2xl flex items-center gap-2">
                    US Trends
                </div>
            </div>

            <div className="mb-16">
                {renderTokenGrid(usaTokens, "Waiting for USA Trends...")}
                <div className="flex justify-end mt-4">
                    <Link href="/us" className="text-[#61cd21] font-bold hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
                        View All US Trends <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* NG Trends Header */}
            <div className="flex items-center justify-start mb-6">
                <div className="text-[#61cd21] font-bold text-2xl flex items-center gap-2">
                    NG Trends
                </div>
            </div>

            <div className="mb-8">
                {renderTokenGrid(otherTokens, "Waiting for Nigeria Trends...")}
                <div className="flex justify-end mt-4">
                    <Link href="/ng" className="text-[#61cd21] font-bold hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-wider">
                        View All NG Trends <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Worldwide Header */}
            <div className="flex items-center justify-start mt-12 mb-16">
                <div className="text-[#61cd21] font-bold text-2xl flex items-center gap-3">
                    Worldwide
                    <span className="px-3 py-1 rounded-full bg-[#61cd21]/20 text-[#61cd21] text-xs font-bold border border-[#61cd21]/30 uppercase tracking-widest">Coming Soon</span>
                </div>
            </div>

            {/* TikTok Trends Header */}
            <div className="flex items-center justify-center mt-12 mb-24">
                <div className="text-[#61cd21] font-bold text-2xl flex items-center gap-3">
                    TikTok Trends
                    <span className="px-3 py-1 rounded-full bg-[#61cd21]/20 text-[#61cd21] text-xs font-bold border border-[#61cd21]/30 uppercase tracking-widest">Coming Soon</span>
                </div>
            </div>
        </main>
    );
}
