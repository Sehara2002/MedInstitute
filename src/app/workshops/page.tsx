import React from "react";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { WorkshopCard } from "@/components/WorkshopCard";
import type { Workshop } from "@/lib/workshops";
import { getWorkshops } from "@/lib/workshops.server";
import { Ticket, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  let workshops: Workshop[] = [];
  let loadFailed = false;
  try {
    workshops = await getWorkshops();
  } catch (err) {
    console.error("[workshops] Could not load workshops from the LMS:", err);
    loadFailed = true;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHeader
          eyebrow="Workshops"
          title="Learn with our live workshops"
          description="Join our focused workshop sessions, online or in person, and build the skills you need with guidance from our faculty."
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-medical-green-100 ring-1 ring-white/15">
            <Ticket className="h-4 w-4 shrink-0 text-medical-green-300" aria-hidden="true" />
            <span>Seats are limited. Book and pay online to receive your seat number by email.</span>
          </div>
        </PageHeader>
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.length > 0 ? (
              workshops.map((workshop) => <WorkshopCard key={workshop.workshopId} workshop={workshop} />)
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-ink-100 shadow-soft p-8 max-w-xl mx-auto">
                <ShieldAlert className="h-12 w-12 text-ink-300 mx-auto mb-4" />
                <h3 className="font-display text-lg font-extrabold text-ink-900 mb-2">
                  {loadFailed ? "Workshops could not be loaded right now" : "No upcoming workshops available at the moment"}
                </h3>
                <p className="text-sm text-ink-500">
                  {loadFailed
                    ? "Please refresh the page in a moment or contact us for upcoming workshop sessions."
                    : "Please check back soon or contact support for scheduled upcoming workshop sessions."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
