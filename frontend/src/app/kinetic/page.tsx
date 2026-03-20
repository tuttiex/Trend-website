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
        <section className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 items-center relative">
          {/* Deep blue/primary aura behind hero text */}
          <div className="absolute top-1/2 left-0 w-[800px] h-[600px] bg-primary/15 mix-blend-screen blur-[140px] rounded-full transform -translate-y-1/2 -translate-x-1/4 pointer-events-none z-0"></div>
          
          <div className="flex-1 space-y-8 relative z-10">
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
              <button className="w-full sm:w-auto bg-secondary text-black font-bold text-base px-8 py-4 rounded-full hover:brightness-110 hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all">
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
          <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between text-xs font-mono text-on-surface-variant tracking-wider min-w-[1200px]">
            <div className="flex gap-12">
              <span>ATTENTION VOLUME (24H): <strong className="text-secondary drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]">$XXX</strong></span>
              <span>TOKENS DEPLOYED (24H): <strong className="text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">XXX</strong></span>
              <span>SPECTATOR VOLUME (24H): <strong className="text-secondary drop-shadow-[0_0_4px_rgba(57,255,20,0.4)]">$XXX</strong></span>
              <span>ACTIVE POSITIONS: <strong className="text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">XXX</strong></span>
              <span>Trend$ SCORE: <strong className="text-primary drop-shadow-[0_0_4px_rgba(0,229,255,0.4)]">99.8</strong></span>
            </div>
            <div>TOTAL VOLUME: <strong className="text-on-surface">$XXX</strong></div>
          </div>
        </section>

        {/* Attention Markets Section */}
        <section className="py-24 relative z-10 bg-surface overflow-hidden">
          {/* Deep blue/primary aura behind section text */}
          <div className="absolute top-1/2 left-0 w-[800px] h-[600px] bg-primary/15 mix-blend-screen blur-[140px] rounded-full transform -translate-y-1/2 -translate-x-1/3 pointer-events-none z-0"></div>

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <div className="flex flex-col max-w-3xl">
              <h2 className="font-space text-[3.5rem] md:text-[5rem] font-bold leading-[1.05] tracking-tight mb-8">
                <span className="text-white">Attention</span> <br />
                <span className="text-primary">Markets</span>
              </h2>
              
              <p className="text-[17px] text-[#A0ABC0] leading-[1.7] max-w-2xl mb-12">
                Attention markets consist of tokens representing live social trends across the internet. As attention grows or fades, so does their value, allowing you to trade and participate in global internet attention as it happens.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-primary text-black font-bold text-[15px] px-8 py-4 rounded-full hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all">
                  Explore Trends
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Spectator Markets Section */}
        <section className="py-24 relative z-10 bg-surface overflow-hidden">
          {/* Deep blue/primary aura behind section text */}
          <div className="absolute top-1/2 left-0 w-[800px] h-[600px] bg-primary/10 mix-blend-screen blur-[140px] rounded-full transform -translate-y-1/2 -translate-x-1/3 pointer-events-none z-0"></div>

          <div className="max-w-[1400px] mx-auto px-6 relative z-10">
            <div className="flex flex-col max-w-3xl">
              <h2 className="font-space text-[3.5rem] md:text-[5rem] font-bold leading-[1.05] tracking-tight mb-8">
                <span className="text-white">Spectator</span> <br />
                <span className="text-primary">Markets</span>
              </h2>
              
              <p className="text-[17px] text-[#A0ABC0] leading-[1.7] max-w-2xl mb-12">
                Spectator markets let you create and trade prediction positions on the outcomes of social trends and other attention-driven events, from sports and reality TV to live streams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <button className="bg-primary text-black font-bold text-[15px] px-8 py-4 rounded-full hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all">
                  Spectator Positions
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* Bottom CTA */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 lg:py-24">
          <div className="bg-surface-container-low rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-24 text-center relative overflow-hidden border border-[rgba(255,255,255,0.05)]">
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="font-space text-4xl lg:text-[3.5rem] font-black uppercase leading-[1.1]">
                THE FUTURE OF <br className="hidden sm:block"/> ATTENTION IS <span className="text-primary drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">Trend</span><span className="text-secondary drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]">$</span>
              </h2>
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
             <Link href="/" className="font-space text-3xl font-bold tracking-tighter">
              <span className="text-primary">Trend</span><span className="text-secondary">$</span>
            </Link>
            <p className="text-xs text-on-surface-variant leading-relaxed font-mono">
              © 2026 TREND$.
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
