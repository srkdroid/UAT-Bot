import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { D365_MODULES } from '@/lib/docsContent';
import styles from './QuizPanel.module.css';
import type { QuizResult } from '@/lib/types';

export function QuizPanel() {
  const { quizState, setQuizState, quizHistory, saveQuizResult, clearQuizHistory, uploadedContext } = useApp();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (moduleId: string) => {
    const module = D365_MODULES.find(m => m.id === moduleId);
    if (!module) return;

    setError(null);
    setQuizState({ ...quizState, isLoading: true, selectedModule: module.name, isComplete: false });

    try {
      const contextTexts = uploadedContext.map(doc => `[${doc.fileName}]:\n${doc.content}`);
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: module.name, context: contextTexts }),
      });

      if (!res.ok) throw new Error('Failed to generate quiz');
      
      const questions = await res.json();
      
      setQuizState({
        questions,
        answers: {},
        currentIndex: 0,
        isComplete: false,
        isLoading: false,
        selectedModule: module.name,
      });
    } catch (err: any) {
      console.error(err);
      setError('Could not generate quiz. Please try again.');
      setQuizState({ ...quizState, isLoading: false });
    }
  };

  const handleAnswer = (optionKey: string) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: optionKey }
    }));
  };

  const handleNext = () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      // Finish quiz
      let score = 0;
      const gaps: string[] = [];
      
      quizState.questions.forEach((q, idx) => {
        if (quizState.answers[idx] === q.correctAnswer) {
          score++;
        } else {
          gaps.push(q.question);
        }
      });

      const result: QuizResult = {
        id: Date.now().toString(),
        module: quizState.selectedModule,
        score,
        totalQuestions: quizState.questions.length,
        questions: quizState.questions,
        answers: quizState.answers,
        timestamp: Date.now(),
        knowledgeGaps: gaps,
      };

      saveQuizResult(result);
      setQuizState(prev => ({ ...prev, isComplete: true }));
    }
  };

  const resetQuiz = () => {
    setQuizState({
      questions: [],
      answers: {},
      currentIndex: 0,
      isComplete: false,
      isLoading: false,
      selectedModule: '',
    });
  };

  // State 1: Module Selection
  if (quizState.questions.length === 0 && !quizState.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>UAT Readiness Quiz</h2>
          <p>Test your knowledge before testing the system.</p>
        </div>

        {error && <div className="badge badge-error" style={{marginBottom: '1rem'}}>{error}</div>}

        <div className={styles.moduleGrid}>
          {D365_MODULES.map(module => (
            <div key={module.id} className={`glass-card ${styles.moduleCard}`}>
              <h3>{module.name}</h3>
              <p>{module.description}</p>
              <button 
                className="btn-primary"
                onClick={() => handleGenerate(module.id)}
              >
                Generate Quiz
              </button>
            </div>
          ))}
        </div>

        {quizHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3>Previous Results</h3>
            <div className={styles.historyList}>
              {quizHistory.map(result => (
                <div key={result.id} className={styles.historyItem}>
                  <div>
                    <strong>{result.module}</strong>
                    <span className={styles.date}>
                      {new Date(result.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`badge ${result.score >= 4 ? 'badge-success' : 'badge-warning'}`}>
                    {result.score} / {result.totalQuestions}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-secondary" onClick={clearQuizHistory}>
              Clear History
            </button>
          </div>
        )}
      </div>
    );
  }

  // State Loading
  if (quizState.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className="spinner"></div>
          <h3>Generating your {quizState.selectedModule} quiz...</h3>
          <p>Analyzing project context and D365FO best practices.</p>
        </div>
      </div>
    );
  }

  // State 3: Results
  if (quizState.isComplete) {
    const score = Object.keys(quizState.answers).reduce((acc, idxStr) => {
      const idx = parseInt(idxStr);
      return acc + (quizState.answers[idx] === quizState.questions[idx].correctAnswer ? 1 : 0);
    }, 0);
    const total = quizState.questions.length;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className={styles.container}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Quiz Complete!</h2>
          <div className={styles.scoreCircle} style={{ background: `conic-gradient(var(--accent-blue) ${percentage}%, var(--bg-tertiary) 0)` }}>
            <div className={styles.scoreInner}>
              <span className={styles.scoreText}>{score}/{total}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className="btn-primary" onClick={() => handleGenerate(D365_MODULES.find(m => m.name === quizState.selectedModule)?.id || '')}>
              Retry {quizState.selectedModule}
            </button>
            <button className="btn-secondary" onClick={resetQuiz}>
              Select Another Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Active Question
  const currentQ = quizState.questions[quizState.currentIndex];
  const hasAnswered = !!quizState.answers[quizState.currentIndex];
  const selectedAnswer = quizState.answers[quizState.currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        Question {quizState.currentIndex + 1} of {quizState.questions.length}
      </div>

      <div className={`glass-card ${styles.questionCard}`}>
        <h3>{currentQ.question}</h3>
        
        <div className={styles.options}>
          {(Object.entries(currentQ.options) as [keyof typeof currentQ.options, string][]).map(([key, text]) => {
            let itemClass = styles.option;
            if (hasAnswered) {
              if (key === currentQ.correctAnswer) itemClass += ` ${styles.correct}`;
              else if (key === selectedAnswer) itemClass += ` ${styles.incorrect}`;
              else itemClass += ` ${styles.disabled}`;
            }

            return (
              <button
                key={key}
                className={itemClass}
                onClick={() => !hasAnswered && handleAnswer(key)}
                disabled={hasAnswered}
              >
                <span className={styles.optionKey}>{key}</span>
                <span className={styles.optionText}>{text}</span>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className={`${styles.explanation} animate-slideUp`}>
            <h4>Explanation:</h4>
            <p>{currentQ.explanation}</p>
            <div className={styles.nextWrapper}>
              <button className="btn-primary" onClick={handleNext}>
                {quizState.currentIndex < quizState.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
