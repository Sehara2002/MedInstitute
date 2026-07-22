import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}