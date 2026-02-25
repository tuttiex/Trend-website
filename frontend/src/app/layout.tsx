import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { Providers } from "./Providers";

export const metadata: Metadata = {
    title: "Trend$",
    description: "Live tokens deployed by AI agents",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-[#0B0C10] text-[#C5C6C7] antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
