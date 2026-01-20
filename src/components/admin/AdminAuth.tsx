"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "159159") {
            onAuthenticated();
        } else {
            setError(true);
            setPin("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
            <div className="glass-card p-8 rounded-3xl w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
                        <Lock className="text-slate-400" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Admin Portal</h1>
                    <p className="text-slate-400">Enter your 6-digit access PIN</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => {
                                setError(false);
                                setPin(e.target.value);
                            }}
                            maxLength={6}
                            placeholder="••••••"
                            className={`w-full text-center text-4xl tracking-[1em] py-4 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:border-white/30 font-mono transition-all`}
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center font-medium">Incorrect PIN. Please try again.</p>}

                    <button
                        type="submit"
                        className="w-full py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
