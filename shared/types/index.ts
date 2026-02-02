// User Types
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export enum ExamBoard {
  IGCSE_CIE = 'igcse_cie',
  IGCSE_EDEXCEL = 'igcse_edexcel',
  GCSE_AQA = 'gcse_aqa',
  GCSE_EDEXCEL = 'gcse_edexcel',
  GCSE_OCR = 'gcse_ocr',
  A_LEVEL_CIE = 'a_level_cie',
  A_LEVEL_AQA = 'a_level_aqa',
  A_LEVEL_EDEXCEL = 'a_level_edexcel',
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  examBoard?: ExamBoard;
  subjects?: string[];
  avatar?: string;
  isEmailVerified: boolean;
  subscription?: {
    plan: 'free' | 'premium';
    status: 'active' | 'inactive' | 'cancelled';
    startDate?: Date;
    endDate?: Date;
  };
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Content Types
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionType {
  MCQ = 'mcq',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CALCULATION = 'calculation',
}

export interface ISubject {
  _id: string;
  name: string;
  code: string;
  examBoard: ExamBoard;
  description: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse {
  _id: string;
  subject: string | ISubject;
  examBoard: ExamBoard;
  level: string;
  year: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic {
  _id: string;
  course: string | ICourse;
  name: string;
  order: number;
  parentTopic?: string | ITopic;
  difficulty?: Difficulty;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote {
  _id: string;
  topic: string | ITopic;
  title: string;
  content: string; // Rich text HTML
  author: string | IUser;
  difficulty: Difficulty;
  tags: string[];
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  _id: string;
  topic: string | ITopic;
  type: QuestionType;
  difficulty: Difficulty;
  question: string; // Rich text HTML
  options?: string[]; // For MCQ
  answer: string;
  markScheme: string;
  marks: number;
  examBoard: ExamBoard;
  year?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPastPaper {
  _id: string;
  subject: string | ISubject;
  examBoard: ExamBoard;
  year: number;
  session: 'may_june' | 'october_november' | 'february_march';
  paperNumber: number;
  pdfUrl: string;
  markSchemeUrl?: string;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideo {
  _id: string;
  topic: string | ITopic;
  title: string;
  description?: string;
  url: string;
  duration: number; // in seconds
  thumbnail?: string;
  transcript?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcard {
  _id: string;
  topic: string | ITopic;
  front: string;
  back: string;
  difficulty: Difficulty;
  creator: string | IUser;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Progress Tracking
export interface IUserProgress {
  _id: string;
  user: string | IUser;
  completedNotes: string[];
  completedQuestions: string[];
  completedVideos: string[];
  scores: {
    topic: string;
    totalQuestions: number;
    correctAnswers: number;
    averageScore: number;
  }[];
  timeSpent: {
    date: Date;
    minutes: number;
  }[];
  studyStreak: number;
  lastStudyDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttempt {
  _id: string;
  user: string | IUser;
  question: string | IQuestion;
  answer: string;
  score: number;
  timeSpent: number; // in seconds
  isCorrect: boolean;
  feedback?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  examBoard?: ExamBoard;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

// Query Parameters
export interface QuestionQueryParams {
  topic?: string;
  difficulty?: Difficulty;
  type?: QuestionType;
  examBoard?: ExamBoard;
  page?: number;
  limit?: number;
}

export interface NoteQueryParams {
  topic?: string;
  difficulty?: Difficulty;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PastPaperQueryParams {
  subject?: string;
  examBoard?: ExamBoard;
  year?: number;
  session?: string;
  page?: number;
  limit?: number;
}
