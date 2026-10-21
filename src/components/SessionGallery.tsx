"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const sessionImages = [
    '/images/image1.png',
    '/images/image2.png',
    '/images/image3.png',
    '/images/image4.png',
    '/images/image5.png',
];

export function SessionGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sessionImages.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sessionImages.length - 1 : prevIndex - 1
        );
    }, []);

    // Auto-play functionality
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoPlaying) {
            interval = setInterval(nextSlide, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    // Calculate visible slides (showing 3 at a time)
    const getVisibleSlides = () => {
        const slides = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % sessionImages.length;
            slides.push({
                image: sessionImages[index],
                index: index
            });
        }
        return slides;
    };

    return (
        <section className="py-16 sm:py-24 bg-ink-50/60 border-y border-ink-100 overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <span className="eyebrow mb-3">Inside our classes</span>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink-900 mb-3">
                    Our Training <span className="text-medical-green-600">Sessions</span>
                </h2>
                <p className="text-base sm:text-lg text-ink-600 max-w-2xl mx-auto mb-12">
                    Glimpses from our interactive workshops and hands-on training sessions.
                </p>

                <div
                    className="relative max-w-6xl mx-auto"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white hover:bg-medical-green-50 text-ink-800 p-3 rounded-full shadow-lift ring-1 ring-ink-100 transition-all focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white hover:bg-medical-green-50 text-ink-800 p-3 rounded-full shadow-lift ring-1 ring-ink-100 transition-all focus:outline-none focus:ring-2 focus:ring-medical-green-500"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Carousel Container */}
                    <div className="flex gap-6 justify-center">
                        {getVisibleSlides().map((slide, i) => (
                            <div
                                key={`${slide.index}-${i}`}
                                className={`relative w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-lift ring-1 ring-ink-100 transform transition-all duration-500 hover:scale-105 group ${i > 0 ? 'hidden md:block' : ''
                                    }`}
                            >
                                <Image
                                    src={slide.image}
                                    alt={`Training Session ${slide.index + 1}`}
                                    fill
                                    priority={i === 0} // Prioritize only the first visible image
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 gap-2">
                        {sessionImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-medical-green-600 w-8'
                                    : 'bg-ink-200 hover:bg-medical-green-400'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
