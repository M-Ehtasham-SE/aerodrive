import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Search } from 'lucide-react';

export default function ReservationWizard({ onClose, onSave }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ 
    vehicleId: '', 
    customerId: user?.role === 'customer' ? user?.userId : '', 
    pickupDate: '', 
    returnDate: '', 
    specialRequests: '' 
  });

  const isStaff = user?.role === 'manager' || user?.role === 'clerk';

  useEffect(() => {
    if (isStaff) {
      axios.get('/customers')
        .then(res => setCustomers(res.data.data))
        .catch(() => {});
    }
  }, [isStaff]);

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      axios.get(`/reservations/available?from=${formData.pickupDate}&to=${formData.returnDate}`)
        .then(res => setVehicles(res.data.data))
        .catch(() => {});
    }
  }, [formData.pickupDate, formData.returnDate]);

  const handleSubmit = async () => {
    try {
      if (!formData.customerId) {
        toast.error('Please select a customer');
        return;
      }
      await axios.post('/reservations', formData);
      toast.success('Reservation created!');
      onSave();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to create reservation');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div className="card" style={{ width: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: s <= step ? 'var(--accent-primary)' : 'var(--bg-border)' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Exo 2', marginBottom: '20px' }}>Step 1 — Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isStaff && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>Select Customer</label>
                  <select 
                    className="input" 
                    value={formData.customerId}
                    onChange={e => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => (
                      <option key={c.PersonID} value={c.PersonID}>
                        {c.Person?.FirstName} {c.Person?.LastName} ({c.Person?.Phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>Pickup Date</label>
                  <input type="date" className="input" value={formData.pickupDate} onChange={e => setFormData({ ...formData, pickupDate: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>Return Date</label>
                  <input type="date" className="input" value={formData.returnDate} onChange={e => setFormData({ ...formData, returnDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>Special Requests</label>
                <textarea className="input" rows={3} value={formData.specialRequests} onChange={e => setFormData({ ...formData, specialRequests: e.target.value })} style={{ resize: 'vertical' }} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'Exo 2', marginBottom: '20px' }}>Step 2 — Choose Vehicle</h2>
            {vehicles.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No vehicles available for selected dates.</p>
              : vehicles.map(v => (
                <div key={v.VehicleID} onClick={() => setFormData({ ...formData, vehicleId: v.VehicleID })} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${formData.vehicleId === v.VehicleID ? 'var(--accent-primary)' : 'var(--bg-border)'}`, marginBottom: '8px', cursor: 'pointer', background: formData.vehicleId === v.VehicleID ? 'var(--accent-subtle)' : 'var(--bg-elevated)' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-accent)', fontSize: '12px' }}>{v.LicensePlate}</div>
                  <div style={{ fontSize: '13px', marginTop: '4px' }}>{v.Color} · {v.FuelType} · {v.Year}</div>
                </div>
              ))
            }
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'Exo 2', marginBottom: '20px' }}>Step 3 — Review & Confirm</h2>
            <div className="card" style={{ background: 'var(--bg-elevated)', marginBottom: '16px', fontSize: '14px' }}>
              <p style={{ marginBottom: '8px' }}>Customer: <strong>{isStaff ? (customers.find(c => c.PersonID == formData.customerId)?.Person?.FirstName + ' ' + customers.find(c => c.PersonID == formData.customerId)?.Person?.LastName) : user.name}</strong></p>
              <p style={{ marginBottom: '8px' }}>Pickup: <strong>{formData.pickupDate}</strong></p>
              <p style={{ marginBottom: '8px' }}>Return: <strong>{formData.returnDate}</strong></p>
              <p style={{ marginBottom: '8px' }}>Vehicle: <strong style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{vehicles.find(v => v.VehicleID === formData.vehicleId)?.LicensePlate}</strong></p>
              {formData.specialRequests && <p>Requests: {formData.specialRequests}</p>}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Back</button>}
          {step < 3 && <button onClick={() => setStep(s => s + 1)} className="btn-primary" disabled={(step === 1 && (!formData.pickupDate || !formData.returnDate || (isStaff && !formData.customerId))) || (step === 2 && !formData.vehicleId)}>Next</button>}
          {step === 3 && <button onClick={handleSubmit} className="btn-primary">Confirm Reservation</button>}
        </div>
      </div>
    </div>
  );
}
