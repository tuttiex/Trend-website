'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ExternalLink, ChevronLeft } from 'lucide-react';
import localFont from 'next/font/local';

const spriteGraffiti = localFont({ src: '../../../public/SpriteGraffitiShadow.woff' });

interface Token {
    token_address: string;
    symbol: string;
    topic: string;
    image_cid: string;
    timestamp: string;
    region?: string;
}

export default function NGTrends() {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTokens() {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
                const apiUrl = `${baseUrl}/api/public/tokens`;
                const res = await fetch(apiUrl);
                const data = await res.json();
                if (data.success) {
                    const filteredTokens = data.data.filter((t: Token) => t.symbol !== 'JXSN' && t.symbol !== 'TENI' && t.symbol !== 'VERIFY');
                    const usaSymbols = ['SOTU', 'WWRW', 'SPCX'];
                    const others = filteredTokens.filter((t: Token) => {
                        if (t.region) {
                            const r = t.region.toUpperCase();
                            return r === 'NG' || r === 'NIGERIA';
                        }
                        return !usaSymbols.includes(t.symbol.toUpperCase());
                    });
                    setTokens(others);
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

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <nav className="mb-8">
                <Link href="/" className="text-[#45A29E] hover:text-[#C5C6C7] transition-colors flex items-center gap-2 w-fit">
                    <ChevronLeft size={20} /> Back to Dashboard
                </Link>
            </nav>

            <header className="mb-16 text-center">
                <h1 className={`text-[4rem] md:text-[6rem] font-black mb-4 tracking-tighter leading-none ${spriteGraffiti.className}`}>
                    <span style={{ color: '#61cd21' }}>NG</span>
                    <span style={{ color: '#61cd21' }}>$</span>
                </h1>
                <p className="text-[#45A29E] text-xl max-w-2xl mx-auto">
                    Tokens deployed based on real time Nigerian trends.
                </p>
            </header>

            <div className="flex items-center justify-start mb-6">
                <div className="text-[#45A29E] font-bold text-2xl tracking-tight flex items-center gap-2">
                    NG Trends
                </div>
            </div>

            {loading && tokens.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl" />
                    ))}
                </div>
            ) : tokens.length === 0 ? (
                <div className="text-center py-24 bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl">
                    <TrendingUp className="mx-auto mb-4 text-zinc-600" size={48} />
                    <h2 className="text-2xl font-semibold mb-2 text-zinc-300">No agents active yet</h2>
                    <p className="text-[#C5C6C7]/60">The agent will push new tokens here as they are deployed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tokens.map((token, index) => (
                        <motion.div
                            key={token.token_address}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#1F2833] backdrop-blur-sm border border-[#45A29E]/20 rounded-2xl p-6 group hover:bg-[#141A22] hover:border-[#45A29E]/70 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(69,162,158,0.12)] transition-all duration-300 cursor-pointer"
                        >
                            <Link href={`/token/${token.token_address}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#141A22] border border-white/5">
                                        <img
                                            src={`https://ipfs.io/ipfs/${token.image_cid}`}
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

                                    <button className="w-full py-4 bg-[#45A29E] text-[#0B0C10] font-black rounded-xl hover:bg-[#56C6C2] hover:shadow-[0_4px_20px_rgba(69,162,158,0.3)] active:bg-[#61cd21] active:text-white active:scale-[0.97] active:shadow-none transition-all duration-200 ease-out flex items-center justify-center gap-2">
                                        Trade Now
                                        <ExternalLink size={18} />
                                    </button>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </main>
    );
}
