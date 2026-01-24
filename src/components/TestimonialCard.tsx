import React from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { GlassCard } from './GlassCard';
import { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <GlassCard className="h-full flex flex-col p-6">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={`${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <p className="text-gray-700 mb-6 flex-grow italic">"{testimonial.content}"</p>
            <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-medical-green-100 flex items-center justify-center text-medical-green-700 font-bold text-lg shrink-0 border-2 border-medical-green-200">
                    {testimonial.image ? (
                        <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        testimonial.name[0]
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-medical-green-600 font-medium">{testimonial.role}</p>
                </div>
            </div>
        </GlassCard>
    );
}
