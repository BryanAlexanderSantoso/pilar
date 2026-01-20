import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import LiquidEther from "@/components/ui/LiquidEther";

export const metadata: Metadata = {
    title: "Pilar | Developer Portfolio",
    description: "Professional Developer Portfolio of Muhammad Pilar Abu Dzar Al Ghifari",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased overflow-x-hidden">
                <Navbar />

                <div className="fixed inset-0 z-[-1] pointer-events-none">
                    <LiquidEther
                        color0="#ff0a0a"
                        color1="#3b42a0"
                        color2="#ffffff"
                        mouseForce={20}
                        cursorSize={100}
                        isViscous
                        viscous={30}
                        iterationsViscous={32}
                        iterationsPoisson={32}
                        resolution={0.5}
                        isBounce={false}
                        autoDemo
                        autoSpeed={0.5}
                        autoIntensity={2.2}
                        takeoverDuration={0.25}
                        autoResumeDelay={3000}
                        autoRampDuration={0.6}
                    />
                </div>

                <div className="relative z-0">
                    {children}
                </div>
            </body>
        </html>
    );
}
