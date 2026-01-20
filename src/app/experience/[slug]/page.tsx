import { getFullDb } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Building2, CheckCircle2 } from "lucide-react";

export default async function ExperienceDetail({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const db = await getFullDb();
    const experience = db.experiences.find((e: any) => e.slug === slug);

    if (!experience) {
        notFound();
    }

    return (
        <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto space-y-12">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Profile
            </Link>

            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
                        <img src={experience.logo} alt={experience.company} className="w-full h-full object-contain opacity-80" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gradient">{experience.role}</h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-300">
                            <span className="flex items-center gap-2 font-semibold">
                                <Building2 size={18} className="text-slate-500" /> {experience.company}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin size={18} className="text-slate-500" /> {experience.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={18} className="text-slate-500" /> {experience.period}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-[2rem] p-8 md:p-12 space-y-10 mt-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">About this role</h2>
                        <p className="text-slate-300 leading-relaxed text-lg">
                            {experience.description}
                        </p>
                    </div>

                    {experience.tasks && experience.tasks.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">Key Responsibilities</h2>
                            <ul className="grid gap-4">
                                {experience.tasks.map((task: string, index: number) => (
                                    <li key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <CheckCircle2 size={24} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-200">{task}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            <footer className="pt-12 border-t border-white/5 flex justify-between items-center text-slate-500 text-sm">
                <p>© 2026 Pilar</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </footer>
        </main>
    );
}
