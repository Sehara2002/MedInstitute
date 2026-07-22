"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { X, CreditCard, PlayCircle, Sparkles } from "lucide-react";

export function PromoModal() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (pathname === "/") {
            const timer = setTimeout(() => setIsOpen(true), 600);
            return () => clearTimeout(timer);
        } else {
            setIsOpen(false);
        }
    }, [pathname]);

    function handleClose() {
        setIsOpen(false);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm sm:max-w-3xl max-h-[85vh] sm:max-h-none overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
                    aria-label="Close"
                >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left panel — card payments announcement */}
                    <div className="bg-gradient-to-br from-medical-blue-600 to-medical-blue-800 p-5 sm:p-8 md:p-10 text-white flex flex-col justify-center">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-3 sm:mb-5 w-fit">
                            <CreditCard className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Now Live
                        </div>
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight mb-2 sm:mb-3">
                            We Now Accept Card Payments
                        </h2>
                        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                            Register and pay securely online with your Visa or Mastercard, powered by
                            Commercial Bank — no more waiting, enroll instantly.
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="bg-white rounded-xl flex items-center gap-4 mt-10">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2">
                                    <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={100} height={36} className="object-contain" />
                                    <div className="h-5 w-px bg-white/30" />
                                    <Image src="/images/visalogo.png" alt="Visa" width={70} height={18} className="object-contain" />
                                    <div className="h-5 w-px bg-white/30" />
                                    <Image src="/images/mastercardlogo.png" alt="Mastercard" width={70} height={18} className="object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right panel — free videos offer */}
                    <div className="p-5 sm:p-8 md:p-10 flex flex-col justify-center bg-medical-green-50">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-medical-green-100 text-medical-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-3 sm:mb-5 w-fit">
                            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Limited Offer
                        </div>
                        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3">
                            2 Free Preview Videos <span className="text-medical-green-600">— Every Course</span>
                        </h2>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-6">
                            Create a free student account and watch 2 preview videos from any course before you
                            commit — see our teaching style firsthand, no payment required.
                        </p>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 mb-6">
                            <PlayCircle className="h-5 w-5 text-medical-green-600 flex-shrink-0" />
                            <span>Instant access after signup</span>
                        </div>
                        <Link
                            href="/signup"
                            onClick={handleClose}
                            className="w-full text-center py-2.5 sm:py-3.5 rounded-xl bg-medical-green-600 text-white font-bold text-sm sm:text-base shadow-lg hover:bg-medical-green-500 hover:shadow-xl transition-all"
                        >
                            Sign Up Free
                        </Link>
                        <button
                            onClick={handleClose}
                            className="w-full text-center py-1.5 sm:py-2 mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}