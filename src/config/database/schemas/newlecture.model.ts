import { Schema, model } from "mongoose";
import INewLecture from "./interfaces/newlecture.interface";

const QuizSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  question: {
    type: String,
    default: "",
  },
  options: {
    type: [String],
    default: [],
  },
  answer: {
    type: [String],
    default: [],
  },
  explanation: {
    type: String,
    default: "",
  },
});

const IdeaContentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  quiz: {
    type: [QuizSchema],
    default: [],
  },
});

const NewLectureSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: [String],
    default: [],
  },
  ideas: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        auto: true,
      },
      ideaContents: [IdeaContentSchema],
    },
  ],
});

type NewLectureType = INewLecture;
const NewLectureModel = model<NewLectureType>("NewLecture", NewLectureSchema);

export default NewLectureModel;
