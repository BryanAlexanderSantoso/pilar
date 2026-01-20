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
        <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass px-6 py-4 rounded-full flex items-center gap-8 border border-white/10 shadow-2xl">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 transition-all group",
                                isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
                <div className="w-px h-6 bg-white/10 mx-2" />
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
