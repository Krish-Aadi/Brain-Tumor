import React, { useState } from 'react';
import { Sliders, Sparkles, Eye, Info, Check } from 'lucide-react';

export default function CLAHEComparison() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [clipLimit, setClipLimit] = useState(2.0);
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive' | 'side-by-side'

  return (
    <div className="card-panel" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            CLAHE Preprocessing Laboratory
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Contrast-Limited Adaptive Histogram Equalization with 8×8 Tile Grids and Clip Limit = {clipLimit}
          </p>
        </div>

        <div className="view-mode-tabs" style={{ margin: 0 }}>
          <button
            className={`view-mode-tab ${activeTab === 'interactive' ? 'active' : ''}`}
            onClick={() => setActiveTab('interactive')}
          >
            Interactive Split-Slider
          </button>
          <button
            className={`view-mode-tab ${activeTab === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setActiveTab('side-by-side')}
          >
            Side-by-Side Comparison
          </button>
        </div>
      </div>

      {activeTab === 'interactive' ? (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {/* Split Comparison Canvas Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--border-medium)',
            background: '#090d16',
            userSelect: 'none'
          }}>
            {/* Background: Raw Original MRI (Simulated high-fidelity contrast) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, #232b38 0%, #121824 45%, #05070c 85%)',
            }}>
              {/* Brain MRI simulated silhouette */}
              <svg width="75%" height="75%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
                <ellipse cx="100" cy="100" rx="75" ry="85" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <path d="M100 30 C 85 45, 60 70, 60 100 C 60 135, 80 165, 100 175" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M100 30 C 115 45, 140 70, 140 100 C 140 135, 120 165, 100 175" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="120" cy="85" r="18" fill="#3b4252" stroke="#4c566a" strokeWidth="2" />
                <path d="M100 20 L 100 180" stroke="#334155" strokeWidth="1" />
              </svg>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'JetBrains Mono',
                color: 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                RAW ORIGINAL MRI (LOW CONTRAST)
              </div>
            </div>

            {/* Foreground: CLAHE Enhanced MRI (Clipped by slider) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              width: `${sliderPosition}%`,
              overflow: 'hidden',
              borderRight: '2px solid var(--accent-cyan)',
              background: 'radial-gradient(circle at center, #384252 0%, #1a2233 45%, #05070c 85%)',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '640px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="75%" height="75%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="100" cy="100" rx="75" ry="85" fill="#334155" stroke="var(--accent-cyan)" strokeWidth="3" />
                  <path d="M100 30 C 85 45, 60 70, 60 100 C 60 135, 80 165, 100 175" stroke="#94a3b8" strokeWidth="2.5" />
                  <path d="M100 30 C 115 45, 140 70, 140 100 C 140 135, 120 165, 100 175" stroke="#94a3b8" strokeWidth="2.5" />
                  <circle cx="120" cy="85" r="18" fill="rgba(6, 182, 212, 0.45)" stroke="var(--accent-cyan)" strokeWidth="2.5" />
                  <circle cx="120" cy="85" r="8" fill="#f43f5e" />
                  <path d="M100 20 L 100 180" stroke="var(--accent-teal)" strokeWidth="1.5" />
                </svg>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--accent-cyan)'
                }}>
                  CLAHE ENHANCED (clipLimit={clipLimit})
                </div>
              </div>
            </div>

            {/* Drag Handle Indicator */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${sliderPosition}%`,
              transform: 'translate(-50%, -50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--accent-cyan-glow)',
              pointerEvents: 'none'
            }}>
              <Sliders size={16} />
            </div>
          </div>

          {/* Slider input control */}
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Raw View</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-cyan)', cursor: 'ew-resize' }}
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>CLAHE View</span>
          </div>
        </div>
      ) : (
        /* Side by Side Grid */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card-panel" style={{ textAlign: 'center', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              1. Unprocessed T1 MRI
            </div>
            <div style={{
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-md)',
              background: 'radial-gradient(circle, #1e293b 0%, #0b0f19 80%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dim lesion margins & non-uniform intensity</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Low tissue contrast impairs transformer self-attention map resolution.
            </p>
          </div>

          <div className="card-panel" style={{ textAlign: 'center', background: 'var(--bg-surface)', borderColor: 'var(--accent-cyan)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
              2. Post-CLAHE Enhanced (224 × 224)
            </div>
            <div style={{
              aspectRatio: '1/1',
              borderRadius: 'var(--radius-md)',
              background: 'radial-gradient(circle, #334155 0%, #0b0f19 80%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--accent-cyan)',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>Sharpened sulcal/gyral borders & amplified lesion contrast</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Provides crisp gradient signals for both PDSCNN filters and ViT patch embeddings.
            </p>
          </div>
        </div>
      )}

      {/* Rationale Note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Why 224 × 224 + CLAHE?</strong> Brain MRI scans exhibit subtle grayscale gradients between healthy white/gray matter and neoplastic tissue. CLAHE operates on localized 8×8 tiles, maximizing lesion boundary definition without noise blooming, while 224 × 224 resolution provides optimal spatial fidelity for patch tokenization.
        </div>
      </div>
    </div>
  );
}
