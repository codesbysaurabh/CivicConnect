import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

export function CameraCapture({ photo, onCapture, onClear }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('idle'); // idle | live | denied
  const [camError, setCamError] = useState('');

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => () => stopStream(), []);

  const openCamera = async () => {
    setCamError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMode('denied');
      setCamError("Camera access isn't supported in this browser. Use upload instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      setMode('live');
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      setMode('denied');
      setCamError('Camera permission denied or unavailable. Use upload instead.');
    }
  };

  const takeShot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopStream();
    setMode('idle');
    onCapture(dataUrl);
  };

  const cancelLive = () => {
    stopStream();
    setMode('idle');
  };

  const handleFilePick = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onCapture(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (photo) {
    return (
      <div className="camera-box has-photo">
        <img src={photo} alt="Captured issue" />
        <button className="retake-btn" onClick={onClear}>
          Retake
        </button>
      </div>
    );
  }

  if (mode === 'live') {
    return (
      <div className="camera-box has-photo" style={{ background: '#000' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        ></video>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        <button
          onClick={takeShot}
          aria-label="Take photo"
          style={{
            position: 'absolute',
            bottom: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'white',
            border: '4px solid rgba(255,255,255,0.5)',
            cursor: 'pointer',
          }}
        ></button>
        <button
          onClick={cancelLive}
          aria-label="Cancel"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="camera-box" type="button" onClick={openCamera}>
        <div style={{ fontSize: 32 }}>
          <Icon name="camera" size={32} />
        </div>
        <span className="camera-cta">Open camera</span>
        <span className="camera-upload-hint">or choose a photo from your device</span>
      </button>
      <button
        className="btn btn-outline camera-upload-button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose photo from device
      </button>
      {camError && (
        <div style={{ marginTop: '-0.6rem', marginBottom: '0.8rem' }}>
          <div className="error-text" style={{ marginBottom: 6 }}>
            {camError}
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFilePick}
      />
    </>
  );
}
