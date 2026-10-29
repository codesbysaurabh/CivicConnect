export function OfflineBanner() {
  return (
    <div
      style={{
        background: '#FDEEDB',
        color: '#8A5A00',
        fontSize: 11.5,
        textAlign: 'center',
        padding: '0.4rem',
        fontWeight: 600,
      }}
    >
      Backend connection unavailable — reports may not load or save
    </div>
  );
}
