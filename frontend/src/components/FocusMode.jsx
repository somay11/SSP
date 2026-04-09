import { useApp } from '../App';

export default function FocusMode() {
  const { setFocusMode, quote } = useApp();

  return (
    <div className="focus-overlay">
      <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '20px', background: 'linear-gradient(135deg, var(--primary), #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Focus Time
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', textAlign: 'center', marginBottom: '40px' }}>
        "{quote.text}"<br/>
        <strong style={{ opacity: 0.7 }}>— {quote.author}</strong>
      </p>
      <button 
        className="btn btn-primary" 
        onClick={() => setFocusMode(false)}
        style={{ padding: '15px 40px', fontSize: '1.1rem', borderRadius: '30px' }}
      >
        Exit Deep Work
      </button>
    </div>
  );
}
