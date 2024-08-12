import { Schema, model } from "mongoose"
import ICourseWithFile from "./interfaces/course-with-file.interface"



const CourseWithFileSchema = new Schema(
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
        courseFiles:{
            type: [String],
            default: [],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

type CourseType = ICourseWithFile;

const CourseWithFileModel = model<CourseType>("CourseWithFile", CourseWithFileSchema);
export default CourseWithFileModel;