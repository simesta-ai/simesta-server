import Lecture from "./lectures.js";


interface Topic {
    _id: string;
    name: string;
    lectures: Array<Lecture>;
    image: string;
    completed: boolean;
    inProgress: boolean;

    
}

export default Topic