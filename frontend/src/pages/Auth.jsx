import { useState } from 'react';
import { useApp } from '../App';
import { authAPI } from '../services/api';

export default function Auth() {
  const { addToast, setPage } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = isLogin 
        ? await authAPI.login({ email: formData.email, password: formData.password }) 
        : await authAPI.signup(formData);
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        addToast(isLogin ? 'Welcome back!' : 'Account created!', 'success');
        window.location.reload(); // Refresh to trigger App.jsx re-fetch with new token
      }
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--text-main)' }}>
          {isLogin ? 'StudyFlow' : 'Join StudyFlow'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {isLogin ? 'Sign in to access your planner' : 'Start your productivity journey today'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="glass-input"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="glass-input"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="glass-input"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '12px', padding: '14px' }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent)', 
              fontWeight: 600, 
              cursor: 'pointer',
              padding: 0
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
