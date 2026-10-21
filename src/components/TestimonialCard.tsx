import React from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <figure className="relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-soft transition-shadow hover:shadow-lift">
            <Quote className="absolute right-6 top-6 h-8 w-8 text-medical-green-100" aria-hidden="true" />
            <div className="mb-4 flex gap-0.5" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-200'}
                    />
                ))}
            </div>
            <blockquote className="mb-6 flex-grow leading-relaxed text-ink-700">&ldquo;{testimonial.content}&rdquo;</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 border-t border-ink-100 pt-5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-medical-green-100 text-lg font-bold text-medical-green-700 ring-2 ring-medical-green-100">
                    {testimonial.image ? (
                        <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                    ) : (
                        testimonial.name[0]
                    )}
                </div>
                <div>
                    <p className="font-semibold text-ink-900">{testimonial.name}</p>
                    <p className="text-sm font-medium text-medical-green-700">{testimonial.role}</p>
                </div>
            </figcaption>
        </figure>
    );
}
