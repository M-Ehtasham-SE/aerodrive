import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus, Trash2, Edit, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import StaffForm from './StaffForm';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get('/staff');
      setStaff(res.data.data);
    } catch (error) {
      toast.error('Failed to load staff data');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingStaff(null);
    fetchStaff();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await axios.delete(`/staff/${id}`);
      toast.success('Staff member removed');
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove staff');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Staff Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage clerks, mechanics, and branch managers.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Add Staff Member</button>
      </div>

      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Branch</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Phone</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.PersonID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>STF-{s.PersonID}</td>
                <td style={{ padding: '12px' }}>{s.Person?.FirstName} {s.Person?.LastName}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${s.Position.toLowerCase()}`}>{s.Position}</span>
                </td>
                <td style={{ padding: '12px' }}>{s.Branch?.BranchName || 'N/A'}</td>
                <td style={{ padding: '12px' }}>{s.Person?.Phone}</td>
                <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setEditingStaff(s); setShowForm(true); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}><Edit size={16} /></button>
                  <button onClick={() => handleDelete(s.PersonID)} style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && <StaffForm onClose={() => { setShowForm(false); setEditingStaff(null); }} onSave={handleSave} initialData={editingStaff} />}
    </div>
  );
}
