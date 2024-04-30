interface Lecture {
    _id: string;
    name: string;
    estCompletionTime: number;
    videos: string[];
    lectureText: string;
    position: number;
    completed: boolean;

   
}

export default Lecture