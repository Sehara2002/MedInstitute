export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string; // Used for "Mode" or duration text
    level: string; // Used for badges
    imageUrl: string;
    curriculum?: string[]; // Optional curriculum modules
    fee?: string;
    targetAudience?: string[];
    mode?: string[];
}

export const courses: Course[] = [
    {
        id: "mrcgp-akt",
        title: "MRCGP International AKT Course",
        description: "A comprehensive, exam-oriented program designed to help doctors master the breadth of knowledge required to pass the AKT with confidence. Focuses on high-yield topics and clinical guidelines.",
        duration: "Online Live",
        level: "Exam Prep",
        imageUrl: "bg-gradient-to-br from-blue-100 to-indigo-200",
        curriculum: [
            "Cardiovascular Medicine", "Respiratory Medicine", "Endocrinology & Metabolic Disorders",
            "Gastroenterology & Hepatology", "Neurology", "Musculoskeletal & Rheumatology",
            "Dermatology", "Women’s Health", "Mental Health", "Infectious Diseases",
            "Ethics, Professionalism & Patient Safety", "Preventive Care & Screening"
        ],
        fee: "LKR 35,000",
        targetAudience: ["Doctors preparing for MRCGP International AKT", "Doctors pursuing postgraduate qualifications in Primary Care"],
        mode: ["Online live interactive sessions", "Group-based learning", "Recordings provided"]
    },
    {
        id: "mrcgp-osce",
        title: "MRCGP International OSCE Course",
        description: "Designed to develop structured consultations, clinical reasoning, and communication skills aligned with examiner expectations. Includes real OSCE-style cases and focused feedback.",
        duration: "Physical/Group",
        level: "Clinical Skills",
        imageUrl: "bg-gradient-to-br from-green-100 to-teal-200",
        curriculum: [
            "Cardiovascular OSCE Cases", "Respiratory OSCE Cases", "Neurology (TIA, Stroke, etc.)",
            "Endocrinology (Diabetes & Complications)", "Gastrointestinal Disorders", "Musculoskeletal & Rheumatology",
            "Mental Health Consultations", "Women’s Health Scenarios", "Ethics, Consent & Breaking Bad News",
            "Data Interpretation & Risk Communication"
        ],
        fee: "LKR 35,000",
        mode: ["Physical OSCE sessions", "Small group training", "Examiner-oriented feedback"]
    },
    {
        id: "individual-osce",
        title: "Individual OSCE Training",
        description: "One-to-one training tailored for candidates requiring personalized guidance, correction of weak areas, and intensive examiner-style feedback.",
        duration: "Flexible",
        level: "Personalized",
        imageUrl: "bg-gradient-to-br from-purple-100 to-pink-200",
        targetAudience: ["Last-minute revision candidates", "Repeat candidates needing focused correction"],
        fee: "On Request",
        mode: ["Individual sessions", "Online or physical (by appointment)"]
    },
];
