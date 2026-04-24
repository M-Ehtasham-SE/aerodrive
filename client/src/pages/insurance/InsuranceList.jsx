import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InsuranceList() {
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ PolicyNo: '', InsuranceCompany: '', StartDate: '', EndDate: '', CoverageType: '', MaxCoverage: '', VehicleID: '', perils: [], exclusions: [] });

  useEffect(() => { fetchPolicies(); }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get('/insurance');
      setPolicies(res.data.data);
    } catch { toast.error('Failed to load insurance'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/insurance', formData);
      toast.success('Policy created');
      setShowForm(false);
      fetchPolicies();
    } catch { toast.error('Failed to create policy'); }
  };

  const today = new Date();
  const in30 = new Date(); in30.setDate(today.getDate() + 30);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Insurance</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> Add Policy</button>
      </div>
      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['Policy No', 'Company', 'Vehicle', 'Coverage', 'Max Coverage', 'Expires', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {policies.map(p => {
              const expiring = new Date(p.EndDate) <= in30 && p.Status === 'Active';
              return (
                <tr key={p.PolicyNo} style={{ borderBottom: '1px solid var(--bg-border)', background: expiring ? 'rgba(245,158,11,0.05)' : 'transparent' }}>
                  <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{p.PolicyNo}</td>
                  <td style={{ padding: '12px' }}>{p.InsuranceCompany}</td>
                  <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{p.Vehicle?.LicensePlate}</td>
                  <td style={{ padding: '12px' }}>{p.CoverageType}</td>
                  <td style={{ padding: '12px' }}>${parseFloat(p.MaxCoverage || 0).toLocaleString()}</td>
                  <td style={{ padding: '12px', color: expiring ? 'var(--status-maintenance)' : 'var(--text-secondary)' }}>{p.EndDate} {expiring && '⚠️'}</td>
                  <td style={{ padding: '12px' }}><span className={`badge badge-${p.Status === 'Active' ? 'available' : p.Status === 'Expired' ? 'danger' : 'retired'}`}>{p.Status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px' }}>Add Insurance Policy</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Policy No" required onChange={e => setFormData({ ...formData, PolicyNo: e.target.value })} />
              <input className="input" placeholder="Insurance Company" required onChange={e => setFormData({ ...formData, InsuranceCompany: e.target.value })} />
              <input className="input" placeholder="Vehicle ID" required onChange={e => setFormData({ ...formData, VehicleID: e.target.value })} />
              <input className="input" type="date" placeholder="Start Date" onChange={e => setFormData({ ...formData, StartDate: e.target.value })} />
              <input className="input" type="date" placeholder="End Date" onChange={e => setFormData({ ...formData, EndDate: e.target.value })} />
              <input className="input" placeholder="Coverage Type" onChange={e => setFormData({ ...formData, CoverageType: e.target.value })} />
              <input className="input" type="number" placeholder="Max Coverage ($)" onChange={e => setFormData({ ...formData, MaxCoverage: e.target.value })} />
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
