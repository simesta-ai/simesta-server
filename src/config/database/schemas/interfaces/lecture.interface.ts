import { Document } from "mongoose";

interface Lecture extends Document{
    _id: string;
    title: string;
    videos: string[];
    lectureText: string;
    position: number;
    completed: boolean;
    topic: string;
   
}

export default Lecture