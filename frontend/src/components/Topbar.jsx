import { useState } from 'react';
import { useApp } from '../App';

export default function Topbar() {
  const { darkMode, setDarkMode, quote, streak, setFocusMode, logout, user } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-quote">
        "{quote.text}" — <strong style={{color: 'var(--primary)'}}>{quote.author}</strong>
      </div>
      
      <div className="topbar-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold' }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 18, height: 18}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          {streak} Day Streak
        </div>
        
        <button className="icon-btn" onClick={() => setFocusMode(true)} title="Focus Mode">
           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
          {darkMode ? (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #c084fc)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'}}
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {showUserMenu && (
            <div className="glass-card" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', minWidth: '160px', zIndex: 100, padding: '8px' }}>
              <div style={{ padding: '8px 12px', wordBreak: 'break-all' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
              <button 
                onClick={logout}
                style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 16, height: 16}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

