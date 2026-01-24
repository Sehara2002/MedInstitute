import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TestimonialCard } from '@/components/TestimonialCard';
import { testimonials } from '@/data/testimonials';

export default function TestimonialsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-fixed bg-cover bg-center">
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm -z-10" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Success <span className="text-medical-green-600">Stories</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from doctors who have successfully advanced their careers with our guidance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
