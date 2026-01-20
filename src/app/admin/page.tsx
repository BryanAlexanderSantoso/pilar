"use client";

import { useState } from "react";
import AdminAuth from "@/components/admin/AdminAuth";
import Dashboard from "./Dashboard";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <Dashboard />
        </main>
    );
}
