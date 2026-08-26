import React, { useState } from 'react';
import { User, Mail, Building, Calendar, ShieldCheck, Activity, Brain, History, Edit3, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Dr. Researcher');
  const [institution, setInstitution] = useState(user?.institution || 'NeuroImaging Research Center');

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, institution });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Researcher Identity</div>
          <h1 className="section-title">Researcher Profile & Academic Credentials</h1>
          <p className="section-subtitle">
            Manage your research affiliation, role accreditation, and review diagnostic session statistics.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0, maxWidth: '800px' }}>
        <div className="card-panel" style={{ background: 'var(--bg-surface)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800
              }}>
                {user?.name?.charAt(0) || 'R'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{user?.name || 'Research Scholar'}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="badge badge-glioma" style={{ background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', borderColor: 'var(--border-medium)' }}>
                    {user?.role || 'Medical Researcher'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {user?.institution || 'NeuroScan Research Lab'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm"
            >
              <Edit3 size={15} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Institution / Hospital</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <CheckCircle2 size={16} />
                <span>Save Profile Changes</span>
              </button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.email || 'researcher@university.edu'}</div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>PRIMARY AFFILIATION</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.institution || 'NeuroImaging Research Center'}</div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ACCOUNT ROLE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>{user?.role || 'Researcher'}</div>
              </div>

              <div style={{ background: 'var(--bg-main)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>JOINED RESEARCH PROGRAM</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{user?.joinedDate || '2026-01-15'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Launch Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <Link to="/analyze" className="card-panel" style={{ background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan-glow)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Launch MRI Studio</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Execute parallel CNN-ViT inference</div>
            </div>
          </Link>

          <Link to="/history" className="card-panel" style={{ background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Scan History Audit</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review past session classifications</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
