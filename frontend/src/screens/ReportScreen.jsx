import { useState } from 'react';
import { CameraCapture, Icon } from '../components';
import { CATEGORIES } from '../constants/categories.js';

export function ReportScreen({ onSubmit, onBack }) {
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [gpsLocked, setGpsLocked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCapture = (dataUrl) => {
    setPhoto(dataUrl);
    setGpsLocked(false);
    setLocation('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setGpsLocked(true);
          setLocation(`Auto-detected: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        },
        () => {
          setGpsLocked(true);
          setLocation('Location unavailable — add manually if needed');
        },
        { timeout: 6000 }
      );
    } else {
      setGpsLocked(true);
      setLocation('Location unavailable — add manually if needed');
    }
  };

  const handleClear = () => {
    setPhoto(null);
    setGpsLocked(false);
    setLocation('');
  };

  const handleSubmit = () => {
    const errs = {};
    if (!photo) errs.photo = 'Take a photo of the issue first';
    if (!category) errs.category = 'Select a category';
    if (!description.trim()) errs.description = 'Add a short description';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      category,
      description,
      location: location || 'Location pending GPS',
      photo,
    });
  };

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="topbar-title">New report</div>
        <div style={{ width: 34 }}></div>
      </div>
      <div className="content">
        <label className="field-label">Photo</label>
        <CameraCapture photo={photo} onCapture={handleCapture} onClear={handleClear} />
        {errors.photo && <div className="error-text">{errors.photo}</div>}

        {gpsLocked && (
          <div
            className="card"
            style={{
              background: '#E7F6F6',
              border: '1px solid var(--mint)',
              marginBottom: '1.2rem',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--teal)', marginBottom: 2 }}>
              <Icon name="pin" size={14} /> Location captured
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--navy)' }}>{location}</div>
          </div>
        )}

        <label className="field-label">Category</label>
        <div className="chip-grid">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className={`chip ${category === c.id ? 'selected' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              <span className="chip-icon">
                <Icon name={c.icon} size={24} />
              </span>
              {c.label}
            </div>
          ))}
        </div>
        {errors.category && <div className="error-text">{errors.category}</div>}

        <label className="field-label">Description</label>
        <textarea
          className="field-textarea"
          placeholder="Briefly describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <div className="error-text">{errors.description}</div>}

        <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: '0.5rem' }}>
          Submit report
        </button>
      </div>
    </>
  );
}
