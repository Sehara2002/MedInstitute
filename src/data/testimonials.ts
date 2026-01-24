import { StaticImageData } from 'next/image';
import DrNilanthiImg from './images/DrNilanthi.png';
import DrPMVibashiniImg from './images/DrPMVibashini.jpeg';
import DrJanieImg from './images/DrJanie.jpeg';

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    image?: string | StaticImageData;
    rating: number;
}

export const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Dr. Nilanthi Renuka',
        role: 'MRCGP Examination 2014 Sri Lanka',
        content: 'Passed my MRCGP (INT) OSCE Exam on the first attempt!Huge thanks to DR.MALKANTHI GALHENA.Her 12 years of experience as an examiner provided the precise, marking- grid - based feedback I needed to master the exam structure and pass my exam on the first attempt.Highly recommend her feedback - based training to all candidates!',
        rating: 5,
        image: DrNilanthiImg
    },
    {
        id: '2',
        name: 'Dr. R. P. M. VIBHASHINIE',
        role: '2024 AKT exam MRCGP',
        content: 'Passing the MRCGP (INT) was a huge milestone in my career, and I couldn’t have done it without Dr. Malkanthi Galhena. Her hands-on training went beyond just exam preparation. It genuinely improved my consultation techniques and time management. I went into the exam feeling calm and prepared. Highly recommended!',
        rating: 5,
        image: DrPMVibashiniImg
    },
    {
        id: '3',
        name: 'Dr. Janie Ranasinghe',
        role: '2024 November MRCG (Intl) Exam Sri Lanka',
        content: 'Passing the MRCGP (INT) with a higher marking score was a dream come true. My heartfelt thanks to DR. MALKANTHI GALHENA for the hands-on training. The focus on advanced consultation techniques and time management was exactly what I needed to secure a top-tier score. Highly recommended for any serious candidate!',
        rating: 5,
        image: DrJanieImg
    }
];
