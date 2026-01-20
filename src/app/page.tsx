import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";
import TextType from "@/component/TextType";

export default function Home() {
    const personalDetails = {
        fullName: "Muhammad Pilar Abu Dzar Al Ghifari",
    };

    const techLogos = [
        { name: "React", icon: "react" },
        { name: "Next.js", icon: "next" },
        { name: "Laravel", icon: "laravel" },
        { name: "Node.js", icon: "node" },
        { name: "Express.js", icon: "express" },
        { name: "Bootstrap", icon: "bootstrap" },
        { name: "Tailwind", icon: "tailwind" },
        { name: "PHP", icon: "php" },
        { name: "JS", icon: "javascript" },
        { name: "CSS", icon: "css" },
        { name: "HTML", icon: "html" },
        { name: "TS", icon: "typescript" },
        { name: "MySQL", icon: "mysql" },
        { name: "Supabase", icon: "supabase" },
        { name: "phpMyAdmin", icon: "phpmyadmin" },
        { name: "Flutter", icon: "flutter" },
        { name: "Figma", icon: "figma" }
    ];

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 max-w-6xl mx-auto space-y-32">
            {/* Hero Section */}
            <section className="w-full grid md:grid-cols-2 gap-12 items-center text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-slate-400 font-medium tracking-[0.3em] uppercase text-xs">Software Engineer & Developer</h2>
                        <h1 className="text-6xl md:text-7xl font-bold text-gradient tracking-tighter leading-none min-h-[1.5em]">
                            <TextType
                                text={personalDetails.fullName}
                                typingSpeed={70}
                                pauseDuration={3000}
                                showCursor
                                cursorCharacter="_"
                                loop={false}
                            />
                        </h1>
                        <p className="text-slate-400 text-xl leading-relaxed font-light max-w-xl">
                            Crafting high-end, scalable business architectures with precision and modern tech stacks.
                            Specialized in React, Laravel, and enterprise-grade web development.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <Link href="/projects" className="px-10 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5">
                            View Projects <ArrowRight size={20} />
                        </Link>
                        <Link href="/experience" className="px-10 py-4 glass rounded-full font-bold hover:bg-white/10 transition-all border border-white/10">
                            Journey
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <ElectricBorder color="#20494b" speed={1} chaos={0.1} borderRadius={48}>
                        <div className="relative w-72 h-96 md:w-80 md:h-[480px] rounded-[48px] overflow-hidden glass shadow-2xl">
                            <img
                                src="https://ik.imagekit.io/psdoxljjy/IMG_1516.HEIC?tr=f-auto"
                                alt="Muhammad Pilar"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </ElectricBorder>
                </div>
            </section>

            {/* Tech Stack - Compact */}
            <section className="w-full space-y-12">
                <div className="flex items-center gap-8">
                    <div className="h-px bg-white/10 flex-1" />
                    <h3 className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Primary Tech Stack</h3>
                    <div className="h-px bg-white/10 flex-1" />
                </div>
                <div className="flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-100 transition-all duration-700">
                    {techLogos.slice(0, 8).map((tech) => (
                        <ElectricBorder key={tech.name} color="#20494b" speed={0.5} chaos={0.05} borderRadius={12}>
                            <div className="px-6 py-3 glass rounded-xl cursor-default group">
                                <span className="text-xs font-bold tracking-widest text-slate-400 group-hover:text-white transition-colors uppercase">{tech.name}</span>
                            </div>
                        </ElectricBorder>
                    ))}
                </div>
            </section>
        </main>
    );
}
