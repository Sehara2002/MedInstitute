import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/PageHeader';
import { TestimonialCard } from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';

export default function TestimonialsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                <PageHeader
                    eyebrow="Success stories"
                    title="Doctors who made it"
                    description="Hear from doctors who have successfully advanced their careers with our guidance."
                />
                <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
