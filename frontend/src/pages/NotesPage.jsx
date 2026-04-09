import { useState } from 'react';
import { useApp } from '../App';

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, COLORS } = useApp();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addNote({ title: newTitle, body: '' });
    setNewTitle('');
  };

  return (
    <div className="notes-page">
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px' }}>Study Notes</h2>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="New sticky note..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '120px', justifyContent: 'center' }}>Create</button>
      </form>

      <div className="notes-grid">
        {notes.map(note => (
          <div key={note.id} className="glass-card note-card" style={{ borderTop: `4px solid ${COLORS[note.color]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <input 
                type="text" 
                value={note.title} 
                onChange={e => updateNote(note.id, { title: e.target.value })}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', outline: 'none', width: '80%' }}
              />
              <button className="icon-btn" onClick={() => deleteNote(note.id)} style={{ width: 28, height: 28, border: 'none' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: 16, height: 16, color: 'var(--danger)'}}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <textarea 
              value={note.body}
              onChange={e => updateNote(note.id, { body: e.target.value })}
              placeholder="Start typing..."
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '12px' }}>
              {note.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
