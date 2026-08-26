import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, DownloadCloud, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export default function DatasetMiniBlock({ className = '', style = {} }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/datasets')}
      className={`dataset-mini-block ${className}`}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderLeft: '4px solid var(--accent-cyan)',
        borderRadius: '14px',
        padding: '1.4rem 1.6rem',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        ...style
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/datasets')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.12)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)' }}>
              Open Research Data
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Curated Brain MRI Datasets (13,994 Scans)
            </h3>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: 'var(--accent-cyan)',
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid var(--border-subtle)'
        }}>
          <DownloadCloud size={15} />
          <span>Download Datasets</span>
          <ArrowRight size={14} />
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
        Our models are trained on standardized multi-source T1-weighted MRI cohorts: <strong>Masoud Nickparvar (7,023 scans)</strong> and <strong>Sartaj Bhuvaji (3,264 scans)</strong>, with 100% 4-class balance across 12,000 training scans and 1,197 unseen test scans.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
        paddingTop: '0.4rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} style={{ color: 'var(--color-glioma)' }} />
          Glioma (3,000)
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} style={{ color: 'var(--color-meningioma)' }} />
          Meningioma (3,000)
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} style={{ color: 'var(--color-pituitary)' }} />
          Pituitary (3,000)
        </span>
        <span>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} style={{ color: 'var(--color-notumor)' }} />
          No Tumor (3,000)
        </span>
      </div>
    </div>
  );
}
