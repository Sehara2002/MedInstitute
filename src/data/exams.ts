import { StaticImageData } from "next/image";
import ExPost1 from "./images/Posts/exam_post1.png";
import ExPost2 from "./images/Posts/exam_post2.png";

export interface Exam {
    id: string;
    title: string;
    description: string;
    date?: string;
    time?: string;
    loc?: string;
    fee: string;
    type: 'Mock Exam' | 'Practice Session';
    offer?: string;
    image?: string | StaticImageData;
}

export const exams: Exam[] = [
    {
        id: "osce-mock-circuit",
        title: "MRCGP INT. OSCE Mock Exam",
        description: "Realistic Exam simulation with an experienced examiner. Ideal Marking Grid driven assessment & feedback for each candidate for all 14 cases. Also Unique exam tips will be given.",
        date: "22nd MARCH 2026",
        time: "9.00 AM ONWARDS",
        loc:"Colombo, Sri Lanka",
        fee: "LKR 16,000 per slot",
        type: "Mock Exam",
        offer: "LIMITED SLOTS AVAILABLE!",
        image: ExPost1
    },

    {
        id: "osce-mock-circuit-2",
        title: "MRCGP INT. OSCE Mock Exam",
        description: "Realistic Exam simulation with an experienced examiner. Ideal Marking Grid driven assessment & feedback for each candidate for all 14 cases. Also Unique exam tips will be given.",
        date: "29th MARCH 2026",
        time: "9.00 AM ONWARDS",
        loc:"Colombo, Sri Lanka",
        fee: "LKR 20,000 per slot",
        type: "Mock Exam",
        offer: "LIMITED SLOTS AVAILABLE!",
        image: ExPost2
    }

];
