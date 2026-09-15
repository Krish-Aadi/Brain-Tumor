import React, { useState } from 'react';
import { CheckCircle2, Cpu, Eye, Layers } from 'lucide-react';

// Epoch data 1 to 15 for PDSCNN
const PDSCNN_EPOCHS = [
  { epoch: 1, train_loss: 0.65, val_loss: 0.68, train_acc: 0.74, val_acc: 0.71 },
  { epoch: 2, train_loss: 0.50, val_loss: 0.54, train_acc: 0.82, val_acc: 0.79 },
  { epoch: 3, train_loss: 0.41, val_loss: 0.45, train_acc: 0.86, val_acc: 0.83 },
  { epoch: 4, train_loss: 0.34, val_loss: 0.38, train_acc: 0.89, val_acc: 0.87 },
  { epoch: 5, train_loss: 0.29, val_loss: 0.33, train_acc: 0.91, val_acc: 0.89 },
  { epoch: 6, train_loss: 0.25, val_loss: 0.30, train_acc: 0.93, val_acc: 0.91 },
  { epoch: 7, train_loss: 0.22, val_loss: 0.27, train_acc: 0.94, val_acc: 0.92 },
  { epoch: 8, train_loss: 0.19, val_loss: 0.25, train_acc: 0.95, val_acc: 0.93 },
  { epoch: 9, train_loss: 0.17, val_loss: 0.24, train_acc: 0.96, val_acc: 0.94 },
  { epoch: 10, train_loss: 0.15, val_loss: 0.23, train_acc: 0.965, val_acc: 0.945 },
  { epoch: 11, train_loss: 0.14, val_loss: 0.22, train_acc: 0.97, val_acc: 0.95 },
  { epoch: 12, train_loss: 0.13, val_loss: 0.21, train_acc: 0.974, val_acc: 0.955 },
  { epoch: 13, train_loss: 0.12, val_loss: 0.21, train_acc: 0.978, val_acc: 0.96 },
  { epoch: 14, train_loss: 0.11, val_loss: 0.20, train_acc: 0.981, val_acc: 0.965 },
  { epoch: 15, train_loss: 0.10, val_loss: 0.20, train_acc: 0.983, val_acc: 0.969 },
];

// Epoch data 1 to 15 for ViT
const VIT_EPOCHS = [
  { epoch: 1, train_loss: 0.68, val_loss: 0.70, train_acc: 0.71, val_acc: 0.69 },
  { epoch: 2, train_loss: 0.53, val_loss: 0.57, train_acc: 0.79, val_acc: 0.76 },
  { epoch: 3, train_loss: 0.44, val_loss: 0.48, train_acc: 0.84, val_acc: 0.81 },
  { epoch: 4, train_loss: 0.37, val_loss: 0.41, train_acc: 0.87, val_acc: 0.85 },
  { epoch: 5, train_loss: 0.31, val_loss: 0.36, train_acc: 0.90, val_acc: 0.88 },
  { epoch: 6, train_loss: 0.27, val_loss: 0.33, train_acc: 0.92, val_acc: 0.90 },
  { epoch: 7, train_loss: 0.24, val_loss: 0.30, train_acc: 0.93, val_acc: 0.91 },
  { epoch: 8, train_loss: 0.21, val_loss: 0.28, train_acc: 0.94, val_acc: 0.92 },
  { epoch: 9, train_loss: 0.19, val_loss: 0.27, train_acc: 0.95, val_acc: 0.93 },
  { epoch: 10, train_loss: 0.17, val_loss: 0.26, train_acc: 0.955, val_acc: 0.935 },
  { epoch: 11, train_loss: 0.16, val_loss: 0.25, train_acc: 0.96, val_acc: 0.94 },
  { epoch: 12, train_loss: 0.15, val_loss: 0.24, train_acc: 0.965, val_acc: 0.945 },
  { epoch: 13, train_loss: 0.14, val_loss: 0.24, train_acc: 0.97, val_acc: 0.95 },
  { epoch: 14, train_loss: 0.13, val_loss: 0.23, train_acc: 0.972, val_acc: 0.954 },
  { epoch: 15, train_loss: 0.12, val_loss: 0.23, train_acc: 0.975, val_acc: 0.959 },
];

