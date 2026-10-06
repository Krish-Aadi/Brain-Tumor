import React, { useState } from 'react';
import { Eye, Info, Sliders, Layers } from 'lucide-react';

export default function GradCAMViewer({ originalImage, gradcamImage, gradcamRawImage, predictedClass }) {
  const [viewMode, setViewMode] = useState('overlay'); // 'original' | 'heatmap' | 'overlay'
  const [opacity, setOpacity] = useState(0.65);

  const displayImage = viewMode === 'original'
    ? (originalImage || gradcamImage)
    : viewMode === 'heatmap'
    ? (gradcamRawImage || gradcamImage)
    : (gradcamImage || originalImage);

  return (
    <div className="card-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--accent-blue)',
          background: 'rgba(56, 189, 248, 0.1)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 700,
          marginBottom: '0.4rem'
        }}>
          <Layers size={13} />
          <span>PDSCNN CONVOLUTIONAL BRANCH XAI</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Grad-CAM Heatmap</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Highlights localized spatial gradient activations that contributed most heavily to the {predictedClass || 'tumor'} classification.
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
          className={`view-mode-tab ${viewMode === 'heatmap' ? 'active' : ''}`}
          onClick={() => setViewMode('heatmap')}
        >
          Grad-CAM Map
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
            alt="Grad-CAM Visualization"
            className="mri-image-display"
          />
        ) : (
          /* Simulated High-Res Grad-CAM Vector Rendering */
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

            {/* Simulated Heatmap Glow */}
            {viewMode !== 'original' && (
              <div style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(244, 63, 94, 0.85) 0%, rgba(245, 158, 11, 0.6) 45%, rgba(6, 182, 212, 0.3) 70%, transparent 85%)',
                top: '30%',
                left: '42%',
                filter: 'blur(10px)',
                opacity: opacity
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
              color: 'var(--accent-cyan)'
            }}>
              MODE: {viewMode.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Colormap Legend */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low Activation</span>
        <div style={{
          height: '8px',
          flex: 1,
          margin: '0 1rem',
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #1e3a8a 0%, #06b6d4 35%, #eab308 70%, #ef4444 100%)'
        }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--color-glioma)', fontWeight: 700 }}>High Activation</span>
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
        Grad-CAM takes the gradients of the score for {predictedClass || 'the target class'} flowing into the final convolutional layer of PDSCNN to produce a coarse localization map.
      </div>
    </div>
  );
}
