import { StaticImageData } from 'next/image';
import DrMalkanthiImg from '@/app/staff/images/DrMalkanthi.jpeg';
import DrShaneImg from '@/app/staff/images/DrShane.jpeg';

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    working: string;
    qualification: string;
    bio: string;
    image?: string | StaticImageData;
    email?: string;
    linkedin?: string;
}

export const staff: StaffMember[] = [
    {
        id: "dr-malkanthi-galhena",
        name: "Dr. Malkanthi Galhena",
        role: "Examiner - MRCGP International OSCE Examination",
        working: "Consultant Family Physician - Base Hospital Panadura Sri Lanka",
        qualification: "MBBS, DFM, MD (Family Medicine), MRGCP[INT], MRCGP Examiner (2012-2024)",
        bio: "President, Sri Lanka College of specialist family physicians, Consultant Family Physician / Examiner MRCGP International, Post Graduate Trainer & Examiner (PGIM University of Colombo)",
        image: DrMalkanthiImg,
        email: "contact@familymedicineforum.com",
        linkedin: "https://www.linkedin.com/in/malkanthi-galhena-a7609568/",
    },
    {
        id: "dr-shane-halpe",
        name: "Dr. Shane Halpe",
        role: "Senior Registrar & Lecturer",
        working: "Senior Registrar - Base Hospital Dambadeniya Sri Lanka | Lecturer, Dept. of Public Health & Community medicine, Faculty of Medicine, UoM",
        qualification: "MBBS, MD (Family Medicine), MRGCP[INT],",
        bio: "Senior Registrar and Lecturer in Family Medicine with extensive experience in clinical practice, medical education, community health, and health systems development. He holds an MD in Family Medicine and the MRCGP (International) qualification, and is actively involved in postgraduate training and mentorship of doctors pursuing careers in primary care.With a strong commitment to strengthening primary healthcare in Sri Lanka, Dr.Halpe has led and contributed to multiple initiatives in rural health development, community- oriented primary care, medical education, and public health research.His academic interests include rural health systems, planetary health, health equity, and complex health system interventions.As a co - founder of the Family Medicine Forum, he is dedicated to supporting doctors in achieving excellence in examinations such as MRCGP (INT) and MD Family Medicine, while fostering a culture of lifelong learning, professional integrity, and compassionate patient - centered care.",
        image: DrShaneImg,
        email: "contact@familymedicineforum.com",
        linkedin: "https://www.linkedin.com/in/shane-halpe-76b702182/",
    }
];
