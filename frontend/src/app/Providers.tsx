'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
    appName: 'Trend Agent Trading',
    projectId: 'YOUR_PROJECT_ID', // Replaced later in Phase 4
    chains: [base, mainnet],
    transports: {
        [base.id]: http(),
        [mainnet.id]: http(),
    },
    ssr: true, // Required for Next.js App Router
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#66FCF1', // Red to match the site themes
                        accentColorForeground: 'white',
                        borderRadius: 'large',
                    })}
                >
                    {mounted && children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
