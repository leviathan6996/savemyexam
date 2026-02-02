import mongoose, { Schema, Document } from 'mongoose';
import { ExamBoard } from '@shared/types';

export interface ISubjectDocument extends Document {
  name: string;
  code: string;
  examBoard: ExamBoard;
  description: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    examBoard: {
      type: String,
      enum: Object.values(ExamBoard),
      required: [true, 'Exam board is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SubjectSchema.index({ code: 1, examBoard: 1 }, { unique: true });
SubjectSchema.index({ examBoard: 1 });

const Subject = mongoose.model<ISubjectDocument>('Subject', SubjectSchema);

export default Subject;
