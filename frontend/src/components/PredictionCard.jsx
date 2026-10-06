import React, { useState } from 'react';
import { ShieldCheck, Cpu, Sparkles, Binary, CheckCircle2, AlertTriangle, FileSpreadsheet, PieChart, BarChart2 } from 'lucide-react';
import ProbabilityChart from './ProbabilityChart';
import DonutProbabilityChart from './DonutProbabilityChart';

const CLASS_DETAILS = {
  glioma: {
    name: 'Glioma Tumor',
    badgeClass: 'badge-glioma',
    color: '#ef4444',
    description: 'Neoplasm originating from glial cells (astrocytes, oligodendrocytes, or ependymal cells). Exhibited infiltration into adjacent parenchyma.',
    risk: 'High Severity / Infiltrative'
  },
  meningioma: {
    name: 'Meningioma Tumor',
    badgeClass: 'badge-meningioma',
    color: '#f59e0b',
    description: 'Extra-axial dural-based mass arising from arachnoid cap cells. Typically well-circumscribed with potential dural tail sign.',
    risk: 'Moderate Severity / Extra-Axial'
  },
  pituitary: {
    name: 'Pituitary Tumor',
    badgeClass: 'badge-pituitary',
    color: '#a855f7',
    description: 'Sellar / suprasellar endocrine mass centered within the pituitary fossa. May exert mass effect on optic chiasm.',
    risk: 'Moderate Severity / Sellar Region'
  },
  notumor: {
    name: 'Healthy Brain (No Tumor)',
    badgeClass: 'badge-notumor',
    color: '#10b981',
    description: 'No focal mass, abnormal pathological enhancement, or significant midline shift detected in intracranial structures.',
    risk: 'Normal Intracranial Anatomy'
  }
};

export default function PredictionCard({ result, onReset }) {
  const [chartView, setChartView] = useState('donut'); // 'donut' | 'bars'

  if (!result) return null;

  const predictedClassKey = result.predicted_class?.toLowerCase() || 'glioma';
  const info = CLASS_DETAILS[predictedClassKey] || CLASS_DETAILS.glioma;
  const confidence = result.confidence || 0;

  return (
    <div className="card-panel" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-medium)' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.25rem'
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Model Inference Decision
          </span>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
            Classified Brain Tumor Result
          </h3>
        </div>

        <div className={`badge ${info.badgeClass}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
          {info.name}
        </div>
      </div>

      {/* Main Confidence & Metric Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>CONFIDENCE SCORE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: info.color, fontFamily: 'Outfit' }}>
            {confidence.toFixed(1)}%
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>INPUT RESOLUTION</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono', marginTop: '4px' }}>
            124 × 124
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ARCHITECTURE</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '8px' }}>
            CNN-ViT + Ensemble RRELM
          </div>
        </div>
      </div>

      {/* Single Classified Tumor Confidence Gauge */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Classification Result
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Classified Tumor Type & Confidence
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-main)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setChartView('donut')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: chartView === 'donut' ? 'var(--accent-cyan)' : 'transparent',
                color: chartView === 'donut' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <PieChart size={13} />
              <span>Gauge</span>
            </button>
            <button
              type="button"
              onClick={() => setChartView('bars')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: chartView === 'bars' ? 'var(--accent-cyan)' : 'transparent',
                color: chartView === 'bars' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <BarChart2 size={13} />
              <span>Bar</span>
            </button>
          </div>
        </div>

        {chartView === 'donut' ? (
          <DonutProbabilityChart
            probabilities={result.probabilities}
            predictedClass={result.predicted_class}
            confidence={result.confidence}
          />
        ) : (
          <ProbabilityChart
            probabilities={result.probabilities}
            predictedClass={result.predicted_class}
            confidence={result.confidence}
          />
        )}
      </div>

      {/* Clinical Pathology Summary */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Clinical Profile & Characteristics:
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {info.description}
        </p>
      </div>
    </div>
  );
}
