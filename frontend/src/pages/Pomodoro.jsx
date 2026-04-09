import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { timerAPI } from '../services/api';

export default function Pomodoro() {
  const { addToast } = useApp();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    try {
      const duration = mode === 'focus' ? 25 : mode === 'shortBreak' ? 5 : 15;
      await timerAPI.saveSession({ duration, mode });
      addToast(`${mode === 'focus' ? 'Focus' : 'Break'} session complete!`, 'success');
      
      // Auto-switch modes could be a nice touch here
      if (mode === 'focus') switchMode('shortBreak');
      else switchMode('focus');
    } catch (err) {
      addToast('Failed to save session', 'error');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    if (newMode === 'shortBreak') setTimeLeft(5 * 60);
    if (newMode === 'longBreak') setTimeLeft(15 * 60);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="pomodoro-container animate-fade">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: 'var(--surface-color)', padding: '6px', borderRadius: '30px', border: '1px solid var(--border-color)', width: 'fit-content', margin: '0 auto 32px' }}>
        <button onClick={() => switchMode('focus')} style={{ padding:'10px 24px', borderRadius:'24px', border:'none', background:mode==='focus'?'var(--primary)':'transparent', color:mode==='focus'?'#fff':'var(--text-secondary)', cursor:'pointer', fontWeight: 600 }}>Focus</button>
        <button onClick={() => switchMode('shortBreak')} style={{ padding:'10px 24px', borderRadius:'24px', border:'none', background:mode==='shortBreak'?'var(--success)':'transparent', color:mode==='shortBreak'?'#fff':'var(--text-secondary)', cursor:'pointer', fontWeight: 600 }}>Short Break</button>
        <button onClick={() => switchMode('longBreak')} style={{ padding:'10px 24px', borderRadius:'24px', border:'none', background:mode==='longBreak'?'var(--info)':'transparent', color:mode==='longBreak'?'#fff':'var(--text-secondary)', cursor:'pointer', fontWeight: 600 }}>Long Break</button>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', textAlign: 'center', padding: '60px 20px', margin: '0 auto', border: `2px solid ${mode === 'focus' ? 'var(--primary)' : mode === 'shortBreak' ? 'var(--success)' : 'var(--info)'}` }}>
        <div className="timer-display" style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '40px', letterSpacing: '-2px' }}>
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            className="btn btn-primary" 
            onClick={toggleTimer} 
            style={{ 
              width: '160px', 
              justifyContent: 'center', 
              boxShadow: isActive ? 'none' : '0 10px 20px -5px var(--primary-light)',
              transform: isActive ? 'scale(0.98)' : 'scale(1)',
              background: mode === 'focus' ? 'var(--primary)' : mode === 'shortBreak' ? 'var(--success)' : 'var(--info)'
            }}
          >
            {isActive ? (
              <><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20, marginRight: 8}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Pause</>
            ) : (
              <><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20, marginRight: 8}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Start</>
            )}
          </button>
          
          <button className="icon-btn" onClick={() => switchMode(mode)} style={{ width: 54, height: 54, background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 24, height: 24}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

