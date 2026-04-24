import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function VehicleForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    RegistrationNo: '', LicensePlate: '', Mileage: 0, FuelType: 'Petrol',
    Year: new Date().getFullYear(), Color: '', CurrentCity: '', ParkingSpot: '',
    ModelID: '', BranchID: '', type: 'car'
  });
  const [subclassData, setSubclassData] = useState({});
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios.get('/models').then(res => setModels(res.data.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/vehicles', { ...formData, subclassData });
      toast.success('Vehicle created');
      onSave();
    } catch (error) {
      toast.error('Failed to create vehicle');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Add Vehicle</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <input className="input" placeholder="Registration No" required onChange={e => setFormData({...formData, RegistrationNo: e.target.value})} />
          <input className="input" placeholder="License Plate" required onChange={e => setFormData({...formData, LicensePlate: e.target.value})} />
          
          <select className="input" required onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
          
          <select className="input" required onChange={e => setFormData({...formData, ModelID: e.target.value})}>
            <option value="">Select Model</option>
            {models.map(m => <option key={m.ModelID} value={m.ModelID}>{m.ModelName}</option>)}
          </select>

          <input className="input" placeholder="Branch ID (e.g. 1)" required type="number" onChange={e => setFormData({...formData, BranchID: e.target.value})} />
          
          {formData.type === 'car' && (
            <>
              <input className="input" placeholder="Doors" type="number" onChange={e => setSubclassData({...subclassData, Doors: e.target.value})} />
              <input className="input" placeholder="AC Type" onChange={e => setSubclassData({...subclassData, ACType: e.target.value})} />
            </>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
