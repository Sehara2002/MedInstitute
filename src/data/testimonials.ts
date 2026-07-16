import { StaticImageData } from 'next/image';
import DrNilanthiImg from './images/DrNilanthi.png';
import DrPMVibashiniImg from './images/DrPMVibashini.jpeg';
import DrJanieImg from './images/DrJanie.jpeg';
import DrHabibImg from './images/DrHabibImg.jpeg';
import DrRoshiniImg from './images/DrRoshiniImg.png';
import DrSHettiarachchiImg from './images/DrSHettiarachchiImg.png';

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
        id: '5',
        name: 'Dr Habib Ullah Bhuyian from BANGLADESH',
        role: '2026 OSCE Exam MRCGP Intl.',
        content: `I passed the MRCGP OSCE on my first attempt thanks to Dr. Malkanthi Galhena's exceptional mentorship.
Her focused teaching, examiner-level insight, and structured marking-grid approach helped me understand exactly what examiners expect.
The dedicated mock exams, personalised feedback, and consultation practice gave me the confidence, clarity, and technique I needed to perform well on exam day.
The mock exam felt very close to the real OSCE and helped me identify my weak areas early. Her guidance truly made a difference.`,
        rating: 5,
        image: DrHabibImg
    },
    {
        id: '6',
        name: 'Dr Roshini from INDIA',
        role: '2026 OSCE Exam MRCGP Intl.',
        content: `I am truly grateful to Dr. Malkanthi and her team for their support and guidance during my OSCE preparation. Dr Malkanthi's 12 years of experience as an examiner and her structured teaching approach were key to my success. I highly recommend this OSCE preparation course to any friends and colleagues preparing for the exam`,
        rating: 5,
        image: DrRoshiniImg
    },
    {
        id: '7',
        name: 'Dr S Hettiarachchi',
        role: '2026 OSCE Exam MRCGP Intl.',
        content: `I highly recommend Dr. Malkanthi's course to anyone preparing for the MRCGP OSCE. Thanks to her incredible support, I passed my April 2026 exam. The program's weekly case discussions and concise NICE guideline reviews were invaluable, and the flexible lecture recordings fit perfectly into my busy routine.
Even as an experienced doctor seeing dozens of patients daily at Karapitiya Hospital, Dr. Malkanthi's mock exams and impressive physical examination methods completely transformed my approach. She teaches you how to effectively build rapport, communicate naturally, and successfully navigate the practical nuances of the exam. I am incredibly grateful to Dr. Malkanthi and confidently recommend her course and mock exams to all future OSCE candidates.`,
        rating: 5,
        image: DrSHettiarachchiImg
    },
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
    , {
        id: '4',
        name: 'Dr Manjula Giragama',
        role: '2026 OSCE Exam MRCGP Intl.',
        content: 'I passed the MRCGP OSCE on my first attempt thanks to Dr. Malkanthi Galhena’s exceptional individually focused mentorship. Her 12 years of examiner experience provided true insider insight. The dedicated One-to-One Training training and marking grid-driven consultation practice gave me the clarity, structure and confidence to score. She trains you to succeed with confidence.',
        rating: 5,
        image: ""
    },
    
];
