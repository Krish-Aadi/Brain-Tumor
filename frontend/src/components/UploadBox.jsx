import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, RefreshCw, X, Play, FileUp } from 'lucide-react';

export default function UploadBox({ onUpload, isProcessing }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid MRI image file (PNG, JPG, or JPEG).');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = (e) => {
    e.stopPropagation();
    if (selectedFile) {
      onUpload(selectedFile, previewUrl);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Large Custom Upload Dropzone */}
      <div
        className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          minHeight: '340px',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '16px',
          border: dragActive ? '2px dashed var(--accent-cyan)' : '2px dashed var(--border-medium)',
          background: dragActive ? 'var(--accent-cyan-glow)' : 'var(--bg-surface)',
          transition: 'all 0.25s ease'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {previewUrl ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '360px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid var(--accent-cyan)',
              background: '#000',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}>
              <img
                src={previewUrl}
                alt="Selected MRI Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#fff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Remove scan"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                {selectedFile?.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {(selectedFile?.size / 1024).toFixed(1)} KB • Ready for Analysis
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleStartAnalysis}
              disabled={isProcessing}
              style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '1rem', justifyContent: 'center' }}
            >
              <Play size={18} />
              <span>{isProcessing ? 'Analyzing Scan...' : 'Analyze Brain MRI'}</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '420px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--accent-cyan-glow)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <UploadCloud size={36} />
            </div>

            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Upload Brain MRI Scan
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Drag and drop your scan here, or <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>browse from your computer</span>
              </div>
            </div>

            <div style={{
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-main)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono'
            }}>
              Supports: PNG, JPG, JPEG (T1-Weighted Scans)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
