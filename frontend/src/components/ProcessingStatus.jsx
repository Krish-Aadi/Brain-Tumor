import React from 'react';
import { Loader2, CheckCircle2, Cpu, Sparkles, Binary, Sliders, Eye } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Uploading & Validating Scan', icon: Sliders },
  { id: 2, label: 'CLAHE Contrast Normalization (124 × 124)', icon: Sliders },
  { id: 3, label: 'PDSCNN 256-d Local Feature Extraction', icon: Cpu },
  { id: 4, label: 'Vision Transformer Patch Self-Attention', icon: Sparkles },
  { id: 5, label: 'Concatenated Feature Fusion (384-d)', icon: Binary },
  { id: 6, label: 'RRELM Ridge Regularized Classification', icon: Cpu },
  { id: 7, label: 'Generating Grad-CAM & ViT Explainability Maps', icon: Eye }
];

export default function ProcessingStatus({ currentStep = 4 }) {
  return (
    <div className="card-panel" style={{
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-medium)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'var(--accent-cyan-glow)',
        color: 'var(--accent-cyan)',
        marginBottom: '1.25rem'
      }}>
        <Loader2 size={30} className="animate-spin" />
      </div>

      <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
        Analyzing MRI with Parallel Deep Architecture
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
        Processing raw pixels through dual local/global streams and regularized extreme learning machine.
      </p>

      {/* Pipeline Stage Tracker */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '440px', margin: '0 auto', textAlign: 'left' }}>
        {STAGES.map((stg) => {
          const isDone = currentStep > stg.id;
          const isCurrent = currentStep === stg.id;
          const Icon = stg.icon;

          return (
            <div
              key={stg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isCurrent ? 'var(--accent-cyan-glow)' : 'var(--bg-surface)',
                border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={16} style={{ color: isDone ? 'var(--color-notumor)' : (isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)') }} />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isDone ? 'var(--text-primary)' : (isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)')
                }}>
                  {stg.label}
                </span>
              </div>

              {isDone ? (
                <CheckCircle2 size={16} style={{ color: 'var(--color-notumor)' }} />
              ) : isCurrent ? (
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent-cyan)' }} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
