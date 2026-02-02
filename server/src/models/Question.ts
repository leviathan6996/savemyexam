import mongoose, { Schema, Document } from 'mongoose';
import { QuestionType, Difficulty, ExamBoard } from '@shared/types';

export interface IQuestionDocument extends Document {
  topic: mongoose.Types.ObjectId;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  answer: string;
  markScheme: string;
  marks: number;
  examBoard: ExamBoard;
  year?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic is required'],
    },
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: [true, 'Question type is required'],
    },
    difficulty: {
      type: String,
      enum: Object.values(Difficulty),
      required: [true, 'Difficulty is required'],
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: [{
      type: String,
    }],
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
    markScheme: {
      type: String,
      required: [true, 'Mark scheme is required'],
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [1, 'Marks must be at least 1'],
    },
    examBoard: {
      type: String,
      enum: Object.values(ExamBoard),
      required: [true, 'Exam board is required'],
    },
    year: {
      type: Number,
      min: [2000, 'Year must be 2000 or later'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
QuestionSchema.index({ topic: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ type: 1 });
QuestionSchema.index({ examBoard: 1 });
QuestionSchema.index({ tags: 1 });

const Question = mongoose.model<IQuestionDocument>('Question', QuestionSchema);

export default Question;
