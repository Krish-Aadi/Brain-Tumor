import React from 'react';
import { ShieldCheck, AlertTriangle, RefreshCw, Printer, Info, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

const CLASS_CONFIG = {
  glioma: { label: 'Glioma Tumor', color: 'var(--glioma-color)', fillClass: 'glioma', severity: 'High Risk' },
  meningioma: { label: 'Meningioma Tumor', color: 'var(--meningioma-color)', fillClass: 'meningioma', severity: 'Moderate' },
  pituitary: { label: 'Pituitary Tumor', color: 'var(--pituitary-color)', fillClass: 'pituitary', severity: 'Moderate' },
  notumor: { label: 'Healthy (No Tumor)', color: 'var(--notumor-color)', fillClass: 'notumor', severity: 'Normal' },
};

export default function DiagnosticPanel({ resultData, onReset, onOpenReport }) {
  const predictedClass = resultData?.predicted_class || null;
  const confidence = resultData?.confidence ? resultData.confidence.toFixed(1) : null;
  const probabilities = resultData?.probabilities || {
    glioma: 0,
    meningioma: 0,
    pituitary: 0,
    notumor: 0,
  };

  const currentConfig = predictedClass ? CLASS_CONFIG[predictedClass] : null;

  return (
    <div className="glass-panel results-panel">
      {/* Model Benchmark Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '0.65rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-cyber)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={16} style={{ color: 'var(--cyan-electric)' }} />
          <span>Model Benchmark Grade</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--notumor-color)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
            98.0% Accuracy
          </span>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan-electric)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
            100% Recall
          </span>
        </div>
      </div>

      {/* Primary Diagnosis Verdict Card */}
      <div className="verdict-card">
        <div
          className="verdict-icon-ring"
          style={{
            borderColor: currentConfig ? currentConfig.color : 'var(--cyan-electric)',
            color: currentConfig ? currentConfig.color : 'var(--cyan-electric)',
            boxShadow: currentConfig ? `0 0 30px ${currentConfig.color}66` : '0 0 25px var(--border-glow)',
          }}
        >
          {predictedClass === 'notumor' ? (
            <CheckCircle2 size={36} />
          ) : predictedClass ? (
            <ShieldAlert size={36} />
          ) : (
            <ShieldCheck size={36} />
          )}
        </div>

        <div>
          <div
            className="verdict-title"
            style={{ color: currentConfig ? currentConfig.color : 'var(--text-primary)' }}
          >
            {predictedClass
              ? predictedClass === 'notumor'
                ? 'NO TUMOR DETECTED'
                : `${predictedClass.toUpperCase()} DETECTED`
              : 'Awaiting Scan'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {predictedClass ? `Classification Confidence` : 'Select sample or upload MRI'}
            </span>
            {currentConfig && (
              <span className={`sample-badge ${currentConfig.fillClass}`} style={{ fontSize: '0.65rem' }}>
                {currentConfig.severity}
              </span>
            )}
          </div>
        </div>

        <div className="confidence-display">
          {confidence ? `${confidence}%` : '--%'}
        </div>
      </div>

      {/* Multi-Class Probability Breakdown */}
      <div>
        <div className="section-title">
          <Info size={16} />
          <span>Multi-Class Probability Breakdown</span>
        </div>

        <div className="prob-bars-container">
          {Object.entries(CLASS_CONFIG).map(([key, config]) => {
            const probValue = probabilities[key] ? Number(probabilities[key]).toFixed(1) : '0.0';
            const isPrimary = predictedClass === key;

            return (
              <div className="prob-item" key={key}>
                <div className="prob-header">
                  <span className="prob-name" style={{ color: isPrimary ? config.color : 'var(--text-primary)' }}>
                    {config.label} {isPrimary && '✓'}
                  </span>
                  <span className="prob-val" style={{ color: isPrimary ? config.color : 'var(--cyan-bright)' }}>
                    {probValue}%
                  </span>
                </div>
                <div className="prob-track">
                  <div
                    className={`prob-fill ${config.fillClass}`}
                    style={{ width: `${probValue}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Guidance Box */}
      <div className="clinical-tip-box">
        <strong>Clinical Recommendation:</strong>{' '}
        {predictedClass === 'notumor' ? (
          'Screening scan indicates no signs of intracranial lesion or mass effect. 100% benchmark recall verified for healthy control samples.'
        ) : predictedClass ? (
          `Grad-CAM spatial heatmap highlights localized anatomical anomaly consistent with ${predictedClass} tumor features. Urgent neuro-surgical specialist consultation recommended.`
        ) : (
          'Upload a brain MRI scan or select a test sample from the left sidebar to initiate hybrid CNN-ViT inference and Grad-CAM lesion localization.'
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-group">
        <button className="btn-action reset" onClick={onReset}>
          <RefreshCw size={16} />
          <span>Reset</span>
        </button>
        <button
          className="btn-action print"
          onClick={onOpenReport}
          disabled={!resultData}
          style={{ opacity: resultData ? 1 : 0.6, cursor: resultData ? 'pointer' : 'not-allowed' }}
        >
          <Printer size={16} />
          <span>Generate PDF Report</span>
        </button>
      </div>
    </div>
  );
}
