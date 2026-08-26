import React from 'react';
import { CheckCircle2, ShieldCheck, Activity, Target } from 'lucide-react';

const CLASS_CONFIG = {
  glioma: {
    label: 'Glioma Tumor',
    shortName: 'Glioma',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.4)',
    pathology: 'Infiltrative Glial Neoplasm (Astrocytic / Oligodendroglial origin)',
    severity: 'High Severity / Infiltrative'
  },
  meningioma: {
    label: 'Meningioma Tumor',
    shortName: 'Meningioma',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.4)',
    pathology: 'Dural-Based Extra-Axial Neoplasm (Arachnoid cap cell origin)',
    severity: 'Moderate Severity / Extra-Axial'
  },
  pituitary: {
    label: 'Pituitary Tumor',
    shortName: 'Pituitary',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.4)',
    pathology: 'Sellar / Suprasellar Endocrine Neoplasm (Pituitary Adenoma)',
    severity: 'Moderate Severity / Sellar Region'
  },
  notumor: {
    label: 'Healthy Brain (No Tumor)',
    shortName: 'No Tumor',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    pathology: 'Normal Intracranial Anatomy (No focal neoplastic mass detected)',
    severity: 'Normal Control'
  },
};

export default function DonutProbabilityChart({ probabilities, predictedClass, confidence }) {
  if (!predictedClass && !confidence) return null;

  const key = predictedClass?.toLowerCase() || 'glioma';
  const cfg = CLASS_CONFIG[key] || CLASS_CONFIG.glioma;
  
  // Extract predicted class confidence
  const confValue = probabilities && probabilities[key] !== undefined
    ? probabilities[key]
    : (confidence || 94.8);
  const percent = Math.min(Math.max(confValue, 0), 100);

  // SVG circular radial meter calculations
  const size = 190;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 210px) 1fr', gap: '2rem', alignItems: 'center' }}>
      {/* Single-Class Radial Confidence Meter */}
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Active Classified Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={cfg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center Label for the Single Classified Tumor */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            {cfg.shortName}
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: cfg.color, fontFamily: 'Outfit', lineHeight: 1.1 }}>
            {percent.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Confidence</span>
        </div>
      </div>

      {/* Single Classified Category Information Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Main Highlight Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            background: cfg.bg,
            border: `1.5px solid ${cfg.border}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cfg.color }} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {cfg.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: 700 }}>
                ★ Primary Classified Tumor Type
              </div>
            </div>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '1.15rem', fontWeight: 900, color: cfg.color }}>
            {percent.toFixed(2)}%
          </span>
        </div>

        {/* Pathology & Severity Details for Classified Tumor */}
        <div style={{
          background: 'var(--bg-main)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          fontSize: '0.8rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Pathology:</span>
            <span style={{ fontWeight: 600, textAlign: 'right' }}>{cfg.pathology}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Assessment:</span>
            <span style={{ fontWeight: 700, color: cfg.color }}>{cfg.severity}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Classifier:</span>
            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>RRELM (L2 Ridge Regularized)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
