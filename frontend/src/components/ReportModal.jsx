import React, { useMemo } from 'react';
import { X, Printer, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

export default function ReportModal({ isOpen, onClose, resultData }) {
  if (!isOpen || !resultData) return null;

  const patientId = useMemo(() => `PT-2026-${Math.floor(1000 + Math.random() * 9000)}`, [resultData]);
  const dateStr = useMemo(() => new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }), [resultData]);
  const refNum = useMemo(() => `#NS-${Math.floor(1000 + Math.random() * 9000)}`, [resultData]);

  const cls = resultData.predicted_class;
  const conf = resultData.confidence ? resultData.confidence.toFixed(1) : '0.0';

  const isNoTumor = cls === 'notumor';

  return (
    <div className="modal-overlay active">
      <div className="report-modal-content">
        <button className="modal-close-btn no-print" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Report Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--cyan-electric)', fontWeight: 800, fontFamily: 'Outfit' }}>
              <FileText size={22} />
              <span style={{ fontSize: '1.4rem' }}>NEUROSCAN AI CLINICAL REPORT</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Automated Deep Learning Intracranial Lesion Analysis & Localization
            </div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div>Patient ID: <strong style={{ color: 'var(--text-primary)' }}>{patientId}</strong></div>
            <div>Ref Code: <strong style={{ color: 'var(--cyan-bright)' }}>{refNum}</strong></div>
            <div>Timestamp: <span>{dateStr}</span></div>
          </div>
        </div>

        {/* Findings Summary Box */}
        <div style={{
          background: isNoTumor ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
          border: `1px solid ${isNoTumor ? '#10B981' : '#F43F5E'}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Primary Diagnostic Finding
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: isNoTumor ? '#10B981' : '#F43F5E', marginTop: '0.2rem' }}>
              {isNoTumor ? 'NO TUMOR DETECTED (HEALTHY)' : `${cls.toUpperCase()} TUMOR DETECTED`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Confidence Metric</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--cyan-electric)' }}>
                {conf}%
              </div>
            </div>
            <div style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              background: isNoTumor ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
              color: isNoTumor ? '#10B981' : '#F43F5E',
              border: `1px solid ${isNoTumor ? '#10B981' : '#F43F5E'}`
            }}>
              {isNoTumor ? 'LOW RISK - NORMAL SCREENING' : 'HIGH RISK - EVALUATION RECOMMENDED'}
            </div>
          </div>
        </div>

        {/* Scan Visual Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: '#03060D', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Original Input Scan
            </div>
            <img src={resultData.original_image} alt="Original Scan" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
          </div>

          <div style={{ background: '#03060D', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: 'var(--purple-accent)', marginBottom: '0.5rem' }}>
              Grad-CAM Heatmap Localization
            </div>
            <img src={resultData.gradcam_image} alt="GradCAM Heatmap" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Probability Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-cyber)', marginBottom: '0.75rem', fontFamily: 'Outfit' }}>
            CLASSIFICATION PROBABILITY MATRIX
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Class Description</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Probability</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Distribution</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {['glioma', 'meningioma', 'pituitary', 'notumor'].map((cName) => {
                const probVal = (resultData.probabilities[cName] || 0).toFixed(1);
                const isPrimary = cName === cls;
                const displayName = cName === 'notumor' ? 'Healthy (No Tumor)' : `${cName.charAt(0).toUpperCase() + cName.slice(1)} Tumor`;
                const statusText = isPrimary ? 'Primary Finding' : probVal > 10 ? 'Secondary Risk' : 'Low Probability';

                return (
                  <tr key={cName} style={{ borderBottom: '1px solid rgba(56, 189, 248, 0.08)' }}>
                    <td style={{ padding: '0.6rem 0.75rem', fontWeight: isPrimary ? 700 : 400, color: isPrimary ? 'var(--cyan-electric)' : 'var(--text-primary)' }}>
                      {displayName} {isPrimary && '✓'}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--cyan-bright)' }}>
                      {probVal}%
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', width: '35%' }}>
                      <div style={{ height: '8px', background: 'rgba(6, 11, 22, 0.8)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ height: '100%', width: `${probVal}%`, background: isPrimary ? 'var(--cyan-electric)' : 'var(--indigo-bright)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-secondary)' }}>
                      {statusText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            * This report is generated by NeuroScan AI Hybrid Deep Learning Architecture (CNN-ViT + RR-ELM).
          </div>

          <div className="no-print" style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => window.print()}
              style={{
                background: 'linear-gradient(135deg, var(--cyan-electric), var(--indigo-bright))',
                color: '#03060D',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Printer size={16} />
              <span>Print PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
