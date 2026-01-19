export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    imageUrl: string; // We'll use placeholders or gradients
}

export const courses: Course[] = [
    {
        id: "family-medicine-pg",
        title: "PG Training in Family Medicine",
        description: "Hands-on experience training specifically for PG Doctors in Family Medicine (General Practice).",
        duration: "1 Year",
        level: "Postgraduate",
        imageUrl: "bg-gradient-to-br from-green-200 to-blue-200",
    },
    {
        id: "clinical-confidence",
        title: "Clinical Confidence Building",
        description: "Specialized training for PG Doctors to build up their clinical confidency during day-to-day activities.",
        duration: "6 Months",
        level: "Professional Dev",
        imageUrl: "bg-gradient-to-br from-blue-200 to-indigo-200",
    },
    {
        id: "evidence-based-care",
        title: "Evidence-Based Patient Care",
        description: "Master the application of updated medical evidence to facilitate patient centered first contact care.",
        duration: "3 Months",
        level: "Certificate",
        imageUrl: "bg-gradient-to-br from-teal-200 to-emerald-200",
    },
];
