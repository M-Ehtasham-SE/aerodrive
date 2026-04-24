export default function VehicleDetail({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="slide-panel open" style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '320px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--bg-border)', padding: '24px', zIndex: 100 }}>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '16px' }}>Close ✕</button>
      <h2 style={{ fontFamily: 'Exo 2', color: 'var(--text-primary)' }}>VEH-{vehicle.VehicleID}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{vehicle.Model?.ModelName}</p>
      
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Specs</h3>
        <p>Plate: <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{vehicle.LicensePlate}</span></p>
        <p>Status: <span className={`badge badge-${vehicle.Status.toLowerCase()}`}>{vehicle.Status}</span></p>
        <p>Mileage: {vehicle.Mileage}</p>
        
        {vehicle.Model?.ModelColors && vehicle.Model.ModelColors.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <p>Colors:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {vehicle.Model.ModelColors.map(c => <span key={c.id} className="tag">{c.Color}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
