import { getFullDb } from "@/lib/db";
import { Laptop, ExternalLink, ArrowRight } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";

export default async function ProjectsPage() {
    const db = await getFullDb();
    const { projects } = db;

    return (
        <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto space-y-12">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <Laptop className="text-white" size={24} />
                    </div>
                    <h1 className="text-4xl font-bold text-gradient">Featured Projects</h1>
                </div>
                <p className="text-slate-400 text-lg">A showcase of business applications and technical solutions.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {!projects || projects.length === 0 ? (
                    <div className="col-span-full text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                        <p className="text-slate-500">No projects added yet.</p>
                    </div>
                ) : (
                    projects.map((project: any, index: number) => (
                        <div key={index} className="group">
                            <ElectricBorder color="#20494b" speed={1} chaos={0.12} borderRadius={32}>
                                <div className="glass-card rounded-[32px] p-8 flex flex-col justify-between h-full transition-colors group-hover:bg-white/5">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-bold group-hover:text-white transition-colors">{project.title}</h3>
                                            <a href={project.link} target="_blank" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                        <p className="text-slate-400 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <a href={project.link} target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold border-b border-white/10 pb-1 hover:border-white/40 transition-all">
                                            View Project <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </ElectricBorder>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
