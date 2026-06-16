import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { D365_MODULES } from '@/lib/docsContent';
import type { TriageResult } from '@/lib/types';
import styles from './DefectTriage.module.css';

export function DefectTriage() {
  const { uploadedContext } = useApp();
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const fullDescription = `
      ${module ? `Module: ${module}\n` : ''}
      Defect: ${description}
      ${expected ? `Expected Result: ${expected}\n` : ''}
      ${actual ? `Actual Result: ${actual}\n` : ''}
    `.trim();

    try {
      const contextTexts = uploadedContext.map(doc => `[${doc.fileName}]:\n${doc.content}`);
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defectDescription: fullDescription, module, context: contextTexts }),
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the defect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `
Classification: ${result.classification}
Confidence: ${result.confidence}
Reasoning: ${result.reasoning}
Recommended Action: ${result.recommended_action}
Suggested Next Steps:
${result.suggested_next_steps.map(s => `- ${s}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getBadgeClass = (classification: string) => {
    switch (classification) {
      case 'Training Issue': return 'badge-warning';
      case 'Configuration Issue': return 'badge-info';
      case 'Genuine Defect': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const getIcon = (classification: string) => {
    switch (classification) {
      case 'Training Issue': return '🟡';
      case 'Configuration Issue': return '🔧';
      case 'Genuine Defect': return '🔴';
      default: return '⬜';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Defect Triage</h2>
        <p>Not sure if it's a bug, a config issue, or a training gap? Let the coach analyze it.</p>
      </div>

      <div className={styles.content}>
        {!result ? (
          <form className={`glass-card ${styles.form}`} onSubmit={handleAnalyze}>
            <div className={styles.formGroup}>
              <label>Module (Optional)</label>
              <select value={module} onChange={e => setModule(e.target.value)}>
                <option value="">Select a module...</option>
                {D365_MODULES.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Defect Description <span className={styles.required}>*</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the issue you encountered during testing..."
                rows={4}
                required
              />
            </div>

            <div className={styles.rowGrid}>
              <div className={styles.formGroup}>
                <label>Expected Result (Optional)</label>
                <textarea
                  value={expected}
                  onChange={e => setExpected(e.target.value)}
                  placeholder="What did you expect to happen?"
                  rows={2}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Actual Result (Optional)</label>
                <textarea
                  value={actual}
                  onChange={e => setActual(e.target.value)}
                  placeholder="What actually happened?"
                  rows={2}
                />
              </div>
            </div>

            {error && <div className="badge badge-error">{error}</div>}

            <button 
              type="submit" 
              className={`btn-primary ${styles.submitBtn}`}
              disabled={isLoading || !description.trim()}
            >
              {isLoading ? (
                <><span className="spinner" style={{width: 16, height: 16, borderWidth: 2}}></span> Analyzing...</>
              ) : 'Analyze Defect'}
            </button>
          </form>
        ) : (
          <div className={`glass-card ${styles.resultCard}`}>
            <div className={styles.resultHeader}>
              <div className={styles.badges}>
                <span className={`badge ${getBadgeClass(result.classification)} ${styles.mainBadge}`}>
                  {getIcon(result.classification)} {result.classification}
                </span>
                <span className="badge badge-neutral">
                  Confidence: {result.confidence}
                </span>
              </div>
              <button className="btn-secondary" onClick={copyToClipboard}>
                📋 Copy
              </button>
            </div>

            <div className={styles.resultSection}>
              <h4>Reasoning</h4>
              <p>{result.reasoning}</p>
            </div>

            <div className={styles.resultSection}>
              <h4>Recommended Action</h4>
              <p>{result.recommended_action}</p>
            </div>

            <div className={styles.resultSection}>
              <h4>Suggested Next Steps</h4>
              <ul>
                {result.suggested_next_steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <button className="btn-primary" onClick={() => setResult(null)}>
                Analyze Another Defect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
