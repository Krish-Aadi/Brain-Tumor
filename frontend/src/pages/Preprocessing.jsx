import React from 'react';
import CLAHEComparison from '../components/CLAHEComparison';
import { Sliders, Maximize2, Sparkles, CheckCircle2, ArrowDown, FileCheck } from 'lucide-react';

const PIPELINE_NODES = [
  { step: '01', title: 'Input Image Validation', desc: 'Verify RGB/Grayscale encoding, pixel bit-depth, and dimension bounds.' },
  { step: '02', title: 'Bilinear Resizing to 124 × 124', desc: 'Standardize spatial dimensions to support 16×16 patch tokenization.' },
  { step: '03', title: 'CLAHE Histogram Equalization', desc: 'Localized adaptive contrast equalization with clipLimit=2.0 on 8×8 tiles.' },
  { step: '04', title: 'Channel Normalization', desc: 'Scale pixel values to [0, 1] range to stabilize neural activations.' },
  { step: '05', title: 'Dual-Stream Input Dispatch', desc: 'Pass preprocessed tensor [B, 3, 124, 124] to PDSCNN & ViT backbones.' }
];

export default function Preprocessing() {
  return (
    <div className="preprocessing-page">
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Image Normalization & Contrast</div>
          <h1 className="section-title">Data Preprocessing & CLAHE Enhancement</h1>
          <p className="section-subtitle">
            Ensuring anatomical boundary clarity through 124 × 124 standardization and localized adaptive histogram equalization.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Interactive Lab Component */}
        <div style={{ marginBottom: '4rem' }}>
          <CLAHEComparison />
        </div>

        {/* Step-by-Step Flow */}
        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Sequential Preprocessing Pipeline</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {PIPELINE_NODES.map((node) => (
              <div
                key={node.step}
                style={{
                  background: 'var(--bg-main)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-teal)' }}>
                  STAGE {node.step}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{node.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {node.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
