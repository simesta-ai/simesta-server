import Topic from "./topics.ts";
import { Document } from "mongoose";




interface Course extends Document{
    _id: string;
    title: string;
    description: string;
    category: string;
    completed: number;
    inProgress: boolean;
    topics: Array<Topic>;
    image: string;
    notes: string;
    courseType: string;
    difficultyLevel: string;
    estCompletionTime: number    
}



export default Course;