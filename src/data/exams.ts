export interface Exam {
    id: string;
    title: string;
    description: string;
    date?: string;
    time?: string;
    fee: string;
    type: 'Mock Exam' | 'Practice Session';
    offer?: string;
}

export const exams: Exam[] = [
    {
        id: "osce-mock-circuit",
        title: "Real Exam Scenario Mock Circuit OSCE Application",
        description: "A complete 14-station OSCE circuit (Most focus for the exam) with examiners and role players. Receive immediate feedback and a marking grid from examinar.",
        date: "28th Jan 2026",
        time: "2:00 PM - 5:00 PM",
        fee: "LKR 30,000",
        type: "Mock Exam",
        offer: "Early Bird Offer available before 12 noon 28th January 2026 IST"
    }
];
