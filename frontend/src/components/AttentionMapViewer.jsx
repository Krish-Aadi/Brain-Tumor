import React, { useState } from 'react';
import { Sparkles, Layers, Grid, Info } from 'lucide-react';

export default function AttentionMapViewer({ originalImage, vitAttentionImage, vitRawImage, predictedClass }) {
  const [viewMode, setViewMode] = useState('overlay'); // 'original' | 'attention' | 'overlay'
  const [showPatchGrid, setShowPatchGrid] = useState(false);

  const displayImage = viewMode === 'original'
    ? (originalImage || vitAttentionImage)
    : viewMode === 'attention'
    ? (vitRawImage || vitAttentionImage)
    : (vitAttentionImage || originalImage);

  return (
    <div className="card-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--accent-indigo)',
          background: 'rgba(99, 102, 241, 0.1)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 700,
          marginBottom: '0.4rem'
        }}>
          <Sparkles size={13} />
          <span>VISION TRANSFORMER MULTI-HEAD ATTENTION</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>ViT Self-Attention Map</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Visualizes global receptive field weights across 16×16 image patch tokens contributing to the classification.
        </p>
      </div>

      {/* View Mode Toggle Controls */}
      <div className="view-mode-tabs">
        <button
          type="button"
          className={`view-mode-tab ${viewMode === 'original' ? 'active' : ''}`}
          onClick={() => setViewMode('original')}
        >
          Original MRI
        </button>
        <button
          type="button"
          className={`view-mode-tab ${viewMode === 'attention' ? 'active' : ''}`}
          onClick={() => setViewMode('attention')}
        >
          ViT Attention Map
        </button>
        <button
          type="button"
          className={`view-mode-tab ${viewMode === 'overlay' ? 'active' : ''}`}
          onClick={() => setViewMode('overlay')}
        >
          Blended Overlay
        </button>
      </div>

      {/* Image Display Canvas */}
      <div className="mri-preview-container" style={{ position: 'relative', overflow: 'hidden' }}>
        {displayImage ? (
          <img
            src={displayImage}
            alt="ViT Attention Map"
            className="mri-image-display"
          />
        ) : (
          /* Simulated ViT Attention Rendering */
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'radial-gradient(circle at center, #1e293b 0%, #060911 80%)'
          }}>
            {/* Brain Outline */}
            <svg width="80%" height="80%" viewBox="0 0 200 200" fill="none" style={{ position: 'absolute' }}>
              <ellipse cx="100" cy="100" rx="75" ry="85" fill="#1e293b" stroke="#334155" strokeWidth="2" />
              <path d="M100 30 C 85 45, 60 70, 60 100 C 60 135, 80 165, 100 175" stroke="#475569" strokeWidth="2" />
              <path d="M100 30 C 115 45, 140 70, 140 100 C 140 135, 120 165, 100 175" stroke="#475569" strokeWidth="2" />
            </svg>

            {/* Simulated ViT Attention Highlights */}
            {viewMode !== 'original' && (
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.85) 0%, rgba(6, 182, 212, 0.5) 50%, transparent 80%)',
                top: '28%',
                left: '40%',
                filter: 'blur(8px)',
              }} />
            )}

            {/* Optional 16x16 Patch Grid Overlay */}
            {showPatchGrid && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                pointerEvents: 'none'
              }} />
            )}

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontFamily: 'JetBrains Mono',
              color: 'var(--accent-indigo)'
            }}>
              MODE: {viewMode.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => setShowPatchGrid(!showPatchGrid)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: showPatchGrid ? 'var(--accent-indigo)' : 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <Grid size={14} />
          <span>Toggle 8×8 Patch Grid (64 Patches) (124×124)</span>
        </button>

        <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontFamily: 'JetBrains Mono' }}>
          8 Self-Attention Heads
        </span>
      </div>

      {/* Educational Explanation */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        The ViT branch computes cosine similarities between the <code>[CLS]</code> token and all spatial patch tokens, exposing non-local hemispheric anatomical relationships.
      </div>
    </div>
  );
}
