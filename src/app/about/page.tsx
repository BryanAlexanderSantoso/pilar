import { getFullDb } from "@/lib/db";
import { GraduationCap, Code2, User } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";

export default async function AboutPage() {
    const db = await getFullDb();
    const { education, skills } = db;
    const personalDetails = {
        fullName: "Muhammad Pilar Abu Dzar Al Ghifari",
        born: "March 6, 2007",
        religion: "Islam",
        citizenship: "Indonesia"
    };

    return (
        <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto space-y-20">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <User className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-bold text-gradient">About Me</h1>
                </div>
                <p className="text-slate-400 text-lg">Personal background, education, and technical expertise.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Education */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Education</h2>
                    </div>
                    <div className="space-y-6">
                        {!education || education.length === 0 ? (
                            <p className="text-slate-500 italic">No education history added yet.</p>
                        ) : (
                            education.map((edu: any) => (
                                <ElectricBorder key={edu.id} color="#20494b" speed={1} chaos={0.08} borderRadius={16}>
                                    <div className="p-6 glass border border-white/5 rounded-2xl">
                                        <h4 className="font-bold text-slate-100">{edu.institution}</h4>
                                        <p className="text-slate-500 text-sm">{edu.period}</p>
                                    </div>
                                </ElectricBorder>
                            ))
                        )}
                    </div>
                </section>

                {/* Skills & Personal */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Code2 className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold">Details & Skills</h2>
                    </div>
                    <ElectricBorder color="#20494b" speed={1} chaos={0.12} borderRadius={32}>
                        <div className="glass-card rounded-[32px] p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Born</p>
                                    <p className="font-medium">{personalDetails.born}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Religion</p>
                                    <p className="font-medium">{personalDetails.religion}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Citizenship</p>
                                    <p className="font-medium">{personalDetails.citizenship}</p>
                                </div>
                            </div>
                            <hr className="border-white/5" />
                            <div className="space-y-4">
                                <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Core Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {!skills || skills.length === 0 ? (
                                        <p className="text-slate-500 italic text-sm">No skills added yet.</p>
                                    ) : (
                                        skills.map((skill: any) => (
                                            <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300">
                                                {skill}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </ElectricBorder>
                </section>
            </div>
        </main>
    );
}
