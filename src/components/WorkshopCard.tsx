import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, Clock, ArrowRight, MapPin, Users, Star } from "lucide-react";
import { Workshop, formatWorkshopDate, formatWorkshopTime, formatFee } from "@/lib/workshops";
import { posterSrc } from "@/lib/workshops.server";

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const poster = posterSrc(workshop);
  const full = workshop.availableSlots === 0;
  const fewLeft = !full && workshop.availableSlots <= Math.max(3, Math.ceil(workshop.totalSlots * 0.2));
  const filledPct = workshop.totalSlots > 0 ? Math.min((workshop.bookedSlots / workshop.totalSlots) * 100, 100) : 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        workshop.isFeatured ? "border-amber-300 ring-2 ring-amber-200/70" : "border-ink-100"
      )}
    >
      {workshop.isFeatured && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 shadow-md">
          <Star className="h-3 w-3 fill-amber-900/80" aria-hidden="true" />
          Featured
        </span>
      )}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-medical-blue-50 text-medical-blue-700">
          Workshop
        </span>
        {full ? (
          <span className="text-xs font-bold text-ink-600 bg-ink-50 px-2.5 py-1 rounded-md border border-ink-200">
            FULLY BOOKED
          </span>
        ) : fewLeft ? (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            ONLY {workshop.availableSlots} {workshop.availableSlots === 1 ? "SEAT" : "SEATS"} LEFT!
          </span>
        ) : (
          <span className="text-xs font-bold text-medical-green-800 bg-medical-green-50 px-2.5 py-1 rounded-md border border-medical-green-200">
            SEATS OPEN
          </span>
        )}
      </div>

      {poster && (
        <div className="relative w-full h-48 md:h-52 overflow-hidden rounded-xl mb-4 ring-1 ring-ink-100">
          {/* The poster is served by the LMS backend through a signed redirect */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt={workshop.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <h3 className="font-display text-xl font-extrabold text-ink-900 mb-2 leading-snug">{workshop.title}</h3>
      {workshop.description && <p className="text-ink-600 text-sm mb-5 flex-grow line-clamp-3">{workshop.description}</p>}

      <div className="space-y-2.5 mb-6 text-sm text-ink-600 border-t border-ink-100 pt-4 mt-auto">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{formatWorkshopDate(workshop.startsAt)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{formatWorkshopTime(workshop.startsAt)} onwards</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2.5 text-medical-green-600 shrink-0" />
          <span>{workshop.venue}</span>
        </div>

        <div className="pt-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium text-ink-700">
              <Users className="h-3.5 w-3.5 text-medical-green-600" />
              {workshop.availableSlots} of {workshop.totalSlots} seats available
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${full ? "bg-ink-300" : fewLeft ? "bg-rose-500" : "bg-medical-green-600"}`}
              style={{ width: `${filledPct}%` }}
            />
          </div>
        </div>

        <div className="pt-2">
          <span className="text-xs text-ink-500 uppercase font-semibold tracking-wider block">Workshop Fee</span>
          <span className="font-display text-2xl font-extrabold text-medical-green-700">{formatFee(workshop.price, workshop.currencyCode)}</span>
          {workshop.price > 0 && <span className="text-xs text-ink-500"> per seat</span>}
        </div>
      </div>

      {workshop.isBookable ? (
        <Link
          href={`/workshops/${workshop.workshopId}/register`}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-medical-green-600 text-white font-semibold hover:bg-medical-green-700 transition-all shadow-sm hover:shadow gap-2 group/btn"
        >
          <span>Book Your Seat</span>
          <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-ink-100 text-ink-500 font-semibold cursor-not-allowed"
        >
          {full ? "Fully Booked" : "Bookings Closed"}
        </button>
      )}
    </article>
  );
}
