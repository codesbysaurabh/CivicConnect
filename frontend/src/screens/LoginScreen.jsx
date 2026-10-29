import { useState } from 'react';

export function LoginScreen({ onLogin }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerify = () => {
    if (otp.some((d) => d === '')) {
      setError('Enter the full 4-digit code');
      return;
    }
    setError('');
    onLogin();
  };

  const updateOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) {
      const nextInput = document.getElementById(`otp-${i + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="login-screen">
      <div className="brand-mark">
        <div className="brand-pin"></div>
        <span className="brand-name">CIVICCONNECT</span>
      </div>

      {step === 'phone' ? (
        <>
          <h1 style={{ color: 'white', fontSize: 26 }}>Report civic issues in your city</h1>
          <p className="muted" style={{ color: '#9FB3C8', marginBottom: '2rem' }}>
            Sign in with your phone number to get started.
          </p>
          <label className="field-label" style={{ color: '#C7D2DC' }}>
            Phone number
          </label>
          <input
            className="field-input"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid #3A4E76',
              color: 'white',
            }}
            type="tel"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-gold" onClick={handleSendOtp}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h1 style={{ color: 'white', fontSize: 24 }}>Enter the code</h1>
          <p className="muted" style={{ color: '#9FB3C8', marginBottom: '2rem' }}>
            We sent a 4-digit code to +91 {phone}
          </p>
          <div className="otp-row">
            {otp.map((d, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                className="otp-box"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid #3A4E76',
                  color: 'white',
                }}
                maxLength={1}
                value={d}
                onChange={(e) => updateOtp(i, e.target.value)}
              />
            ))}
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-gold" onClick={handleVerify}>
            Verify and continue
          </button>
          <button
            className="btn btn-outline"
            style={{ marginTop: '0.7rem', color: '#C7D2DC', borderColor: '#3A4E76' }}
            onClick={() => setStep('phone')}
          >
            Change number
          </button>
        </>
      )}
    </div>
  );
}
