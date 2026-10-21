"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { AuthShell } from "@/components/AuthShell";
import { Footer } from "@/components/Footer";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get("callbackUrl") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid email or password");
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    }

    return (
        <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-extrabold text-ink-900">Welcome back</h1>
            <p className="mt-2 mb-6 text-ink-600">Sign in to your student account.</p>

            <GlassCard className="p-8">
                <button
                    onClick={() => signIn("google", { callbackUrl })}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-ink-200 bg-white font-semibold text-ink-700 hover:bg-ink-50 transition-colors mb-6"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-gray-200 flex-1" />
                    <span className="text-sm text-gray-500">or</span>
                    <div className="h-px bg-gray-200 flex-1" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-ink-700">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-ink-200 px-4 py-3 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-ink-700">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-xl border border-ink-200 px-4 py-3 bg-white text-ink-900 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-medical-green-600 text-white font-semibold shadow-sm hover:bg-medical-green-700 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-medical-green-700 font-semibold hover:underline">
                        Sign up
                    </Link>
                </p>
            </GlassCard>
        </div>
    );
}

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <main>
                <AuthShell>
                    <Suspense fallback={<p>Loading...</p>}>
                        <LoginForm />
                    </Suspense>
                </AuthShell>
            </main>
            <Footer />
        </>
    );
}