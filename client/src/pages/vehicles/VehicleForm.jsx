import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function VehicleForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    RegistrationNo: initialData?.RegistrationNo || '',
    LicensePlate: initialData?.LicensePlate || '',
    Mileage: initialData?.Mileage || 0,
    FuelType: initialData?.FuelType || 'Petrol',
    Year: initialData?.Year || new Date().getFullYear(),
    Color: initialData?.Color || '',
    CurrentCity: initialData?.CurrentCity || '',
    ParkingSpot: initialData?.ParkingSpot || '',
    ModelID: initialData?.ModelID || '',
    BranchID: initialData?.BranchID || '',
    type: initialData?.Car ? 'car' : initialData?.Bike ? 'bike' : initialData?.Truck ? 'truck' : 'car'
  });
  
  const [subclassData, setSubclassData] = useState({
    Doors: initialData?.Car?.Doors || '',
    ACType: initialData?.Car?.ACType || '',
    EngineCapacity: initialData?.Bike?.EngineCapacity || '',
    LoadCapacity: initialData?.Truck?.LoadCapacity || '',
  });

  const [models, setModels] = useState([]);
  const [branches, setBranches] = useState([]);
  const isEditing = !!initialData;

  useEffect(() => {
    axios.get('/models').then(res => setModels(res.data.data)).catch(() => {});
    axios.get('/branches').then(res => setBranches(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/vehicles/${initialData.VehicleID}`, { ...formData, subclassData });
        toast.success('Vehicle updated');
      } else {
        await axios.post('/vehicles', { ...formData, subclassData });
        toast.success('Vehicle created');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} vehicle`);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Exo 2' }}>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <input className="input" placeholder="Registration No" required value={formData.RegistrationNo} onChange={e => setFormData({...formData, RegistrationNo: e.target.value})} />
          <input className="input" placeholder="License Plate" required value={formData.LicensePlate} onChange={e => setFormData({...formData, LicensePlate: e.target.value})} />
          
          <select className="input" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={isEditing}>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
          
          <select className="input" required value={formData.ModelID} onChange={e => setFormData({...formData, ModelID: e.target.value})}>
            <option value="">Select Model</option>
            {models.map(m => <option key={m.ModelID} value={m.ModelID}>{m.ModelName}</option>)}
          </select>

          <select className="input" required value={formData.BranchID} onChange={e => setFormData({...formData, BranchID: e.target.value})}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b.BranchID} value={b.BranchID}>{b.BranchName}</option>)}
          </select>
          
          {formData.type === 'car' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input className="input" placeholder="Doors" type="number" value={subclassData.Doors} onChange={e => setSubclassData({...subclassData, Doors: e.target.value})} />
              <input className="input" placeholder="AC Type" value={subclassData.ACType} onChange={e => setSubclassData({...subclassData, ACType: e.target.value})} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
