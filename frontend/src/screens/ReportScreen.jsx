import { useState } from 'react';
import { CameraCapture, Icon } from '../components';
import { CATEGORIES } from '../constants/categories.js';

export function ReportScreen({ onSubmit, onBack }) {
  const [photo, setPhoto] = useState(null);
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCapture = (dataUrl) => {
    setPhoto(dataUrl);
    setGpsLocked(false);
    setCoordinates(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setGpsLocked(true);
        },
        () => {
          setGpsLocked(true);
        },
        { timeout: 6000 }
      );
    } else {
      setGpsLocked(true);
    }
  };

  const handleClear = () => {
    setPhoto(null);
    setGpsLocked(false);
    setCoordinates(null);
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
      location: address.trim(),
      address: address.trim(),
      ...(coordinates && { lat: coordinates.lat, lng: coordinates.lng }),
      photo,
    });
  };

  return (
    <>
      <main className="content page-content report-form-content">
        <div className="page-back-row">
          <button className="text-back" onClick={onBack}>
            <span aria-hidden="true">←</span> Home
          </button>
        </div>
        <div className="page-intro">
          <div>
            <p className="eyebrow">Public works &amp; community services</p>
            <h1>Report a civic issue</h1>
            <p className="page-subtitle">
              Add a photo, choose a category and describe the issue so your community can respond.
            </p>
          </div>
        </div>
        <form
          className="report-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <section className="form-section">
            <div className="form-section-heading">
              <span className="step-number">1</span>
              <div>
                <h2>Choose a category</h2>
                <p>What needs attention?</p>
              </div>
              <span className="required-label">Required</span>
            </div>
            <div className="chip-grid">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`category-option ${category === c.id ? 'selected' : ''}`}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  <span className="chip-icon">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <div className="error-text" role="alert">
                {errors.category}
              </div>
            )}
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="step-number">2</span>
              <div>
                <h2>Describe the issue</h2>
                <p>A few details help route the report.</p>
              </div>
              <span className="required-label">Required</span>
            </div>
            <label className="field-label" htmlFor="report-description">
              Description
            </label>
            <textarea
              id="report-description"
              className="field-textarea"
              placeholder="What happened, and where?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              required
              aria-describedby={errors.description ? 'description-error' : 'description-hint'}
            ></textarea>
            <div className="field-helper" id="description-hint">
              {description.length}/1000 characters
            </div>
            {errors.description && (
              <div id="description-error" className="error-text" role="alert">
                {errors.description}
              </div>
            )}
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="step-number">3</span>
              <div>
                <h2>Photo of the issue</h2>
                <p>Choose a clear photo from your camera or device.</p>
              </div>
              <span className="required-label">Required</span>
            </div>
            <CameraCapture photo={photo} onCapture={handleCapture} onClear={handleClear} />
            {errors.photo && <div className="error-text">{errors.photo}</div>}
          </section>

          <section className="form-section">
            <div className="form-section-heading">
              <span className="step-number">4</span>
              <div>
                <h2>Location details</h2>
                <p>Your location can help identify the right area.</p>
              </div>
              <span className="optional-label">Optional</span>
            </div>
            {gpsLocked && (
              <div className="location-captured">
                <Icon name="pin" size={17} />
                <span>
                  {coordinates
                    ? `GPS location captured · ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`
                    : 'GPS unavailable. You can enter a street or landmark below.'}
                </span>
              </div>
            )}
            <label className="field-label" htmlFor="report-address">
              Street address or landmark
            </label>
            <input
              id="report-address"
              className="field-input"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              maxLength={300}
              placeholder="e.g. Pine Street near the community center"
            />
          </section>
          <div className="report-form-actions">
            <button className="btn btn-outline" type="button" onClick={onBack}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              <Icon name="arrow" size={17} /> Submit report
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
