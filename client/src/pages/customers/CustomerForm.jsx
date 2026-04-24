import { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function CustomerForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.Person?.FirstName || '',
    lastName: initialData?.Person?.LastName || '',
    phone: initialData?.Person?.Phone || '',
    password: '',
    cnic: initialData?.CNIC || '',
    licenseNo: initialData?.LicenseNo || '',
    dateOfBirth: initialData?.DateOfBirth || '',
    occupation: initialData?.Occupation || ''
  });

  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/customers/${initialData.PersonID}`, formData);
        toast.success('Customer updated');
      } else {
        await axios.post('/customers', formData);
        toast.success('Customer created');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} customer`);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Exo 2' }}>{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <input className="input" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="input" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <input className="input" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          {!isEditing && <input className="input" type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />}
          <input className="input" placeholder="CNIC" required value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} />
          <input className="input" placeholder="License No" required value={formData.licenseNo} onChange={e => setFormData({...formData, licenseNo: e.target.value})} />
          <input className="input" type="date" required value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
          <input className="input" placeholder="Occupation" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} />
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
