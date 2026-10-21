"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { createBooking, formatWorkshopDate, formatWorkshopTime, formatFee, Workshop } from "@/lib/workshops";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-medical-green-200 focus:border-medical-green-500 transition";

export function WorkshopRegisterForm({ workshop }: { workshop: Workshop }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  function validate() {
    const e: { [k: string]: string } = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^[+\d][\d\s()-]{5,}$/.test(phone.trim())) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const booking = await createBooking(workshop.workshopId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      // A free workshop is confirmed straight away; otherwise review and pay
      const next = booking.status === "PAID" ? "/workshops/booking/result" : "/workshops/booking";
      router.push(`${next}?ref=${booking.reference}`);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Failed to create registration" });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900">Workshop Registration</h1>
      <p className="text-gray-600 mb-6">
        Complete the form below to book your seat. Once your payment is confirmed, your seat number, date and venue will
        be emailed to you.
      </p>

      <GlassCard className="p-8 max-w-xl w-full mx-auto">
        <div className="mb-6 rounded-xl bg-gray-50/80 border border-gray-100 p-4 text-sm space-y-2">
          <p className="font-bold text-gray-900 text-base">{workshop.title}</p>
          <div className="flex justify-between gap-4 text-gray-600">
            <span>Date</span>
            <span className="font-medium text-gray-900 text-right">
              {formatWorkshopDate(workshop.startsAt)}, {formatWorkshopTime(workshop.startsAt)}
            </span>
          </div>
          <div className="flex justify-between gap-4 text-gray-600">
            <span>Venue</span>
            <span className="font-medium text-gray-900 text-right">{workshop.venue}</span>
          </div>
          <div className="flex justify-between gap-4 text-gray-600">
            <span>Seats available</span>
            <span className="font-medium text-gray-900">
              {workshop.availableSlots} of {workshop.totalSlots}
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-800">Fee</span>
            <span className="font-extrabold text-medical-green-700">{formatFee(workshop.price, workshop.currencyCode)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">First name</label>
            <input required placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last name</label>
            <input placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input required placeholder="(+94) 71 123 4567" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full glass-btn px-4 py-3 rounded-md disabled:opacity-60 font-semibold text-lg">
              {loading ? "Submitting..." : "Register"}
            </button>
            {errors.form && <p className="text-sm text-red-600 mt-2">{errors.form}</p>}
          </div>

          <div className="flex items-center justify-center gap-4 pt-6 mt-6 border-t border-gray-200">
            <span className="text-xs text-gray-500 font-medium">We&apos;re powered with</span>
            <Image src="/images/combanklogo2.png" alt="Commercial Bank" width={150} height={24} className="object-contain" />
            <Image src="/images/visalogo.png" alt="Visa" width={80} height={24} className="object-contain" />
            <Image src="/images/mastercardlogo.png" alt="Mastercard" width={80} height={24} className="object-contain" />
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
