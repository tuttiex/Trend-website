'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, ExternalLink, TrendingUp, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LiFiWidget } from '@lifi/widget';

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
                    const found = data.data.find((t: Token) =>
                        t.token_address.toLowerCase() === address.toLowerCase() &&
                        t.symbol !== 'JXSN' &&
                        t.symbol !== 'TENI'
                    );
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
                <Link href="/" className="text-[#b21a1a] hover:underline flex items-center gap-2">
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
                        <div className="ml-4 flex items-center">
                            <ConnectButton showBalance={false} chainStatus="icon" />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-8">
                {/* 1. Dedicated Header Row */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-900 border-2 border-white/10 shrink-0">
                        <img src={`https://ipfs.io/ipfs/${token.image_cid}`} alt={token.symbol} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold tracking-tight">{token.symbol}</h1>
                            <span className="text-lg font-medium text-zinc-500">${token.symbol}</span>
                            <span className="text-xs bg-[#b21a1a]/20 text-[#b21a1a] px-2 py-0.5 rounded border border-[#b21a1a]/20 uppercase">Base</span>
                        </div>
                        <div
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 cursor-copy transition-colors group"
                            onClick={() => navigator.clipboard.writeText(token.token_address)}
                        >
                            <span className="text-sm font-mono text-zinc-300">
                                {token.token_address.slice(0, 6)}...{token.token_address.slice(-4)}
                            </span>
                            <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">Copy</span>
                        </div>
                    </div>
                </div>

                {/* 2. Main Grid: 65/35 Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Terminal + Analytics) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Terminal (Tall) */}
                        <div className="h-[650px] glass-card overflow-hidden relative">
                            <iframe
                                src={`https://www.geckoterminal.com/base/tokens/${token.token_address}?embed=1&info=0&swaps=1`}
                                className="w-full h-full border-0 absolute inset-0"
                                allow="clipboard-write"
                                allowFullScreen
                            />
                        </div>

                        {/* 4. The Two Things Under the Terminal (50/50 Split) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Box */}
                            <div className="glass-card p-6 flex flex-col">
                                <div className="flex items-center gap-2 text-zinc-500 mb-6">
                                    <TrendingUp size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Trend Insight</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-4">Topic: {token.topic}</h2>
                                <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                                    This token was autonomously deployed by the Trend Agent after detecting significant social momentum around "{token.topic}" on X.
                                </p>
                            </div>

                            {/* Right Box */}
                            <div className="glass-card p-6 flex flex-col">
                                <div className="flex items-center gap-2 text-zinc-500 mb-6">
                                    <Info size={16} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Analytics</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                        <span className="text-zinc-500">Launched</span>
                                        <span className="font-medium text-zinc-200">{new Date(token.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                                        <span className="text-zinc-500">Network</span>
                                        <span className="font-medium text-zinc-200">Base Mainnet</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500">Contract</span>
                                        <a
                                            href={`https://basescan.org/token/${token.token_address}`}
                                            target="_blank"
                                            className="font-medium text-[#b21a1a] hover:text-[#b21a1a]/80 flex items-center gap-1"
                                        >
                                            View Explorer <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Trade Aspect) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="w-full">
                            <div className="min-h-[500px]">
                                <LiFiWidget
                                    integrator="trend-agent"
                                    config={{
                                        theme: {
                                            container: {
                                                border: '1px solid rgba(178, 26, 26, 0.3)', // Subtle red border
                                                borderRadius: '24px',
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', // Outer shadow for depth
                                            },
                                            palette: {
                                                mode: 'dark',
                                                primary: { main: '#b21a1a' }, // red theme
                                                background: {
                                                    default: 'rgba(20, 20, 20, 0.8)', // Semi-transparent dark background
                                                    paper: '#131313',
                                                },
                                            },
                                            shape: {
                                                borderRadius: 16,
                                                borderRadiusSecondary: 16,
                                            },
                                        },
                                        toChain: 8453,
                                        toToken: token.token_address,
                                    }}
                                />
                            </div>
                            <p className="mt-4 text-[10px] text-zinc-600 text-center uppercase tracking-tighter">
                                Trading carries high risk. Do your own research.
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
