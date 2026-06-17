export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  content: string;
  pageCount?: number;
  fileType: 'pdf' | 'docx' | 'txt';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  currentIndex: number;
  isComplete: boolean;
  isLoading: boolean;
  selectedModule: string;
}

export interface QuizResult {
  id: string;
  module: string;
  score: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  answers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  timestamp: number;
  knowledgeGaps: string[];
}

export interface TriageResult {
  classification: 'Training Issue' | 'Configuration Issue' | 'Genuine Defect' | 'Out of Scope';
  confidence: 'High' | 'Medium' | 'Low';
  reasoning: string;
  recommended_action: string;
  suggested_next_steps: string[];
}

export type AppMode = 'coach' | 'quiz' | 'triage' | 'upload' | 'docs';