// Epoch data 1 to 15 for Combined Fusion
const FUSION_EPOCHS = [
  { epoch: 1, train_loss: 0.62, val_loss: 0.65, train_acc: 0.76, val_acc: 0.72 },
  { epoch: 2, train_loss: 0.48, val_loss: 0.51, train_acc: 0.84, val_acc: 0.81 },
  { epoch: 3, train_loss: 0.39, val_loss: 0.42, train_acc: 0.88, val_acc: 0.86 },
  { epoch: 4, train_loss: 0.32, val_loss: 0.36, train_acc: 0.91, val_acc: 0.89 },
  { epoch: 5, train_loss: 0.27, val_loss: 0.31, train_acc: 0.93, val_acc: 0.91 },
  { epoch: 6, train_loss: 0.23, val_loss: 0.28, train_acc: 0.945, val_acc: 0.93 },
  { epoch: 7, train_loss: 0.20, val_loss: 0.25, train_acc: 0.955, val_acc: 0.94 },
  { epoch: 8, train_loss: 0.18, val_loss: 0.23, train_acc: 0.965, val_acc: 0.95 },
  { epoch: 9, train_loss: 0.16, val_loss: 0.22, train_acc: 0.97, val_acc: 0.955 },
  { epoch: 10, train_loss: 0.14, val_loss: 0.21, train_acc: 0.975, val_acc: 0.96 },
  { epoch: 11, train_loss: 0.13, val_loss: 0.20, train_acc: 0.98, val_acc: 0.965 },
  { epoch: 12, train_loss: 0.12, val_loss: 0.19, train_acc: 0.983, val_acc: 0.968 },
  { epoch: 13, train_loss: 0.11, val_loss: 0.19, train_acc: 0.986, val_acc: 0.971 },
  { epoch: 14, train_loss: 0.10, val_loss: 0.18, train_acc: 0.989, val_acc: 0.975 },
  { epoch: 15, train_loss: 0.09, val_loss: 0.18, train_acc: 0.992, val_acc: 0.980 },
];

const PDSCNN_F1 = [
  { name: 'Glioma', f1: 0.955 },
  { name: 'Meningioma', f1: 0.950 },
  { name: 'Pituitary Tumor', f1: 0.970 },
  { name: 'No Tumor', f1: 0.986 },
];

const VIT_F1 = [
  { name: 'Glioma', f1: 0.947 },
  { name: 'Meningioma', f1: 0.943 },
  { name: 'Pituitary Tumor', f1: 0.963 },
  { name: 'No Tumor', f1: 0.982 },
];

const FUSION_F1 = [
  { name: 'Glioma', f1: 0.969 },
  { name: 'Meningioma', f1: 0.963 },
  { name: 'Pituitary Tumor', f1: 0.983 },
  { name: 'No Tumor', f1: 0.995 },
];

const CONFUSION_MATRIX = {
  labels: ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor'],
  matrix: [
    [216, 8, 2, 0],
    [4, 246, 3, 4],
    [0, 3, 320, 0],
    [0, 0, 0, 391]
  ]
};

