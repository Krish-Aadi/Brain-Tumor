import React from 'react';

const CLASS_CONFIG = {
  glioma: { label: 'Glioma Tumor', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  meningioma: { label: 'Meningioma Tumor', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  pituitary: { label: 'Pituitary Tumor', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' },
  notumor: { label: 'Healthy Brain (No Tumor)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
};

export default function ProbabilityChart({ probabilities, predictedClass, confidence }) {
  const key = predictedClass?.toLowerCase() || 'glioma';
  const config = CLASS_CONFIG[key] || CLASS_CONFIG.glioma;
  const val = probabilities && probabilities[key] !== undefined
    ? probabilities[key]
    : (confidence || 94.8);
  const percent = typeof val === 'number' ? val : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.9rem',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontWeight: 800, color: config.color }}>
            {config.label} ★ Classified Match
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, color: config.color, fontSize: '1rem' }}>
            {percent.toFixed(2)}%
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '12px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-surface)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(Math.max(percent, 0), 100)}%`,
            borderRadius: 'var(--radius-full)',
            background: config.color,
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>
    </div>
  );
}
