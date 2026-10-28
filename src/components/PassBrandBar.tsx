import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Logo from "@/app/logo.png";

/** The slim top bar of a guest's session pages: the brand, and nothing to navigate away with */
export function PassBrandBar({ label = "Your personal session link" }: { label?: string }) {
    return (
        <div className="border-b border-ink-100 bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3" aria-label="MRCGP Fast Track home">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-medical-green-50 ring-1 ring-medical-green-100">
                        <Image src={Logo} alt="" className="h-7 w-7 object-contain" />
                    </span>
                    <span className="font-display text-lg font-extrabold text-ink-900">
                        MRCGP <span className="text-medical-green-600">Fast Track</span>
                    </span>
                </Link>
                <span className="hidden items-center gap-1.5 text-xs font-semibold text-ink-500 sm:flex">
                    <ShieldCheck className="h-4 w-4 text-medical-green-600" aria-hidden="true" />
                    {label}
                </span>
            </div>
        </div>
    );
}
