"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Briefcase, GraduationCap, Code2, Globe, Laptop } from "lucide-react";
import { updateExperience, deleteExperience, updateEducation, updateSkills, updateProjects } from "./actions";
import slugify from "slugify";

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [editingExp, setEditingExp] = useState<any>(null);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/db")
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <div className="text-center py-20">Loading dashboard...</div>;

    const handleSaveExp = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateExperience(editingExp);
        if (res.success) {
            // Refresh data
            const dbRes = await fetch("/api/db");
            setData(await dbRes.json());
            setEditingExp(null);
        } else {
            alert("Failed to save experience: " + res.error);
        }
    };

    const handleDeleteExp = async (id: string) => {
        if (confirm("Are you sure?")) {
            const res = await deleteExperience(id);
            if (res.success) {
                const dbRes = await fetch("/api/db");
                setData(await dbRes.json());
            } else {
                alert("Failed to delete: " + res.error);
            }
        }
    };

    const handleAutoSlug = (title: string, company: string) => {
        const combined = `${title} ${company}`;
        setEditingExp({ ...editingExp, slug: slugify(combined, { lower: true }) });
    };

    return (
        <div className="max-w-6xl mx-auto p-10 space-y-16">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => setEditingExp({
                        id: "", company: "", role: "", period: "", location: "Kopo, Bandung",
                        slug: "", description: "", tasks: [], logo: "https://via.placeholder.com/100"
                    })}
                    className="flex items-center gap-2 px-6 py-2 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-all font-sans"
                >
                    <Plus size={18} /> Add Experience
                </button>
            </div>

            {/* Experience CRUD */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 mb-8">
                    <Briefcase size={20} />
                    <h2 className="text-xl font-semibold uppercase tracking-widest text-sm">Experience Management</h2>
                </div>

                <div className="grid gap-4">
                    {data.experiences.map((exp: any) => (
                        <div key={exp.id} className="glass-card p-6 flex justify-between items-center rounded-2xl">
                            <div>
                                <h3 className="font-bold text-lg">{exp.role}</h3>
                                <p className="text-slate-400">{exp.company}</p>
                                <code className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded mt-2 inline-block">/experience/{exp.slug}</code>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingExp(exp)} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDeleteExp(exp.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Portfolio CRUD */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 mb-8">
                    <Laptop size={20} />
                    <h2 className="text-xl font-semibold uppercase tracking-widest text-sm">Portfolio Management</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {data.projects.map((project: any, index: number) => (
                        <div key={index} className="glass-card p-6 flex flex-col gap-4 rounded-2xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{project.title}</h3>
                                    <a href={project.link} target="_blank" className="text-xs text-blue-400 hover:underline">{project.link}</a>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingProject({ ...project, index })} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white">
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const newProjects = data.projects.filter((_: any, i: number) => i !== index);
                                            const res = await updateProjects(newProjects);
                                            if (res.success) {
                                                setData({ ...data, projects: newProjects });
                                            } else {
                                                alert("Error: " + res.error);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 line-clamp-2">{project.description}</p>
                        </div>
                    ))}
                    <button
                        onClick={() => setEditingProject({ title: "", description: "", link: "", index: -1 })}
                        className="flex items-center justify-center gap-2 py-10 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-white hover:border-white/20 transition-all font-medium"
                    >
                        <Plus size={20} /> Add Project
                    </button>
                </div>
            </section>

            {/* Education CRUD */}

            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 mb-8">
                    <GraduationCap size={20} />
                    <h2 className="text-xl font-semibold uppercase tracking-widest text-sm">Education Management</h2>
                </div>

                <div className="grid gap-4">
                    {data.education.map((edu: any, index: number) => (
                        <div key={index} className="glass-card p-6 flex justify-between items-center rounded-2xl">
                            <div className="flex-1 mr-4">
                                <input
                                    className="w-full bg-transparent border-none text-lg font-bold p-0 focus:ring-0"
                                    value={edu.institution}
                                    onChange={(e) => {
                                        const newEdu = [...data.education];
                                        newEdu[index].institution = e.target.value;
                                        setData({ ...data, education: newEdu });
                                    }}
                                />
                                <input
                                    className="w-full bg-transparent border-none text-slate-400 p-0 focus:ring-0 text-sm"
                                    value={edu.period}
                                    onChange={(e) => {
                                        const newEdu = [...data.education];
                                        newEdu[index].period = e.target.value;
                                        setData({ ...data, education: newEdu });
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        const res = await updateEducation(data.education);
                                        if (res.success) {
                                            alert("Saved education!");
                                        } else {
                                            alert("Error: " + res.error);
                                        }
                                    }}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    <Save size={18} />
                                </button>
                                <button
                                    onClick={async () => {
                                        const newEdu = data.education.filter((_: any, i: number) => i !== index);
                                        const res = await updateEducation(newEdu);
                                        if (res.success) {
                                            setData({ ...data, education: newEdu });
                                        } else {
                                            alert("Error: " + res.error);
                                        }
                                    }}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newEdu = [...data.education, { institution: "New Institution", period: "Period" }];
                            setData({ ...data, education: newEdu });
                        }}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 hover:text-white hover:border-white/20 transition-all font-medium"
                    >
                        + Add Education Entry
                    </button>
                </div>
            </section>

            {/* Skills Management */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 mb-8">
                    <Code2 size={20} />
                    <h2 className="text-xl font-semibold uppercase tracking-widest text-sm">Skills Management</h2>
                </div>

                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <div className="flex flex-wrap gap-3">
                        {data.skills.map((skill: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group">
                                <span>{skill}</span>
                                <button
                                    onClick={async () => {
                                        const newSkills = data.skills.filter((_: any, i: number) => i !== index);
                                        const res = await updateSkills(newSkills);
                                        if (res.success) {
                                            setData({ ...data, skills: newSkills });
                                        } else {
                                            alert("Error: " + res.error);
                                        }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-400"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <input
                            id="new-skill"
                            placeholder="Add a skill..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    const val = (e.currentTarget as HTMLInputElement).value;
                                    if (val) {
                                        const newSkills = [...data.skills, val];
                                        const res = await updateSkills(newSkills);
                                        if (res.success) {
                                            setData({ ...data, skills: newSkills });
                                            (e.currentTarget as HTMLInputElement).value = '';
                                        } else {
                                            alert("Error: " + res.error);
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </section>


            {/* Footer / Logout */}
            <div className="text-center pt-20 border-t border-white/5">
                <a href="/" className="text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                    <Globe size={18} /> View Public Website
                </a>
            </div>

            {/* Edit Modal / Slide-over */}
            {editingExp && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
                    <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl space-y-8 scrollbar-hide">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{editingExp.id ? 'Edit Experience' : 'New Experience'}</h2>
                            <button onClick={() => setEditingExp(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveExp} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Company Name</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                        value={editingExp.company}
                                        onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Role Title</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                        value={editingExp.role}
                                        onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Location</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                        value={editingExp.location}
                                        onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Period (e.g. Feb 2024 - Apr 2025)</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                        value={editingExp.period}
                                        onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm text-slate-400">URL Slug</label>
                                    <button
                                        type="button"
                                        onClick={() => handleAutoSlug(editingExp.role, editingExp.company)}
                                        className="text-xs text-slate-300 hover:text-white underline"
                                    >
                                        Auto-generate
                                    </button>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">/experience/</span>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-28 pr-4 py-3 focus:border-white/30 outline-none font-mono text-sm"
                                        value={editingExp.slug}
                                        onChange={(e) => setEditingExp({ ...editingExp, slug: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Description (Rich Text/Long Content)</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none min-h-[150px]"
                                    value={editingExp.description}
                                    onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm text-slate-400">Key Tasks / Responsibilities</label>
                                <div className="space-y-3">
                                    {editingExp.tasks?.map((task: string, idx: number) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                                                value={task}
                                                onChange={(e) => {
                                                    const newTasks = [...editingExp.tasks];
                                                    newTasks[idx] = e.target.value;
                                                    setEditingExp({ ...editingExp, tasks: newTasks });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newTasks = editingExp.tasks.filter((_: any, i: number) => i !== idx);
                                                    setEditingExp({ ...editingExp, tasks: newTasks });
                                                }}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setEditingExp({ ...editingExp, tasks: [...(editingExp.tasks || []), ""] })}
                                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                                    >
                                        <Plus size={14} /> Add Task
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Project Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
                    <div className="glass-card w-full max-w-xl p-8 rounded-3xl space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{editingProject.index === -1 ? 'Add Project' : 'Edit Project'}</h2>
                            <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                        </div>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                let newProjects = [...data.projects];
                                if (editingProject.index === -1) {
                                    const { index, ...rest } = editingProject;
                                    newProjects.push(rest);
                                } else {
                                    const { index, ...rest } = editingProject;
                                    newProjects[index] = rest;
                                }
                                const res = await updateProjects(newProjects);
                                if (res.success) {
                                    setData({ ...data, projects: newProjects });
                                    setEditingProject(null);
                                }
                            }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Project Title</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                    value={editingProject.title}
                                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Destination Link</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none"
                                    value={editingProject.link}
                                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-white/30 outline-none min-h-[100px]"
                                    value={editingProject.description}
                                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> {editingProject.index === -1 ? 'Add Project' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
