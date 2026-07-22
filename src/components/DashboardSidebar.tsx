"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, BookOpen, User, LogOut, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/app/logo.png";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <Link href="/" className="flex items-center gap-2 px-6 py-6 border-b border-gray-100">
        <div className="rounded-full bg-medical-green-500/20 p-2">
          <Image src={Logo} alt="Logo" className="h-6 w-6" />
        </div>
        <span className="text-lg font-bold text-gray-900">
          MRCGP <span className="text-medical-green-600">Fast Track</span>
        </span>
      </Link>

      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        {session?.user?.image ? (
          <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-medical-green-100 flex items-center justify-center">
            <User className="h-5 w-5 text-medical-green-700" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {session?.user?.name || "Student"}
          </p>
          <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-medical-green-100 text-medical-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}

        <div className="pt-3 mt-3 border-t border-gray-100">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Link>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-white border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" className="h-6 w-6" />
          <span className="font-bold text-gray-900">MRCGP <span className="text-medical-green-600">Fast Track</span></span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 h-screen sticky top-0 bg-white border-r border-gray-100 flex-shrink-0">
        {SidebarContent}
      </aside>
    </>
  );
}