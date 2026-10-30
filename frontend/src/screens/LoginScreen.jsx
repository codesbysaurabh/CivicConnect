import { useState } from 'react';
import { Icon } from '../components';

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
    <main className="login-page">
      <section className="login-welcome">
        <div className="login-brand">
          <span className="brand-symbol">
            <Icon name="pin" size={22} />
          </span>
          <strong>CivicConnect</strong>
        </div>
        <div className="login-welcome-copy">
          <p className="eyebrow">Your community, connected</p>
          <h1>Small reports can make a real difference.</h1>
          <p>
            Sign in to report local issues, follow their progress, and share feedback when they are
            resolved.
          </p>
        </div>
        <div className="login-welcome-footer">
          <Icon name="check" size={17} /> A clear path from report to resolution
        </div>
      </section>
      <section className="login-form-side">
        <div className="login-card">
          <p className="eyebrow">Resident portal</p>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="login-form-intro">
            {mode === 'login'
              ? 'Sign in with the email and password linked to your account.'
              : 'Register with your email to start using CivicConnect.'}
          </p>
          <form onSubmit={submit}>
            <label className="field-label" htmlFor="auth-email">
              Email address
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
            />
            <label className="field-label" htmlFor="auth-password">
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
              placeholder={mode === 'login' ? 'Enter your password' : 'At least 8 characters'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error && (
              <div className="error-text" role="alert">
                {error}
              </div>
            )}
            <button className="btn btn-primary login-submit" type="submit" disabled={busy}>
              <span>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</span>
              <Icon name="arrow" size={17} />
            </button>
          </form>
          <div className="login-switch">
            {mode === 'login' ? 'New to CivicConnect?' : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </div>
          <p className="login-terms">
            By continuing, you agree to use CivicConnect to submit accurate information about civic
            issues.
          </p>
        </div>
      </section>
    </main>
  );
}
