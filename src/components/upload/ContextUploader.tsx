import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './ContextUploader.module.css';

export function ContextUploader() {
  const { uploadedContext, addDocument, removeDocument } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Client-side validation
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error('File size exceeds 5MB limit');
      }

      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !['txt', 'pdf', 'docx'].includes(extension || '')) {
        throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to process file');
      }

      const data = await res.json();
      
      addDocument({
        id: Date.now().toString(),
        fileName: data.fileName,
        content: data.content,
        fileType: data.fileType,
        pageCount: data.pageCount
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'txt': return '📃';
      default: return '📁';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Project Context</h2>
        <p>Upload Functional Design Documents (FDDs) or Test Scripts to give the coach project-specific context.</p>
      </div>

      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''} ${isUploading ? styles.uploading : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className={styles.hiddenInput}
        />
        
        {isUploading ? (
          <div className={styles.uploadingState}>
            <div className="spinner" style={{width: 32, height: 32, borderWidth: 3}}></div>
            <p>Processing document...</p>
          </div>
        ) : (
          <>
            <div className={styles.dropIcon}>📁</div>
            <h3>Drag & drop your documents here</h3>
            <p>or click to browse</p>
            <span className={styles.formats}>Supports PDF, DOCX, TXT (Max 5MB)</span>
          </>
        )}
      </div>

      {error && <div className="badge badge-error" style={{marginBottom: '2rem'}}>{error}</div>}

      {uploadedContext.length > 0 && (
        <div className={styles.documentsSection}>
          <div className={styles.docHeader}>
            <h3>Uploaded Documents</h3>
            <span className="badge badge-info">{uploadedContext.length} loaded</span>
          </div>
          
          <div className={styles.documentList}>
            {uploadedContext.map(doc => (
              <div key={doc.id} className={`glass-card ${styles.docCard}`}>
                <div className={styles.docIcon}>{getFileIcon(doc.fileType)}</div>
                <div className={styles.docInfo}>
                  <div className={styles.docName}>{doc.fileName}</div>
                  <div className={styles.docMeta}>
                    {doc.fileType.toUpperCase()}
                    {doc.pageCount && ` • ${doc.pageCount} pages`}
                  </div>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.id);
                  }}
                  title="Remove document"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.privacyNotice}>
        🔒 <strong>Privacy Notice:</strong> Documents are processed in-memory only and discarded after your session. Nothing is stored permanently.
      </div>
    </div>
  );
}
