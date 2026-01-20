import { getFullDb, initDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Initialize DB on first access if needed
        await initDb();
        const db = await getFullDb();
        return NextResponse.json(db);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
