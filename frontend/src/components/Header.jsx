import React from 'react';
import { Activity, Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="glass-panel">
      <div className="brand-section">
        <div className="brand-icon-box">
          <Activity className="animate-pulse" />
        </div>
        <div className="brand-text">
          <h1>
            NEUROSCAN AI
            <span className="tag">v3.2-HYBRID</span>
          </h1>
          <p>Cyber-Radiology Diagnostic Console | Deep Learning MRI Analysis</p>
        </div>
      </div>

      <div className="header-meta">
        <div className="meta-badge accuracy-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', color: 'var(--notumor-color)' }}>
          <ShieldCheck size={14} />
          <span>ACCURACY: <strong>98.00%</strong></span>
        </div>
        <div className="meta-badge" style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--cyan-electric)' }}>
          <Zap size={14} />
          <span>RECALL: <strong>100% HEALTHY</strong></span>
        </div>
        <div className="meta-badge">
          <Cpu size={14} style={{ color: 'var(--indigo-bright)' }} />
          <span>ARCH: <strong>CNN-ViT + RRELM</strong></span>
        </div>
        <div className="meta-badge">
          <div className="status-dot"></div>
          <span style={{ color: 'var(--notumor-color)', fontWeight: 600 }}>SYSTEM READY</span>
        </div>
      </div>
    </header>
  );
}


