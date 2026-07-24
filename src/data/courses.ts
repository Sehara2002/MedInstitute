export interface Brochure {
    label: string;
    url: string;
}

export interface FreeVideo {
    id: string;
    title: string;
    vimeoId: string;
}

export interface ModeOption {
    mode: string;
    fee: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    imageUrl: string;
    curriculum?: string[];
    modePricing?: ModeOption[];
    fee?: string;
    targetAudience?: string[];
    mode?: string[];
    brochures?: Brochure[];
    freeVideos?: FreeVideo[];
    featured?: boolean; // NEW — marks a course for special promotion (e.g. the flyer spot)
}

export const courses: Course[] = [
    {
        id: "mrcgp-mock-exam-consultation-videos",
        title: "MRCGP Int Model Mock Exam Consultation Videos",
        description: "Examiner-guided mock exam videos by Dr. Malkanthi Galhena — an ideal representation of the original MRCGP Int OSCE exam, designed to identify your gaps before the real thing.",
        duration: "Mock Exam",
        level: "Golden Opportunity",
        imageUrl: "bg-gradient-to-br from-amber-100 to-yellow-200",
        featured: true,
        curriculum: [
            "Realistic OSCE stations and scenarios",
            "Authentic exam setting",
            "Detailed feedback from an experienced examiner",
            "Identification of gaps in your consultations",
            "Tips and strategies to improve performance",
            "Build confidence and maximize your chances of success"
        ],
        fee: "LKR 10,000",
        targetAudience: [
            "Candidates preparing for the upcoming Chennai MRCGP Int OSCE exam",
            "Doctors who want an examiner-guided mock exam before their real attempt"
        ],
        mode: ["Examiner-guided mock exam", "Consultation videos", "Detailed gap-analysis feedback"],
    },
    {
        id: "pg-exams-learning-platform",
        title: "MD (SCREENING) & DFM Exam Preparation",
        description: "By Dr. Malkanthi Galhena",
        duration: "6 Months",
        level: "Exam Prep",
        imageUrl: "bg-gradient-to-br from-yellow-100 to-orange-200",
        curriculum: [
            "Applied basic and clinical sciences",
            "Common acute and chronic conditions in primary care",
            "Clinical reasoning and differential diagnosis",
            "Investigation selection and interpretation",
            "Evidence-based management and prescribing",
            "Preventive care and health promotion",
            "Women's health, child health and elderly care",
            "Mental health and psychosocial medicine",
            "Ethics, communication and professionalism",
            "MCQ, SBA, SEQ and practical examination techniques"
        ],
        fee: "LKR 35,000",
        targetAudience: ["Postgraduate medical students", "Doctors preparing for postgraduate exams"],
        mode: ["Online access", "Self-paced learning"],
        brochures: [
            { label: "Course Brochure", url: "/brochures/MD_Screening_DFM.pdf" }
        ],
        freeVideos: [
            { id: "md-dfm-preview-1", title: "RHEUMATOLOGY", vimeoId: "1202213305" },
            { id: "md-dfm-preview-2", title: "CARDIOLOGY", vimeoId: "1193091282" },
        ]
    },
    {
        id: "OCSE-AKT-Package",
        title: "MRCGP International OSCE + AKT Package",
        description: "Examiner Driven. Marking Grid Focused. Secret of Success",
        duration: "Access for 1 Year",
        level: "Clinical Skills",
        imageUrl: "bg-gradient-to-br from-red-100 to-orange-200",
        curriculum: [
            "OCSE SELF LEARNING",
            "AKT SELF LEARNING",
            "MOCK EXAMS",
            "EXAMINER MARKING GRID",
            "GUIDELINE SUMMARIES",
            "BLUE PRINT TOPIC FOCUS",
            "QUESTION BANK WITH 2500+ QUESTIONS"
        ],
        fee: "LKR 50,000",
        targetAudience: ["Doctors preparing for MRCGP International OSCE and AKT", "Doctors seeking comprehensive exam preparation"],
        mode: ["Online live interactive sessions", "Physical group training", "1 Year Access to materials"],
        freeVideos: [
            { id: "osce-akt-package-preview-2", title: "OSCE INTRODUCTION CLASS", vimeoId: "1203215477" },
            { id: "osce-akt-package-preview-1", title: "PREMATURE OVARIAN FAILURE", vimeoId: "1149767001" },
        ],
        brochures: [
            { label: "AKT Course Brochure", url: "/brochures/akt.pdf" },
            { label: "OSCE Course Brochure", url: "/brochures/osce.pdf" }
        ],
    },
    {
        id: "mrcgp-akt",
        title: "MRCGP International AKT Course",
        description: "A comprehensive, exam-oriented program designed to help doctors master the breadth of knowledge required to pass the AKT with confidence. Focuses on high-yield topics and clinical guidelines.",
        duration: "6 Months",
        level: "Exam Prep",
        imageUrl: "bg-gradient-to-br from-blue-100 to-indigo-200",
        curriculum: [
            "Cardiovascular Medicine", "Respiratory Medicine", "Endocrinology & Metabolic Disorders",
            "Gastroenterology & Hepatology", "Neurology", "Musculoskeletal & Rheumatology",
            "Dermatology", "Women's Health", "Mental Health", "Infectious Diseases",
            "Ethics, Professionalism & Patient Safety", "Preventive Care & Screening"
        ],
        fee: "LKR 35,000",
        targetAudience: ["Doctors preparing for MRCGP International AKT", "Doctors pursuing postgraduate qualifications in Primary Care"],
        mode: ["Online live interactive sessions", "Group-based learning", "Recordings provided"],
        brochures: [
            { label: "Course Brochure", url: "/brochures/akt.pdf" }
        ],
        freeVideos: [
            { id: "akt-preview-1", title: "ENT", vimeoId: "1208521093" },
            { id: "akt-preview-2", title: "RESPIRATORY MEDICINE", vimeoId: "1205173415" }
        ]
    },
    {
        id: "mrcgp-osce",
        title: "MRCGP International OSCE Course",
        description: `A focused and structured OSCE preparation programme designed to help candidates strengthen consultation
skills, clinical reasoning, examination technique, communication and safe patient management. The programme
combines examiner-led teaching, realistic practice stations and personalised feedback to support confident exam
performance.`,
        duration: "5 Months",
        level: "Clinical Skills",
        imageUrl: "bg-gradient-to-br from-green-100 to-teal-200",
        curriculum: [
            "Cardiovascular OSCE Cases", "Respiratory OSCE Cases", "Neurology (TIA, Stroke, etc.)",
            "Endocrinology (Diabetes & Complications)", "Gastrointestinal Disorders", "Musculoskeletal & Rheumatology",
            "Mental Health Consultations", "Women's Health Scenarios", "Ethics, Consent & Breaking Bad News",
            "Data Interpretation & Risk Communication"
        ],
        fee: "LKR 40,000",
        mode: ["Physical OSCE sessions", "Small group training", "Examiner-oriented feedback"],
        brochures: [
            { label: "Course Brochure", url: "/brochures/osce.pdf" }
        ],
        freeVideos: [
            { id: "osce-preview-2", title: "INTRODUCTION", vimeoId: "1155726871" },
            { id: "osce-preview-1", title: "IRRITABLE BOWEL SYNDROME", vimeoId: "1157100795" },
        ],
        modePricing: [
            { mode: "Online", fee: "LKR 35,000" },
            { mode: "Physical", fee: "LKR 40,000" }
        ],
    },
    {
        id: "individual-osce",
        title: "Individual OSCE Training",
        description: "One-to-one training tailored for candidates requiring personalized guidance, correction of weak areas, and intensive examiner-style feedback.",
        duration: "4 Months",
        level: "Personalized",
        imageUrl: "bg-gradient-to-br from-purple-100 to-pink-200",
        targetAudience: ["Last-minute revision candidates", "Repeat candidates needing focused correction"],
        fee: "LKR 100,000",
        mode: ["Two Sessions per week", "Four Cases per session", "One-to-one training", "Personalized feedback"],
        freeVideos: []
    },
];