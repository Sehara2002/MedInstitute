import { StaticImageData } from "next/image";
import ExPost1 from "./images/Posts/exam_post1.png";
import ExPost2 from "./images/Posts/exam_post2.png";
import ExPost3 from "./images/Posts/exam_post3.jpeg";
import ExPost4 from "./images/Posts/exam_post4.png";


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
    // {
    //     id: "osce-mock-circuit",
    //     title: "MRCGP INT. OSCE Mock Exam",
    //     description: "Realistic Exam simulation with an experienced examiner. Ideal Marking Grid driven assessment & feedback for each candidate for all 14 cases. Also Unique exam tips will be given.",
    //     date: "22nd MARCH 2026",
    //     time: "9.00 AM ONWARDS",
    //     loc:"Colombo, Sri Lanka",
    //     fee: "LKR 16,000 per slot",
    //     type: "Mock Exam",
    //     offer: "LIMITED SLOTS AVAILABLE!",
    //     image: ExPost1
    // },

    // {
    //     id: "osce-mock-circuit-2",
    //     title: "MRCGP INT. OSCE Mock Exam",
    //     description: "Realistic Exam simulation with an experienced examiner. Ideal Marking Grid driven assessment & feedback for each candidate for all 14 cases. Also Unique exam tips will be given.",
    //     date: "29th MARCH 2026",
    //     time: "9.00 AM ONWARDS",
    //     loc:"Colombo, Sri Lanka",
    //     fee: "LKR 20,000 per slot",
    //     type: "Mock Exam",
    //     offer: "LIMITED SLOTS AVAILABLE!",
    //     image: ExPost2
    // }
    // ,
    // {
    //     id: "osce-mock-circuit-3",
    //     title: "MRCGP INT. OSCE Mock Exam",
    //     description: "Practice. Feedback. Perform with Confidence",
    //     date: "26th July 2026",
    //     time: "9.00 AM ONWARDS",
    //     loc:"PGIM Academic Center, COTTA Road",
    //     fee: "LKR 35,000 per slot",
    //     type: "Mock Exam",
    //     offer: "LIMITED SLOTS AVAILABLE!",
    //     image: ExPost3
    // }
    // {
    //     id: "osce-mock-exam-colombo-oct-2026",
    //     title: "MRCGP Int. OSCE Mock Exam",
    //     description:
    //         "14 most likely focused cases with marking grid-based assessment to identify your gaps for improvement. Get guidance from an experienced MRCGP Int. examiner.",
    //     date: "17th OCTOBER 2026",
    //     time: "01:00 PM ONWARDS",
    //     loc: "Colombo, Sri Lanka",
    //     fee: "LKR 30,000 per slot",
    //     type: "Mock Exam",
    //     offer: "16 SLOTS ONLY",
    //     image: ExPost4
    // },

];
