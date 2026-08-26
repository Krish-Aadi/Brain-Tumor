import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Filter, Eye, ArrowUpDown, Trash2, ShieldAlert } from 'lucide-react';
import apiService from '../services/api';
import { Link } from 'react-router-dom';

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      const data = await apiService.getPredictionHistory();
      setHistoryItems(data);
    }
    fetchHistory();
  }, []);

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = item.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.predicted_class?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.predicted_class?.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear the local session scan history?')) {
      localStorage.removeItem('neuroscan_history');
      setHistoryItems([]);
    }
  };

  return (
    <div className="history-page">
      <div className="page-header-banner">
        <div className="content-container">
          <div className="section-tag">Audit & Record Log</div>
          <h1 className="section-title">Diagnostic Analysis History</h1>
          <p className="section-subtitle">
            Chronological audit trail of all processed brain MRI scans, confidence scores, and architectural parameters.
          </p>
        </div>
      </div>

      <div className="content-container page-section" style={{ paddingTop: 0 }}>
        {/* Controls Row: Search & Class Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: '280px', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by filename or tumor class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'glioma', 'meningioma', 'pituitary', 'notumor'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  border: selectedFilter === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-medium)',
                  background: selectedFilter === cat ? 'var(--accent-cyan-glow)' : 'var(--bg-card)',
                  color: selectedFilter === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                }}
              >
                {cat === 'notumor' ? 'Healthy' : cat}
              </button>
            ))}

            {historyItems.length > 0 && (
              <button onClick={clearHistory} className="btn btn-outline-danger btn-sm" title="Clear all local history">
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* History Table */}
        <div className="card-panel" style={{ background: 'var(--bg-surface)', padding: '0', overflow: 'hidden' }}>
          {filteredItems.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-medium)' }}>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>TIMESTAMP</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>SCAN FILENAME</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>PREDICTED CLASS</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>CONFIDENCE</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>RESOLUTION</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {item.date}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                        {item.filename}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge badge-${item.predicted_class?.toLowerCase()}`}>
                          {item.predicted_class}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                        {item.confidence}%
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {item.resolution || '224 × 224'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <Link to="/analyze" className="btn btn-secondary btn-sm">
                          <Eye size={14} />
                          <span>View Studio</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              No scan history records match your search or filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
