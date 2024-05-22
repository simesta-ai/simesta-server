import { Schema, model } from "mongoose";
import ILecture from "./interfaces/lecture.interface.ts";

const LectureSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    lectureText: {
        type: String,
        default: "",
    },
    videos: {
        type: [String],
        default: [],
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    estCompletionTime: {
        type: Number,
        default: 0,
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

type LectureType = ILecture;
const LectureModel = model<LectureType>("Lecture", LectureSchema);
export default LectureModel;
