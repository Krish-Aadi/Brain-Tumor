import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  History,
  BookOpen,
  Settings,
  PlusCircle,
  Activity,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers
} from 'lucide-react';
import apiService from '../services/api';

export default function Dashboard() {
  const user = { name: 'Researcher', role: 'AI Neuro-Imaging Scholar', institution: 'NeuroScan Research' };
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const hist = await apiService.getPredictionHistory();
      setHistory(hist);
      const st = await apiService.getStats();
      setStats(st);
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar">
        <div>
          {/* User info mini widget */}
          <div style={{
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name || 'Dr. Researcher'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              {user?.role || 'Research Scholar'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {user?.institution || 'Medical University AI Center'}
            </div>
          </div>

          <nav>
            <ul className="sidebar-nav-list">
              <li>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                  style={{ width: '100%' }}
                >
                  <LayoutDashboard size={18} />
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <Link to="/analyze" className="sidebar-nav-item">
                  <Brain size={18} />
                  <span>Analyze MRI</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className="sidebar-nav-item">
                  <History size={18} />
                  <span>Scan History</span>
                </Link>
              </li>
              <li>
                <Link to="/research" className="sidebar-nav-item">
                  <BookOpen size={18} />
                  <span>Research & Data</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                  style={{ width: '100%' }}
                >
                  <Settings size={18} />
                  <span>Model Settings</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          NeuroScan AI Platform
          <br />
          <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>v3.2 Hybrid</span>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-content">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Research Console Overview</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Parallel CNN–ViT and Regularized ELM Diagnostic Workbench
            </p>
          </div>

          <Link to="/analyze" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>New MRI Analysis</span>
          </Link>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PIPELINE ARCHITECTURE</span>
                  <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>PDSCNN + ViT</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  256d Local + 128d Global (384d Fused)
                </div>
              </div>

              <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>INPUT CONFIGURATION</span>
                  <Activity size={18} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>124 × 124</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  CLAHE Enhanced RGB Tensors
                </div>
              </div>

              <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CLASSIFIER ENGINE</span>
                  <Layers size={18} style={{ color: '#f59e0b' }} />
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>RRELM (C=0.1)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  4096 Hidden Projection Neurons
                </div>
              </div>

              <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL SCANS LOGGED</span>
                  <FileCheck size={18} style={{ color: 'var(--color-notumor)' }} />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{history.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Saved in local research session
                </div>
              </div>
            </div>

            {/* Quick Action & Recent Scans */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              {/* Recent Scan History Feed */}
              <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>Recent Diagnostic Runs</h3>
                  <Link to="/history" style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {history.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.filename}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge badge-${item.predicted_class?.toLowerCase()}`}>
                          {item.predicted_class}
                        </span>
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', fontWeight: 700 }}>
                          {item.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch Panel */}
              <div className="card-panel" style={{ background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Analyze New Scan</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Upload a raw cranial MRI or test preset clinical benchmark instances to generate Grad-CAM and ViT attention maps.
                  </p>

                  <div style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      Diagnostic Classes Supported:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <span className="badge badge-glioma">Glioma</span>
                      <span className="badge badge-meningioma">Meningioma</span>
                      <span className="badge badge-pituitary">Pituitary</span>
                      <span className="badge badge-notumor">Healthy Control</span>
                    </div>
                  </div>
                </div>

                <Link to="/analyze" className="btn btn-primary" style={{ width: '100%' }}>
                  <Brain size={16} />
                  <span>Open Analysis Studio</span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Settings Tab */
          <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Model Hyperparameter Settings</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Input Resolution
                </label>
                <input type="text" value="124 × 124 (Standard RGB)" disabled style={{ width: '100%', opacity: 0.8 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  RRELM Hidden Neurons
                </label>
                <input type="text" value="4096 Hidden Projection Neurons" disabled style={{ width: '100%', opacity: 0.8 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Ridge Regularization Coefficient (C)
                </label>
                <input type="text" value="0.1 (L2 Tikhonov Regularization)" disabled style={{ width: '100%', opacity: 0.8 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  CLAHE Tile Grid Dimensions
                </label>
                <input type="text" value="8 × 8 Grid (clipLimit = 2.0)" disabled style={{ width: '100%', opacity: 0.8 }} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
