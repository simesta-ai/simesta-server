import Course from "./course";
import { Document } from "mongoose";


interface User extends Document {
    _id: string;
    name: string;
    password: string;
    email: string;
    profilePicture?: string;
    interests: string[];
    courses: Array<Course>

}
export default User