'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ExternalLink, ShieldCheck } from 'lucide-react';

interface Token {
    token_address: string;
    symbol: string;
    topic: string;
    image_cid: string;
    timestamp: string;
}

export default function Home() {
    const [tokens, setTokens] = useState<Token[]>([]);
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
                    setTokens(data.data);
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
            <header className="mb-16 text-center">

                <h1 className="text-[5rem] md:text-[8rem] font-black mb-4 tracking-tighter leading-none" style={{ filter: 'drop-shadow(4px 4px 0px rgba(255, 255, 255, 0.2))', fontFamily: '"Sprite Graffiti", sans-serif' }}>
                    <span style={{ color: '#b21a1a' }}>Trend</span>
                    <span style={{ color: '#61cd21' }}>$</span>
                </h1>
                <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
                    Every token listed below was deployed by our AI agent based on real-time X trends.
                </p>
            </header>

            {loading && tokens.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 glass-card" />
                    ))}
                </div>
            ) : tokens.length === 0 ? (
                <div className="text-center py-24 glass-card">
                    <TrendingUp className="mx-auto mb-4 text-zinc-600" size={48} />
                    <h2 className="text-2xl font-semibold mb-2 text-zinc-300">No agents active yet</h2>
                    <p className="text-zinc-500">The agent will push new tokens here as they are deployed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tokens.map((token, index) => (
                        <motion.div
                            key={token.token_address}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 group hover:border-violet-500/50 transition-all cursor-pointer"
                        >
                            <Link href={`/token/${token.token_address}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                                        <img
                                            src={`https://ipfs.io/ipfs/${token.image_cid}`}
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

                                    <button className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-violet-500 hover:text-white transition-colors flex items-center justify-center gap-2">
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
