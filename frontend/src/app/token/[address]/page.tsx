'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface Token {
    token_address: string;
    symbol: string;
    topic: string;
    image_cid: string;
    timestamp: string;
}

export default function TokenDetail({ params }: { params: Promise<{ address: string }> }) {
    const { address } = use(params);
    const [token, setToken] = useState<Token | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchToken() {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
                const apiUrl = `${baseUrl}/api/public/tokens`;
                console.log('Fetching from:', apiUrl);
                const res = await fetch(apiUrl);
                const data = await res.json();
                if (data.success) {
                    const found = data.data.find((t: Token) => t.token_address.toLowerCase() === address.toLowerCase());
                    setToken(found || null);
                }
            } catch (err) {
                console.error('Failed to fetch token:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchToken();
    }, [address]);

    if (loading) return <div className="min-h-screen bg-black" />;

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
                <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
                <Link href="/" className="text-violet-500 hover:underline flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 overflow-hidden border border-white/10">
                            <img src={`https://ipfs.io/ipfs/${token.image_cid}`} alt={token.symbol} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold">{token.symbol}</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                                    {token.symbol}
                                    <span className="text-sm bg-violet-600/20 text-violet-400 px-3 py-1 rounded-full border border-violet-500/20 uppercase">Base</span>
                                </h1>
                                <p className="text-zinc-500 font-mono text-sm">{token.token_address}</p>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={`https://basescan.org/token/${token.token_address}`}
                                    target="_blank"
                                    className="p-3 glass-card hover:bg-white/10 transition-colors"
                                >
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Chart Widget */}
                        <div className="h-[600px] glass-card overflow-hidden relative group">
                            <iframe
                                src={`https://www.geckoterminal.com/base/tokens/${token.token_address}?embed=1&info=0&swaps=1`}
                                className="w-full h-full border-0 absolute inset-0"
                                allow="clipboard-write"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    {/* Trade Area */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="glass-card p-6 border-violet-500/30">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                Swap 🚀
                            </h2>
                            {/* Uniswap Widget Iframe - Standard simple swap embed */}
                            <div className="rounded-2xl overflow-hidden bg-[#131313] min-h-[500px]">
                                <iframe
                                    src={`https://app.uniswap.org/#/swap?outputCurrency=${token.token_address}&chain=base`}
                                    width="100%"
                                    height="500px"
                                    style={{ border: 0 }}
                                />
                            </div>
                            <p className="mt-4 text-[10px] text-zinc-600 text-center uppercase tracking-tighter">
                                Trading carries high risk. Do your own research.
                            </p>
                        </div>

                        <a
                            href={`https://www.geckoterminal.com/base/tokens/${token.token_address}`}
                            target="_blank"
                            className="glass-card p-4 flex items-center justify-between group hover:bg-white/5 transition-colors"
                        >
                            <div className="text-sm font-bold">View on GeckoTerminal</div>
                            <ExternalLink size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
