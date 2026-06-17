'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/lib/types';
import styles from './CoachChat.module.css';

const STARTER_QUESTIONS = [
  "What is 3-way matching in D365?",
  "How do I post a vendor invoice?",
  "Why can't I post to a closed period?",
  "Where do I find the trial balance?"
];

export function CoachChat() {
  const { chatHistory, addMessage, uploadedContext } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingId, setStreamingId] = useState<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingContent]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    setError(null);
    setIsStreaming(true);
    setStreamingContent('');
    
    const userMsgId = crypto.randomUUID();
    const modelMsgId = crypto.randomUUID();
    setStreamingId(modelMsgId);

    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInputValue('');

    // Prepare history for Gemini API
    const contextTexts = uploadedContext.map(doc => `[${doc.fileName}]:\n${doc.content}`);
    const apiHistory = [...chatHistory, userMessage].map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory, context: contextTexts }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        fullText += decoder.decode(value, { stream: true });
        setStreamingContent(fullText);
      }

      // Add final message to context
      addMessage({
        id: modelMsgId,
        role: 'model',
        content: fullText,
        timestamp: Date.now(),
      });

    } catch (err: any) {
      console.error(err);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsStreaming(false);
      setStreamingId(null);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messagesArea}>
        {chatHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.welcomeIcon}>🎓</div>
            <h2>Hi! I'm your D365 UAT Coach</h2>
            <p>Ask me anything about D365FO Finance or select a starter question:</p>
            
            <div className={styles.starterGrid}>
              {STARTER_QUESTIONS.map((q, i) => (
                <button 
                  key={i} 
                  className="glass-card" 
                  onClick={() => handleSend(q)}
                  disabled={isStreaming}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messageList}>
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isStreaming && streamingId && (
              <MessageBubble 
                message={{
                  id: streamingId,
                  role: 'model',
                  content: streamingContent || '...',
                  timestamp: Date.now()
                }} 
                isStreaming={true} 
              />
            )}
            
            {error && (
              <div className={styles.errorBanner}>
                ⚠️ {error}
                <button onClick={() => {
                  setError(null);
                  // Re-run with existing history (last user message is already in chatHistory)
                  const contextTexts = uploadedContext.map(doc => `[${doc.fileName}]:\n${doc.content}`);
                  const apiHistory = chatHistory.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.content }]
                  }));
                  setIsStreaming(true);
                  setStreamingContent('');
                  const retryModelId = crypto.randomUUID();
                  setStreamingId(retryModelId);

                  fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: apiHistory, context: contextTexts }),
                  }).then(async response => {
                    if (!response.ok) throw new Error(`API error: ${response.statusText}`);
                    if (!response.body) throw new Error('No response body');
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let fullText = '';
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;
                      fullText += decoder.decode(value, { stream: true });
                      setStreamingContent(fullText);
                    }
                    addMessage({ id: retryModelId, role: 'model', content: fullText, timestamp: Date.now() });
                  }).catch(err => {
                    console.error(err);
                    setError('Failed to get response. Please try again.');
                  }).finally(() => {
                    setIsStreaming(false);
                    setStreamingId(null);
                    setStreamingContent('');
                  });
                }}>
                  Retry
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about D365 UAT..."
            className={styles.textarea}
            rows={1}
            disabled={isStreaming}
          />
          <button 
            className={`btn-primary ${styles.sendBtn}`} 
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
          >
            ➤
          </button>
        </div>
        <p className={styles.disclaimer}>
          The coach may make mistakes. Please verify important information with your project team.
        </p>
      </div>
    </div>
  );
}
