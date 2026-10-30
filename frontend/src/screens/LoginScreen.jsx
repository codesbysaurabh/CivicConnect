import { useState } from 'react';

export function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/${mode}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Could not authenticate. Please try again.');
      localStorage.setItem('civicconnect_token', result.token);
      onLogin(result.user);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Could not reach the server. Check that the backend is running.'
          : err.message
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="brand-mark">
        <div className="brand-pin"></div>
        <span className="brand-name">CIVICCONNECT</span>
      </div>
      <h1 style={{ color: 'white', fontSize: 26 }}>Report civic issues in your city</h1>
      <p className="muted" style={{ color: '#9FB3C8', marginBottom: '2rem' }}>
        {mode === 'login'
          ? 'Sign in with your email and password.'
          : 'Create an account to get started.'}
      </p>
      <form onSubmit={submit}>
        <label className="field-label" htmlFor="auth-email" style={{ color: '#C7D2DC' }}>
          Email
        </label>
        <input
          className="field-input"
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid #3A4E76',
            color: 'white',
            marginBottom: '1rem',
          }}
        />
        <label className="field-label" htmlFor="auth-password" style={{ color: '#C7D2DC' }}>
          Password
        </label>
        <input
          className="field-input"
          id="auth-password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          required
          minLength={8}
          maxLength={128}
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid #3A4E76',
            color: 'white',
          }}
        />
        {error && (
          <div className="error-text" role="alert">
            {error}
          </div>
        )}
        <button className="btn btn-gold" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <button
        className="btn btn-outline"
        type="button"
        style={{ marginTop: '0.7rem', color: '#C7D2DC', borderColor: '#3A4E76' }}
        onClick={() => {
          setMode(mode === 'login' ? 'register' : 'login');
          setError('');
        }}
      >
        {mode === 'login' ? 'Create an account' : 'I already have an account'}
      </button>
    </div>
  );
}