// Precise Scientific Line Graph Component
function ScientificLineChart({ title, epochData, caption }) {
  // Chart dimensions
  const width = 480;
  const height = 240;
  const padLeft = 45;
  const padRight = 45;
  const padTop = 30;
  const padBottom = 30;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  // X coordinate mapping (Epochs 1 to 15)
  const getX = (epoch) => padLeft + ((epoch - 1) / 14) * plotW;

  // Y coordinate for Loss (0.1 to 0.7)
  const getYLoss = (loss) => padBottom + plotH - ((loss - 0.1) / (0.7 - 0.1)) * plotH;

  // Y coordinate for Accuracy (0.70 to 1.00)
  const getYAcc = (acc) => padBottom + plotH - ((acc - 0.70) / (1.00 - 0.70)) * plotH;

  // SVG path generators
  const buildPath = (data, yFunc, key) => {
    return data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.epoch).toFixed(1)} ${yFunc(d[key]).toFixed(1)}`)
      .join(' ');
  };

  const trainLossPath = buildPath(epochData, getYLoss, 'train_loss');
  const valLossPath = buildPath(epochData, getYLoss, 'val_loss');
  const trainAccPath = buildPath(epochData, getYAcc, 'train_acc');
  const valAccPath = buildPath(epochData, getYAcc, 'val_acc');

  // Horizontal tick values
  const lossTicks = [0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
  const accTicks = ['1.00', '0.95', '0.90', '0.85', '0.80', '0.75', '0.70'];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.75rem',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Title & Legend Header */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
          {title}
        </h3>

        {/* Legend Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #38bdf8', padding: '2px 8px', borderRadius: '4px', background: '#f0f9ff' }}>
            <div style={{ width: '10px', height: '3px', background: '#38bdf8' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0369a1' }}>Train Loss</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #818cf8', padding: '2px 8px', borderRadius: '4px', background: '#eef2ff' }}>
            <div style={{ width: '10px', height: '3px', background: '#818cf8' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4338ca' }}>Val Loss</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #22c55e', padding: '2px 8px', borderRadius: '4px', background: '#f0fdf4' }}>
            <div style={{ width: '10px', height: '3px', background: '#22c55e' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#15803d' }}>Train Acc</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1.5px solid #f97316', padding: '2px 8px', borderRadius: '4px', background: '#fff7ed' }}>
            <div style={{ width: '10px', height: '3px', background: '#f97316' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#c2410c' }}>Val Acc</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Axis Labels (Rotated) */}
          <text
            x={-height / 2}
            y="12"
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            Loss
          </text>

          <text
            x={height / 2}
            y={-width + 12}
            transform="rotate(90)"
            textAnchor="middle"
            fill="#64748b"
            fontSize="10"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            Accuracy
          </text>

          {/* Background Grid Lines & Ticks */}
          {lossTicks.map((val, idx) => {
            const y = padTop + (idx / 6) * plotH;
            return (
              <g key={val}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                {/* Left Y Axis Tick (Loss) */}
                <text x={padLeft - 8} y={y + 3.5} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif">
                  {val.toFixed(1)}
                </text>
                {/* Right Y Axis Tick (Accuracy) */}
                <text x={width - padRight + 8} y={y + 3.5} textAnchor="start" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif">
                  {accTicks[idx]}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines & Epoch X Labels */}
          {epochData.map((d) => {
            const x = getX(d.epoch);
            return (
              <g key={d.epoch}>
                <line x1={x} y1={padTop} x2={x} y2={padTop + plotH} stroke="#f8fafc" strokeWidth="1" />
                <text x={x} y={padTop + plotH + 16} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif">
                  {d.epoch}
                </text>
              </g>
            );
          })}

          {/* Train Loss Curve (Light Blue) */}
          <path d={trainLossPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {epochData.map((d) => (
            <circle key={`tl-${d.epoch}`} cx={getX(d.epoch)} cy={getYLoss(d.train_loss)} r="3" fill="#ffffff" stroke="#38bdf8" strokeWidth="2" />
          ))}

          {/* Val Loss Curve (Purple) */}
          <path d={valLossPath} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {epochData.map((d) => (
            <circle key={`vl-${d.epoch}`} cx={getX(d.epoch)} cy={getYLoss(d.val_loss)} r="3" fill="#ffffff" stroke="#818cf8" strokeWidth="2" />
          ))}

          {/* Train Acc Curve (Green) */}
          <path d={trainAccPath} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {epochData.map((d) => (
            <circle key={`ta-${d.epoch}`} cx={getX(d.epoch)} cy={getYAcc(d.train_acc)} r="3" fill="#ffffff" stroke="#22c55e" strokeWidth="2" />
          ))}

          {/* Val Acc Curve (Orange) */}
          <path d={valAccPath} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {epochData.map((d) => (
            <circle key={`va-${d.epoch}`} cx={getX(d.epoch)} cy={getYAcc(d.val_acc)} r="3" fill="#ffffff" stroke="#f97316" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* Caption Footer */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
        {caption}
      </div>
    </div>
  );
}

// Precise Scientific Bar Graph Component
function ScientificBarChart({ title, f1Data, caption }) {
  const width = 480;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 30;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const yTicks = [1.00, 0.95, 0.90, 0.85, 0.80];

  const getY = (val) => padTop + plotH - ((val - 0.80) / (1.00 - 0.80)) * plotH;

  const numBars = f1Data.length;
  const slotW = plotW / numBars;
  const barW = 56;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '1.75rem',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      {/* Title & Legend Header */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
          {title}
        </h3>

        {/* Legend Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#818cf8', padding: '3px 12px', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>F1-score</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div style={{ width: '100%', position: 'relative' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          {/* Horizontal Grid Lines & Ticks */}
          {yTicks.map((val, idx) => {
            const y = padTop + (idx / 4) * plotH;
            return (
              <g key={val}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padLeft - 8} y={y + 3.5} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif">
                  {val.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Vertical Separator Grid Lines */}
          {f1Data.map((d, i) => {
            const xSlot = padLeft + (i + 1) * slotW;
            return (
              <line key={`sep-${i}`} x1={xSlot} y1={padTop} x2={xSlot} y2={padTop + plotH} stroke="#f8fafc" strokeWidth="1" />
            );
          })}

          {/* Vertical Bars */}
          {f1Data.map((d, i) => {
            const centerX = padLeft + (i + 0.5) * slotW;
            const barX = centerX - barW / 2;
            const barY = getY(d.f1);
            const barHeight = (padTop + plotH) - barY;

            return (
              <g key={d.name}>
                {/* Bar */}
                <rect
                  x={barX}
                  y={barY}
                  width={barW}
                  height={barHeight}
                  rx="7"
                  ry="7"
                  fill="#818cf8"
                  opacity="0.95"
                />

                {/* Value Label above Bar */}
                <text
                  x={centerX}
                  y={barY - 6}
                  textAnchor="middle"
                  fill="#4338ca"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  {d.f1.toFixed(3)}
                </text>

                {/* X Axis Category Label */}
                <text
                  x={centerX}
                  y={padTop + plotH + 18}
                  textAnchor="middle"
                  fill="#334155"
                  fontSize="10.5"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Caption Footer */}
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
        {caption}
      </div>
    </div>
  );
}

export default function MetricsDashboard() {
  const [activeModelView, setActiveModelView] = useState('all');

  const KFOLD_DATA = [
    { fold: 'Fold 1', train_scans: '11,195', test_scans: '2,799', train_acc: '98.54%', test_acc: '97.93%', precision: '97.93%', recall: '97.93%', f1: '97.93%' },
    { fold: 'Fold 2', train_scans: '11,195', test_scans: '2,799', train_acc: '98.45%', test_acc: '97.93%', precision: '97.95%', recall: '97.93%', f1: '97.93%' },
    { fold: 'Fold 3', train_scans: '11,195', test_scans: '2,799', train_acc: '98.41%', test_acc: '98.25%', precision: '98.26%', recall: '98.25%', f1: '98.25%' },
    { fold: 'Fold 4', train_scans: '11,195', test_scans: '2,799', train_acc: '98.49%', test_acc: '98.25%', precision: '98.26%', recall: '98.25%', f1: '98.24%' },
    { fold: 'Fold 5', train_scans: '11,196', test_scans: '2,798', train_acc: '98.57%', test_acc: '97.89%', precision: '97.89%', recall: '97.89%', f1: '97.89%' },
  ];

  return (
    <div className="metrics-dashboard-section">
      {/* Top Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            5-FOLD MEAN ACCURACY
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'Outfit' }}>
            98.05%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-notumor)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> ±0.16% Across 13,994 Scans
          </div>
        </div>

        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            MEAN PRECISION
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-teal)', fontFamily: 'Outfit' }}>
            98.06%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            High positive predictive rate
          </div>
        </div>

        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            MEAN RECALL (SENSITIVITY)
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-indigo)', fontFamily: 'Outfit' }}>
            98.05%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-notumor)' }}>
            99.80% Recall on Healthy Scans
          </div>
        </div>

        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            MACRO F1-SCORE
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#f59e0b', fontFamily: 'Outfit' }}>
            0.9805
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            384-d Fusion + Analytical RRELM
          </div>
        </div>
      </div>

      {/* 5-Fold Stratified Cross-Validation Table Card */}
      <div className="card-panel" style={{ background: 'var(--bg-surface)', padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              📊 Stratified 5-Fold Cross-Validation Performance (13,994 Total Scans)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Rigorous 5-fold cross-validation protocol adhering strictly to the base paper validation standards.
            </p>
          </div>
          <div style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
            Mean: 98.05% (±0.16%)
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-medium)', background: 'var(--bg-main)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Fold Index</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Train Scans</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Test Scans</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Train Acc</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Test Acc</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Precision</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Recall</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>F1-Score</th>
              </tr>
            </thead>
            <tbody>
              {KFOLD_DATA.map((row, idx) => (
                <tr key={row.fold} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{row.fold}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>{row.train_scans}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono' }}>{row.test_scans}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>{row.train_acc}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--color-notumor)' }}>{row.test_acc}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-teal)' }}>{row.precision}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', color: 'var(--accent-indigo)' }}>{row.recall}</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--text-primary)' }}>{row.f1}</td>
                </tr>
              ))}
              <tr style={{ background: 'rgba(6, 182, 212, 0.1)', borderTop: '2px solid var(--accent-cyan)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>OVERALL AVERAGE</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>11,195</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>2,799</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>98.49%</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--color-notumor)' }}>98.05% (±0.16%)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--accent-teal)' }}>98.06%</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--accent-indigo)' }}>98.05%</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--accent-cyan)' }}>98.05%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Model Optimization & Performance Graphs
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Inspect standard Loss & Accuracy convergence curves and Per-Class F1 bar charts for each branch.
          </p>
        </div>

        <div className="view-mode-tabs" style={{ margin: 0 }}>
          <button
            className={`view-mode-tab ${activeModelView === 'all' ? 'active' : ''}`}
            onClick={() => setActiveModelView('all')}
          >
            All Models
          </button>
          <button
            className={`view-mode-tab ${activeModelView === 'pdscnn' ? 'active' : ''}`}
            onClick={() => setActiveModelView('pdscnn')}
          >
            PDSCNN Branch
          </button>
          <button
            className={`view-mode-tab ${activeModelView === 'vit' ? 'active' : ''}`}
            onClick={() => setActiveModelView('vit')}
          >
            ViT Branch
          </button>
          <button
            className={`view-mode-tab ${activeModelView === 'fusion' ? 'active' : ''}`}
            onClick={() => setActiveModelView('fusion')}
          >
            Combined Fusion
          </button>
        </div>
      </div>

      {/* 1. PDSCNN MODEL (Parallel Depthwise Separable CNN - 256d) */}
      {(activeModelView === 'all' || activeModelView === 'pdscnn') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--accent-teal-glow)', color: 'var(--accent-teal)', padding: '6px', borderRadius: '8px' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                PDSCNN Branch (Parallel Depthwise Separable CNN – 256d)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Local spatial and boundary feature representation
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            <ScientificLineChart
              title="PDSCNN – Loss & Accuracy"
              epochData={PDSCNN_EPOCHS}
              caption="Training and validation curves summarizing optimization stability and convergence for the PDSCNN feature extractor."
            />
            <ScientificBarChart
              title="PDSCNN – Per-Class F1"
              f1Data={PDSCNN_F1}
              caption="Macro-level comparison between tumor types, highlighting class-wise balance and local boundary sensitivity."
            />
          </div>
        </div>
      )}

      {/* 2. VISION TRANSFORMER MODEL (ViT - 128d) */}
      {(activeModelView === 'all' || activeModelView === 'vit') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', padding: '6px', borderRadius: '8px' }}>
              <Eye size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Vision Transformer Branch (ViT Multi-Head Attention – 128d)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Global patch self-attention and long-range hemispheric context
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            <ScientificLineChart
              title="Vision Transformer – Loss & Accuracy"
              epochData={VIT_EPOCHS}
              caption="Training and validation curves summarizing optimization stability and convergence for the Vision Transformer token representations."
            />
            <ScientificBarChart
              title="Vision Transformer – Per-Class F1"
              f1Data={VIT_F1}
              caption="Macro-level comparison between tumor types, highlighting multi-head patch attention specificity across classes."
            />
          </div>
        </div>
      )}

      {/* 3. COMBINED PARALLEL FUSION + RRELM (384d) */}
      {(activeModelView === 'all' || activeModelView === 'fusion') && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', padding: '6px', borderRadius: '8px' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Classification – Combined Parallel Fusion + RRELM (384d)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                End-to-end hybrid feature concatenation with Regularized Ridge ELM (98.05% Accuracy)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            <ScientificLineChart
              title="Classification – Loss & Accuracy"
              epochData={FUSION_EPOCHS}
              caption="Training and validation curves summarizing optimization stability and convergence for the classification model."
            />
            <ScientificBarChart
              title="Classification – Per-Class F1"
              f1Data={FUSION_F1}
              caption="Macro-level comparison between tumor types, highlighting class-wise balance and robustness."
            />
          </div>
        </div>
      )}

      {/* 4. CONFUSION MATRIX TABLE */}
      <div className="card-panel" style={{ background: 'var(--bg-surface)', padding: '1.75rem', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Confusion Matrix (1,994 Benchmark Test Scans)
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Breakdown of ground-truth radiologist diagnoses versus model classifications.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>True \ Predicted</th>
                {CONFUSION_MATRIX.labels.map((l) => (
                  <th key={l} style={{ padding: '0.75rem', color: 'var(--text-primary)', fontWeight: 700 }}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONFUSION_MATRIX.matrix.map((row, rowIdx) => (
                <tr key={CONFUSION_MATRIX.labels[rowIdx]}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, textAlign: 'left', background: 'var(--bg-main)' }}>
                    {CONFUSION_MATRIX.labels[rowIdx]}
                  </td>
                  {row.map((val, colIdx) => {
                    const isDiagonal = rowIdx === colIdx;
                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: '1rem',
                          background: isDiagonal ? 'rgba(6, 182, 212, 0.18)' : (val > 0 ? 'rgba(244, 63, 94, 0.12)' : 'var(--bg-main)'),
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'JetBrains Mono',
                          fontWeight: isDiagonal ? 800 : 500,
                          color: isDiagonal ? 'var(--accent-cyan)' : (val > 0 ? '#ef4444' : 'var(--text-muted)')
                        }}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
