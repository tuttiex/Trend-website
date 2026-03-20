import Link from 'next/link';

export default function KineticHomepage() {
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface selection:bg-primary/30">
      {/* Navbar */}
      <div className="fixed top-6 w-full z-50 px-6 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-[1200px] bg-[#0A0B0C]/90 backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-full shadow-2xl">
          <div className="px-8 h-14 flex items-center justify-between">
            <Link href="/" className="font-space text-xl font-bold tracking-tighter shrink-0 min-w-[120px]">
              <span className="text-primary">Trend</span><span className="text-secondary">$</span>
            </Link>
            
            <div className="hidden md:flex flex-1 items-center justify-evenly px-8 text-sm font-medium text-on-surface-variant">
              <Link href="#" className="hover:text-white transition-colors">Attention Market</Link>
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

      <main className="pt-32 lg:pt-40 pb-24">
        {/* Hero Section */}
        <section className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-secondary uppercase">
              <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse"></span>
              LIVE TRADING ENGINE ACTIVE
            </div>
            <h1 className="font-space text-5xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tight">
              ATTENTION IS <br className="hidden md:block" />
              <span className="bg-gradient-to-br from-primary to-primary-container text-transparent bg-clip-text">THE NEW</span><br className="hidden md:block"/>
              ASSET <br className="hidden md:block"/>
              CLASS.
            </h1>
            <p className="text-base lg:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Don’t just follow trends, trade them on our attention market, and trade their outcomes on our spectator market.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-surface-container-lowest font-bold text-base px-8 py-4 rounded-full hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
                Attention Market
              </button>
              <button className="w-full sm:w-auto bg-surface-container-highest text-on-surface font-bold text-base px-8 py-4 rounded-full hover:bg-surface-container-high transition-colors">
                Spectator Market
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-[480px] space-y-4">
            {/* Asset Cards Placeholder */}
            {[
              { title: 'Top Trend 1 / USD', price: 'XXXX', mcap: 'XXXX', change: '+X%', up: true },
              { title: 'Top Trend 2 / USD', price: 'XXXX', mcap: 'XXXX', change: '+X%', up: true },
              { title: 'Top Spectator Position', price: 'XXXX', mcap: 'XXXX', change: '-X%', up: false }
            ].map((asset, i) => (
              <div key={i} className="bg-surface-container p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:bg-surface-bright transition-colors">
                <div className="flex justify-between items-start z-10">
                  <span className="font-bold text-sm tracking-wide uppercase">{asset.title}</span>
                  <span className={`text-sm font-medium ${asset.up ? 'text-secondary drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'text-error drop-shadow-[0_0_8px_rgba(255,113,108,0.6)]'}`}>{asset.change}</span>
                </div>
                <div className="z-10 flex items-end gap-3">
                  <div className="font-space text-3xl font-bold leading-none">{asset.price}</div>
                  <div className="text-[10px] text-on-surface-variant border border-surface-container-high px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold">MCAP: {asset.mcap}</div>
                </div>
                {/* Simulated Sparkline Glow */}
                <div className={`absolute -bottom-10 -right-10 w-48 h-32 opacity-20 blur-[40px] ${asset.up ? 'bg-secondary' : 'bg-error'}`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Dense Data Ticker */}
        <section className="border-y border-surface-container bg-surface-container-lowest py-4 my-12 overflow-x-auto hide-scrollbar">
          <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between text-xs font-mono text-on-surface-variant tracking-wider min-w-[800px]">
            <div className="flex gap-12">
              <span>AVG LATENCY: <strong className="text-secondary drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]">0.4ms</strong></span>
              <span>OPEN INTEREST: <strong className="text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">512.4M</strong></span>
              <span>LIQUIDITY DEPTH: <strong className="text-secondary drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]">HIGH</strong></span>
              <span>Trend$ SCORE: <strong className="text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">99.8</strong></span>
            </div>
            <div>TOTAL VOLUME (24H): <strong className="text-on-surface">5.2B</strong></div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-8 rounded-3xl md:col-span-1 flex flex-col justify-between min-h-[240px]">
            <div className="text-xs font-semibold tracking-widest text-on-surface-variant mb-4 uppercase">ENGINE PERFORMANCE</div>
            <div>
              <div className="font-space text-5xl font-bold mb-2">1.2M <span className="text-lg text-on-surface-variant font-sans">TPS</span></div>
              <p className="text-sm text-on-surface-variant">Proprietary matching engine built for the most demanding institutional workflows.</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-3xl md:col-span-1 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-space text-xl font-bold">Secured by PulseVault</h3>
            <p className="text-sm text-on-surface-variant">Multi-layer cold storage with hardware-level encryption.</p>
          </div>
          <div className="bg-surface-container-low p-8 rounded-3xl md:col-span-1 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-space text-xl font-bold">Ultra-Low API Latency</h3>
            <p className="text-sm text-on-surface-variant">WebSockets and FIX protocol support for automated strategies.</p>
          </div>
        </section>

        {/* Split Features */}
        <section className="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-3xl lg:col-span-1 border border-outline-variant flex flex-col relative overflow-hidden h-[300px] lg:h-auto">
             <div className="relative z-10 flex-1">
               <h3 className="font-space text-2xl font-bold mb-2">Global Reach</h3>
               <p className="text-sm text-on-surface-variant leading-relaxed">Serving institutional clients across 40 countries with cross-fiat clearing.</p>
             </div>
             <div className="absolute -bottom-20 -right-20 opacity-30 pointer-events-none">
                <svg className="w-64 h-64 text-on-surface-variant" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
             </div>
          </div>
          <div className="bg-surface-container p-8 lg:p-12 rounded-3xl lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-12 border border-transparent hover:border-surface-container-high transition-colors">
            <div className="flex-1">
              <h2 className="font-space text-3xl lg:text-4xl font-bold mb-4 uppercase">Deep Liquidity Aggregation</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                We bridge fragmented markets into a single high-density order book. Get the best prices across Spot, Futures, and Perpetual markets with minimal slippage.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-surface-container-highest p-6 rounded-2xl text-center border border-[rgba(255,255,255,0.05)] w-32">
                <div className="text-2xl font-bold text-secondary mb-1">0.01%</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Maker Fee</div>
              </div>
              <div className="bg-surface-container-highest p-6 rounded-2xl text-center border border-[rgba(255,255,255,0.05)] w-32">
                <div className="text-2xl font-bold text-primary mb-1">0.04%</div>
                <div className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Taker Fee</div>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Professionals */}
        <section className="max-w-[1400px] mx-auto px-6 py-24 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-space text-4xl lg:text-5xl font-black uppercase mb-4">
                BUILT FOR <span className="text-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">PROFESSIONALS</span>
              </h2>
              <p className="text-on-surface-variant text-lg">Sophisticated tools for sophisticated traders. Kinetic Pulse provides the infrastructure you need to execute complex strategies at scale.</p>
            </div>
            <button className="flex items-center gap-2 text-primary font-bold hover:brightness-125 transition-all text-sm uppercase tracking-wider">
              EXPLORE ALL FEATURES <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col gap-24 hover:bg-surface-container transition-colors group">
              <div className="text-on-surface-variant group-hover:text-primary transition-colors">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              </div>
              <div>
                <div className="bg-surface-container-lowest text-[10px] font-bold px-4 py-2 rounded-full inline-block mb-6 tracking-widest text-primary border border-primary/20">ADVANCED CHARTING</div>
                <h3 className="font-space text-xl font-bold mb-3">Real-time Order Book Depth</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Visualize market liquidity with precision. Our heatmap and order-flow tools provide insight into institutional positioning.</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col gap-24 hover:bg-surface-container transition-colors group">
              <div className="text-on-surface-variant group-hover:text-tertiary transition-colors">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div>
                <div className="bg-surface-container-lowest text-[10px] font-bold px-4 py-2 rounded-full inline-block mb-6 tracking-widest text-tertiary border border-tertiary/20">MULTI-ASSET WALLET</div>
                <h3 className="font-space text-xl font-bold mb-3">Unified Portfolio View</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">Manage Spot, Futures, and Staked assets from a single command center. Integrated cross-margin capabilities.</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl flex flex-col gap-24 hover:bg-surface-container transition-colors group">
               <div className="text-on-surface-variant group-hover:text-secondary transition-colors">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <div className="bg-surface-container-lowest text-[10px] font-bold px-4 py-2 rounded-full inline-block mb-6 tracking-widest text-secondary border border-secondary/20">ALGO-READY</div>
                <h3 className="font-space text-xl font-bold mb-3">Custom Order Types</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">TWAP, VWAP, and iceberg orders standard. Build and deploy custom execution bots via our SDK.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24">
          <div className="bg-surface-container-low rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-24 text-center relative overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="font-space text-4xl lg:text-[3.5rem] font-black uppercase leading-[1.1]">
                THE FUTURE OF <br className="hidden sm:block"/> TRADING IS <span className="text-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">Trend$</span>.
              </h2>
              <p className="text-on-surface-variant text-base lg:text-lg max-w-xl">
                Join 50,000+ institutional and professional traders already leveraging the Pulse ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-surface-container-lowest font-bold text-lg px-12 py-4 rounded-full hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
                  Get Started
                </button>
                <button className="w-full sm:w-auto bg-surface-container-highest text-on-surface font-bold text-lg px-12 py-4 rounded-full hover:bg-surface-container-high transition-colors">
                  Institutional API
                </button>
              </div>
            </div>
            {/* Fake ambient bloom */}
            <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none mix-blend-screen"></div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-container-lowest bg-surface-container-lowest">
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6 max-w-xs">
             <Link href="/" className="font-space text-3xl font-bold text-on-surface tracking-tighter">
              Trend<span className="text-secondary">$</span>.
            </Link>
            <p className="text-xs text-on-surface-variant leading-relaxed font-mono">
              © 2026 TREND$. HIGH-SPEED INSTITUTIONAL LIQUIDITY.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 text-sm font-medium">
            <div className="space-y-6">
              <h4 className="font-bold text-primary tracking-widest text-[10px] uppercase border-b border-surface-container-low pb-2">Platform</h4>
              <div className="flex flex-col gap-4 text-on-surface-variant">
                <Link href="#" className="hover:text-on-surface transition-colors">Markets</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">Trade</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">Advanced</Link>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="font-bold text-primary tracking-widest text-[10px] uppercase border-b border-surface-container-low pb-2">Legal</h4>
              <div className="flex flex-col gap-4 text-on-surface-variant">
                <Link href="#" className="hover:text-on-surface transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">KYC/AML Policy</Link>
              </div>
            </div>
             <div className="space-y-6">
              <h4 className="font-bold text-primary tracking-widest text-[10px] uppercase border-b border-surface-container-low pb-2">Support</h4>
              <div className="flex flex-col gap-4 text-on-surface-variant">
                <Link href="#" className="hover:text-on-surface transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">Status</Link>
                <Link href="#" className="hover:text-on-surface transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
