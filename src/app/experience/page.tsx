import { getFullDb } from "@/lib/db";
import Link from "next/link";
import { Briefcase, MapPin, Calendar, ArrowRight } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";

export default async function ExperiencePage() {
    const db = await getFullDb();
    const { experiences } = db;

    return (
        <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto space-y-12">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <Briefcase className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-bold text-gradient">Professional Experience</h1>
                </div>
                <p className="text-slate-400 text-lg">Detailed history of my career and contributions.</p>
            </div>

            <div className="space-y-6">
                {!experiences || experiences.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                        <p className="text-slate-500">No professional experience added yet.</p>
                    </div>
                ) : (
                    experiences.map((exp: any) => (
                        <Link
                            key={exp.id}
                            href={`/experience/${exp.slug}`}
                            className="block group"
                        >
                            <ElectricBorder color="#20494b" speed={1} chaos={0.12} borderRadius={24}>
                                <div className="glass-card rounded-[24px] p-8 transition-colors group-hover:bg-white/5">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img src={exp.logo} alt={exp.company} className="w-10 h-10 object-contain opacity-80" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold group-hover:text-white transition-colors">{exp.role}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-sm">
                                                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                                                        {exp.company}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} /> {exp.location}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar size={14} /> {exp.period}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 mt-4 leading-relaxed max-w-3xl line-clamp-2">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-col items-end">
                                            <span className="p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight size={20} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ElectricBorder>
                        </Link>
                    ))
                )}
            </div>
        </main>
    );
}
