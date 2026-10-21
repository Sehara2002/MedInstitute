import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { WorkshopApiError, type Workshop } from "@/lib/workshops";
import { getWorkshop } from "@/lib/workshops.server";
import { WorkshopRegisterForm } from "./WorkshopRegisterForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkshopRegisterPage({ params }: PageProps) {
  const { id } = await params;

  let workshop: Workshop | null = null;
  let problem: string | null = null;
  try {
    workshop = await getWorkshop(id);
    if (!workshop.isBookable) {
      problem = workshop.availableSlots === 0 ? "Sorry, this workshop is fully booked." : "Bookings for this workshop are closed.";
    }
  } catch (err) {
    problem =
      err instanceof WorkshopApiError && err.status === 404
        ? "This workshop could not be found."
        : "We could not load this workshop. Please try again shortly.";
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        {workshop && !problem ? (
          <WorkshopRegisterForm workshop={workshop} />
        ) : (
          <GlassCard className="p-8 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration unavailable</h1>
            <p className="text-gray-600 mb-6">{problem}</p>
            <Link href="/workshops" className="glass-btn inline-block px-4 py-2 rounded-md">
              View workshops
            </Link>
          </GlassCard>
        )}
      </main>
      <Footer />
    </>
  );
}
