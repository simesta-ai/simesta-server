import { Schema, model } from "mongoose";
import Lecture from "../classes/lectures";

const LectureSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    inProgress: {
        type: Boolean,
        default: false,
    },
    nextLecture: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        default: null,
    },
    prevLecture: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        default: null,
    },
    });
