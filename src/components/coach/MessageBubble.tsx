'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '@/lib/types';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${styles.bubbleWrapper} ${isUser ? styles.userWrapper : styles.modelWrapper}`}>
      {!isUser && (
        <div className={styles.avatar}>
          🤖
        </div>
      )}
      
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.modelBubble}`}>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
          {isStreaming && !isUser && (
            <span className="typing-indicator">
              <span></span><span></span><span></span>
            </span>
          )}
        </div>
        
        <div className={styles.footer}>
          <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
          {!isUser && !isStreaming && (
            <span className={styles.disclaimer}>
              💡 AI-generated guidance. Validate with your project team.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
