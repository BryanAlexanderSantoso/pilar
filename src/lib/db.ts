import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
export const sql = postgres(connectionString, { ssl: 'require' });

export async function initDb() {
  // Create tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS experiences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      period TEXT,
      location TEXT,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      tasks JSONB DEFAULT '[]',
      logo TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      link TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS education (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      institution TEXT NOT NULL,
      period TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Seed initial data if empty
  const expCount = await sql`SELECT count(*) FROM experiences`;
  if (parseInt(Object.values(expCount[0])[0] as string) === 0) {
    await sql`
      INSERT INTO experiences (company, role, period, location, slug, description, tasks, logo)
      VALUES (
        'PT. Icommits Karya Solusi', 
        'Frontend Developer - Internship', 
        'February 2024 - April 2025', 
        'Kopo, Bandung', 
        'frontend-developer-icommits', 
        'Website maintenance, building mid-to-high level business websites, and assisting client marketing.',
        ${['Website maintenance', 'Building mid-to-high level business websites', 'Assisting client marketing']},
        'https://via.placeholder.com/100'
      )
    `;
  }

  const projCount = await sql`SELECT count(*) FROM projects`;
  if (parseInt(Object.values(projCount[0])[0] as string) === 0) {
    const defaultProjs = [
      { title: 'EcomGuard', desc: '🛡️ EcomGuard - Ecosystem Anti-Fraud untuk UMKM Indonesia', link: 'https://github.com/BryanAlexanderSantoso/EcomGuard' },
      { title: 'MyDuitGua', desc: 'Aplikasi manajemen keuangan pribadi Liquid Glass UI', link: 'https://github.com/bryanalexandersantoso/MyDuitGua' },
      { title: 'Work365', desc: 'Aplikasi navigasi transformasi fisik komprehensif', link: 'https://github.com/bryanalexandersantoso/Work365' }
    ];
    for (const p of defaultProjs) {
      await sql`INSERT INTO projects (title, description, link) VALUES (${p.title}, ${p.desc}, ${p.link})`;
    }
  }

  const eduCount = await sql`SELECT count(*) FROM education`;
  if (parseInt(Object.values(eduCount[0])[0] as string) === 0) {
    const defaultEdu = [
      { inst: "SDIT Mathla'ul Anwar", period: "N/A" },
      { inst: "MTs Darul Ma'arif", period: "N/A" },
      { inst: "SMK Assalaam", period: "N/A" },
      { inst: "UTB (Universitas Teknologi Bandung)", period: "N/A" }
    ];
    for (const e of defaultEdu) {
      await sql`INSERT INTO education (institution, period) VALUES (${e.inst}, ${e.period})`;
    }
  }

  const skillCount = await sql`SELECT count(*) FROM skills`;
  if (parseInt(Object.values(skillCount[0])[0] as string) === 0) {
    const defaultSkills = ['React.js', 'Laravel', 'Node.js', 'Web App Dev', 'CRM building', 'Public Speaking', 'English'];
    for (const s of defaultSkills) {
      await sql`INSERT INTO skills (name) VALUES (${s})`;
    }
  }
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  slug: string;
  description: string;
  tasks: string[];
  logo: string;
  created_at: Date;
}

export async function getFullDb() {
  await initDb();
  const experiences = await sql`SELECT * FROM experiences ORDER BY created_at DESC`;
  const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
  const education = await sql`SELECT * FROM education ORDER BY created_at DESC`;
  const skills = await sql`SELECT * FROM skills ORDER BY created_at DESC`;

  return {
    experiences: (experiences as any[]).map(exp => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      period: exp.period,
      location: exp.location,
      slug: exp.slug,
      description: exp.description,
      logo: exp.logo,
      created_at: exp.created_at,
      tasks: typeof exp.tasks === 'string' ? JSON.parse(exp.tasks) : (exp.tasks || [])
    })) as Experience[],
    projects,
    education,
    skills: skills.map(s => s.name)
  };
}
