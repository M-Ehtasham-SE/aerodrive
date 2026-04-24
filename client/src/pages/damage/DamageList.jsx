import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DamageList() {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', damagePart: '', damageSide: '', severity: 'Low', incidentDetails: '', description: '', repairCost: '', insuranceClaim: false });

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get('/damage');
      setReports(res.data.data);
    } catch { toast.error('Failed to load damage reports'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/damage', formData);
      toast.success('Damage report created');
      setShowForm(false);
      fetchReports();
    } catch { toast.error('Failed to create report'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/damage/${id}/status`, { status });
      toast.success('Status updated');
      fetchReports();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Exo 2', fontSize: '22px' }}>Damage Reports</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={16} /> New Report</button>
      </div>
      <div className="card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
              {['ID', 'Vehicle', 'Part', 'Severity', 'Repair Cost', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.ReportID} style={{ borderBottom: '1px solid var(--bg-border)' }}>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>RPT-{r.ReportID}</td>
                <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-accent)' }}>{r.Vehicle?.LicensePlate}</td>
                <td style={{ padding: '12px' }}>{r.DamagePart} ({r.DamageSide})</td>
                <td style={{ padding: '12px' }}><span className={`badge badge-${r.Severity === 'Critical' || r.Severity === 'High' ? 'danger' : r.Severity === 'Medium' ? 'maintenance' : 'available'}`}>{r.Severity}</span></td>
                <td style={{ padding: '12px' }}>${parseFloat(r.RepairCost || 0).toFixed(2)}</td>
                <td style={{ padding: '12px' }}><span className={`badge badge-${r.Status === 'Resolved' ? 'available' : r.Status === 'In Review' ? 'reserved' : 'danger'}`}>{r.Status}</span></td>
                <td style={{ padding: '12px' }}>
                  {r.Status !== 'Resolved' && (
                    <button onClick={() => updateStatus(r.ReportID, r.Status === 'Pending' ? 'In Review' : 'Resolved')} className="btn-primary" style={{ padding: '4px 10px', fontSize: '12px' }}>
                      {r.Status === 'Pending' ? 'Review' : 'Resolve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div className="card" style={{ width: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '16px' }}>New Damage Report</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input className="input" placeholder="Vehicle ID" required onChange={e => setFormData({ ...formData, vehicleId: e.target.value })} />
              <input className="input" placeholder="Damage Part (e.g. Front Bumper)" required onChange={e => setFormData({ ...formData, damagePart: e.target.value })} />
              <input className="input" placeholder="Damage Side (e.g. Left)" onChange={e => setFormData({ ...formData, damageSide: e.target.value })} />
              <select className="input" onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
              </select>
              <textarea className="input" placeholder="Description" rows={3} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ resize: 'vertical' }} />
              <input className="input" type="number" placeholder="Repair Cost" onChange={e => setFormData({ ...formData, repairCost: e.target.value })} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary">Submit</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-primary" style={{ background: 'var(--bg-elevated)' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
