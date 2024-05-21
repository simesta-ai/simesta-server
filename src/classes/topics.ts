import Lecture from "./lectures.ts";
import { Document } from "mongoose";


interface Topic extends Document{
    _id: string;
    title: string;
    lectures: Array<Lecture>;
    image: string;
    completed: boolean;
    inProgress: boolean;

    
}

export default Topic