import { useState } from 'react';
import { useApp } from '../App';

export default function CalendarPage() {
  const { tasks } = useApp();
  const [currDate, setCurrDate] = useState(new Date());

  const year = currDate.getFullYear();
  const month = currDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => setCurrDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrDate(new Date(year, month + 1, 1));

  const days = [];
  // Fill empty slots for start of month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Current date for highlighting
  const today = new Date();
  const isToday = (d) => today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;

  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.deadline?.startsWith(dStr));
    
    days.push(
      <div key={d} className={`calendar-day ${isToday(d) ? 'today' : ''}`}>
        <span className="day-num">{d}</span>
        <div className="day-tasks">
          {dayTasks.map((t, idx) => (
            <div key={t._id || idx} className={`task-dot ${t.priority.toLowerCase()}`} title={t.title || t.name}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page animate-fade">
      <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{monthNames[month]} {year}</h2>
        <div className="calendar-nav" style={{ display: 'flex', gap: '12px' }}>
          <button className="icon-btn glass-card" onClick={prevMonth} style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="icon-btn glass-card" onClick={nextMonth} style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 20, height: 20}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="calendar-weekday" style={{ color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', marginBottom: '12px' }}>{d}</div>
          ))}
          {days}
        </div>
      </div>

      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .calendar-day {
          aspect-ratio: 1;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s;
        }
        .calendar-day:not(.empty):hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .calendar-day.today {
          border-color: var(--primary);
          background: rgba(124, 106, 255, 0.05);
        }
        .calendar-day.today .day-num {
          background: var(--primary);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .day-num {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .day-tasks {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          overflow: hidden;
        }
        .task-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .task-dot.high { background: var(--danger); }
        .task-dot.medium { background: var(--warning); }
        .task-dot.low { background: var(--success); }
        .empty {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
