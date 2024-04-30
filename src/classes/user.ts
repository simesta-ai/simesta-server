import Course from "./course.js";


interface User {
    _id: string;
    name: string;
    password: string;
    email: string;
    profilePicture?: string;
    interests: string[];
    courses: Array<Course>
}
export default User