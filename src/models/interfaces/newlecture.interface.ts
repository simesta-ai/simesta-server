import { Document } from "mongoose";

interface NewLecture extends Document{
    _id: string;
    title: string;
    videos: string[];
    ideas: Idea[];

}

interface Idea {
    _id: string;
    ideaContents: IdeaContent[];
}

interface IdeaContent{
    text: string;
    image?: string;
    quiz?: Quiz[];
}

interface Quiz {
    _id: string;
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export default NewLecture