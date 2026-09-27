import React from 'react';
import { Activity, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const CAPABILITIES = [
  {
    id: 'glioma',
    name: 'Glioma',
    category: 'Intra-Axial Mass',
    description: 'Infiltrative glial neoplasms affecting the cerebral cortex and subcortical white matter.',
    color: '#ef4444',
    f1Score: '98.6% Prec | 90.4% F1'
  },
  {
    id: 'meningioma',
    name: 'Meningioma',
    category: 'Dural-Based Mass',
    description: 'Extra-axial tumors originating from the arachnoid cap cells along meningeal membranes.',
    color: '#f59e0b',
    f1Score: '92.4% Prec | 93.2% F1'
  },
  {
    id: 'pituitary',
    name: 'Pituitary Tumor',
    category: 'Sellar Region Mass',
    description: 'Adenomas located in the sella turcica right above the sphenoid sinus.',
    color: '#a855f7',
    f1Score: '96.5% Prec | 98.0% F1'
  },
  {
    id: 'notumor',
    name: 'No Tumor',
    category: 'Healthy Control',
    description: 'Normal cranial MRI without focal space-occupying lesions or pathological enhancement.',
    color: '#10b981',
    f1Score: '99.2% Rec | 94.3% F1'
  }
];

export default function DetectionCapabilities() {
  return (
    <div className="card-panel" style={{
      background: 'var(--bg-surface)',
      borderRadius: '16px',
      border: '1px solid var(--border-subtle)',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--accent-cyan-glow)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Detection Capabilities
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Supported Pathological Classifications
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--color-notumor)',
          fontFamily: 'JetBrains Mono',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle2 size={12} />
          <span>4-Class Classifier</span>
        </div>
      </div>

      {/* 4 Tumor Capability Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {CAPABILITIES.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'var(--bg-main)',
              borderRadius: '12px',
              padding: '1.1rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div>
              {/* Header with Colored Dot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}80`
                  }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono',
                  color: item.color,
                  background: `${item.color}15`,
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {item.f1Score}
                </span>
              </div>

              {/* Category Tag */}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.category}
              </div>

              {/* Brief Description */}
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
