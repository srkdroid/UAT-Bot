'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { userGuide, sampleFlows } from '@/lib/docsContent';
import styles from './DocsPanel.module.css';

export function DocsPanel() {
  const [activeTab, setActiveTab] = useState<'guide' | 'flows'>('guide');
  const [expandedSection, setExpandedSection] = useState<string | null>(userGuide[0].id);
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Documentation & Flows</h2>
        <p>Learn how to use the coach and reference sample UAT scenarios.</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'guide' ? styles.active : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          User Guide
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'flows' ? styles.active : ''}`}
          onClick={() => setActiveTab('flows')}
        >
          Sample UAT Flows
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'guide' && (
          <div className={styles.accordionList}>
            {userGuide.map(section => (
              <div key={section.id} className={`glass-card ${styles.accordionItem}`}>
                <button 
                  className={styles.accordionHeader}
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <span className={styles.accordionIcon}>{section.icon}</span>
                  <h3>{section.title}</h3>
                  <span className={styles.chevron}>
                    {expandedSection === section.id ? '▼' : '▶'}
                  </span>
                </button>
                
                {expandedSection === section.id && (
                  <div className={`markdown-content ${styles.accordionContent} animate-slideUp`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {section.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flows' && (
          <div className={styles.flowList}>
            {sampleFlows.map(flow => (
              <div key={flow.id} className={`glass-card ${styles.flowCard}`}>
                <div 
                  className={styles.flowHeader}
                  onClick={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
                >
                  <div className={styles.flowTitleRow}>
                    <h3>{flow.title}</h3>
                    <span className="badge badge-info">{flow.module}</span>
                  </div>
                  <p className={styles.flowDesc}>{flow.description}</p>
                  <button className={styles.expandBtn}>
                    {expandedFlow === flow.id ? 'Hide Details' : 'View Steps'}
                  </button>
                </div>

                {expandedFlow === flow.id && (
                  <div className={`${styles.flowDetails} animate-slideUp`}>
                    <div className={styles.stepsTableWrapper}>
                      <table className={styles.stepsTable}>
                        <thead>
                          <tr>
                            <th>Step</th>
                            <th>Action</th>
                            <th>Navigation</th>
                            <th>Key Fields to Validate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flow.steps.map(step => (
                            <tr key={step.stepNumber}>
                              <td className={styles.stepNum}>{step.stepNumber}</td>
                              <td>{step.action}</td>
                              <td><code>{step.navigation}</code></td>
                              <td>
                                <ul className={styles.fieldsList}>
                                  {step.fieldsToValidate.map((field, i) => (
                                    <li key={i}>{field}</li>
                                  ))}
                                </ul>
                                {step.tip && (
                                  <div className={styles.stepTip}>💡 {step.tip}</div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className={styles.flowFooter}>
                      <div className={styles.pitfalls}>
                        <h4>⚠️ Common Pitfalls</h4>
                        <ul>
                          {flow.commonPitfalls.map((pitfall, i) => (
                            <li key={i}>{pitfall}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={styles.outcome}>
                        <h4>✅ Expected Outcome</h4>
                        <p>{flow.expectedOutcome}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
