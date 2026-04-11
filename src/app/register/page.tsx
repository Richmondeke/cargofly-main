"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    Building2,
    ArrowRight,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import SuccessModal from "@/components/auth/SuccessModal";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const { signUp } = useAuth();
    const [accountType, setAccountType] = useState<"personal" | "business">("personal");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (accountType === "business") {
            const personalProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'zoho.com', 'protonmail.com'];
            const domain = email.split('@')[1]?.toLowerCase();
            if (personalProviders.includes(domain)) {
                setError("Please use a business email address for business registration.");
                setIsLoading(false);
                return;
            }
        }

        try {
            await signUp(email, password, name);
            setShowSuccess(true);
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Start shipping with Cargofly"
            subtitle="Join thousands of businesses managing their logistics efficiently."
            imageSrc="/images/illustrations/courier_plane.jpg"
        >
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-3 mb-6">
                    <Image
                        src="/logo-dark.png"
                        alt="Cargofly"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Create an account
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Enter your details to get started
                </p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm"
                    role="alert"
                >
                    {error}
                </motion.div>
            )}

            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl mb-6">
                <button
                    onClick={() => setAccountType("personal")}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                        accountType === "personal"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                >
                    <User className="w-4 h-4" />
                    Personal
                </button>
                <button
                    onClick={() => setAccountType("business")}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                        accountType === "business"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    )}
                >
                    <Building2 className="w-4 h-4" />
                    Business
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        autoComplete="email"
                        className="h-11"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            className="h-11 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                            <div className="w-5 h-5 rounded border border-slate-300 bg-white flex items-center justify-center text-blue-600">
                                <Check className="w-3 h-3" />
                            </div>
                        </div>
                        <div className="text-sm text-slate-500">
                            I agree to the{" "}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        "w-full h-12 mt-2 rounded-xl bg-blue-600 text-white font-bold transition-all hover:bg-blue-700 active:scale-[0.98]",
                        isLoading ? "opacity-70 cursor-not-allowed" : "shadow-lg shadow-blue-600/20"
                    )}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500 tracking-wider">
                        Or continue with
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={async () => {
                    const { signInWithGoogle } = (await import("@/contexts/AuthContext")).useAuth();
                    try {
                        setIsLoading(true);
                        await signInWithGoogle();
                    } catch (error) {
                        console.error("Google Auth Error:", error);
                        setError("Failed to sign in with Google.");
                        setIsLoading(false);
                    }
                }}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Google
            </button>

            <p className="text-center mt-8 text-slate-500 text-sm">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                    Sign in
                </Link>
            </p>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => window.location.href = "/dashboard"}
                title="Account Created Successfully"
                message={accountType === 'business'
                    ? "Your business account has been created. Let's finish setting up your company profile."
                    : "Welcome to Cargofly! Your account is ready. You can now start booking shipments."
                }
            />
        </AuthLayout>
    );
}
