'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { CoachChat } from '@/components/coach/CoachChat';
import { QuizPanel } from '@/components/quiz/QuizPanel';
import { DefectTriage } from '@/components/triage/DefectTriage';
import { ContextUploader } from '@/components/upload/ContextUploader';
import { DocsPanel } from '@/components/docs/DocsPanel';

export default function Home() {
  const { activeMode } = useApp();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {activeMode === 'coach' && <CoachChat />}
        {activeMode === 'quiz' && <QuizPanel />}
        {activeMode === 'triage' && <DefectTriage />}
        {activeMode === 'upload' && <ContextUploader />}
        {activeMode === 'docs' && <DocsPanel />}
      </main>
    </div>
  );
}
