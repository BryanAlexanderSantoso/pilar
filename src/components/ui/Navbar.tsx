"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Briefcase, Laptop, User, Lock } from "lucide-react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Experience", href: "/experience", icon: Briefcase },
    { name: "Projects", href: "/projects", icon: Laptop },
    { name: "About", href: "/about", icon: User },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
            <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-full flex items-center gap-4 md:gap-8 border border-white/10 shadow-2xl backdrop-blur-xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all group min-w-[3rem] md:min-w-0",
                                isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                <div className="w-px h-6 bg-white/10 mx-1 md:mx-2" />
                <Link
                    href="/admin"
                    className={cn(
                        "p-2 rounded-xl transition-all",
                        pathname.startsWith("/admin") ? "bg-white text-slate-950" : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Lock size={18} />
                </Link>
            </div>
        </nav>
    );
}
