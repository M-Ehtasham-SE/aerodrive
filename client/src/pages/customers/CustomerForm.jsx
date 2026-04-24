import { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function CustomerForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', password: '', cnic: '', licenseNo: '', dateOfBirth: '', occupation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers', formData);
      toast.success('Customer created');
      onSave();
    } catch (error) {
      toast.error('Failed to create customer');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>Add Customer</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <input className="input" placeholder="First Name" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="input" placeholder="Last Name" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <input className="input" placeholder="Phone" required onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input className="input" type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <input className="input" placeholder="CNIC" required onChange={e => setFormData({...formData, cnic: e.target.value})} />
          <input className="input" placeholder="License No" required onChange={e => setFormData({...formData, licenseNo: e.target.value})} />
          <input className="input" type="date" required onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
          <input className="input" placeholder="Occupation" onChange={e => setFormData({...formData, occupation: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
