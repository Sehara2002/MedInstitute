// The course catalogue (names, descriptions, prices, offers) comes from the
// CITech LMS — see src/lib/citech.ts. This file holds only what CITech does
// not: the institute's own videos and brochures, attached to CITech courses.

export interface Brochure {
    label: string;
    url: string;
}

export interface FreeVideo {
    id: string;
    title: string;
    vimeoId: string;
}

/** One way to take a paid course (e.g. Online · Group) and its fee */
export interface CourseFee {
    /** Stable option key such as "ONLINE_GROUP"; the register form sends it back */
    key: string;
    label: string;
    amount: number;
    display: string;
}

export interface Course {
    /** "citech-<CITech course id>" — used in URLs, registrations and video views */
    id: string;
    citechCourseId: number;
    title: string;
    description: string;
    duration: string;
    level: string;
    instructor: string | null;
    /** Free CITech courses are shown as offers and joined on the LMS */
    isFree: boolean;
    currencyCode: string | null;
    fees: CourseFee[];
    /** Paid, priced, and in the payment gateway's currency */
    acceptsOnlinePayment: boolean;
    curriculum: string[];
    targetAudience: string[];
    mode: string[];
    coverImageUrl: string | null;
    /** Gradient classes used when the course has no cover image */
    imageUrl: string;
    /** The public LMS page where a free course is joined */
    lmsUrl: string | null;
    brochures: Brochure[];
    freeVideos: FreeVideo[];
    fullVideos: FreeVideo[];        // full paid content, unlocked only for enrolled students
    requiresAccount: boolean;       // forces signup before registration
}

export interface CourseContent {
    /** The course's id before the catalogue moved to CITech; older registrations and video views still use it */
    legacyId: string;
    /** The CITech course this content belongs to. Set it once the course exists in CITech. */
    citechCourseId?: number;
    title: string;
    brochures?: Brochure[];
    freeVideos?: FreeVideo[];
    fullVideos?: FreeVideo[];
    requiresAccount?: boolean;
}

const COURSE_ID_PATTERN = /^citech-([1-9]\d{0,9})$/;

export function toCourseId(citechCourseId: number): string {
    return `citech-${citechCourseId}`;
}

/** The CITech course id inside a "citech-<id>" course id, or null for anything else */
export function parseCourseId(courseId: string): number | null {
    const match = COURSE_ID_PATTERN.exec(courseId);
    if (!match) return null;
    const id = Number(match[1]);
    return Number.isSafeInteger(id) ? id : null;
}

/** The institute's content for a course id in either form ("citech-<id>" or a legacy id) */
export function findCourseContent(courseId: string): CourseContent | undefined {
    const citechCourseId = parseCourseId(courseId);
    if (citechCourseId !== null) {
        return courseContent.find((c) => c.citechCourseId === citechCourseId);
    }
    return courseContent.find((c) => c.legacyId === courseId);
}

/** Every registration course id that grants access to this content */
export function accessCourseIds(courseId: string): string[] {
    const content = findCourseContent(courseId);
    const ids = new Set([courseId]);
    if (content) {
        ids.add(content.legacyId);
        if (content.citechCourseId !== undefined) ids.add(toCourseId(content.citechCourseId));
    }
    return [...ids];
}

export const courseContent: CourseContent[] = [
    {
        legacyId: "mrcgp-mock-exam-consultation-videos",
        title: "MRCGP Int Model Mock Exam Consultation Videos",
        requiresAccount: true,
        fullVideos: [
            { id: "mock-full-1", title: "FACIAL RASH", vimeoId: "1212397524" },
            { id: "mock-full-2", title: "COPD", vimeoId: "1212359285" },
            { id: "mock-full-3", title: "URETERIC COLIC", vimeoId: "1212212758" },
            { id: "mock-full-4", title: "STABLE ANGINA", vimeoId: "1212205079" },
            { id: "mock-full-5", title: "TRIGEMINAL NEURALGIA", vimeoId: "1212202505" },
            { id: "mock-full-6", title: "HIV WORRY", vimeoId: "1212200710" },
            { id: "mock-full-7", title: "OSTEOARTHRITIS", vimeoId: "1212199997" },
            { id: "mock-full-8", title: "CERVICAL SPONDYLOSIS", vimeoId: "1212199176" },
            { id: "mock-full-9", title: "PAEDIATRIC CONSTIPATION", vimeoId: "1212198659" },
            { id: "mock-full-10", title: "HYPOTHYROIDISM", vimeoId: "1212195636" },
            { id: "mock-full-11", title: "STATIN INDUCED LIVER INJURY", vimeoId: "1212193011" },
        ],
    },
    {
        legacyId: "pg-exams-learning-platform",
        title: "MD (SCREENING) & DFM Exam Preparation",
        brochures: [
            { label: "Course Brochure", url: "/brochures/MD_Screening_DFM.pdf" }
        ],
        freeVideos: [
            { id: "md-dfm-preview-1", title: "RHEUMATOLOGY", vimeoId: "1202213305" },
            { id: "md-dfm-preview-2", title: "CARDIOLOGY", vimeoId: "1193091282" },
        ],
    },
    {
        legacyId: "OCSE-AKT-Package",
        title: "MRCGP International OSCE + AKT Package",
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
        legacyId: "mrcgp-akt",
        title: "MRCGP International AKT Course",
        brochures: [
            { label: "Course Brochure", url: "/brochures/akt.pdf" }
        ],
        freeVideos: [
            { id: "akt-preview-1", title: "ENT", vimeoId: "1208521093" },
            { id: "akt-preview-2", title: "RESPIRATORY MEDICINE", vimeoId: "1205173415" }
        ],
    },
    {
        legacyId: "mrcgp-osce",
        title: "MRCGP International OSCE Course",
        brochures: [
            { label: "Course Brochure", url: "/brochures/osce.pdf" }
        ],
        freeVideos: [
            { id: "osce-preview-2", title: "INTRODUCTION", vimeoId: "1155726871" },
            { id: "osce-preview-1", title: "IRRITABLE BOWEL SYNDROME", vimeoId: "1157100795" },
        ],
    },
];
