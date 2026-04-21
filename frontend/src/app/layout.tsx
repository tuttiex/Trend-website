import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

import { Providers } from "./Providers";

export const metadata: Metadata = {
    title: "Trend$",
    description: "Live tokens deployed by AI agents",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${spaceGrotesk.variable} bg-black text-[#C5C6C7] antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
