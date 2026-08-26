import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-medium)',
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        transition: 'all var(--transition-fast)',
      }}
    >
      {theme === 'dark' ? (
        <Sun size={18} style={{ color: '#f59e0b' }} />
      ) : (
        <Moon size={18} style={{ color: 'var(--accent-indigo)' }} />
      )}
    </button>
  );
}
