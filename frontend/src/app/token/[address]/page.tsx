'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
    ChevronLeft, ExternalLink, TrendingUp, Info, 
    Home, Activity, Eye, History, Wallet, Search, SlidersHorizontal, ShieldCheck
} from 'lucide-react';
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
                        t.symbol !== 'TENI' &&
                        t.symbol !== 'VERIFY'
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
                <Link href="/" className="text-[#45A29E] hover:text-[#C5C6C7] transition-colors hover:underline flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to dashboard
                </Link>
            </div>
        );
    }

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
                            <div className="hidden sm:block">
                                <ConnectButton showBalance={false} chainStatus="icon" />
                            </div>
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
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors">
                            <Home size={18} /> Dashboard
                        </Link>
                        <Link href="/attention-market" className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors">
                            <Activity size={18} /> Attention Market
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Eye size={18} /> Spectator Market
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <Wallet size={18} /> Staking
                        </button>
                        <button className="flex items-center gap-3 px-4 py-3 text-sm text-[#A0ABC0] hover:text-white rounded-lg hover:bg-[#141A22] transition-colors text-left">
                            <History size={18} /> History
                        </button>
                    </nav>
                </aside>

                <div className="flex-1 min-w-0">
                    {/* Token Info Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#141A22] border-2 border-white/5 shadow-[0_0_20px_rgba(0,229,255,0.1)] shrink-0 group">
                            <img src={`https://gateway.pinata.cloud/ipfs/${token.image_cid}`} alt={token.symbol} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-4xl font-black tracking-tight uppercase">
                                    <span className="text-white">{token.symbol}</span> <span className="bg-gradient-to-br from-primary to-primary-container text-transparent bg-clip-text inline-block">TERMINAL</span>
                                </h1>
                                <span className="text-xs font-bold text-[#A0ABC0] bg-[#141A22] px-2 py-1 rounded border border-white/5 uppercase tracking-widest">{token.topic}</span>
                            </div>
                            <div
                                className="inline-flex items-center gap-2 bg-[#141A22] hover:bg-[#1F2833] px-3 py-1.5 rounded-lg border border-white/5 cursor-pointer transition-colors group"
                                onClick={() => navigator.clipboard.writeText(token.token_address)}
                            >
                                <span className="text-xs font-mono text-[#A0ABC0]">
                                    {token.token_address}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-primary/70 group-hover:text-primary transition-colors">Copy</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Trading Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Chart Area */}
                        <div className="xl:col-span-2 flex flex-col gap-6">
                            <div className="h-[600px] bg-[#0C1014] rounded-2xl overflow-hidden border border-white/5 relative">
                                <iframe
                                    src={`https://www.geckoterminal.com/base/tokens/${token.token_address}?embed=1&info=0&swaps=1`}
                                    className="w-full h-full border-0 absolute inset-0 grayscale-[0.2] brightness-[0.9]"
                                    allow="clipboard-write"
                                    allowFullScreen
                                />
                            </div>

                            {/* Analytics Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#141A22] p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#A0ABC0] uppercase">
                                        <TrendingUp size={14} className="text-primary" />
                                        <span>Trend Insight</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Topic: {token.topic}</h3>
                                    <p className="text-[#A0ABC0] text-sm leading-relaxed">
                                        This token was autonomously deployed by the Trend Agent after detecting significant social momentum around "{token.topic}" on X.
                                    </p>
                                </div>

                                <div className="bg-[#141A22] p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#A0ABC0] uppercase">
                                        <Info size={14} className="text-primary" />
                                        <span>Analytics</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                            <span className="text-[#A0ABC0] uppercase font-bold tracking-wider">Launched</span>
                                            <span className="font-mono text-white">{new Date(token.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                                            <span className="text-[#A0ABC0] uppercase font-bold tracking-wider">Network</span>
                                            <span className="font-bold text-white uppercase tracking-tighter italic">Base Mainnet</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-[#A0ABC0] uppercase font-bold tracking-wider">Explorer</span>
                                            <a
                                                href={`https://basescan.org/token/${token.token_address}`}
                                                target="_blank"
                                                className="font-bold text-primary hover:text-white transition-colors flex items-center gap-1 uppercase tracking-tighter"
                                            >
                                                View Basescan <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trade Widget Area */}
                        <div className="xl:col-span-1 flex flex-col gap-6">
                            <div className="bg-[#0C1014] rounded-2xl p-4 border border-white/5 min-h-[500px]">
                                <LiFiWidget
                                    integrator="trend-agent"
                                    config={{
                                        theme: {
                                            container: {
                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                borderRadius: '16px',
                                                boxShadow: 'none',
                                            },
                                            palette: {
                                                mode: 'dark',
                                                primary: { main: '#66FCF1' },
                                                background: {
                                                    default: '#141A22',
                                                    paper: '#0C1014',
                                                },
                                            },
                                            shape: {
                                                borderRadius: 12,
                                                borderRadiusSecondary: 12,
                                            },
                                        },
                                        toChain: 8453,
                                        toToken: token.token_address,
                                    }}
                                />
                                <p className="mt-6 text-[10px] text-zinc-600 text-center uppercase font-bold tracking-[0.1em] px-4">
                                    NOTICE: TRADING ASSETS CARRIES SIGNIFICANT RISK. ENSURE YOUR WALLET'S SECURITY.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
