import { Schema, model } from "mongoose"
import ICourse from "./interfaces/course.interface"



const CourseSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description:{
            type: String,
            default: ""
        },
        category: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        completed: {
            type: Boolean,
            default: false
        },
        inProgress: {
            type: Boolean,
            default: false
        },
        courseType: {
            type: String,
            default: "" 
        },
        difficultyLevel: {
            type: String,
            default: ""
        },
        estCompletionTime: {
            type: Number,
            default: 0
        },
        notes: {
            type: String,
            default: ""
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

type CourseType = ICourse;

const CourseModel = model<CourseType>("Course", CourseSchema);
export default CourseModel;