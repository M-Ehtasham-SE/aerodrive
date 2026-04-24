import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export default function StaffForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    firstName: initialData?.Person?.FirstName || '',
    lastName: initialData?.Person?.LastName || '',
    phone: initialData?.Person?.Phone || '',
    password: '',
    role: initialData?.Position || 'clerk',
    branchId: initialData?.BranchID || '',
    salary: initialData?.Salary || '',
    subclassData: {}
  });

  const [branches, setBranches] = useState([]);
  const isEditing = !!initialData;

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('/branches');
      setBranches(res.data.data);
    } catch (error) {
      toast.error('Failed to load branches');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (isEditing) {
        await axios.put(`/staff/${initialData.PersonID}`, payload);
        toast.success('Staff member updated');
      } else {
        await axios.post('/staff', payload);
        toast.success('Staff member created');
      }
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
      <div className="card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'Exo 2' }}>{isEditing ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input className="input" placeholder="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input className="input" placeholder="Last Name" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>
          
          <input className="input" placeholder="Phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          
          {!isEditing && (
            <input className="input" type="password" placeholder="Password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          )}

          <select className="input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} disabled={isEditing}>
            <option value="clerk">Clerk</option>
            <option value="mechanic">Mechanic</option>
            <option value="manager">Manager</option>
          </select>

          <select className="input" required value={formData.branchId} onChange={e => setFormData({...formData, branchId: e.target.value})}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b.BranchID} value={b.BranchID}>{b.BranchName}</option>)}
          </select>

          <input className="input" type="number" placeholder="Salary" required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary">Save Member</button>
            <button type="button" onClick={onClose} className="btn-primary" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
