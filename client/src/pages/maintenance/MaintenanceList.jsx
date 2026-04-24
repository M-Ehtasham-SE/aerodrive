import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MaintenanceList() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', mechanicId: '', scheduledDate: '', serviceType: '', description: '', laborCost: '' });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/maintenance');
      setJobs(res.data.data);
    } catch { toast.error('Failed to load maintenance jobs'); }
  };

  const complete = async (id) => {
    try {
      await axios.put(`/maintenance/${id}/complete`);
      toast.success('Job completed — vehicle set to Available');
      fetchJobs();
    } catch { toast.error('Failed to complete job'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/maintenance', formData);
      toast.success('Maintenance job created');
      setShowForm(false);
      fetchJobs();
    } catch { toast.error('Failed to create job'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Maintenance</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Job</button>
      </div>
      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['ID', 'Vehicle', 'Service', 'Scheduled', 'Status', 'Cost', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.MaintenanceID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>MNT-{j.MaintenanceID}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{j.Vehicle?.LicensePlate}</td>
                <td style={{ padding: '12px' }}>{j.ServiceType}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{j.ScheduledDate}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge badge-${j.Status === 'Completed' ? 'available' : j.Status === 'In Progress' ? 'rented' : j.Status === 'Cancelled' ? 'danger' : 'reserved'}`}>{j.Status}</span>
                </td>
                <td style={{ padding: '12px' }}>${parseFloat(j.TotalCost || j.LaborCost || 0).toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  {j.Status !== 'Completed' && j.Status !== 'Cancelled' && (
                    <button onClick={() => complete(j.MaintenanceID)} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: '440px' }}>
            <h2 style={{ marginBottom: '16px' }}>New Maintenance Job</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Vehicle ID" required onChange={e => setFormData({ ...formData, vehicleId: e.target.value })} />
              <input className="input" placeholder="Mechanic ID" required onChange={e => setFormData({ ...formData, mechanicId: e.target.value })} />
              <input className="input" type="date" required onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })} />
              <input className="input" placeholder="Service Type (e.g. Oil Change)" required onChange={e => setFormData({ ...formData, serviceType: e.target.value })} />
              <textarea className="input" placeholder="Description" rows={3} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
              <input className="input" type="number" placeholder="Labor Cost" onChange={e => setFormData({ ...formData, laborCost: e.target.value })} />
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
