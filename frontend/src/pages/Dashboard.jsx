import { useEffect, useState } from 'react';
import { useApp } from '../App';
import { tasksAPI } from '../services/api';

export default function Dashboard() {
  const { user, tasks, aiSuggestions } = useApp();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, progress: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: res } = await tasksAPI.getSummary();
        if (res.success) setStats(res.data);
      } catch (err) { console.error('Stats fetch error:', err); }
    };
    fetchStats();
  }, [tasks]); // Re-fetch stats when tasks change

  return (
    <div className="dashboard-content animate-fade">
      <h2 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '24px' }}>
        Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0]}</span>! 👋
      </h2>
      
      <div className="dashboard-grid">
        {/* Progress Card */}
        <div className="glass-card">
          <div className="widget-header">
            <span>Overall Progress</span>
            <span style={{color: 'var(--primary)', fontWeight: 600}}>LIVE</span>
          </div>
          <div className="progress-ring" style={{"--progress": stats.progress}}>
            <p>{stats.progress}%</p>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px', color: 'var(--text-secondary)'}}>
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: 'var(--text-primary)', fontSize: '1.2rem'}}>{stats.completed}</h4>
              <small>Completed</small>
            </div>
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: 'var(--text-primary)', fontSize: '1.2rem'}}>{stats.pending}</h4>
              <small>Pending</small>
            </div>
          </div>
        </div>

        {/* AI Suggestions Card */}
        <div className="glass-card">
          <div className="widget-header">
            <span>Smart Recommendations</span>
            <span style={{color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem'}}>AI</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {aiSuggestions.length > 0 ? aiSuggestions.map((suggestion, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: '#8b5cf6', marginTop: '2px' }}>✦</span>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4, fontSize: '0.95rem' }}>{suggestion}</span>
              </li>
            )) : <li style={{ color: 'var(--text-muted)' }}>Analyzing your schedule...</li>}
          </ul>
        </div>

        {/* Quick Tasks Summary Card */}
        <div className="glass-card">
          <div className="widget-header">
            <span>Critical Deadlines</span>
            <span style={{color: 'var(--danger)', fontSize: '0.9rem', cursor: 'pointer'}} onClick={() => window.dispatchEvent(new CustomEvent('nav', {detail: 'tasks'}))}>View all</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {tasks.filter(t => !t.completed).sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3).map(task => (
                <div key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)', boxShadow: `0 0 8px ${task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}` }}></div>
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: 500 }}>{task.title || task.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(task.deadline).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                </div>
             ))}
             {tasks.filter(t => !t.completed).length === 0 && (
               <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                 <p style={{fontSize: '1.2rem', marginBottom: '8px'}}>🎯</p>
                 <p>All tasks completed for now!</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

