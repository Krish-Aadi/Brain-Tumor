import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Activity, ShieldCheck, UserCheck, Key, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Researcher');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email || 'researcher@university.edu', password, role);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    const demoEmail = demoRole.toLowerCase().replace(/\s+/g, '.') + '@neuroscan-research.edu';
    login(demoEmail, 'password123', demoRole);
    navigate('/dashboard');
  };

  return (
    <div className="login-page" style={{ padding: '4rem 0 6rem' }}>
      <div className="content-container" style={{ maxWidth: '480px' }}>
        <div className="card-panel" style={{ background: 'var(--bg-surface)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="brand-icon-wrapper" style={{ margin: '0 auto 1rem', width: '48px', height: '48px' }}>
              <Activity size={26} />
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Researcher Sign In</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Access the NeuroScan AI Diagnostic & Analysis Dashboard
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div style={{
            background: 'var(--bg-main)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
              ONE-CLICK DEMO ACCOUNTS:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Doctor / Radiologist')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Radiologist Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Researcher')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem' }}
              >
                Researcher Demo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Academic / Institutional Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="researcher@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Role Description
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Doctor / Radiologist">Doctor / Radiologist</option>
                <option value="Researcher">Medical Researcher</option>
                <option value="Student">Student / Academic</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={isLoading}>
              <LogIn size={16} />
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Footer link */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            New to the project?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
              Create a Researcher Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
