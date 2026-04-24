import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ BranchName: '', Street: '', City: '', ZipCode: '', Phone: '' });

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get('/branches');
      setBranches(res.data.data);
    } catch { toast.error('Failed to load branches'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/branches', formData);
      toast.success('Branch created');
      setShowForm(false);
      fetchBranches();
    } catch { toast.error('Failed to create branch'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Branches</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Branch</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {branches.map(b => (
          <div key={b.BranchID} className="card">
            <h3 style={{ fontFamily: 'Exo 2', fontSize: '16px', marginBottom: '8px' }}>{b.BranchName}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{b.Street}, {b.City}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{b.Phone}</p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '20px', color: 'var(--text-accent)' }}>{b.StaffCount || 0}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '20px', color: 'var(--accent-primary)' }}>{b.VehicleCount || 0}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vehicles</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: '420px' }}>
            <h2 style={{ marginBottom: '16px' }}>Add Branch</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Branch Name" required onChange={e => setFormData({ ...formData, BranchName: e.target.value })} />
              <input className="input" placeholder="Street" onChange={e => setFormData({ ...formData, Street: e.target.value })} />
              <input className="input" placeholder="City" onChange={e => setFormData({ ...formData, City: e.target.value })} />
              <input className="input" placeholder="Zip Code" onChange={e => setFormData({ ...formData, ZipCode: e.target.value })} />
              <input className="input" placeholder="Phone" onChange={e => setFormData({ ...formData, Phone: e.target.value })} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
