import { Document } from "mongoose";

interface Lecture extends Document{
    _id: string;
    title: string;
    estCompletionTime: number;
    videos: string[];
    lectureText: string;
    position: number;
    completed: boolean;

   
}

export default Lecture