import React from 'react';
import { Database, ShieldCheck, AlertTriangle, GitCompare, FileCheck, Layers, ArrowDown, Info } from 'lucide-react';

const PIPELINE_STAGES = [
  { step: '01', title: 'Data Collection', desc: 'Sourcing publicly available Kaggle & Figshare brain MRI repositories.' },
  { step: '02', title: 'Dataset Verification', desc: 'Validating slice formats, channel depths, and DICOM metadata consistency.' },
  { step: '03', title: 'Duplicate Detection', desc: 'Hashing and perceptual comparison to eliminate duplicate scans across splits.' },
  { step: '04', title: 'Label Harmonization', desc: 'Aligning multi-source terminology into 4 standard categories.' },
  { step: '05', title: 'CLAHE Preprocessing', desc: 'Standardizing intensity histograms and resizing scans to 224 × 224 resolution.' },
  { step: '06', title: 'Patient-Wise Splitting', desc: 'Isolating distinct patient IDs across train/validation/test to prevent data leakage.' },
  { step: '07', title: 'Ablation & Evaluation', desc: 'Benchmarking performance via precision, recall, F1, and confusion matrices.' },
];

export default function Research() {
  return (
    <div className="research-page">
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Academic Research & Benchmarking</div>
          <h1 className="section-title">Dataset Strategy, Curation & Ablation Studies</h1>
          <p className="section-subtitle">
            Scientific methodology for dataset harmonization, duplicate verification, patient-wise partitioning to prevent data leakage, and rigorous ablation evaluation.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Dataset Curation & Integrity Section */}
        <section className="card-panel" style={{ background: 'var(--bg-surface)', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>DATASET CURATION & VERIFICATION</div>
              <h2 style={{ fontSize: '1.6rem' }}>Multi-Center Benchmark Datasets</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The research investigates brain MRI classification across four established clinical categories: <strong>Glioma</strong>, <strong>Meningioma</strong>, <strong>Pituitary Tumor</strong>, and <strong>No Tumor (Healthy Control)</strong>. Primary evaluation is conducted using the publicly available <em>Kaggle Brain Tumor MRI Dataset</em>, with additional multi-center exploration incorporating the <em>Figshare Brain Tumor Dataset</em>.
          </p>

          {/* Warning on Data Merging & Duplicate Scans */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.4rem' }}>
              <AlertTriangle size={18} />
              <span>Critical Methodological Principle: Rigorous Duplicate Detection</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Merging open-access medical imaging repositories without rigorous verification introduces widespread duplicate scans and overlapping patient slices. NeuroScan AI applies automated MD5 hashing and structural similarity index (SSIM) checks to detect duplicate instances before any dataset merging occurs.
            </p>
          </div>

          {/* Visual Curation Flow */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Dataset Pre-processing & Split Protocol</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.85rem',
            marginBottom: '2rem'
          }}>
            {PIPELINE_STAGES.map((stg) => (
              <div key={stg.step} style={{
                background: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  STAGE {stg.step}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{stg.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{stg.desc}</div>
              </div>
            ))}
          </div>

          {/* Patient-Wise Splitting Rationale */}
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-teal)' }}>
              Importance of Patient-Wise Splitting
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Random slice-level splitting can allocate adjacent MRI slices from the same individual patient into both the training and test partitions, artificially inflating test scores due to <em>data leakage</em>. Wherever patient identifiers or volumetric sequence tags are present, partition boundaries are assigned strictly on a <strong>patient-by-patient</strong> basis.
            </p>
          </div>
        </section>

        {/* Section: Evaluation Metrics Framework */}
        <section id="metrics" className="card-panel" style={{ background: 'var(--bg-surface)', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--color-notumor)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-notumor)', fontWeight: 700 }}>PERFORMANCE VALIDATION</div>
              <h2 style={{ fontSize: '1.6rem' }}>Evaluation Metrics & Framework</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            To ensure balanced multi-class diagnostic rigor, the model architecture is assessed using five standardized clinical classification metrics:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>1. ACCURACY</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Overall proportion of correct classifications across all 4 categories.
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 700 }}>2. PRECISION</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Positive predictive value minimizing false positive misclassifications.
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 700 }}>3. RECALL (SENSITIVITY)</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                True positive rate critical for ensuring no pathological tumor is missed.
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>4. F1-SCORE (MACRO)</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Harmonic mean of precision and recall accounting for class support balance.
              </div>
            </div>
          </div>
        </section>

        {/* Section: Model Ablation Study Comparison */}
        <section id="ablation" className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--accent-indigo)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <GitCompare size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-indigo)', fontWeight: 700 }}>ARCHITECTURAL CONTRIBUTION</div>
              <h2 style={{ fontSize: '1.6rem' }}>Model Component Ablation Study</h2>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Ablation experiments isolate the quantitative contributions of each sub-network: standalone local PDSCNN convolutions, standalone global Vision Transformer attention, intermediate concatenation fusion, and analytical RRELM classification.
          </p>

          {/* Ablation Comparison Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-medium)', background: 'var(--bg-main)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Configuration Model</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Local Features</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Global Context</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Classifier Engine</th>
                  <th style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Primary Strength</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>1. PDSCNN Only</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)' }}>✓ 256-d</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '0.85rem 1rem' }}>Dense Softmax</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Fast boundary texture extraction</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>2. ViT Only</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)' }}>✓ 128-d (8 Heads)</td>
                  <td style={{ padding: '0.85rem 1rem' }}>Dense Softmax</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Long-range contextual relations</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>3. PDSCNN + ViT</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)' }}>✓ 256-d</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)' }}>✓ 128-d</td>
                  <td style={{ padding: '0.85rem 1rem' }}>Backprop MLP</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Joint spatial & attention representation</td>
                </tr>
                <tr style={{ background: 'var(--accent-cyan-glow)', borderBottom: '1px solid var(--border-medium)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    4. Proposed: PDSCNN + ViT + RRELM
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)', fontWeight: 700 }}>✓ 256-d</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-notumor)', fontWeight: 700 }}>✓ 128-d</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>RRELM (C=0.1)</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Dual local/global representation with analytical L2 regularized decision boundary
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Info size={14} />
            <span>Benchmark evaluation framework designed for university peer-review and multi-center clinical validation experiments.</span>
          </div>
        </section>
      </div>
    </div>
  );
}
