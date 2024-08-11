import { Document } from "mongoose";

interface CourseWithFile extends Document{
    _id: string;
    title: string;
    description: string;
    category: string;
    completed: number;
    inProgress: boolean;
    image: string;
    notes: string;
    courseType: string;
    difficultyLevel: string;
    estCompletionTime: number;
    courseFiles: string[];
}



export default CourseWithFile;