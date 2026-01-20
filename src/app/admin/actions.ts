"use server";

import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

function revalidateAll() {
    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/projects");
    revalidatePath("/about");
}

export async function updateExperience(exp: any) {
    try {
        if (exp.id && exp.id.length > 30) {
            await sql`
        UPDATE experiences 
        SET company = ${exp.company}, role = ${exp.role}, period = ${exp.period}, 
            location = ${exp.location}, slug = ${exp.slug}, description = ${exp.description}, 
            tasks = ${exp.tasks || []}, logo = ${exp.logo}
        WHERE id = ${exp.id}
      `;
        } else {
            await sql`
        INSERT INTO experiences (company, role, period, location, slug, description, tasks, logo)
        VALUES (${exp.company}, ${exp.role}, ${exp.period}, ${exp.location}, ${exp.slug}, ${exp.description}, ${exp.tasks || []}, ${exp.logo})
      `;
        }
        revalidateAll();
        revalidatePath(`/experience/${exp.slug}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating experience:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteExperience(id: string) {
    try {
        await sql`DELETE FROM experiences WHERE id = ${id}`;
        revalidateAll();
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateProjects(projects: any[]) {
    try {
        await sql`DELETE FROM projects`;
        for (const p of projects) {
            await sql`INSERT INTO projects (title, description, link) VALUES (${p.title}, ${p.description}, ${p.link})`;
        }
        revalidateAll();
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateEducation(education: any[]) {
    try {
        await sql`DELETE FROM education`;
        for (const e of education) {
            await sql`INSERT INTO education (institution, period) VALUES (${e.institution}, ${e.period})`;
        }
        revalidateAll();
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateSkills(skills: string[]) {
    try {
        await sql`DELETE FROM skills`;
        for (const s of skills) {
            await sql`INSERT INTO skills (name) VALUES (${s})`;
        }
        revalidateAll();
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}
