import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { AppMode } from '@/lib/types';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { activeMode, setActiveMode, uploadedContext, clearChat } = useApp();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems: { mode: AppMode; label: string; icon: string }[] = [
    { mode: 'coach', label: 'Coach', icon: '💬' },
    { mode: 'quiz', label: 'Quiz', icon: '📝' },
    { mode: 'triage', label: 'Triage', icon: '🔍' },
    { mode: 'upload', label: 'Upload Context', icon: '📁' },
    { mode: 'docs', label: 'Docs & Flows', icon: '📖' },
  ];

  const handleNavClick = (mode: AppMode) => {
    setActiveMode(mode);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className={styles.mobileToggle}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>🎓</div>
          <h1 className={styles.title}>D365 UAT Coach</h1>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.mode}
              className={`${styles.navItem} ${activeMode === item.mode ? styles.active : ''}`}
              onClick={() => handleNavClick(item.mode)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.mode === 'upload' && uploadedContext.length > 0 && (
                <span className={styles.badge}>{uploadedContext.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.footer}>
          <button 
            className={styles.clearBtn} 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the chat history?')) {
                clearChat();
              }
            }}
          >
            🗑️ Clear Chat
          </button>
          <div className={styles.credits}>
            Conceptualised and developed by Ramkumar Subbarao
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
}
