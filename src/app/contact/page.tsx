import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const details = [
    {
        icon: MapPin,
        title: "Address",
        body: (
            <>
                29 C, Perera Avenue,
                <br />
                Kohuwala, Nugegoda,
                <br />
                Sri Lanka
            </>
        ),
    },
    {
        icon: Phone,
        title: "Make an inquiry",
        body: (
            <a href="tel:+94718739060" className="hover:text-medical-green-700 transition-colors">
                +94 71 873 9060
            </a>
        ),
    },
    {
        icon: Mail,
        title: "Email",
        body: (
            <a href="mailto:mrcgpinternationalosce@gmail.com" className="break-all hover:text-medical-green-700 transition-colors">
                mrcgpinternationalosce@gmail.com
            </a>
        ),
    },
];

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <PageHeader
                    eyebrow="Contact"
                    title="Get in touch"
                    description="Reach our admissions office with any question about courses, mock exams or registration."
                />
                <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Contact info */}
                        <section id="contact-details" className="rounded-2xl border border-ink-100 bg-white p-7 shadow-soft sm:p-8">
                            <h2 className="mb-6 font-display text-2xl font-extrabold text-ink-900">Contact information</h2>
                            <ul className="space-y-6">
                                {details.map((d) => (
                                    <li key={d.title} className="flex items-start gap-4">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-medical-green-50 text-medical-green-700 ring-1 ring-medical-green-100">
                                            <d.icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <h3 className="font-display font-bold text-ink-900">{d.title}</h3>
                                            <p className="mt-0.5 text-ink-600">{d.body}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Office hours and map */}
                        <section className="flex h-full flex-col justify-between rounded-2xl border border-ink-100 bg-white p-7 shadow-soft sm:p-8">
                            <div>
                                <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-extrabold text-ink-900">
                                    <Clock className="h-6 w-6 text-medical-green-600" aria-hidden="true" />
                                    Office hours
                                </h2>
                                <ul className="space-y-1 text-ink-600">
                                    <li className="flex items-center justify-between gap-4 border-b border-ink-100 py-3">
                                        <span>Monday – Friday</span>
                                        <span className="font-semibold text-ink-900">8:00 AM – 6:00 PM IST</span>
                                    </li>
                                    <li className="flex items-center justify-between gap-4 border-b border-ink-100 py-3">
                                        <span>Saturday &amp; Sunday</span>
                                        <span className="font-semibold text-ink-900">9:00 AM – 1:00 PM IST</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8 h-64 overflow-hidden rounded-xl bg-ink-100 ring-1 ring-ink-100">
                                <iframe
                                    src="https://www.google.com/maps?q=29+C,+Perera+Avenue,+Kohuwala,+Nugegoda,+Sri+Lanka&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Family Medicine Forum Location"
                                ></iframe>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
