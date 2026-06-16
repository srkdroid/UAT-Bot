'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

import type {
  AppMode,
  Message,
  QuizQuestion,
  QuizResult,
  QuizState,
  UploadedDocument,
} from '@/lib/types';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface AppContextValue {
  // Mode
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;

  // Chat
  chatHistory: Message[];
  addMessage: (msg: Message) => void;
  clearChat: () => void;

  // Uploaded context
  uploadedContext: UploadedDocument[];
  addDocument: (doc: UploadedDocument) => void;
  removeDocument: (id: string) => void;

  // Quiz
  quizState: QuizState;
  setQuizState: React.Dispatch<React.SetStateAction<QuizState>>;
  quizHistory: QuizResult[];
  saveQuizResult: (result: QuizResult) => void;
  clearQuizHistory: () => void;
}

const QUIZ_HISTORY_KEY = 'd365-uat-coach-quiz-history';

const initialQuizState: QuizState = {
  questions: [] as QuizQuestion[],
  answers: {},
  currentIndex: 0,
  isComplete: false,
  isLoading: false,
  selectedModule: '',
};

// ---------------------------------------------------------------------------
// Context creation
// ---------------------------------------------------------------------------

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AppProvider({ children }: { children: ReactNode }) {
  // -- Mode -----------------------------------------------------------------
  const [activeMode, setActiveMode] = useState<AppMode>('coach');

  // -- Chat -----------------------------------------------------------------
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const addMessage = useCallback((msg: Message) => {
    setChatHistory((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  // -- Uploaded context -----------------------------------------------------
  const [uploadedContext, setUploadedContext] = useState<UploadedDocument[]>([]);

  const addDocument = useCallback((doc: UploadedDocument) => {
    setUploadedContext((prev) => [...prev, doc]);
  }, []);

  const removeDocument = useCallback((id: string) => {
    setUploadedContext((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // -- Quiz -----------------------------------------------------------------
  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  // Load quiz history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (stored) {
        const parsed: QuizResult[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setQuizHistory(parsed);
        }
      }
    } catch {
      // Silently ignore corrupted data
      console.warn('Failed to load quiz history from localStorage.');
    }
  }, []);

  const saveQuizResult = useCallback((result: QuizResult) => {
    setQuizHistory((prev) => {
      const next = [...prev, result];
      try {
        localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(next));
      } catch {
        console.warn('Failed to persist quiz history to localStorage.');
      }
      return next;
    });
  }, []);

  const clearQuizHistory = useCallback(() => {
    setQuizHistory([]);
    try {
      localStorage.removeItem(QUIZ_HISTORY_KEY);
    } catch {
      console.warn('Failed to clear quiz history from localStorage.');
    }
  }, []);

  // -- Value ----------------------------------------------------------------
  const value: AppContextValue = {
    activeMode,
    setActiveMode,
    chatHistory,
    addMessage,
    clearChat,
    uploadedContext,
    addDocument,
    removeDocument,
    quizState,
    setQuizState,
    quizHistory,
    saveQuizResult,
    clearQuizHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === undefined) {
    throw new Error('useApp must be used within an <AppProvider>');
  }
  return ctx;
}
