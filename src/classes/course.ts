import Topic from "./topics.js";

interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    completed: boolean;
    inProgress: boolean;
    topics: Array<Topic>;
    image: string;
    notes: string;
    type: "recommended" | "created";
    difficultyLevel: "beginner" | "intermediate" | "advanced";
    estCompletionTime: number

    
}

export default Course;