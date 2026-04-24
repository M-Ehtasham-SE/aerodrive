import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import VehicleForm from './VehicleForm';
import VehicleDetail from './VehicleDetail';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('/vehicles');
      setVehicles(res.data.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchVehicles();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Vehicles</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Vehicle</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Plate</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Model</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Type</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.VehicleID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>VEH-{v.VehicleID}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono' }}>{v.LicensePlate}</td>
                <td style={{ padding: '12px' }}>{v.Model?.ModelName || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{v.Car ? 'Car' : v.Bike ? 'Bike' : v.Truck ? 'Truck' : 'Unknown'}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${v.Status.toLowerCase()}`}>{v.Status}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => setSelectedVehicle(v)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <VehicleForm onClose={() => setShowForm(false)} onSave={handleSave} />}
      <VehicleDetail vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </div>
  );
}
